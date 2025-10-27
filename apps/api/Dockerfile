FROM node:20-alpine AS base
WORKDIR /workspace

COPY package*.json ./
COPY tsconfig*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install
RUN npm run build --workspace apps/api

FROM node:20-alpine
WORKDIR /workspace
COPY --from=base /workspace .

EXPOSE 3333
CMD ["npm", "run", "start", "--workspace", "apps/api"]
