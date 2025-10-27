# SDAI - Scientific Data Authenticity Identification

Plataforma para proveniência verificável de micrografias de microscopia eletrônica (SEM/TEM), com veredito técnico calculado a partir de metadados certificados e assinatura digital, garantindo rastreabilidade ponta a ponta.

## Estrutura

- `apps/api`: API Node + Express organizada em camadas (domain, application, infrastructure, interfaces).
- `apps/web`: Front-end Next.js 15 (App Router) para visualização da trilha de proveniência/
- `packages/shared`: Tipos utilitários e schemas Zod reutilizáveis.
- `packages/merkle-log`: Implementação de árvore Merkle append-only com Signed Tree Head (STH).
- `packages/sem-metadata`: Extração, validação e cálculo de score para metadados SEM/TEM.
- `infra`: docker-compose e scripts de automação.

## Scripts

- `npm run dev`: Sobe API e Web em paralelo (usa workspaces).
- `npm run build`: Gera artefatos de build para todos os workspaces registrados.
- `npm run start`: Executa os entrypoints em modo produção.
- `npm run lint` / `npm run format`: Lint e format global.

## Qualidade

- ESLint + Prettier alinhados para projetos TypeScript/React.
- Husky + lint-staged aplicam lint/format antes dos commits.
- `.editorconfig` e `.nvmrc` padronizam ambiente.

## Falta

- Implementar endpoints REST/GraphQL na API conectando serviços de metadados e Merkle Log.
- Integrar fluxo real de ingestão SEM/TEM (upload de metadados e arquivos binários).
- Adicionar camada de persistência.
