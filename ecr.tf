resource "aws_ecr_repository" "main" {
  name                 = "my-app-repo"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "squad-1"
  }
}

