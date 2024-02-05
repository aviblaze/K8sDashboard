data "aws_iam_policy_document" "instance_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

data "aws_ami" "amazon-linux" {
  filter {
    name = "description"
    values = [var.aminamereg]
  }

  filter {
    name = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "owner-alias"
    values = [var.amiowner]
  }
  most_recent = true
}

resource "aws_iam_role" "iam-role" {
  name                = "iam-role"
  force_detach_policies = true
  assume_role_policy  = data.aws_iam_policy_document.instance_assume_role_policy.json
  managed_policy_arns = ["arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",aws_iam_policy.policy_one.arn, aws_iam_policy.policy_two.arn]
  tags = {
        Name = "K8s-instance-role-${random_string.random.result}"
   }
}

resource "aws_iam_policy" "policy_one" {
  name = "k8s-policy-${random_string.random.result}-1"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["ec2:*"]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_policy" "policy_two" {
  name = "k8s-policy-${random_string.random.result}-2"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["s3:*"]
        Effect   = "Allow"
        Resource = ["${aws_s3_bucket.ha-k8s-master-details.arn}", "${aws_s3_bucket.ha-k8s-master-details.arn}/*"]
      },
    ]
  })
}

resource "aws_iam_instance_profile" "Profile" {
  name = "profile-${random_string.random.result}"

  role = aws_iam_role.iam-role.name
  tags = {
    Name = "profile-${random_string.random.result}"
  }
}

resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "kp" {
  key_name   = "ha-k8s-key.pem"
  public_key = tls_private_key.pk.public_key_openssh
}

data "external" "file_exists" {
  program = ["python", "${path.module}/check_file_exists.py", "${path.module}/ha-k8s-key.pem"]
}


resource "local_file" "ssh_key" {
  filename = "ha-k8s-key.pem"
  content = tls_private_key.pk.private_key_pem
  file_permission = "0600"
  count    = data.external.file_exists.result.exists == "false" ? 1 : 0
}


resource "aws_s3_bucket" "ha-k8s-master-details" {

  bucket = "ha-k8s-master-details"
  tags = {
    Name = "ha-k8s-master-details"
  }
  force_destroy = true
}

# resource "aws_s3_object" "upload-files" {
#   for_each = fileset("../jenkins_home/", "**")
#   bucket = aws_s3_bucket.ha-k8s-master-details.id
#   key = "jenkins_home/${each.value}"
#   source = "../jenkins_home/${each.value}"
#   etag = filemd5("../jenkins_home/${each.value}")
#   depends_on = [ aws_s3_bucket.ha-k8s-master-details ]
# }

resource "aws_s3_object" "upload-files1" {
  for_each = fileset("../HELM/RLP/", "**")
  bucket = aws_s3_bucket.ha-k8s-master-details.id
  key = "RLP/${each.value}"
  source = "../HELM/RLP/${each.value}"
  etag = filemd5("../HELM/RLP/${each.value}")
  depends_on = [ aws_s3_bucket.ha-k8s-master-details ]
}

resource "aws_instance" "K8s-master" {
    ami           = data.aws_ami.amazon-linux.id
    instance_type = "c5a.xlarge"
    count=1
    associate_public_ip_address = false
    key_name      = aws_key_pair.kp.key_name
    root_block_device {
      volume_type = "gp2"
      volume_size = 30 # Size in GB
      delete_on_termination = true
    }
    #vpc_security_group_ids = [aws_default_security_group.default.id]
    iam_instance_profile   = aws_iam_instance_profile.Profile.name
    tags = {
        Name = "master-${random_string.random.result}-${count.index}"
    }
    security_groups = [aws_default_security_group.default.id]
    subnet_id = aws_subnet.K8s-subnet-private[0].id
    user_data = filebase64("${path.module}/master-userdata.sh")
    source_dest_check = false
}

resource "aws_instance" "jenkins" {
    ami           = data.aws_ami.amazon-linux.id
    instance_type = "t2.medium"
    count=1
    associate_public_ip_address = false
    key_name      = aws_key_pair.kp.key_name
    root_block_device {
      volume_type = "gp2"
      volume_size = 10# Size in GB
      delete_on_termination = true
    }
    #vpc_security_group_ids = [aws_default_security_group.default.id]
    iam_instance_profile   = aws_iam_instance_profile.Profile.name
    tags = {
        Name = "jenkins-${random_string.random.result}-${count.index}"
    }
    security_groups = [aws_default_security_group.default.id]
    subnet_id = aws_subnet.K8s-subnet-private[0].id
    user_data = filebase64("${path.module}/jenkins-userdata.sh")
    source_dest_check = false
}
