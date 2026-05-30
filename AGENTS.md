# CoreFlow - AI Agent Instructions

## Projeto

CoreFlow é um sistema SaaS multi-tenant para gestão empresarial.

Stack:

- Frontend: React 19 + Vite + React Router
- Backend: Node.js + Express
- Banco: PostgreSQL
- ORM: Sequelize
- Containers: Docker
- Orquestração: Kubernetes
- Ambiente Local: Minikube

---

## Estrutura

/frontend
/backend
/.k8s

---

## Frontend

Tecnologias:

- React
- React Router DOM
- Axios
- TailwindCSS
- Lucide React

Deploy:

- Build gerado via Vite
- Servido por Nginx
- Porta interna: 80

Docker:

- Multi-stage build
- node:20-alpine
- nginx:alpine

---

## Backend

Tecnologias:

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT
- bcrypt

Porta:

3000

Rotas:

POST /auth/register
POST /auth/login
POST /auth/activate

---

## Kubernetes

Deployments:

- coreflow-front-deployment
- coreflow-api-deployment
- postgres

Services:

- coreflow-front-service
- coreflow-api-service
- postgres

Ingress:

- coreflow-ingress

Host:

coreflow.seudominio.com

---

## Objetivo Atual

Resolver totalmente o deploy Kubernetes.

O frontend já está funcionando.

A API ainda apresenta falhas de conexão com PostgreSQL.

---

## Regras

Antes de modificar arquivos:

1. Ler AGENTS.md
2. Ler CONTEXT.md
3. Verificar impacto em Kubernetes
4. Verificar impacto em Docker
5. Não alterar rotas sem validar Ingress

Sempre sugerir comandos completos.
Sempre explicar alterações em YAML.
Sempre verificar compatibilidade com Minikube.