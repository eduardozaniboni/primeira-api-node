import { db } from '../../database/client';
import { courses } from '../../database/schema';

export async function findCourses() {
  const result = await db.select().from(courses);
  return result[0];
}
