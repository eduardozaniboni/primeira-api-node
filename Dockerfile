# Criando uma imagem do Node para o Linux alpine 
# (-alpine é uma versão do Linux especíica contendo só o necessário)
FROM node:22-alpine AS builder

# Cria uma pasta /app no Linux
WORKDIR /app

# Copia os arquivos de package para a pasta /app
# Criar o arquivo .dockerignore
COPY . ./

# Instala somente as dependências do package-lock.json
# --omit=dev instala somente as dependências necessárias
# Mas precisamos da drizzle-kit, então vamos enviar tudo
RUN npm ci

# Porta que a aplicação roda
EXPOSE 3333

# Comando para executar migrações e iniciar a aplicação
CMD ["sh", "-c", "npm run db:migrate && node src/server.ts"]

