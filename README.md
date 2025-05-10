Task Manager
A simple task management app built with micro-services, containerized and orchestrated locally.

🚀 Tech Stack
Frontend: React + Vite served by Nginx

Backends: Two Spring Boot services

service-users (port 8081): JWT authentication & user management

service-tasks (port 8080): CRUD operations on tasks

Database: MySQL 5.7, initialized via init.sql

Orchestration:

Docker Compose for local development

Minikube + Kubernetes manifests under k8s/ for a local cluster

Prerequisites
Docker & Docker Compose

kubectl

Minikube (with Docker driver)

Local Setup (Docker Compose)
Copy and edit environment variables:

bash
Copier
Modifier
cp .env.example .env
# Set MYSQL_PASSWORD and JWT_SECRET
Start all services:

bash
Copier
Modifier
docker-compose up --build
Open the app at
http://localhost:5173

Kubernetes Setup (Minikube)
Start Minikube with Docker:

bash
Copier
Modifier
minikube config set driver docker
minikube start
minikube addons enable ingress
Create the MySQL init ConfigMap:

bash
Copier
Modifier
kubectl create configmap mysql-initdb \
  --from-file=./mysql-init/init.sql
Apply all manifests:

bash
Copier
Modifier
kubectl apply -f k8s/ --recursive
Check pod status:

bash
Copier
Modifier
kubectl get pods
Expose the frontend:

Automatic URL:

bash
Copier
Modifier
minikube service frontend --url
Or port-forward:

bash
Copier
Modifier
kubectl port-forward svc/frontend 5173:80
then browse http://localhost:5173

Features
Sign up / Log in with JWT

Task dashboard: create, read, update, delete, and toggle done status

Health checks on /health for each service

Next Steps
Move to a managed Kubernetes cluster (GKE, EKS, AKS)

Set up CI/CD (e.g., GitHub Actions)

Add HTTPS in production with cert-manager

Implement E2E tests and monitoring
