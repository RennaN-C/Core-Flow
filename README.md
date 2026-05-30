# 🚀 CoreFlow - SaaS Business Management

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-43853D?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?logo=postgresql&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-326CE5?logo=kubernetes&logoColor=white)
![Jest](https://img.shields.io/badge/Tested_with-Jest-C21325?logo=jest&logoColor=white)

O **CoreFlow** é uma plataforma Full-Stack moderna e escalável, projetada no modelo SaaS (Software as a Service) para a gestão otimizada de negócios. A aplicação possui uma arquitetura estrita de **Multi-tenancy**, garantindo o isolamento total de dados entre diferentes empresas (Tenants), além de um sistema robusto de licenciamento, autenticação e orquestração cloud-native.

---

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Segurança
* **JWT & Bcrypt:** Autenticação baseada em tokens (JSON Web Tokens) com senhas fortemente criptografadas.
* **Middlewares de Proteção:** Rotas de backend e frontend protegidas contra acessos não autorizados.
* **Gestão de Sessão:** Controle de estado persistente no client-side via `localStorage`.

### 🏢 Multi-tenancy e Licenciamento
* **Isolamento de Dados:** Cada usuário e registro no sistema pertence a um `tenant_id` específico, impedindo o vazamento de dados entre empresas.
* **Sistema de Ativação (License Keys):** Fluxo de bloqueio/desbloqueio de sistema. Novas empresas recebem uma chave de licença única de 16 caracteres (ex: `ABCD-1234-EFGH-5678`) que deve ser ativada para liberar o Dashboard.

### 👥 Gestão de Entidades
* **Cadastro de Pessoas:** Gerenciamento de clientes e funcionários (`PersonController`) com metadados flexíveis.
* **Integração ViaCEP:** Autopreenchimento e validação de endereços consumindo a API externa do ViaCEP de forma assíncrona.

### 💳 Gestão Financeira (Roadmap)
* Integração arquitetada para gateways de pagamento (como Asaas/Mercado Pago) para processamento de transações e cobranças recorrentes.

---

## 🛠️ Stack Tecnológico

A stack foi escolhida com foco em performance, experiência de desenvolvimento e facilidade de deploy.

* **Frontend:** React.js, Vite, TailwindCSS, Lucide Icons, Axios. *(Interface com estética dark mode / neon)*
* **Backend:** Node.js, Express.js, Sequelize ORM.
* **Banco de Dados:** PostgreSQL.
* **Testes:** Jest (Mocks, Stubs, Coverage Reports).
* **Infraestrutura e DevOps:** Docker, Docker Compose, Kubernetes (K8s), Minikube, Ingress Nginx Controller.

---

## 🚢 Infraestrutura Cloud-Native (Kubernetes)

O CoreFlow está preparado para ambientes de produção distribuídos. A pasta `.k8s/` contém todos os manifestos declarativos necessários para orquestrar a aplicação:

* **Deployments:** Gestão de réplicas do Frontend, Backend API e Banco de Dados.
* **Services (NodePort/ClusterIP):** Comunicação interna segura entre os pods.
* **ConfigMaps & Secrets:** Injeção de variáveis de ambiente (`API_URL`) e credenciais sensíveis (`DB_PASSWORD`) de forma segura.
* **Persistent Volume Claims (PVC):** Persistência de dados do PostgreSQL para evitar perda de informações no reinício dos pods.
* **Ingress Controller:** Roteamento reverso para mapeamento do domínio (`coreflow.seudominio.com`) para os serviços internos.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) rodando.
* [Minikube](https://minikube.sigs.k8s.io/docs/start/) e `kubectl` instalados.
* Node.js v18+.

### Passo 1: Subir o Cluster Kubernetes
Inicie o Minikube e ative o addon de Ingress:
```bash
minikube start
minikube addons enable ingress
Passo 2: Configurar o DNS Local (Windows)
Descubra o IP do seu cluster rodando minikube ip. Em seguida, adicione a seguinte linha ao seu arquivo C:\Windows\System32\drivers\etc\hosts:

Plaintext
<SEU_MINIKUBE_IP> coreflow.seudominio.com
Passo 3: Iniciar a Infraestrutura
Na raiz do projeto, aplique as configurações do Kubernetes (certifique-se de ter criado o arquivo secret.yaml dentro da pasta .k8s com as credenciais do banco):

Bash
kubectl apply -f .k8s/
Dica: Se as imagens locais do Docker não estiverem subindo, envie-as para o Minikube com minikube image load rennanmk9/coreflow-api:1.0.0 e rennanmk9/coreflow-front:1.0.0.

Acesse a aplicação no navegador em: http://coreflow.seudominio.com

🧪 Estratégia de Testes Unitários
O projeto utiliza Jest seguindo o padrão AAA (Arrange, Act, Assert). Os testes são totalmente isolados, utilizando bibliotecas de Mocking para simular o banco de dados (Sequelize) e chamadas HTTP externas (Axios), garantindo velocidade e independência de infraestrutura.

Casos de Teste Mapeados e Cobertos:

[CT01 a CT02] - Fluxo de Registro e violação de restrições (Not Null/Unique).

[CT03 a CT04] - Autenticação, emissão de JWT e bloqueio de credenciais inválidas.

[CT05 a CT07] - Proteção de Tenant (injeção segura de ID) e mock da API ViaCEP.

Rodando os testes:
Para executar a suíte de testes e visualizar o relatório de cobertura de código (Coverage):

Bash
cd backend
npm install
npm run test:coverage
👨‍💻 Autor
Desenvolvido por Rennan De Oliveira Cardoso Estudante de Engenharia de Software | Full-Stack Developer
