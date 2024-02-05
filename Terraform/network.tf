resource "random_string" "random" {
  length  = 8
  special = false
}

resource "aws_vpc" "K8s-vpc" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = "vpc-${random_string.random.result}"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.K8s-vpc.id
  tags = {
    Name = "gw-${random_string.random.result}"
  }
}

resource "aws_eip" "eip" {
  tags = {
    Name = "nat-${random_string.random.result}"
  }
}

resource "aws_subnet" "K8s-subnet-public" {
  vpc_id            = aws_vpc.K8s-vpc.id
  cidr_block        = var.public-subnet_cidr[count.index]
  availability_zone = var.az[count.index]
  tags = {
    Name = "public-subnet-${random_string.random.result}-${count.index}"
  }
  count = 2
}


resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.eip.id
  subnet_id     = aws_subnet.K8s-subnet-public[0].id
  tags = {
    Name = "nat-${random_string.random.result}"
  }
}

resource "aws_subnet" "K8s-subnet-private" {
  vpc_id            = aws_vpc.K8s-vpc.id
  cidr_block        = var.subnet_cidr[count.index]
  availability_zone = var.az[count.index]
  tags = {
    Name = "private-subnet-${random_string.random.result}-${count.index}"
  }
  count = 1
}



resource "aws_default_route_table" "default-route-table" {
  default_route_table_id = aws_vpc.K8s-vpc.default_route_table_id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table" "private-route-table" {
  vpc_id = aws_vpc.K8s-vpc.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
}

resource "aws_route_table_association" "private-route-table-association" {
  subnet_id      = aws_subnet.K8s-subnet-private[count.index].id
  route_table_id = aws_route_table.private-route-table.id
  count          = 1
}
resource "aws_route_table_association" "public-route-table-association" {
  count          = 1
  subnet_id      = aws_subnet.K8s-subnet-public[count.index].id
  route_table_id = aws_default_route_table.default-route-table.id
}

resource "aws_default_security_group" "default" {
  #name   = "default"
  vpc_id = aws_vpc.K8s-vpc.id
  # ingress {
  #   from_port   = 22
  #   to_port     = 22
  #   protocol    = "tcp"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

  # ingress {
  #   from_port   = 443
  #   to_port     = 443
  #   protocol    = "tcp"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

  # ingress {
  #   from_port   = 80
  #   to_port     = 80
  #   protocol    = "tcp"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

  # ingress {
  #   protocol    = "icmp"
  #   from_port   = 8
  #   to_port     = 8
  #   cidr_blocks = ["0.0.0.0/0"]
  # }
  # ingress {
  #   from_port   = 6443
  #   to_port     = 6443
  #   protocol    = "tcp"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

  # ingress {
  #   protocol    = "tcp"
  #   from_port   = 10250
  #   to_port     = 10250
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

  # ingress {
  #   from_port   = 30000
  #   to_port     = 32767
  #   protocol    = "tcp"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
