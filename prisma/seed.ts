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
    {
      name: 'Next.js',
      category: 'Frontend',
      order: 1,
    },
    {
      name: 'React',
      category: 'Frontend',
      order: 2,
    },
    {
      name: 'TypeScript',
      category: 'Frontend',
      order: 3,
    },
    {
      name: 'Tailwind CSS',
      category: 'Frontend',
      order: 4,
    },
    {
      name: 'JavaScript',
      category: 'Frontend',
      order: 5,
    },
    {
      name: 'Node.js',
      category: 'Backend',
      order: 6,
    },
    {
      name: 'Express',
      category: 'Backend',
      order: 7,
    },
    {
      name: 'Prisma',
      category: 'Database',
      order: 8,
    },
    {
      name: 'SQLite',
      category: 'Database',
      order: 9,
    },
    {
      name: 'PostgreSQL',
      category: 'Database',
      order: 10,
    },
    {
      name: 'Zustand',
      category: 'State Management',
      order: 11,
    },
    {
      name: 'REST API',
      category: 'Backend',
      order: 12,
    },
    {
      name: 'Git',
      category: 'Tools',
      order: 13,
    },
    {
      name: 'GitHub',
      category: 'Tools',
      order: 14,
    },
    {
      name: 'Docker',
      category: 'DevOps',
      order: 15,
    },
    {
      name: 'AI Integration',
      category: 'AI',
      order: 16,
    },
    {
      name: 'UI/UX Design',
      category: 'Design',
      order: 17,
    },
    {
      name: 'Design Systems',
      category: 'Design',
      order: 18,
    },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: {
        name: skill.name,
      },
      update: {
        category: skill.category,
        order: skill.order,
        updatedAt: new Date(),
      },
      create: {
        name: skill.name,
        category: skill.category,
        order: skill.order,
      },
    });
  }

  console.log(`✅ Seeded ${skills.length} skills`);

  // --------------------------------------------------
  // PROJECTS
  // --------------------------------------------------

  const projects = [
    {
      title: 'Luma Studio',
      slug: 'luma-studio',
      summary:
        'Story-first portfolio site for a boutique creative brand.',
      description:
        'A polished portfolio experience designed for a creative studio. The project focuses on strong visual presentation, responsive layouts, clear storytelling, and a simple content structure that makes the studio work easy for potential clients to explore.',
      url: null,
      githubUrl: null,
      imageUrl:
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      status: 'active',
      tags: 'PORTFOLIO,DESIGN,CMS',
    },

    {
      title: 'Pulse Analytics',
      slug: 'pulse-analytics',
      summary:
        'Executive reporting suite for marketing and growth teams.',
      description:
        'A business analytics dashboard focused on making marketing and growth data easier to understand. The interface brings important metrics, reports, and business insights into a clean dashboard experience designed for fast decision making.',
      url: null,
      githubUrl: null,
      imageUrl:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      status: 'active',
      tags: 'DASHBOARD,SAAS,DATA',
    },

    {
      title: 'Northstar Commerce',
      slug: 'northstar-commerce',
      summary:
        'B2B marketplace redesign focused on conversion, trust, and customer expansion.',
      description:
        'A modern B2B commerce experience focused on improving usability and conversion. The project emphasizes clear product discovery, trustworthy presentation, responsive interfaces, and a scalable frontend architecture.',
      url: null,
      githubUrl: null,
      imageUrl:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      status: 'active',
      tags: 'NEXT.JS,COMMERCE,UX',
    },

    {
      title: 'AI Portfolio Assistant',
      slug: 'ai-portfolio-assistant',
      summary:
        'AI-powered assistant that helps potential clients understand a developer portfolio.',
      description:
        'An AI-powered portfolio assistant that answers questions about skills, projects, professional experience, and services. The assistant combines a Next.js interface, a server-side API route, Prisma, SQLite, and OpenAI to provide potential clients with a conversational way to learn about the developer.',
      url: null,
      githubUrl: null,
      imageUrl:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      status: 'active',
      tags: 'AI,NEXT.JS,OPENAI,PRISMA',
    },

    {
      title: 'Business Dashboard',
      slug: 'business-dashboard',
      summary:
        'Responsive internal dashboard for business reporting and workflow management.',
      description:
        'A responsive business dashboard designed to organize reporting, operational information, and workflow data in one place. The interface prioritizes clarity, responsive behavior, and maintainable component architecture.',
      url: null,
      githubUrl: null,
      imageUrl:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      featured: false,
      status: 'active',
      tags: 'REACT,DASHBOARD,ANALYTICS',
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: {
        slug: project.slug,
      },
      update: {
        title: project.title,
        summary: project.summary,
        description: project.description,
        url: project.url,
        githubUrl: project.githubUrl,
        imageUrl: project.imageUrl,
        featured: project.featured,
        status: project.status,
        tags: project.tags,
        updatedAt: new Date(),
      },
      create: {
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        description: project.description,
        url: project.url,
        githubUrl: project.githubUrl,
        imageUrl: project.imageUrl,
        featured: project.featured,
        status: project.status,
        tags: project.tags,
      },
    });
  }

  console.log(`✅ Seeded ${projects.length} projects`);

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------

  const skillCount = await prisma.skill.count();
  const projectCount = await prisma.project.count();
  const adminCount = await prisma.adminUser.count();

  console.log('');
  console.log('================================');
  console.log('🎉 DATABASE SEED COMPLETE');
  console.log('================================');
  console.log(`Skills:   ${skillCount}`);
  console.log(`Projects: ${projectCount}`);
  console.log(`Admins:   ${adminCount}`);
  console.log('================================');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });