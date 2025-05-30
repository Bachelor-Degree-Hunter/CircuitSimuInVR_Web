pipeline {
    triggers {
        pollSCM('H/1 * * * *') // ตรวจ Git ทุก 1 นาที
    }

    agent { label 'connect-admin3940' }

    environment {
        GITLAB_IMAGE_NAME = "registry.gitlab.com/threeman/deployprojectcircuitregistry"
        DOCKER_PORT       = "3000"
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                script {
                    echo "Checking out source code from GitHub..."
                    checkout scm
                }
            }
        }

        stage('Build and Tag Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER} ."
                }
            }
        }

        stage('Stop & Remove Existing Containers') {
            steps {
                script {
                    echo "Stopping and Removing existing containers..."
                    sh '''
                    for container_name in circuit-db circuit-backend circuit-frontend; do
                      docker ps -aq --filter "name=$container_name" | xargs -r docker rm -f || true
                    done
                    '''
                }
            }
        }

        stage('Check and Free Port') {
            steps {
                script {
                    echo "Checking and Freeing Port ${DOCKER_PORT}..."
                    sh '''
                    CONTAINER_ID=$(docker ps -q --filter "publish=5000") || true
                    if [ ! -z "$CONTAINER_ID" ]; then
                        echo "Stopping container using port 5000 (Container: $CONTAINER_ID)..."
                        docker rm -f $CONTAINER_ID || true
                    fi
                    '''
                }
            }
        }

        stage('Deploy Docker Compose') {
            steps {
                script {
                    echo "Deploying new containers..."
                    sh '''
                    DOCKER_COMPOSE_CMD=$(which docker-compose || which docker compose || echo "")
                    if [ -z "$DOCKER_COMPOSE_CMD" ]; then
                        echo "❌ ERROR: Docker Compose is not installed!"
                        exit 1
                    fi

                    docker system prune -f || true
                    docker volume prune -f || true

                    # ปิด service เก่าก่อน
                    $DOCKER_COMPOSE_CMD down || true
                    $DOCKER_COMPOSE_CMD up -d --build
                    '''
                }
            }
        }

        stage('Wait for Database to be Ready') {
            steps {
                script {
                    echo "Waiting for MySQL to be ready..."
                    sh '''
                    MAX_RETRIES=30
                    COUNTER=0
                    until docker exec circuit-db mysqladmin ping -h"localhost" --silent; do
                        COUNTER=$((COUNTER+1))
                        if [ $COUNTER -ge $MAX_RETRIES ]; then
                            echo "❌ ERROR: MySQL did not become ready in time!"
                            exit 1
                        fi
                        echo "⏳ Waiting for MySQL to be ready... ($COUNTER/$MAX_RETRIES)"
                        sleep 5
                    done
                    echo "✅ MySQL is ready!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully!"
        }
        failure {
            echo "❌ Deployment failed. Please check the logs."
        }
    }
}
