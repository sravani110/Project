pipeline {
    agent any
    tools {
        nodejs 'node20'
        sonar 'sonar-scanner'
    }
    environment {
        AWS_REGION   = "${AWS_REGION}"
        ACCOUNT_ID   = "${AWS_ACCOUNT_ID}"
        REPO_NAME    = "${ECR_REPO_NAME}"
        IMAGE_TAG    = "${BUILD_NUMBER}"
        ECR_URL      = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        CLUSTER_NAME = "my-eks-cluster"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    node -v
                    npm ci
                    npm install --save-dev jsdom
                '''
            }
        }

        stage('Run Tests with Coverage') {
            steps {
                sh 'npm run coverage'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                        sh '''
                            sonar-scanner
                        '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building Docker image: $ECR_URL/$REPO_NAME:$IMAGE_TAG"
                    docker build -t $ECR_URL/$REPO_NAME:$IMAGE_TAG .
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin $ECR_URL
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh 'docker push $ECR_URL/$REPO_NAME:$IMAGE_TAG'
            }
        }

        stage('Update Manifest') {
            steps {
                sh '''
                    sed -i "s|IMAGE_TAG|$IMAGE_TAG|g" Deployment.yaml
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                    aws eks update-kubeconfig \
                        --region $AWS_REGION \
                        --name my-eks-cluster

                    kubectl apply -f Deployment.yaml
                    kubectl apply -f service.yaml
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}