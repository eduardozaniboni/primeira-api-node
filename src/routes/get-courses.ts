import { and, asc, count, eq, ilike, type SQL } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../database/client.ts';
import { courses, enrollments } from '../database/schema.ts';
import { checkRequestJWT } from './hooks/check-request-jwt.ts';
import { checkUserRole } from './hooks/check-user-role.ts';

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/courses',
    {
      preHandler: [checkRequestJWT, checkUserRole('student')],
      schema: {
        tags: ['courses'],
        summary: 'Busca todos os cursos',
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(['id', 'title']).optional().default('id'),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z
            .object({
              courses: z.array(
                z.object({
                  id: z.uuid(),
                  title: z.string(),
                  description: z.string().optional(),
                  enrollments: z.number(),
                }),
              ),
              total: z.number(),
            })
            .describe('Cursos encontrados com sucesso'),
        },
      },
    },
    async (request, reply) => {
      const { search, orderBy, page } = request.query;

      const conditions: SQL[] | undefined = [];

      if (search) {
        conditions.push(ilike(courses.title, `%${search}%`));
      }

      const [result, total] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
            enrollments: count(enrollments.id),
          })
          .from(courses)
          .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
          .where(and(...conditions))
          .orderBy(asc(courses[orderBy]))
          .groupBy(courses.id)
          .limit(10)
          .offset((page - 1) * 10),
        db.$count(courses, and(...conditions)),
      ]);

      return reply.send({ courses: result, total });
    },
  );
};
