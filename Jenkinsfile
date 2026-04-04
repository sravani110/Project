pipeline {
    agent any
    environment {
        AWS_REGION = "${AWS_REGION}"
        ACCOUNT_ID = "${AWS_ACCOUNT_ID}"
        REPO_NAME = "${ECR_REPO_NAME}"
        IMAGE_TAG = "latest"

        ECR_URL = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('build') {
            steps {
                sh '''
                docker build -t  $REPO_NAME:$IMAGE_TAG .
                docker tag $REPO_NAME:$IMAGE_TAG $ECR_URL/$REPO_NAME:$IMAGE_TAG
                '''
            }
        }
        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION \
                | docker login --username AWS --password-stdin $ECR_URL
                '''
            }
        }
        stage('Push to ECR') {
            steps {
                sh '''
                docker push $ECR_URL/$REPO_NAME:$IMAGE_TAG
                '''
            }
        }
        stage('Deploying app') {
            steps {
                sh '''
                aws eks --region us-east-1 update-kubeconfig --name my-eks-cluster
                kubectl apply -f Deployment.yaml 
                kubectl apply -f service.yaml 
                '''
            }
        }
    }
}
