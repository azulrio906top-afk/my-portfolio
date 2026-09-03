import {
    PrismaClient,
} from '@prisma/client';

import {
    hash,
} from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting portfolio database seed...');

    /*
     * ============================================================
     * ADMIN USER
     * ============================================================
     */

    const passwordHash = await hash(
        'ChangeMe123!',
        12,
    );

    const admin = await prisma.adminUser.upsert({
        where: {
            email: 'admin@flunco.dev',
        },
        update: {
            name: 'Flunco Ruiz',
            passwordHash,
            role: 'admin',
        },
        create: {
            name: 'Flunco Ruiz',
            email: 'admin@flunco.dev',
            passwordHash,
            role: 'admin',
        },
    });

    console.log(`✓ Admin: ${admin.email}`);

    /*
     * ============================================================
     * PROFILE
     * ============================================================
     */

    const existingProfile = await prisma.profile.findFirst();

    const profileData = {
        name: 'Flunco Ruiz',

        title: 'Full-Stack Developer & Product Designer',

        headline:
            'I build digital products that move businesses forward.',

        bio:
            'Full-stack developer and product designer helping startups and growing businesses turn ideas into fast, elegant and production-ready software.',

        email:
            'azulrio906top@gmail.com',

        location:
            'United States',

        summary:
            'I design and build modern web applications, SaaS products, dashboards and AI-powered experiences with a focus on performance, usability and maintainability.',

        availability:
            'Available for selected freelance projects',
    };

    let profile;

    if (existingProfile) {
        profile = await prisma.profile.update({
            where: {
                id: existingProfile.id,
            },
            data: profileData,
        });
    } else {
        profile = await prisma.profile.create({
            data: profileData,
        });
    }

    console.log(`✓ Profile: ${profile.name}`);

    /*
     * ============================================================
     * SKILLS
     * ============================================================
     *
     * Skill.name is unique, so upsert by name is SQLite-safe.
     */

    const skills = [
        {
            name: 'React',
            category: 'frontend',
            order: 1,
        },
        {
            name: 'Next.js',
            category: 'frontend',
            order: 2,
        },
        {
            name: 'TypeScript',
            category: 'frontend',
            order: 3,
        },
        {
            name: 'JavaScript',
            category: 'frontend',
            order: 4,
        },
        {
            name: 'Tailwind CSS',
            category: 'frontend',
            order: 5,
        },
        {
            name: 'HTML',
            category: 'frontend',
            order: 6,
        },
        {
            name: 'CSS',
            category: 'frontend',
            order: 7,
        },
        {
            name: 'Zustand',
            category: 'frontend',
            order: 8,
        },

        {
            name: 'Node.js',
            category: 'backend',
            order: 1,
        },
        {
            name: 'Express',
            category: 'backend',
            order: 2,
        },
        {
            name: 'REST APIs',
            category: 'backend',
            order: 3,
        },
        {
            name: 'Authentication',
            category: 'backend',
            order: 4,
        },

        {
            name: 'PostgreSQL',
            category: 'data',
            order: 1,
        },
        {
            name: 'SQLite',
            category: 'data',
            order: 2,
        },
        {
            name: 'MongoDB',
            category: 'data',
            order: 3,
        },
        {
            name: 'Prisma',
            category: 'data',
            order: 4,
        },
        {
            name: 'Redis',
            category: 'data',
            order: 5,
        },

        {
            name: 'AI Integration',
            category: 'ai',
            order: 1,
        },
        {
            name: 'AI Assistants',
            category: 'ai',
            order: 2,
        },
        {
            name: 'LLM Integration',
            category: 'ai',
            order: 3,
        },
        {
            name: 'AI Automation',
            category: 'ai',
            order: 4,
        },

        {
            name: 'Git',
            category: 'tools',
            order: 1,
        },
        {
            name: 'Docker',
            category: 'tools',
            order: 2,
        },
        {
            name: 'Vitest',
            category: 'tools',
            order: 3,
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
            },
            create: {
                name: skill.name,
                category: skill.category,
                order: skill.order,
            },
        });
    }

    console.log(`✓ Skills: ${skills.length}`);

    /*
     * ============================================================
     * PROJECTS
     * ============================================================
     *
     * Project.slug is unique, so it is the natural upsert key.
     */

    const projects = [
        {
            title: 'AI Portfolio Assistant',
            slug: 'ai-portfolio-assistant',

            summary:
                'An AI-powered portfolio assistant that answers questions about skills, projects and experience.',

            description:
                'A conversational portfolio experience designed to help potential clients quickly understand a developer’s background, technical strengths and previous work. The assistant combines a polished chat interface with a backend API and portfolio-aware responses.',

            url: null,
            githubUrl: null,

            imageUrl:
                'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=85',

            featured: true,
            status: 'featured',

            tags:
                'Next.js, TypeScript, React, AI, API, Tailwind CSS',
        },

        {
            title: 'SaaS Dashboard',
            slug: 'saas-dashboard',

            summary:
                'A modern SaaS dashboard for monitoring business metrics, workflows and operational data.',

            description:
                'A responsive business dashboard focused on clear information architecture, fast interactions and reusable interface components. Designed to make complex business data easier to understand and act upon.',

            url: null,
            githubUrl: null,

            imageUrl:
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85',

            featured: false,
            status: 'active',

            tags:
                'React, TypeScript, Dashboard, Analytics, Tailwind CSS',
        },

        {
            title: 'Business Management Platform',
            slug: 'business-management-platform',

            summary:
                'A full-stack application for managing customers, projects, workflows and business operations.',

            description:
                'A production-oriented business application built around structured workflows, authentication, database persistence and a clean administrative experience. The architecture emphasizes maintainability and room for future growth.',

            url: null,
            githubUrl: null,

            imageUrl:
                'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85',

            featured: false,
            status: 'active',

            tags:
                'Next.js, Node.js, Prisma, SQLite, REST API',
        },

        {
            title: 'Developer Portfolio',
            slug: 'developer-portfolio',

            summary:
                'A polished personal portfolio combining project discovery, technical skills and AI-assisted communication.',

            description:
                'A responsive developer portfolio built to present technical capabilities and professional work through a focused visual experience. It includes dynamic project and skill data, theme switching, responsive navigation and an integrated AI assistant.',

            url: null,
            githubUrl: null,

            imageUrl:
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85',

            featured: false,
            status: 'active',

            tags:
                'Next.js, React, TypeScript, Tailwind CSS, AI',
        },

        {
            title: 'AI Workflow Automation',
            slug: 'ai-workflow-automation',

            summary:
                'An intelligent workflow concept for automating repetitive business tasks with AI.',

            description:
                'An automation-focused product concept that combines structured business workflows with AI-assisted processing. The goal is to reduce repetitive manual work while keeping humans in control of important decisions.',

            url: null,
            githubUrl: null,

            imageUrl:
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=85',

            featured: false,
            status: 'active',

            tags:
                'AI, Automation, Node.js, APIs, SaaS',
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

    console.log(`✓ Projects: ${projects.length}`);

    /*
     * ============================================================
     * EXPERIENCE
     * ============================================================
     *
     * IMPORTANT:
     * startDate and endDate are String fields in your schema.
     *
     * Therefore:
     *
     *     startDate: '2020-01-01'
     *
     * NOT:
     *
     *     startDate: new Date(...)
     */

    const experiences = [
        {
            company: 'Independent / Freelance',
            position: 'Full-Stack Developer & Product Designer',

            startDate: '2020-01-01',
            endDate: null,

            description:
                'Designing and building modern web applications, SaaS products, dashboards and AI-powered experiences for startups, businesses and individual clients. Responsible for product thinking, architecture, implementation and delivery.',

            technologies:
                'React, Next.js, TypeScript, Node.js, Express, Prisma, PostgreSQL, SQLite, Tailwind CSS, AI',

            current: true,
        },

        {
            company: 'Personal Product Development',
            position: 'Software Engineer',

            startDate: '2018-01-01',
            endDate: '2019-12-31',

            description:
                'Built software projects to develop strong foundations in application architecture, frontend development, backend development, databases and API design.',

            technologies:
                'JavaScript, React, Node.js, Express, SQL, Git',

            current: false,
        },
    ];

    /*
     * Experience has no unique field in the schema.
     *
     * Therefore we cannot use a normal Prisma upsert safely.
     *
     * Instead, we use a deterministic lookup based on
     * company + position + startDate.
     */

    for (const experience of experiences) {
        const existing = await prisma.experience.findFirst({
            where: {
                company: experience.company,
                position: experience.position,
                startDate: experience.startDate,
            },
        });

        if (existing) {
            await prisma.experience.update({
                where: {
                    id: existing.id,
                },
                data: {
                    endDate: experience.endDate,
                    description: experience.description,
                    technologies:
                        experience.technologies,
                    current: experience.current,
                },
            });
        } else {
            await prisma.experience.create({
                data: experience,
            });
        }
    }

    console.log(`✓ Experience: ${experiences.length}`);

    /*
     * ============================================================
     * SUMMARY
     * ============================================================
     */

    const [
        skillCount,
        projectCount,
        experienceCount,
        profileCount,
        adminCount,
    ] = await Promise.all([
        prisma.skill.count(),
        prisma.project.count(),
        prisma.experience.count(),
        prisma.profile.count(),
        prisma.adminUser.count(),
    ]);

    console.log('');
    console.log('========================================');
    console.log('🌱 Portfolio seed completed');
    console.log('========================================');
    console.log(`Admin users:  ${adminCount}`);
    console.log(`Profiles:     ${profileCount}`);
    console.log(`Skills:       ${skillCount}`);
    console.log(`Projects:     ${projectCount}`);
    console.log(`Experience:   ${experienceCount}`);
    console.log('========================================');
}

main()
    .catch((error) => {
        console.error('❌ Seed failed:', error);

        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });