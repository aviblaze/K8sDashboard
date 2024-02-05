terraform {
  backend "s3" {
    bucket = "awsterraformbackendstatebucket"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 5.31.0"
    }

    local = {
      source = "hashicorp/local"
      version = "~> 2.4.1"
    }
  }
}

provider "aws" {
    region = var.region
    access_key = var.aws_access_key
    secret_key = var.aws_secret_key
}

provider "local" {
  # Configuration options
}