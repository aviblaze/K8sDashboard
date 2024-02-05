import os
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import time
from threading import Thread
from urllib.parse import quote

generate_traffic = False
jenkins_session = requests.Session()
app = Flask(__name__)
CORS(app)

# Fetch Jenkins credentials from environment variables
JENKINS_USERNAME = os.getenv('JENKINS_USERNAME',False)
JENKINS_PASSWORD = os.getenv('JENKINS_PASSWORD',False)
MASTER_IP = os.getenv('MASTER_IP',False)
JENKINS_PORT = os.getenv('JENKINS_PORT',False)
ELASTICSEARCH_PORT = os.getenv('ELASTICSEARCH_PORT',False)
KUBERNETES_PORT = os.getenv('KUBERNETES_PORT',False)

kubernetesApiUrl = f'http://{MASTER_IP}:{KUBERNETES_PORT}',
elasticsearchApiUrl= f'http://{MASTER_IP}:{ELASTICSEARCH_PORT}',
jenkinsUrl= 'http://{MASTER_IP}:{JENKINS_PORT}'

def simulate_traffic(target_url):
    global generate_traffic
    while generate_traffic:
        # Make a request to the target URL
        try:
            requests.get(target_url)
            print("Traffic generated to", target_url)
        except Exception as e:
            print("Error generating traffic:", e)
        # Wait for a short duration before the next request
        time.sleep(1)


# Jenkins Service Endpoints
@app.route('/jenkins/build-status', methods=['GET'])
def get_build_status():
    base_url = request.args.get('baseUrl')
    job_name = request.args.get('jobName')
    encoded_job_name = quote(job_name, safe='')
    build_number = request.args.get('buildNumber')
    url = f'{base_url}/job/{encoded_job_name}/{build_number}/api/json'

    auth_str = f'{JENKINS_USERNAME}:{JENKINS_PASSWORD}'
    encoded_credentials = base64.b64encode(auth_str.encode()).decode()
    headers = {'Authorization': f'Basic {encoded_credentials}'}

    response = requests.get(url, headers=headers)
    return jsonify(response.json())

@app.route('/jenkins/console-output', methods=['GET'])
def get_console_output():
    base_url = request.args.get('baseUrl')
    job_name = request.args.get('jobName')
    encoded_job_name = quote(job_name, safe='')
    build_number = request.args.get('buildNumber')
    url = f'{base_url}/job/{encoded_job_name}/{build_number}/consoleText'

    auth_str = f'{JENKINS_USERNAME}:{JENKINS_PASSWORD}'
    encoded_credentials = base64.b64encode(auth_str.encode()).decode()
    headers = {'Authorization': f'Basic {encoded_credentials}', 'Accept': 'text/plain'}

    response = requests.get(url, headers=headers)
    return response.text

def get_jenkins_crumb(base_url):
    crumb_issuer_url = f"{base_url}/crumbIssuer/api/json"
    auth_str = f'{JENKINS_USERNAME}:{JENKINS_PASSWORD}'
    encoded_credentials = base64.b64encode(auth_str.encode()).decode()
    headers = {'Authorization': f'Basic {encoded_credentials}'}

    response = jenkins_session.get(crumb_issuer_url, headers=headers)
    if response.status_code == 200:
        # Parse the JSON response to get the crumb
        crumb_json = response.json()
        crumb = crumb_json.get('crumb', None)
        return crumb
    else:
        return None

@app.route('/jenkins/trigger-job', methods=['POST'])
def trigger_job():
    base_url = request.args.get('baseUrl')
    job_name = request.args.get('jobName')
    parameters = request.json

    encoded_job_name = quote(job_name, safe='')
    url = f'{base_url}/job/{encoded_job_name}/buildWithParameters'

    # Get CSRF token using the same session
    crumb = get_jenkins_crumb(base_url)
    if crumb is None:
        return jsonify({"error": "Failed to get Jenkins crumb"}), 500

    auth_str = f'{JENKINS_USERNAME}:{JENKINS_PASSWORD}'
    encoded_credentials = base64.b64encode(auth_str.encode()).decode()
    headers = {
        'Authorization': f'Basic {encoded_credentials}',
        'Jenkins-Crumb': crumb
    }

    # Make the POST request using the same session
    response = jenkins_session.post(url, json=parameters, headers=headers)
    if response.status_code == 201:
        message = "Jenkins job successfully triggered"
        return jsonify({"message": message, "headers": dict(response.headers)}), 200
    else:
        return jsonify({"error": "Failed to trigger Jenkins job"}), 500



