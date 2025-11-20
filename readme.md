# Prisma Digital Marketing

Sistema de gerenciamento de leads, campanhas e grupos para marketing digital, construído com arquitetura em camadas e princípios SOLID.

## 🚀 Sobre o Projeto

API REST para gestão de marketing digital com **baixo acoplamento** e **alta coesão**:

-   **Arquitetura em 3 Camadas**: Controllers (HTTP) → Services (Negócio) → Repositories (Dados)
-   **Injeção de Dependências**: Componentes desacoplados via `instancesContainer`
-   **Abstração de Persistência**: Interfaces desacoplam lógica de negócio do ORM
-   **Type Safety**: TypeScript strict mode + `exactOptionalPropertyTypes`
-   **Separação de Responsabilidades**: Cada camada com responsabilidade única

### Stack

Node.js • Express 5 • TypeScript • PostgreSQL • Prisma • Zod

## 📦 Estrutura do Projeto

```
src/
├── controllers/        # HTTP handlers (validação Zod + delegação)
├── services/          # Lógica de negócio e regras
├── repositories/      # Abstração de dados (interfaces + Prisma)
├── errors/            # HttpError e middlewares
└── instancesContainer.ts  # Injeção de dependências
```

## ⚡ Como Executar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# 3. Rodar migrações
npx prisma migrate dev

# 4. Iniciar servidor
npm run dev  # http://localhost:3000
```

**Scripts:**

-   `npm run dev` - Desenvolvimento (hot reload)
-   `npm run build` - Compilar TypeScript
-   `npx prisma studio` - Interface visual do banco

## 🌐 Principais Endpoints

**Leads:** `/api/leads` (GET, POST, PUT, DELETE)  
**Grupos:** `/api/groups` (GET, POST, PUT, DELETE)  
**Campanhas:** `/api/campaigns` (GET, POST, PUT, DELETE)  
**Grupo-Leads:** `/api/groups/:id/leads`  
**Campanha-Leads:** `/api/campaigns/:id/leads`

Query params (listagem): `page`, `pageSize`, `name`, `status`, `sortBy`, `order`

## 📋 Modelos de Dados

**Lead**: `id`, `name`, `email` (único), `phone?`, `status`, `createdAt`, `updatedAt`  
**Group**: `id`, `name`, `description`  
**Campaign**: `id`, `name`, `description`, `startDate`, `endDate?`  
**LeadCampaign**: `leadId`, `campaignId`, `status` (relação N:N)

### Regras de Negócio

-   Lead NEW → só pode ir para CONTACTED primeiro
-   Lead ARCHIVED → requer 6 meses desde última atualização
-   Email único no sistema
-   Lead pode estar em múltiplos grupos/campanhas simultaneamente

## 💡 Arquitetura e Boas Práticas

**Injeção de Dependências:** `instancesContainer.ts` centraliza instâncias

```typescript
Repository → Service → Controller
```

**Abstração de Persistência:** Interfaces `LeadModel`, `CampaignModel` desacoplam do Prisma

**Validação em Camadas:**

1. Controller: Formato (Zod schemas)
2. Service: Regras de negócio
3. Repository: Integridade (DB constraints)

**TypeScript Strict:** `exactOptionalPropertyTypes` garante propriedades opcionais sem `undefined` explícito

---

**Licença:** ISC | **Autor:** Rodhis
