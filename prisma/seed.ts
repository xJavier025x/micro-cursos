import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding ...');

  // 1. Clean up existing data (optional, be careful in production!)
  // await prisma.userAnswer.deleteMany();
  // await prisma.quizResult.deleteMany();
  // await prisma.userProgress.deleteMany();
  // await prisma.option.deleteMany();
  // await prisma.question.deleteMany();
  // await prisma.quiz.deleteMany();
  // await prisma.lesson.deleteMany();
  // await prisma.course.deleteMany();
  // await prisma.user.deleteMany();

  // 2. Create Users
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'empleado@test.com' },
    update: {},
    create: {
      email: 'empleado@test.com',
      name: 'Empleado Test',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
  });

  console.log({ admin, employee });

  // 3. Create Course
  const course = await prisma.course.upsert({
    where: { id: 'course-1' }, // We can use a fixed ID or find by title if unique
    update: {},
    create: {
      id: 'course-1',
      title: 'Introducción a la Seguridad Laboral',
      description: 'Curso básico sobre normas y procedimientos de seguridad en el trabajo.',
    },
  });

  console.log({ course });

  // 4. Create Lessons
  const lesson1 = await prisma.lesson.upsert({
    where: { id: 'lesson-1' },
    update: {},
    create: {
      id: 'lesson-1',
      title: 'Normas Básicas',
      content: 'Contenido de la lección sobre normas básicas de seguridad. Siempre usar casco y botas.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example video
      order: 1,
      courseId: course.id,
    },
  });

  const lesson2 = await prisma.lesson.upsert({
    where: { id: 'lesson-2' },
    update: {},
    create: {
      id: 'lesson-2',
      title: 'Prevención de Incendios',
      content: 'Cómo prevenir y actuar ante un incendio. Uso de extintores.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      order: 2,
      courseId: course.id,
    },
  });

  console.log({ lesson1, lesson2 });

  // 5. Create Quiz for Lesson 1
  const quiz = await prisma.quiz.upsert({
    where: { lessonId: lesson1.id },
    update: {},
    create: {
      lessonId: lesson1.id,
      questions: {
        create: [
          {
            text: '¿Qué equipo de protección es obligatorio?',
            options: {
              create: [
                { text: 'Casco y botas', isCorrect: true },
                { text: 'Solo guantes', isCorrect: false },
                { text: 'Gafas de sol', isCorrect: false },
              ],
            },
          },
          {
            text: '¿Qué hacer en caso de emergencia?',
            options: {
              create: [
                { text: 'Correr', isCorrect: false },
                { text: 'Mantener la calma y seguir el protocolo', isCorrect: true },
                { text: 'Gritar', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ quiz });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
