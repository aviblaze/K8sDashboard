resource aws_alb "alb" {
  name               = "alb-${random_string.random.result}"
  load_balancer_type = "application"
  subnets            = aws_subnet.K8s-subnet-public.*.id
  enable_deletion_protection = false
  tags = {
    Name = "alb-${random_string.random.result}"
  }
}

resource aws_alb_target_group "target_group" {
  name     = "target-group-${random_string.random.result}"
  # port     = 443
  # protocol = "HTTPS"
  port = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.K8s-vpc.id
  tags = {
    Name = "target-group-${random_string.random.result}"
  }
}

resource aws_alb_listener "https" {
  load_balancer_arn = aws_alb.alb.arn
  # port              = "443"
  # protocol          = "HTTPS"
  # ssl_policy      = "ELBSecurityPolicy-FS-1-2-Res-2020-10"
  # certificate_arn = data.aws_acm_certificate.default.arn
  port = "80"
  protocol = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.target_group.id
  }
}

output "alb_fqdn" {
  value = aws_alb.alb.dns_name
}