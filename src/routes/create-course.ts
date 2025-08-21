import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z, { uuid } from 'zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/courses',
    {
      schema: {
        tags: ['courses'],
        summary: 'Cria um curso',
        body: z.object({
          title: z
            .string()
            .min(5, 'O título precisa ter no mínimo 10 caracteres'),
          description: z
            .string()
            .max(255, 'A descrição deve ter no máximo 250 caracteres')
            .nullable()
            .optional(),
        }),
        response: {
          201: z
            .object({
              courseId: uuid(),
            })
            .describe('Curso criado com sucesso'),
        },
      },
    },
    async (request, reply) => {
      const { title: courseTitle, description: courseDescription } =
        request.body;

      const result = await db
        .insert(courses)
        .values({
          title: courseTitle,
          description: courseDescription,
        })
        .returning();

      return reply.status(201).send({ courseId: result[0].id });
    },
  );
};
