import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  projects!: any[];
  ngOnInit(): void {
    this.projects = [
      {
        title: "Resilient Kubernetes Cluster with External Etcd on AWS",
        description: "Developed a high-availability Kubernetes cluster on AWS, integrating an external Etcd for enhanced\
        performance. This project involved setting up Kubernetes, a powerful container orchestration tool, to\
        manage and scale containerized applications with ease. By utilizing an external Etcd, a key-value store for\
        critical data of the Kubernetes cluster, we ensured greater reliability and stability. The implementation\
        resulted in a robust system capable of self-healing and automatic scaling, making it ideal for\
        mission-critical applications. Impact: Achieved 99.9% system uptime, ensuring continuous operation and\
        reliability, vital for the client's business continuity and service quality."
      },
      {
        title: "Comprehensive Monitoring and Log Management System Integration",
        description: "Engineered an integrated monitoring and logging system using the ELK Stack (Elasticsearch, Logstash,\
        Kibana). This project aimed to enhance system observability by collecting, analyzing, and visualizing logs\
        and metrics. Elasticsearch provided a scalable search engine, Logstash processed and transformed data,\
        and Kibana offered powerful data visualization."
      },
      {
        title: "Advanced CI/CD Pipeline and Monitoring for Kubernetes-Hosted Applications",
        description: "Crafted a sophisticated CI/CD (Continuous Integration/Continuous Deployment) pipeline tailored for\
        microservices deployment on Kubernetes. This involved automating the software release process,\
        enabling consistent and reliable delivery of applications. The pipeline integrated testing, building, and\
        deployment processes, ensuring that each code change was automatically and efficiently applied to the\
        production environment. Kubernetes played a crucial role in managing and scaling the microservices."
      },
      {
        title: "Automated Containerization of Node.js Apps with Azure DevOps Pipelines",
        description: "Implemented an Azure DevOps pipeline for automating the build, test, and containerization of Node.js\
        applications. This project streamlined the entire development lifecycle of Node.js apps, from source code\
        to deployment. By leveraging Docker for containerization, we ensured consistent environments from\
        development to production. Azure DevOps provided a robust platform for orchestrating the CI/CD\
        pipeline, enhancing the overall efficiency and reliability of the development process."
      },
      {
        title: "Streamlined AWS Deployment with Terraform, Jenkins, and Python Automation",
        description: "Developed an automated solution for deploying applications on AWS using Terraform, Jenkins, and Python\
scripting. Terraform was utilized for infrastructure as code (IaC), allowing us to define and provision AWS\
infrastructure using a declarative configuration language. Jenkins automated the deployment pipeline,\
integrating seamlessly with Terraform for infrastructure changes and Python scripts for custom\
deployment logic."
      },
      {
        title: "Scalable Multi-Cloud Infrastructure Design for E-commerce Platform",
        description: "Led the design and implementation of a scalable and resilient infrastructure across AWS, Azure, and GCP,\
leveraging Terraform for Infrastructure as Code (IaC). This multi-cloud strategy provided flexibility and\
reduced vendor lock-in risks. We deployed and managed containerized services using Kubernetes and\
Docker, ensuring high availability and consistent deployment across different cloud providers."
      },
      {
        title: "AWS Application Deployment Automation with Python Scripting",
        description: "Developed a Python-based automation script for efficient and seamless deployment of applications on\
AWS. This script automated various AWS services, integrating them into a cohesive deployment workflow.\
The automation covered aspects like environment setup, resource allocation, and application deployment,\
all driven by Python scripting to reduce manual intervention and improve accuracy."
      },
      {
        title: "Efficient VMware Server Builds and Configuration Automation with Ansible",
        description: "Conducted efficient VMware server builds and streamlined post-deployment processes using Ansible, an\
automation tool that simplifies complex deployment tasks. This project focused on automating the\
configuration and management of VMware virtual servers, ensuring consistent and repeatable server\
setups. Ansible playbooks were written to handle various tasks, reducing the time and effort required for\
server configuration and maintenance."
      }
    ]
  }

}
