pipeline {
    agent any
    tools {
        nodejs 'node16'
    }
    environment {
        AWS_REGION = "${AWS_REGION}"
        ACCOUNT_ID = "${AWS_ACCOUNT_ID}"
        REPO_NAME = "${ECR_REPO_NAME}"
        IMAGE_TAG = "${env.BUILD_NUMBER}"

        ECR_URL = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        SONARQUBE = "Sonarqube"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('install dependencies') {
            steps {
                sh 'npm install'
                sh 'npm install --save-dev jsdom'
            }
        }
        stage('run tests with coverage') {
            steps {
                sh 'npm run coverage'
            }
        } 
        stage('sonarqube analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE}") {
                    withCredentials([string(credentialsId:'sonar-cred', variable:'SONAR_TOKEN')]) {
                          sh '''
                npx sonar-scanner \
                -Dsonar.projectKey=devops-company \
                -Dsonar.sources=src \
                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                '''
                }
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
        stage('build') {
            steps {
                sh '''
                 
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
                sh '''
                docker push $ECR_URL/$REPO_NAME:$IMAGE_TAG
                '''
            }
        }
        stage('Update Manifest') {
            steps {
                sh '''
                sed -i "s|IMAGE_TAG|$IMAGE_TAG|g" Deployment.yaml
                '''
            }
        }
        stage('Deploying app') {
            steps {
                sh '''
                aws eks update-kubeconfig --region us-east-1 --name my-eks-cluster
                kubectl apply -f Deployment.yaml 
                kubectl apply -f service.yaml 
                '''
            }
        }
    }
}
