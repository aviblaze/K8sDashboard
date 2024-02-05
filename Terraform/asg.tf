resource "aws_launch_template" "asg-launch-template" {
  name_prefix   = "lt-${random_string.random.result}"
  image_id      = data.aws_ami.amazon-linux.id
  instance_type = "t2.medium"
  key_name      = aws_key_pair.kp.key_name

  iam_instance_profile {
    name = aws_iam_instance_profile.Profile.name
  }
  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 10
    }
  }
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "instance-${random_string.random.result}"
    }
  }
  monitoring {
    enabled = true
  }
  vpc_security_group_ids = [aws_default_security_group.default.id]
  user_data = filebase64("${path.module}/slave-userdata.sh")
}

resource "aws_autoscaling_group" "asg" {
  launch_template {
    id      = aws_launch_template.asg-launch-template.id
    version = "$Latest"
  }
  vpc_zone_identifier = aws_subnet.K8s-subnet-private.*.id
  target_group_arns   = ["${aws_alb_target_group.target_group.id}"]
  min_size            = 1
  max_size            = 5
  health_check_type   = "EC2"
  desired_capacity    = 1

  tag {
    key                 = "Name"
    value               = "ASG-${random_string.random.result}"
    propagate_at_launch = true
  }

  instance_refresh {
    strategy = "Rolling"
  }
  depends_on = [ aws_instance.K8s-master,aws_alb_target_group.target_group ]
}
