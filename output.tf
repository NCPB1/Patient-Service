output "vpc_id" {
  value = aws_vpc.main.id
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.main.endpoint
}

output "ecr_repository_url" {
  value = aws_ecr_repository.main.repository_url
}

