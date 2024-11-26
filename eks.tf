resource "aws_eks_cluster" "main" {
  name     = "my-eks-cluster"
  role_arn = aws_iam_role.eks.arn

  vpc_config {
    subnet_ids = concat(
      aws_subnet.public[*].id,
      aws_subnet.private[*].id
    )
  }

  tags = {
    Name = "squad1-eks-cluster"
  }
}
resource "aws_eks_node_group" "managed" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "eks-managed-nodes"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = aws_subnet.private[*].id

  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 1
  }

  instance_types = ["t3.medium"] # Adjust based on your requirements

  tags = {
    Name = "squad1-eks-managed-nodes"
  }
}

