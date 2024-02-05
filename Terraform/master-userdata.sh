#!/bin/bash
sudo echo "${count.index}" > /tmp/count.conf
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
sudo swapoff -a

sudo yum update -y
cat <<EOF1 | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF1

sudo yum install -y amazon-ssm-agent git 
sudo yum update -y amazon-ssm-agent
sudo systemctl start amazon-ssm-agent
sudo systemctl enable amazon-ssm-agent

sudo modprobe overlay
sudo modprobe br_netfilter

cat <<EOF2 | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF2

sudo sysctl --system
sudo yum update -y && sudo yum install -y containerd
sudo mkdir -p /etc/containerd

containerd config default | sudo tee /etc/containerd/config.toml

sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml

sudo systemctl restart containerd
#sudo systemctl status containerd

cat <<EOF1 | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
EOF1

sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
sudo systemctl start containerd
sudo systemctl start kubelet
sudo systemctl enable --now kubelet
sudo systemctl daemon-reload


TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
IPADDR=$(curl -H "X-aws-ec2-metadata-token: $TOKEN"  http://169.254.169.254/latest/meta-data/local-ipv4)
NODENAME=$(hostname -s)
POD_CIDR="192.168.0.0/16"

#sudo kubeadm init --control-plane-endpoint=$IPADDR  --apiserver-cert-extra-sans=$IPADDR  --pod-network-cidr=$POD_CIDR --node-name $NODENAME --ignore-preflight-errors Swap
sudo kubeadm init --control-plane-endpoint=$IPADDR --pod-network-cidr=$POD_CIDR --ignore-preflight-errors Swap
# configure kubeconfig for kubectl
sudo mkdir -p /root/.kube
sudo cp -i /etc/kubernetes/admin.conf /root/.kube/config
sudo chown $(id -u):$(id -g) /root/.kube/config

sudo mkdir -p /home/ec2-user/.kube
sudo cp -i /etc/kubernetes/admin.conf /home/ec2-user/.kube/config
sudo chown -R ec2-user:ec2-user /home/ec2-user/.kube

sudo mkdir -p /home/ssm-user/.kube
sudo cp -i /etc/kubernetes/admin.conf /home/ssm-user/.kube/config
sudo chown -R ssm-user:ssm-user /home/ssm-user/.kube

# install calico
sudo kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/tigera-operator.yaml
sudo curl https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/custom-resources.yaml -O
sudo kubectl create -f custom-resources.yaml

sudo kubectl taint nodes --all node-role.kubernetes.io/control-plane-
sudo kubectl taint nodes --all node-role.kubernetes.io/master-

sudo echo "$(kubeadm token create)"  |sudo aws s3 cp - s3://ha-k8s-master-details/jointoken.txt
sudo echo "$(openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //')" |sudo  aws s3 cp - s3://ha-k8s-master-details/jointokenhash.txt
sudo echo "$IPADDR" | sudo aws s3 cp - s3://ha-k8s-master-details/masterip.txt

sudo mkdir /home/ssm-user/helm-charts
sudo aws s3 sync s3://ha-k8s-master-details/RLP /home/ssm-user/helm-charts
sudo chmod -R 777 /home/ssm-user/helm-charts

sleep 180
sudo helm install K8sdashboard /home/ssm-user/helm-charts -f /home/ssm-user/helm-charts/values.yaml

