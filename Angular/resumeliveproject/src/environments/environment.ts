// environment.ts
export const environment = {
    production: false,
    falskbaseUrl:'http://localhost:5000',
    // trafficSimulationStartUrl: 'http://localhost:5000/start-traffic',
    // trafficSimulationStopUrl: 'http://localhost:5000/stop-traffic',
    // trafficSimulationTargetUrl: 'http://dev-kubernetes-api-url:8888',
    // kubernetesApiUrl: 'http://dev-kubernetes-api-url',
    // elasticsearchApiUrl: 'http://dev-elasticsearch-api-url',
    // jenkinsUrl: 'http://192.168.50.10:8080',
    applicationPodLabel: {'app':'angular-resume'},
    jobNameActionMapping : {
      autoScalingJobName: 'deploy-asg',
      appupgradeJobName: 'Application Upgrade',
      disasterRecoveryJobName: 'Disaster Recovery',
    }
    // other development settings
  };
  