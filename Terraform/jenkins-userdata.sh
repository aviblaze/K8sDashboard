#!/bin/bash
sudo yum update -y
sudo amazon-linux-extras install docker
sudo yum install -y docker git
sudo service docker start

sudo mkdir /home/ssm-user/K8s_repo
sudo git config --global user.name "aviblaze"
sudo git config --global user.email "malla.avinash@gmail.com"
sudo git clone https://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@github.com/aviblaze/K8sDashboard.git /home/ssm-user/K8s_repo
sudo chmod -R 777 /home/ssm-user/K8s_repo

sudo docker run -d --name jenkins-docker -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -v /home/ssm-user/K8s_repo/jenkins_home:/var/jenkins_home -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts



