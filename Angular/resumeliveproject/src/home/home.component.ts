import { Component } from '@angular/core';
import { HorizontalcontainerComponent } from '../Services/horizontalcontainer/horizontalcontainer.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HorizontalcontainerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  myDiagrams = [
    {
      image: "/assets/Cluster-Architecture.svg",
      title: "Infrastructure Overview",
      description: `
        <p>The diagram unveils the foundational structure of the Kubernetes cluster, a testament to the scalable and resilient nature of cloud-native applications. Key components include:</p>
        <ul>
          <li><strong>Master Node:</strong> The control plane of the Kubernetes architecture, responsible for cluster state maintenance, application scheduling, and scaling operations. Ensures deployments align with Terraform-defined infrastructure as code principles.</li>
          <li><strong>Worker Nodes and Autoscaling:</strong> Worker nodes serve as the primary hosts for application pods, with an autoscaling group dynamically adjusting node counts based on load, guided by ALB monitoring.</li>
          <li><strong>Application Load Balancer (ALB):</strong> Acts as a traffic director, intelligently routing requests and ensuring consistent application performance.</li>
          <li><strong>Elastic Search on Master Node:</strong> Provides robust search and analytics, aggregating cluster logs for advanced querying and operational insights.</li>
        </ul>`
    },
    {
      image: "/assets/Logging-Monitoring.svg",
      title: "Logging & Metric Collection",
      description: `
        <p>The diagram illustrates the vital operational processes of logging, monitoring, and autoscaling. Essential components include:</p>
        <ul>
          <li><strong>Worker Nodes with DaemonSets:</strong> Ensures each node runs specific pods for logging (Filebeat) and monitoring (Metricbeat), crucial for observability.</li>
          <li><strong>Metricbeat and Filebeat:</strong> Collect system and service metrics, and monitor and forward logs to Elastic Search on the master node.</li>
          <li><strong>Horizontal Pod Autoscaler (HPA):</strong> Dynamically scales application pods based on real-time load and metrics.</li>
          <li><strong>Real-Time Monitoring Dashboard:</strong> Provides a visual representation of cluster state, offering immediate feedback for performance optimization.</li>
        </ul>`
    },
    {
      image: "/assets/Dynamic-Pod-Updates.svg",
      title: "Dynamic Application Pod Updates",
      description: `
        <p>The diagram effectively conveys the flow from user input to the creation of new pods. The process involves several key components:</p>
        <ul>
          <li><strong>Traffic Simulation Button:</strong> An interactive UI component that triggers horizontal pod autoscaling by simulating increased web traffic.</li>
          <li><strong>Kubernetes API Interaction:</strong> The back-end process where the Kubernetes API responds to simulated load changes.</li>
          <li><strong>Real-Time Metrics Dashboard:</strong> Displays live metrics such as pod count and resource usage, illustrating the effects of scaling and providing feedback on the system's performance.</li>
        </ul>`
    }
  ];


}
