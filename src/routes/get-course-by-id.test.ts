import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { expect, test } from 'vitest';
import { server } from '../app.ts';
import { makeCourse } from '../tests/factories/make-course.ts';
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts';

test('get course by id', async () => {
  await server.ready();

  const { token } = await makeAuthenticatedUser('student');
  const course = await makeCourse();

  const response = await request(server.server)
    .get(`/courses/${course.id}`)
    .set('Authorization', token);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: null,
    },
  });
});

test('returning 404 for non existing course', async () => {
  await server.ready();

  const { token } = await makeAuthenticatedUser('student');
  const randomCourseId = randomUUID();

  const response = await request(server.server)
    .get(`/courses/${randomCourseId}`)
    .set('Authorization', token);

  expect(response.status).toEqual(404);
});
