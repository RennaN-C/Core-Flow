# CoreFlow - Configuracao das integracoes

## Pagamentos

O modulo financeiro usa PIX demonstrativo local por padrao:

```text
PAYMENT_PROVIDER=demo
```

Esse modo:

- gera cobrancas locais no PostgreSQL;
- gera um codigo `CORE_FLOW_DEMO_PIX`, sem valor bancario;
- permite usar o botao **Simular pagamento**;
- atualiza a cobranca para `PAID` e registra a acao na auditoria.

## Asaas Sandbox

Para criar cobrancas reais no ambiente sandbox, altere:

```text
PAYMENT_PROVIDER=asaas
ASAAS_BASE_URL=https://api-sandbox.asaas.com/v3
```

Configure `ASAAS_API_KEY` somente como Secret. Nunca exponha a chave no frontend ou no Git.

O webhook publico e:

```text
POST /webhooks/asaas
```

Cadastre essa URL no Asaas e configure um token forte. O mesmo valor deve ser salvo como `ASAAS_WEBHOOK_TOKEN`. O backend valida o header `asaas-access-token`, ignora eventos duplicados e atualiza cobrancas recebidas para `PAID`.

## Groq

O dashboard sempre calcula indicadores usando PostgreSQL. Para enriquecer o texto com IA, configure `GROQ_API_KEY`. Sem essa variavel, o resumo local continua funcionando.

## Kubernetes

Edite `.k8s/secret.yaml`, que e ignorado pelo Git, e adicione somente os secrets necessarios:

```yaml
stringData:
  ASAAS_API_KEY: "sua-chave-sandbox"
  ASAAS_WEBHOOK_TOKEN: "token-forte-do-webhook"
  GROQ_API_KEY: "sua-chave-opcional"
```

Depois aplique:

```powershell
cd D:\Projetos\Core-Flow-main
kubectl apply -f .k8s/configmap.yaml
kubectl apply -f .k8s/secret.yaml
kubectl apply -f .k8s/ingress.yaml
kubectl apply -f .k8s/backend_deployment.yml
```

Use `docs/kubernetes-secret.example.yaml` como referencia. Nao aplique o arquivo de exemplo sem substituir os valores.

## Referencias oficiais

- Asaas - cobrancas PIX: https://docs.asaas.com/docs/cobrancas-via-pix
- Asaas - assinaturas: https://docs.asaas.com/docs/criando-uma-assinatura
- Asaas - webhooks: https://docs.asaas.com/docs/sobre-os-webhooks
- Groq - chat completions: https://console.groq.com/docs/api-reference
