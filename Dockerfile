FROM node:24-alpine

WORKDIR /app

# O npm ci precisa enxergar todos os manifests dos workspaces.
COPY . .

RUN npm ci \
    && cd packages/database \
    && DATABASE_URL=postgresql://build:build@localhost:5432/build npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "server", "--workspace=@douglasguita/backend-api"]