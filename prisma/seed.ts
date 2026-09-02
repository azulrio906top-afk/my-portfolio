import * as PrismaClientModule from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const bcryptLib = (bcrypt as typeof import('bcryptjs') & { default?: typeof import('bcryptjs') }).default ?? bcrypt;
const PrismaClientCtor = (PrismaClientModule as any).PrismaClient as new (
  args?: Record<string, unknown>,
) => any;

const prisma = new PrismaClientCtor();

async function main() {
  const adminEmail = 'admin@portfolio.dev';
  const adminPassword = 'admin123';

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcryptLib.hash(adminPassword, 10);

    await prisma.adminUser.create({
      data: {
        name: 'Portfolio Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
      },
    });
  }

  const skills = [
    { name: 'Next.js', category: 'Frontend', order: 1 },
    { name: 'TypeScript', category: 'Frontend', order: 2 },
    { name: 'React', category: 'Frontend', order: 3 },
    { name: 'Prisma', category: 'Backend', order: 4 },
    { name: 'SQLite', category: 'Database', order: 5 },
    { name: 'Node.js', category: 'Backend', order: 6 },
    { name: 'Tailwind CSS', category: 'Styling', order: 7 },
    { name: 'Framer Motion', category: 'UI/UX', order: 8 },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: skill,
      create: skill,
    });
  }

  const projects = [
    {
      title: 'Northstar Commerce',
      slug: 'northstar-commerce',
      summary: 'B2B marketplace redesign for higher conversion and brand clarity.',
      description:
        'A full storefront refresh for a B2B commerce brand, focused on search, trust signals, and scalable UI patterns.',
      url: 'https://northstar.example',
      githubUrl: 'https://github.com/example/northstar-commerce',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      featured: true,
      status: 'active',
      tags: 'Next.js, Commerce, UX',
    },
    {
      title: 'Pulse Analytics',
      slug: 'pulse-analytics',
      summary: 'Executive dashboard for product and marketing performance insights.',
      description:
        'Built a data-rich dashboard with reusable charts, role-aware views, and a clean operational workflow.',
      url: 'https://pulse.example',
      githubUrl: 'https://github.com/example/pulse-analytics',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
      featured: true,
      status: 'active',
      tags: 'Dashboard, SaaS, Data',
    },
    {
      title: 'Luma Studio',
      slug: 'luma-studio',
      summary: 'Modern portfolio site for a boutique creative studio.',
      description:
        'Designed and built a storytelling-first portfolio with motion-rich interactions and a CMS-ready content model.',
      url: 'https://luma.example',
      githubUrl: 'https://github.com/example/luma-studio',
      imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
      featured: false,
      status: 'active',
      tags: 'Portfolio, Design, CMS',
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
