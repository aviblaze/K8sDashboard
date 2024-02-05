variable "region" {
    type = string
    default = "us-east-1"
}

variable "aws_access_key" {
    type = string
    sensitive = true
}

variable "aws_secret_key" {
    type = string
    sensitive = true
}

variable "vpc_cidr" {
    type = string
    default = "172.16.0.0/16"
}

variable "public-subnet_cidr" {
    type = list
    default = ["172.16.70.0/24","172.16.30.0/24"]
}

variable "az" {
    type = list
    default = ["us-east-1a","us-east-1b"]
}

variable "subnet_cidr" {
    type = list
    default = ["172.16.20.0/24","172.16.60.0/24"]
}

variable "aminamereg"{
    type = string
    default = "Amazon Linux 2023 * x86_64 HVM *"
}

variable "amiowner"{
    type = string
    default = "amazon"
}