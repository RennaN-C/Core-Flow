**Estratégia de Testes - Projeto CoreFlow**
Este documento detalha as principais funcionalidades e o plano de testes para garantir a integridade do sistema CoreFlow.

1. **Gestão de Multi-tenancy e Registro de Conta**
Permite a criação simultânea de uma nova empresa (Tenant) e seu primeiro usuário administrador.

**Regras de Negócio**:

- O sistema deve criar um registro na tabela Tenants antes de criar o User.

- O User criado deve estar obrigatoriamente vinculado ao tenant_id gerado.

- Os campos tenantName, businessType, email e password são obrigatórios.

**Casos de Teste**:

- CT01 (Positivo): Enviar todos os dados obrigatórios no formato camelCase. Esperado: Status 201 e retorno dos objetos criados. (Integração)

- CT02 (Negativo): Enviar a requisição sem o campo tenantName. Esperado: Erro de "notNull Violation" do Sequelize. (Unitário/Integração)

2. **Autenticação de Usuários (Login)**
Responsável por validar as credenciais e emitir o token de acesso JWT.

**Regras de Negócio**:

- A senha enviada deve ser comparada com o hash salvo no banco via bcrypt.

- O Token JWT deve conter no payload o id do usuário e o tenant_id.

- Credenciais inválidas devem retornar erro genérico por segurança.

**Casos de Teste**:

CT03 (Positivo): Informar e-mail e senha corretos. Esperado: Receber o token JWT válido por 1 dia. (E2E)

CT04 (Negativo): Tentar login com senha incorreta. Esperado: Erro 401 "Credenciais inválidas". (Integração)

3. **Cadastro de Pessoas e Integração ViaCEP**
Permite cadastrar clientes/funcionários vinculados à empresa do usuário logado.

**Regras de Negócio**:

- A rota deve ser protegida por authMiddleware.

- O tenant_id da pessoa deve ser extraído automaticamente do Token do usuário logado.

- Se um CEP for fornecido no metadata, o sistema deve buscar dados via API externa (ViaCEP).

**Casos de Teste**:

- CT05 (Positivo): Cadastrar uma pessoa enviando um Token válido. Esperado: Registro salvo com o tenant_id correto no banco. (E2E)

- CT06 (Negativo): Tentar cadastrar uma pessoa sem enviar o Token no Header (Bearer). Esperado: Erro de acesso negado. (Integração)