/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID       = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY   = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_REGION              = credentials('AWS_REGION')
        S3_BUCKET               = credentials('S3_BUCKET')
        TOKEN_SECRET            = credentials('TOKEN_SECRET')
        MONGODB_URI             = credentials('MONGODB_URI')
        FRONTEND_SERVICE_ORIGIN = credentials('FRONTEND_SERVICE_ORIGIN')
        PORT                    = credentials('PORT')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                echo 'Installing backend dependencies...'
                sh 'npm install'

                echo 'Building Docker image for backend...'
                sh 'docker build -t datekarle-app:server-latest .'
            }
        }

        stage('Run Backend Container') {
            steps {
                sh 'docker rm -f backend-container || true'
                sh '''docker run -d -p 4001:4001 \\
                  -e PORT=$PORT \\
                  -e MONGODB_URI="$MONGODB_URI" \\
                  -e TOKEN_SECRET="$TOKEN_SECRET" \\
                  -e AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \\
                  -e AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \\
                  -e AWS_REGION="$AWS_REGION" \\
                  -e S3_BUCKET="$S3_BUCKET" \\
                  -e FRONTEND_SERVICE_ORIGIN="$FRONTEND_SERVICE_ORIGIN" \\
                  --name backend-container \\
                  datekarle-app:server-latest'''
            }
        }
    }
}
