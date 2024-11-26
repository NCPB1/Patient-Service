resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "squad1-eks-vpc"
  }
}

resource "aws_subnet" "public" {
  count                  = 2
  vpc_id                 = aws_vpc.main.id
  cidr_block             = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone      = element(["us-east-1a", "us-east-1b"], count.index)
  map_public_ip_on_launch = true

  tags = {
    Name = "squad1-eks-public-subnet-${count.index}"
  }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 2)
  availability_zone = element(["us-east-1a", "us-east-1b"], count.index)

  tags = {
    Name = "squad1-eks-private-subnet-${count.index}"
  }
}

