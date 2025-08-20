## Aprendizados

## Aula 1

- Rodar 'node --watch server.js' para não ficar reiniciando o servidor após alterações
- Sempre retornar um objeto (JSON) das rotas

### Instalar Typescript

- npm i typescript @types/node -D => instalar o typescript e os types do node
- npx tsc --init => criar o arquivo tsconfig.json
- Acessar o repositório da microsft "ts config bases": https://github.com/tsconfig/bases?tab=readme-ov-file#node-22-tsconfigjson
- Obter o arquivo tsconfig.json para a versão do node que esta usando'
- Alterar o script do package.json dev para: "dev": "node --watch server.ts",

### Usando o REST Client (extensão) para API
- Exemplo:
	POST http://localhost:3000/courses
	Content-Type: application/json

	{
		"title": "Curso de Docker"
	}

	###

	GET http://localhost:3000/courses

### Instalar o Pino Pretty

Serve para configurar os logs do Fastify para ficarem visualmente mais bonitos
- npm i pino-pretty

## Aula 2

### Iniciando aprendizado de Docker e ORM
- Docker funciona como uma VM (Virtual Machine), porém aproveitando o máximo da máquina hospedeira
	- Possível trabalhar com versões de diversas tecnologias
	- Não é necessário a instalação de ferramentas como: dbs diferentes caso o projeto use
	- ORM (Object Relational Mapping)
		- Serve para comunicar e mapear as tabelas do banco de dados
		- Java: Hibernate
		- Python: SQL Alchemy

### Comandos Docker
- Construir o docker-compose.yml
- docker compose up (-d)
	- Serve para subir os serviços do docker-compose, -d serve para deixar em background
- docker ps
	- Serve para visualizar os containers que estão iniciados

### Instalação do Drizzle (ORM)
- npm i drizzle-kit -D
	- Instalando apenas o Drizzle Kit para desenvolvimento
- npm i drizzle-orm 
	- Drizzle ORM que será usado para criação de Queries
- npm i pg
	- Driver do Postgres
	- O PG é muito bom para observabilidade, pois ele envia logs com tempo que demorou as queries para ferramentas de observabilidade

### Configurando Drizzle
- Criar o arquivo drizzle.config.ts
	- Importar defineConfig do Drizzle-Kit
	- Definir o dialect
	- Definir o dbCredentials
	- Definir o out
		- Saída dos arquivos do drizzle
	- Definir o schema
		- Pode ser criado uma pasta src/database/schema.ts
- Criar o .env para configurar o DATABASE_URL
- schema.ts
	- Criar as tabelas
- Configurar o client.ts do Drizzle

### Comandos Drizzle
- npx drizzle-kit generate --name
	- Usar para gerar o SQL do schema.ts
- npx drizzle-kit migrate
	- Ler todos os arquivos da pasta drizzle (out) que não foram migrados e migra
- npx drizzle-kit studio
	- Abrir o studio para visualizar o banco de dados
- npx drizzle-kit introspect
	- Funcionamento inverso, o drizzle gera o schema com base no banco de dados existente (Não muito recomendado)


### Package.json
- Configurar os comandos do drizzle
	- "db:generate": "drizzle-kit generate",
	- "db:migrate": "drizzle-kit migrate",
	- "db:studio": "drizzle-kit studio"
- Configurar a leitura do .env, pois o Node ele não lê arquivos .env
	- "dev": "node --env-file .env --watch server.ts"
		- Adicionar o '--env-file .env'

### Alterando o server.ts
- O arquivo client.ts que foi configurado para o drizzle, deve ser importado com .ts no final
	- Para não gerar erros, deve ir no arquivo tsconfig.json e adicionar '"allowImportingTsExtensions": true,'
	- Adicionar também o '"noEmit": true', para não usar o Typescript para converter o código para Javascript, pois o Node já suporta Typescript


### Instalando zod
- npm i zod
	- Usado para validações
- npm i fastify-type-provider-zod
	- Integração do zod + fastify que facilita a utilização do zod
	- importar validatorCompiler e serializerCompiler
	- validatorCompiler
		- Checagem nos dados de entrada
		- server.setValidatorCompiler(validatorCompiler)
	- serializerCompiler
		- Forma de converter os dados de saída em um formato específico
		- server.setSerializerCompiler(serializerCompiler)
	- type ZodTypeProvider
		- Usado para configurar o server '.withTypeProvider<ZodTypeProvider>()'

### Instalando @fastify/swagger e @fastify/swagger-ui
- Swagger gera uma documentação em um formato específico chamado de Open API (uma especificação)
- Não importa a tecnologia, todas as APIs estão do formato Open API
- @fastify/swagger-ui serve para visualizar a documentação

### Instalando o @scalar/fastify-api-reference
- Utilizado como UI
- Alternativa ao Swagger UI, para uma interface mais bonita
- Documentação: https://guides.scalar.com/scalar/introduction