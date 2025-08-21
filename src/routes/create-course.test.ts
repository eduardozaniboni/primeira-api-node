import { faker } from '@faker-js/faker';
import request from 'supertest';
import { expect, test } from 'vitest';
import { server } from '../app.ts';
import { findCourses } from '../tests/factories/find-courses.ts';
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts';

test('create a course', async () => {
  await server.ready();

  const { token } = await makeAuthenticatedUser('manager');

  const response = await request(server.server)
    .post('/courses')
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ title: faker.lorem.words(4) });

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    courseId: expect.any(String),
  });
});

test('returning 409 for existing course', async () => {
  await server.ready();

  const { token } = await makeAuthenticatedUser('manager');
  const course = await findCourses();

  const response = await request(server.server)
    .post('/courses')
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ title: course.title });

  expect(response.status).toEqual(409);
  expect(response.body).toEqual({
    message: expect.any(String),
  });
});
