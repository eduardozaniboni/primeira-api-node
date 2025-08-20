import { fastifySwagger } from "@fastify/swagger";
// import { fastifySwaggerUi } from "@fastify/swagger-ui";
import fastify from "fastify";
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createCourseRoute } from "./src/routes/create-course.ts";
import { getCourseByIdRoute } from "./src/routes/get-course-by-id.ts";
import { getCoursesRoute } from "./src/routes/get-courses.ts";
import scalarAPIReference from "@scalar/fastify-api-reference";

// Configuração Fastify

const server = fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
            },
        },
    },
}).withTypeProvider<ZodTypeProvider>();

// Swagger + Swagger UI (Alternativa)
// Swagger + Scalar Fastify UI (Alternativa mais bonita)

if (process.env.NODE_ENV === "development") {
    server.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Desafio Node.js",
                version: "1.0.0",
            },
        },
        transform: jsonSchemaTransform,
    });

    server.register(scalarAPIReference, {
        routePrefix: "/docs",
        configuration: {
            theme: "deepSpace",
        },
    });
}

// Zod + Fastify

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Registrando as rotas

server.register(createCourseRoute);
server.register(getCoursesRoute);
server.register(getCourseByIdRoute);

// Inicia servidor

server.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running");
});
