# Prisma Digital Marketing

Ferramentas modernas para negócios de marketing digital, desenvolvidas com Node.js, Express, TypeScript, PostgreSQL e Prisma ORM.

## 🚀 Sobre o Projeto

Este projeto oferece uma base robusta para construir aplicações voltadas ao marketing digital, integrando as melhores práticas do ecossistema Node.js e tecnologias modernas de banco de dados.

-   **Backend:** Node.js + Express
-   **Linguagem:** TypeScript
-   **Banco de Dados:** PostgreSQL
-   **ORM:** Prisma

## 📦 Estrutura do Projeto

```
├── src/
│   ├── router.ts        # Rotas da API
│   └── server.ts        # Inicialização do servidor Express
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração do TypeScript
```

## ⚡ Como Executar

1. **Instale as dependências:**
    ```bash
    npm install
    ```
2. **Configure o banco de dados PostgreSQL** e o arquivo `.env` com as credenciais.
3. **Execute as migrações do Prisma:**
    ```bash
    npx prisma migrate dev
    ```
4. **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## 🌐 Endpoints Básicos

-   `GET /api/status` — Verifica se o servidor está online.

## 🛠️ Tecnologias Utilizadas

-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Prisma ORM](https://www.prisma.io/)

## 📚 Documentação

-   [Documentação do Prisma](https://www.prisma.io/docs/)
-   [Documentação do Express](https://expressjs.com/pt/)

