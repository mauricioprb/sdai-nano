FROM node:20-alpine AS deps
WORKDIR /workspace

COPY package*.json ./
COPY tsconfig*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install
RUN npm run build --workspace apps/web

FROM node:20-alpine
WORKDIR /workspace
COPY --from=deps /workspace .

EXPOSE 3000
CMD ["npm", "run", "start", "--workspace", "apps/web"]
