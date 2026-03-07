# 🚀 TeamBoard API - B2B SaaS Backend

Este é o repositório do backend (API) do **TeamBoard**, um sistema de gestão de projetos e tarefas (Kanban) construído com arquitetura **Multi-tenant B2B**.

A API foi desenvolvida com foco extremo em segurança, isolamento de dados entre empresas (Tenants) e rastreabilidade, utilizando as melhores práticas de Engenharia de Software para aplicações corporativas.

## 🧠 Decisões Arquiteturais e Pontos Fortes

Ao contrário de CRUDS tradicionais, esta API foi arquitetada para suportar múltiplos clientes (empresas) na mesma infraestrutura sem risco de vazamento de dados (*Cross-Tenant Data Leakage*). 

### 1. Arquitetura Multi-tenant (Single Database)
* **Isolamento Lógico:** Todas as requisições autenticadas exigem a passagem do contexto da organização (via header `x-organization-id`).
* **Segurança contra IDOR:** Todos os *Services* (Projetos, Tarefas, Comentários) validam ativamente se o recurso solicitado pertence à organização injetada no contexto da requisição. Nenhuma entidade pode ser acessada ou mutada fora do escopo do Tenant.
* **Desnormalização Consciente:** Entidades filhas (como `Task` e `Comment`) possuem o `organizationId` diretamente em suas tabelas para otimização de queries e garantia de isolamento em nível de banco de dados.

### 2. Segurança e Autenticação (Dual-Token Pattern)
* **JWT Access Token (Stateless):** Tokens de curta duração (ex: 15 min) para operações de alta performance sem onerar o banco de dados.
* **Refresh Token Rotation (Stateful):** Tokens de longa duração mantidos em cookies `HttpOnly`. A cada renovação, o token antigo é revogado e um novo é gerado, neutralizando ataques de roubo de sessão e permitindo invalidação remota.

### 3. Controle de Acesso Baseado em Cargos (RBAC)
* **Design Pattern:** Implementação via *Guards* nativos do NestJS (`OrganizationGuard` e `RolesGuard`).
* **Execução Limpa:** O Controller não possui lógica de autorização. O controle é feito via *Custom Decorators* (ex: `@Roles('ADMIN', 'MANAGER')`), tornando as rotas semânticas e o código *DRY* (Don't Repeat Yourself).
* **Global User com Nested Memberships:** A identidade do usuário é global, mas suas permissões são relativas à Organização que ele está acessando no momento.

### 4. Trilha de Auditoria Automática (Audit Log)
* O sistema possui um `AuditLogService` global com estratégia *Fire-and-Forget* (assíncrona) para não bloquear a latência da resposta ao cliente (UX).
* **Interceptor Genérico:** Um *NestInterceptor* captura automaticamente todas as requisições de mutação (`POST`, `PUT`, `PATCH`, `DELETE`) e registra metadados cruciais (IP, Payload, Action, User) para compliance.

### 5. Resiliência e Integridade de Dados
* **Chaves de Idempotência:** A entidade `Task` possui uma `idempotencyKey` atrelada a uma *constraint* de unicidade no banco, garantindo que falhas de rede do frontend não gerem tarefas duplicadas.
* **Soft Delete:** Remoções de entidades críticas (Projetos e Tarefas) não executam `DELETE` no banco de dados. Utilizamos `deletedAt` para preservar a integridade referencial e o histórico de auditoria.
* **Transações ACID:** Operações complexas, como o reordenamento de cards no Kanban (atualização em cascata de posições), são envelopadas em transações (`$transaction` do Prisma) para evitar estados inconsistentes.

## 🛠️ Stack Tecnológico

* **Framework:** [NestJS](https://nestjs.com/) (Node.js com TypeScript Estrito)
* **Banco de Dados:** PostgreSQL
* **ORM:** [Prisma](https://www.prisma.io/) (com schema otimizado e índices compostos)
* **Autenticação:** Passport.js, JWT, bcrypt
* **Validação:** class-validator e class-transformer

## 🗄️ Modelagem de Dados (High-Level)
* `User` (Global) <-> `Membership` (Cargo) <-> `Organization` (Tenant)
* `Organization` -> `Project` -> `Task` -> `Comment`
* `AuditLog` (Tabela apendável para rastreabilidade de eventos de negócio)

## 🚀 Como rodar o projeto localmente

1. Clone o repositório e navegue até a pasta `/api`.
2. Instale as dependências:
   ```bash
   npm install