# Modified Jenkins pipeline-details endpoint
@app.route('/jenkins/pipeline-details', methods=['GET'])
def get_pipeline_details():
    base_url = request.args.get('baseUrl')
    job_name = request.args.get('jobName')
    encoded_job_name = quote(job_name, safe='')
    url = f'{base_url}/job/{encoded_job_name}/wfapi/runs'
    auth_str = f'{JENKINS_USERNAME}:{JENKINS_PASSWORD}'
    encoded_credentials = base64.b64encode(auth_str.encode()).decode()
    headers = {'Authorization': f'Basic {encoded_credentials}'}
    response = requests.get(url, headers=headers)
    runs = response.json()

    if runs:
        if runs[0]['status'] != 'SUCCESS':
          for run in runs:
            if run['status'] != 'SUCCESS':
                continue
            stages = run['stages']
            for stage in stages:
                stage['status']='FAILURE'
            run['stages'] = stages
            return jsonify(run)
        else:
            return jsonify(runs[0])
    else:
        return jsonify({"error": "No runs found"})

@app.route('/jenkins/build-details', methods=['GET'])
def get_build_details():
    base_url = request.args.get('baseUrl')
    job_name = request.args.get('jobName')
    encoded_job_name = quote(job_name, safe='')
    build_number = request.args.get('buildNumber')
    url = f'{base_url}/job/{encoded_job_name}/{build_number}/wfapi/describe'
    auth_str = f'{JENKINS_USERNAME}:{JENKINS_PASSWORD}'
    encoded_credentials = base64.b64encode(auth_str.encode()).decode()
    headers = {'Authorization': f'Basic {encoded_credentials}'}
    response = requests.get(url, headers=headers)
    return jsonify(response.json())


@app.route('/jenkins/queue-item-status', methods=['GET'])
def get_queue_item_status():
    job_name = request.args.get('jobName')
    encoded_job_name = quote(job_name, safe='')
    queue_id = request.args.get('queueId')
    base_url = request.args.get('baseUrl')
    auth_str = f'{JENKINS_USERNAME}:{JENKINS_PASSWORD}'
    encoded_credentials = base64.b64encode(auth_str.encode()).decode()
    headers = {'Authorization': f'Basic {encoded_credentials}'}

    attempts = 0
    max_attempts = 5  # Adjust as needed
    sleep_interval = 3  # Seconds to wait between attempts

    while attempts < max_attempts:
        url = f'{base_url}/job/{encoded_job_name}/api/json'
        params = {
            'tree': 'builds[number,queueId,result]{0,2}'
        }
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            builds = response.json().get('builds', [])
            for build in builds:
                if build['queueId'] == int(queue_id):
                    return jsonify({'number': build['number'], 'result': build['result']})

        time.sleep(sleep_interval)
        attempts += 1

    return jsonify({'error': 'Build number not found for the given queue ID'}), 404

