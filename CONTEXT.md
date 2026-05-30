# Histórico do Projeto CoreFlow

## Situação Atual

Projeto em funcionamento no Kubernetes (Minikube).

Stack:

* React + Vite
* Node.js + Express
* PostgreSQL
* Sequelize
* Docker
* Kubernetes
* Minikube

---

# Frontend

Status: FUNCIONANDO

Imagem Docker:

rennanmk9/coreflow-front:1.0.4

Deployment:

coreflow-front-deployment

Replicas:

2

Service:

coreflow-front-service

Tipo:

NodePort

Portas:

80 -> 80

NodePort:

30000

---

## Problemas Corrigidos

### React Invalid Hook Call

Erro:

Invalid hook call

Causa:

Dependências React não instaladas.

Solução:

npm install

---

### Erro WebSocket do Vite

Erro:

failed to connect websocket

Causa:

Frontend rodando em modo desenvolvimento dentro do Kubernetes.

Solução:

Migrado para build estático.

Dockerfile convertido para multi-stage build.

---

### Frontend não carregava

Problema:

Service apontava para porta 5173.

Solução:

Alterado:

targetPort: 80

---

### Erro de rota duplicada

Problema:

Frontend gerava:

/auth/auth/login

/auth/auth/register

Causa:

baseURL configurada como:

/auth

e chamadas usando:

/auth/login

Resultado:

/auth/auth/login

Solução:

Manter:

baseURL: "/auth"

Trocar chamadas para:

api.post("/login")

api.post("/register")

api.post("/activate")

---

# Backend

Status: FUNCIONANDO

Imagem Docker:

rennanmk9/coreflow-api:1.0.2

Deployment:

coreflow-api-deployment

Replicas:

2

Service:

coreflow-api-service

Tipo:

ClusterIP

Portas:

3001 -> 3000

---

## Problema Resolvido

Erro anterior:

SequelizeConnectionError

getaddrinfo EAI_AGAIN postgres

A API não iniciava.

---

## Diagnóstico Realizado

DNS Kubernetes:

nslookup postgres

Resultado:

postgres.default.svc.cluster.local

Funcionando.

---

Conectividade PostgreSQL:

nc -zv postgres 5432

Resultado:

OPEN

---

Service PostgreSQL:

Nome:

postgres

IP:

10.101.240.143

Porta:

5432

Endpoints:

10.244.0.39:5432

---

## Solução Aplicada

Backend estava usando imagem inadequada.

Foi criado Dockerfile de produção.

Dockerfile:

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

---

package.json atualizado:

"scripts": {
"start": "node server.js",
"dev": "nodemon server.js"
}

---

Nova imagem gerada:

rennanmk9/coreflow-api:1.0.2

Deployment atualizado.

---

## Estado Atual Confirmado

Logs:

Tentando conectar ao banco: postgres

Conexão estabelecida e tabelas sincronizadas com sucesso!

Servidor rodando na porta 3000

---

Pods Backend

coreflow-api-deployment-5cd55f8fd6-75wwq

coreflow-api-deployment-5cd55f8fd6-94gvj

Status:

Running

---

Teste de Porta

Comando:

kubectl exec -it deployment/coreflow-api-deployment -- netstat -tulpn

Resultado:

tcp 0 0 0.0.0.0:3000 0.0.0.0:* LISTEN

Backend ouvindo corretamente.

---

# PostgreSQL

Status: FUNCIONANDO

Deployment:

postgres

Service:

postgres

Tipo:

ClusterIP

Porta:

5432

PVC:

postgres-pvc

Banco:

coreflow_db

Usuário:

postgres

---

# Ingress

Status: FUNCIONANDO

Nome:

coreflow-ingress

Host:

coreflow.seudominio.com

IP:

192.168.49.2

Rotas:

/ -> coreflow-front-service

/auth -> coreflow-api-service

---

# Infraestrutura Kubernetes

Deployments:

* coreflow-front-deployment
* coreflow-api-deployment
* postgres

Services:

* coreflow-front-service
* coreflow-api-service
* postgres

Ingress:

* coreflow-ingress

---

# Imagens Docker

Frontend:

rennanmk9/coreflow-front:1.0.4

Backend:

rennanmk9/coreflow-api:1.0.2

---

# Próximos Passos

Validar:

POST /auth/register

POST /auth/login

POST /auth/activate

Verificar:

* geração de JWT
* persistência PostgreSQL
* ativação de licença
* fluxo completo frontend -> backend -> banco

---

# Planejamento AWS

Objetivo:

Migrar do Minikube para AWS EC2.

Fluxo desejado:

Desenvolvimento Local

↓

Docker Build

↓

Docker Hub

↓

AWS EC2

↓

docker pull

↓

docker compose ou Kubernetes

Sem necessidade de clonar repositório na VM.

---

# Comandos Úteis

Ver pods:

kubectl get pods

Ver services:

kubectl get svc

Ver ingress:

kubectl get ingress

Ver logs backend:

kubectl logs -f deployment/coreflow-api-deployment

Ver logs frontend:

kubectl logs -f deployment/coreflow-front-deployment

Reiniciar backend:

kubectl rollout restart deployment coreflow-api-deployment

Reiniciar frontend:

kubectl rollout restart deployment coreflow-front-deployment

Entrar no container:

kubectl exec -it <pod> -- sh

Testar PostgreSQL:

nc -zv postgres 5432

Verificar DNS:

nslookup postgres

Verificar portas:

netstat -tulpn
