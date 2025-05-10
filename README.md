# Distributed Task Manager Project Report

## Introduction

This report presents the Distributed Task Manager project, outlining its goals, architecture, local deployment (Docker Compose, Kubernetes).

---

## 1. Context and Objectives

* **Objectives**: Implement microservices (`service-users`, `service-tasks`), develop a React frontend, expose REST APIs, and use MySQL for persistence.

---

## 2. System Architecture

* **Microservices**: Two Spring Boot services (ports 8081 and 8080) exposing REST endpoints.
* **Frontend SPA**: React + Vite communicating through `/api/users` and `/api/tasks`.
* **Database**: MySQL 5.7 initialized via `init.sql`.
* **Authentication**: JWT-based security.

**Architecture diagram**:
Frontend ↔ service-users (auth/login, user creation)
Frontend ↔ service-tasks (task CRUD)
service-\* ↔ MySQL (usersdb & tasksdb)

---

## 3. Containerization and Local Deployment

### 3.1 Docker Compose

* Defined services for MySQL, service-users, service-tasks, and frontend.
* Mounted initialization script via volume.
* Configured health checks for automatic restarts.

### 3.2 Kubernetes (Minikube)

* Created PVC for MySQL persistence.
* ConfigMap for `init.sql` injection.
* Secrets for database passwords and JWT keys.
* Deployments and ClusterIP Services for each component.
* Ingress NGINX for routing HTTP traffic.
* RBAC and readiness/liveness probes for reliability.

---

## 4. Security and Service Mesh

* **Istio mTLS** experimentation with `PeerAuthentication` and `DestinationRule`.
* Partial rollback to simpler HTTP due to local constraints.
* Implemented RBAC, NetworkPolicies for least-privilege networking.

---

## Conclusion

This project provided hands-on experience with the full deployment lifecycle: from local Docker and Kubernetes environments to exploring PaaS cloud deployment, covering aspects of security, resilience, and production considerations.
