export type jenkinsJobresult="SUCCESS" | "FAILURE" | "UNSTABLE" | "ABORTED"|"IN PROGRESS"|"BUILDING"|"NOT BUILT"|"QUEUED"|"DISABLED"

export interface ElasticsearchCpuResponse {
    aggregations: {
        cpu_usage_over_time: {
            buckets: Array<{
                key_as_string: string;
                cpu_usage: {
                    value: number;
                };
            }>;
        };
    };
}

export interface ElasticsearchMemoryResponse {
    aggregations: {
        memory_usage_over_time: {
            buckets: Array<{
                key_as_string: string;
                memory_usage: {
                    value: number;
                };
            }>;
        };
    };
}

export interface ElasticsearchNetworkResponse {
    aggregations: {
        network_throughput_over_time: {
            buckets: Array<{
                key_as_string: string;
                network_in: {
                    value: number;
                };
                network_out: {
                    value: number;
                };
            }>;
        };
    };
}

export interface NodeMetadata {
    name: string;
    labels: { [key: string]: string };
    // ... other metadata properties
}

export interface NodeSpec {
    podCIDR: string;
    podCIDRs: string[];
    // ... other spec properties
}

export interface NodeCondition {
    type: string;
    status: string;
    lastHeartbeatTime: string;
    lastTransitionTime: string;
    // ... other condition properties
}

export interface NodeStatus {
    conditions: NodeCondition[];
    // ... other status properties
}

export interface KubernetesNode {
    metadata: NodeMetadata;
    spec: NodeSpec;
    status: NodeStatus;
}

export interface NodeListResponse {
    kind: string;
    apiVersion: string;
    metadata: {
        selfLink: string;
        resourceVersion: string;
    };
    items: KubernetesNode[];
}

export interface PodMetadata {
    name: string;
    namespace: string;
    labels: { [key: string]: string };
    // ... other metadata properties
}

export interface ContainerResources {
    requests?: {
      memory?: string;
      cpu?: string;
      // ... other resource requests
    };
    limits?: {
      memory?: string;
      cpu?: string;
      // ... other resource limits
    };
  }
  
  export interface Container {
    name: string;
    image: string;
    resources?: ContainerResources;
    // ... other container properties
  }

export interface PodSpec {
    containers: Container[];
    // ... other spec properties
}

export interface PodCondition {
    type: string;
    status: string;
    // ... other condition properties
}

export interface PodStatus {
    phase: string;
    conditions: PodCondition[];
    // ... other status properties
}

export interface KubernetesPod {
    metadata: PodMetadata;
    spec: PodSpec;
    status: PodStatus;
}

export interface PodListResponse {
    kind: string;
    apiVersion: string;
    metadata: {
        selfLink: string;
        resourceVersion: string;
    };
    items: KubernetesPod[];
}


export interface JenkinsBuildStatusResponse {
    actions: any[];
    artifacts: any[];
    building: boolean;
    description: string | null;
    displayName: string;
    duration: number;
    estimatedDuration: number;
    executor: any | null;
    fullDisplayName: string;
    id: string;
    inProgress: boolean;
    keepLog: boolean;
    number: number;
    queueId: number;
    result: string;
    timestamp: number;
    url: string;
    builtOn: string;
    changeSet: {
      items: any[];
      kind: string | null;
    };
    stages: {
      name: string;
      status: string;
      startTimeMillis: number;
      durationMillis: number;
      pauseDurationMillis: number;
    }[];
  }

export interface JenkinsTriggerJobResponse {
    status: string;
    queueItemURL: string;
    message: string | null;
}

export interface jenkinsConsoleOutputResponse {
    body: string;
    headers: any;
}

export interface JenkinsJobData {
    id: string;
    name: string;
    status: string;
    startTimeMillis: number;
    endTimeMillis: number;
    durationMillis: number;
    queueDurationMillis: number;
    pauseDurationMillis: number;
    stages: JenkinsStageDetails[];
  }
  
  export interface JenkinsStageDetails {
    id: string;
    name: string;
    execNode: string;
    status: string;
    startTimeMillis: number;
    durationMillis: number;
    pauseDurationMillis: number;
  }
  
  