# Kubernetes Service Endpoints
@app.route('/kubernetes/nodes', methods=['GET'])
def get_nodes():
    kubernetes_api_url = request.args.get('kubernetesApiUrl')
    url = f'{kubernetes_api_url}/api/v1/nodes'
    try:
        response = requests.get(url)
        return jsonify(response.json())
    except Exception as e:
        print("in except block for nodes")
        return {
            "kind": "NodeList",
            "apiVersion": "v1",
            "items": [
                {
                "metadata": {
                    "name": "node1",
                    "labels": {
                    "beta.kubernetes.io/os": "linux",
                    "kubernetes.io/hostname": "node1"
                    }
                },
                "status": {
                    "conditions": [
                    {
                        "type": "Ready",
                        "status": "True",
                        "lastHeartbeatTime": "2024-01-25T12:34:56Z",
                        "lastTransitionTime": "2024-01-25T12:00:00Z"
                    }
                    ],
                    "addresses": [
                    {
                        "type": "InternalIP",
                        "address": "192.168.1.101"
                    }
                    ],
                    "nodeInfo": {
                    "architecture": "amd64",
                    "osImage": "Ubuntu 20.04.1 LTS",
                    "kubeletVersion": "v1.22.0"
                    }
                }
                },
                {
                "metadata": {
                    "name": "node2",
                    "labels": {
                    "beta.kubernetes.io/os": "linux",
                    "kubernetes.io/hostname": "node2"
                    }
                },
                "status": {
                    "conditions": [
                    {
                        "type": "Ready",
                        "status": "True",
                        "lastHeartbeatTime": "2024-01-25T12:35:10Z",
                        "lastTransitionTime": "2024-01-25T12:01:00Z"
                    }
                    ],
                    "addresses": [
                    {
                        "type": "InternalIP",
                        "address": "192.168.1.102"
                    }
                    ],
                    "nodeInfo": {
                    "architecture": "amd64",
                    "osImage": "Ubuntu 20.04.1 LTS",
                    "kubeletVersion": "v1.22.0"
                    }
                }
                }
            ]
            }


@app.route('/kubernetes/pods', methods=['GET'])
def get_pods():
    kubernetes_api_url = request.args.get('kubernetesApiUrl')
    url = f'{kubernetes_api_url}/api/v1/pods'
    try:
        response = requests.get(url)
        return jsonify(response.json())
    except Exception as e:
        print("in except block for pods")
        return {
                  "kind": "PodList",
                  "apiVersion": "v1",
                  "items": [
                    {
                      "metadata": {
                        "name": "pod1",
                        "namespace": "default",
                        "labels": {
                          "app": "angular-resume"
                        }
                      },
                      "status": {
                        "phase": "Running",
                        "podIP": "10.244.1.12",
                        "startTime": "2024-01-25T11:30:00Z",
                        "containerStatuses": [
                          {
                            "name": "nginx-container",
                            "ready": True,
                            "restartCount": 0
                          }
                        ]
                      },
                      "spec": {
                        "nodeName": "node1",
                        "containers": [
                          {
                            "name": "nginx-container",
                            "image": "nginx:latest",
                            "ports": [
                              {
                                "containerPort": 80
                              }
                            ],
                            "resources": {
                              "requests": {
                                "memory": "64Mi"
                              },
                              "limits": {
                                "memory": "128Mi"
                              }
                            }
                          }
                        ]
                      }
                    },
                    {
                      "metadata": {
                        "name": "pod2",
                        "namespace": "default",
                        "labels": {
                          "app": "database"
                        }
                      },
                      "status": {
                        "phase": "Running",
                        "podIP": "10.244.1.13",
                        "startTime": "2024-01-25T11:35:00Z",
                        "containerStatuses": [
                          {
                            "name": "mysql-container",
                            "ready": True,
                            "restartCount": 0
                          }
                        ]
                      },
                      "spec": {
                        "nodeName": "node2",
                        "containers": [
                          {
                            "name": "mysql-container",
                            "image": "mysql:5.7",
                            "ports": [
                              {
                                "containerPort": 3306
                              }
                            ],
                            "resources": {
                              "requests": {
                                "memory": "256Mi"
                              },
                              "limits": {
                                "memory": "512Mi"
                              }
                            }
                          }
                        ]
                      }
                    }
                  ]
                }

@app.route('/start-traffic', methods=['POST'])
def start_traffic():
    global generate_traffic
    target_url = request.json.get('targetUrl')
    if not generate_traffic and target_url:
        generate_traffic = True
        thread = Thread(target=simulate_traffic, args=(target_url,))
        thread.start()
        return jsonify({"message": "Traffic generation started"}), 200
    return jsonify({"error": "Traffic generation already started or target URL missing"}), 400

@app.route('/stop-traffic', methods=['POST'])
def stop_traffic():
    global generate_traffic
    generate_traffic = False
    return jsonify({"message": "Traffic generation stopped"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0' , port=5000,debug=True)
