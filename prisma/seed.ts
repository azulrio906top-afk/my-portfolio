import * as PrismaClientModule from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } from '@/lib/admin';

const bcryptLib = (bcrypt as typeof import('bcryptjs') & { default?: typeof import('bcryptjs') }).default ?? bcrypt;
const PrismaClientCtor = (PrismaClientModule as any).PrismaClient as new (
  args?: Record<string, unknown>,
) => any;

const prisma = new PrismaClientCtor();

async function main() {
  const adminEmail = ADMIN_EMAIL;
  const adminPassword = ADMIN_PASSWORD;

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcryptLib.hash(adminPassword, 10);

    await prisma.adminUser.create({
      data: {
        name: ADMIN_NAME,
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
    { name: 'Design Systems', category: 'Product', order: 9 },
    { name: 'Analytics', category: 'Strategy', order: 10 },
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
      summary: 'B2B marketplace redesign focused on conversion, trust, and customer expansion.',
      description:
        'Led the UX strategy and implementation for a complex commerce platform, improving category discovery, buyer confidence, and product information density for enterprise customers.',
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
      summary: 'Executive reporting suite for marketing and growth teams.',
      description:
        'Built a responsive analytics workspace with role-based views, interactive charts, and a simplified decision workflow so leadership teams could monitor performance in minutes.',
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
      summary: 'Story-first portfolio site for a boutique creative brand.',
      description:
        'Designed and built a premium portfolio experience with motion, editorial layouts, and a clean CMS-driven content model to showcase flagship client work.',
      url: 'https://luma.example',
      githubUrl: 'https://github.com/example/luma-studio',
      imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
      featured: true,
      status: 'active',
      tags: 'Portfolio, Design, CMS',
    },
    {
      title: 'Atlas Ops',
      slug: 'atlas-ops',
      summary: 'Operations dashboard for sales teams and field managers.',
      description:
        'Created a streamlined internal portal for team visibility, task routing, and customer follow-up flows, reducing admin overhead and improving operational clarity.',
      url: 'https://atlas.example',
      githubUrl: 'https://github.com/example/atlas-ops',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      featured: false,
      status: 'active',
      tags: 'Operations, Dashboard, Workflow',
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
