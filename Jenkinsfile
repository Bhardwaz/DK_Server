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
    }
}
