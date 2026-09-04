import {
    PrismaClient,
} from "@prisma/client";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting portfolio database seed...");

    /*
     * =========================================================
     * ADMIN
     * =========================================================
     */

    const adminEmail = (
        process.env.ADMIN_EMAIL ||
        "admin@portfolio.dev"
    )
        .trim()
        .toLowerCase();

    const adminPassword =
        process.env.ADMIN_PASSWORD ||
        "admin123";

    const passwordHash = await bcrypt.hash(
        adminPassword,
        12,
    );

    const admin = await prisma.adminUser.upsert({
        where: {
            email: adminEmail,
        },

        update: {
            name: "Portfolio Admin",
            passwordHash,
            role: "admin",
        },

        create: {
            name: "Portfolio Admin",
            email: adminEmail,
            passwordHash,
            role: "admin",
        },
    });

    console.log(
        `✓ Admin: ${admin.email}`,
    );

    /*
     * =========================================================
     * PROFILE
     * =========================================================
     *
     * Profile has no unique business field other than id.
     * We intentionally use id = 1 so the seed remains
     * deterministic and SQLite-safe.
     */

    const profile = await prisma.profile.upsert({
        where: {
            id: 1,
        },

        update: {
            name: "Flunco Ruiz",

            title:
                "Full-Stack Developer & Product Designer",

            headline:
                "Building intelligent digital products with Full-Stack + AI.",

            bio:
                "Full-stack developer and product builder creating polished web applications, business platforms and AI-powered experiences with a strong focus on usability, performance and maintainable engineering.",

            email:
                "azulrio906top@gmail.com",

            location:
                "United States",

            summary:
                "I design and build modern web applications with a strong focus on usability, performance, maintainability and real business value.",

            availability:
                "Available for selected freelance projects",
        },

        create: {
            id: 1,

            name: "Flunco Ruiz",

            title:
                "Full-Stack Developer & Product Designer",

            headline:
                "Building intelligent digital products with Full-Stack + AI.",

            bio:
                "Full-stack developer and product builder creating polished web applications, business platforms and AI-powered experiences with a strong focus on usability, performance and maintainable engineering.",

            email:
                "azulrio906top@gmail.com",

            location:
                "United States",

            summary:
                "I design and build modern web applications with a strong focus on usability, performance, maintainability and real business value.",

            availability:
                "Available for selected freelance projects",
        },
    });

    console.log(
        `✓ Profile: ${profile.name}`,
    );

    /*
     * =========================================================
     * SKILLS
     * =========================================================
     */

    const skills = [
        /*
         * Frontend
         */
        {
            name: "React",
            category: "frontend",
            order: 1,
        },
        {
            name: "Next.js",
            category: "frontend",
            order: 2,
        },
        {
            name: "TypeScript",
            category: "frontend",
            order: 3,
        },
        {
            name: "JavaScript",
            category: "frontend",
            order: 4,
        },
        {
            name: "Tailwind CSS",
            category: "frontend",
            order: 5,
        },
        {
            name: "Zustand",
            category: "frontend",
            order: 6,
        },
        {
            name: "HTML5",
            category: "frontend",
            order: 7,
        },
        {
            name: "CSS3",
            category: "frontend",
            order: 8,
        },

        /*
         * Backend
         */
        {
            name: "Node.js",
            category: "backend",
            order: 1,
        },
        {
            name: "Express",
            category: "backend",
            order: 2,
        },
        {
            name: "REST APIs",
            category: "backend",
            order: 3,
        },
        {
            name: "Authentication",
            category: "backend",
            order: 4,
        },
        {
            name: "NextAuth",
            category: "backend",
            order: 5,
        },

        /*
         * Data
         */
        {
            name: "PostgreSQL",
            category: "data",
            order: 1,
        },
        {
            name: "SQLite",
            category: "data",
            order: 2,
        },
        {
            name: "MongoDB",
            category: "data",
            order: 3,
        },
        {
            name: "Prisma",
            category: "data",
            order: 4,
        },
        {
            name: "Redis",
            category: "data",
            order: 5,
        },

        /*
         * AI
         */
        {
            name: "AI Integration",
            category: "ai",
            order: 1,
        },
        {
            name: "AI Assistants",
            category: "ai",
            order: 2,
        },
        {
            name: "OpenAI",
            category: "ai",
            order: 3,
        },
        {
            name: "LLM Integration",
            category: "ai",
            order: 4,
        },
        {
            name: "AI Automation",
            category: "ai",
            order: 5,
        },

        /*
         * Engineering
         */
        {
            name: "Git",
            category: "engineering",
            order: 1,
        },
        {
            name: "GitHub",
            category: "engineering",
            order: 2,
        },
        {
            name: "Docker",
            category: "engineering",
            order: 3,
        },
        {
            name: "Vitest",
            category: "engineering",
            order: 4,
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

    console.log(
        `✓ Skills: ${skills.length}`,
    );

    /*
     * =========================================================
     * PROJECTS
     * =========================================================
     *
     * slug is unique, so it is the ideal SQLite-safe
     * upsert key.
     */

    const projects = [
        {
            title:
                "AI Portfolio Assistant",

            slug:
                "ai-portfolio-assistant",

            summary:
                "An AI-powered assistant that helps visitors discover skills, projects and services through natural conversation.",

            description:
                "A production-style portfolio assistant built with Next.js, TypeScript and an API-driven AI conversation layer. The experience combines contextual responses, conversation history, suggested questions and a polished floating chatbot interface.",

            url: null,

            githubUrl: null,

            imageUrl:
                "/projects/ai-portfolio-assistant.svg",

            featured: true,

            status: "active",

            tags:
                "Next.js, React, TypeScript, AI, OpenAI, Tailwind CSS",
        },

        {
            title:
                "SaaS Analytics Dashboard",

            slug:
                "saas-analytics-dashboard",

            summary:
                "A modern analytics dashboard for monitoring business performance, users, revenue and operational metrics.",

            description:
                "A responsive SaaS dashboard designed around information hierarchy and fast decision-making. It includes reusable data visualization components, responsive layouts, filtering patterns and a scalable application architecture.",

            url: null,

            githubUrl: null,

            imageUrl:
                "/projects/saas-dashboard.svg",

            featured: false,

            status: "active",

            tags:
                "React, Next.js, TypeScript, Tailwind CSS, Dashboard",
        },

        {
            title:
                "Business Management Platform",

            slug:
                "business-management-platform",

            summary:
                "A full-stack business application for managing customers, workflows, records and day-to-day operations.",

            description:
                "A practical business management platform focused on reducing repetitive work and centralizing operational information. The application uses structured data models, authentication, server-side APIs and a responsive administrative interface.",

            url: null,

            githubUrl: null,

            imageUrl:
                "/projects/business-platform.svg",

            featured: false,

            status: "active",

            tags:
                "Next.js, Node.js, Prisma, SQLite, REST API",
        },

        {
            title:
                "AI Workflow Automation",

            slug:
                "ai-workflow-automation",

            summary:
                "An automation system that combines AI capabilities with structured business workflows.",

            description:
                "An AI-assisted workflow application designed to reduce repetitive manual tasks. The system connects structured application data with intelligent processing and automation flows while keeping the user experience simple.",

            url: null,

            githubUrl: null,

            imageUrl:
                "/projects/ai-automation.svg",

            featured: false,

            status: "active",

            tags:
                "AI, Automation, Node.js, APIs, TypeScript",
        },

        {
            title:
                "Developer Portfolio Platform",

            slug:
                "developer-portfolio-platform",

            summary:
                "A content-driven developer portfolio with project management, skills, experience and an admin dashboard.",

            description:
                "A complete portfolio platform built to present technical work professionally while keeping the content manageable through an authenticated admin interface. Portfolio data is stored with Prisma and SQLite.",

            url: null,

            githubUrl: null,

            imageUrl:
                "/projects/portfolio-platform.svg",

            featured: false,

            status: "active",

            tags:
                "Next.js, Prisma, SQLite, NextAuth, TypeScript",
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
                description:
                    project.description,
                url: project.url,
                githubUrl:
                    project.githubUrl,
                imageUrl:
                    project.imageUrl,
                featured:
                    project.featured,
                status:
                    project.status,
                tags:
                    project.tags,
            },

            create: {
                title: project.title,
                slug: project.slug,
                summary: project.summary,
                description:
                    project.description,
                url: project.url,
                githubUrl:
                    project.githubUrl,
                imageUrl:
                    project.imageUrl,
                featured:
                    project.featured,
                status:
                    project.status,
                tags:
                    project.tags,
            },
        });
    }

    console.log(
        `✓ Projects: ${projects.length}`,
    );

    /*
     * =========================================================
     * EXPERIENCE
     * =========================================================
     *
     * IMPORTANT:
     *
     * startDate and endDate are Strings in your schema.
     *
     * Therefore:
     *
     *     "2023-01"
     *
     * NOT:
     *
     *     new Date(...)
     *
     * This avoids the Date -> String TypeScript error.
     */

    const experiences = [
        {
            company:
                "Independent / Freelance",

            position:
                "Full-Stack Developer & Product Designer",

            startDate:
                "2023-01",

            endDate:
                null,

            description:
                "Designing and building modern web applications for startups, businesses and independent products. Work includes frontend architecture, backend APIs, databases, authentication, dashboards, AI integrations and product-focused UX.",

            technologies:
                "React, Next.js, TypeScript, Node.js, Express, Prisma, SQLite, PostgreSQL, Tailwind CSS, AI",

            current: true,
        },

        {
            company:
                "Product Development",

            position:
                "Full-Stack Developer",

            startDate:
                "2021-01",

            endDate:
                "2022-12",

            description:
                "Built responsive web applications and internal tools while working across frontend and backend systems. Focused on clean architecture, reusable components, API design and reliable data workflows.",

            technologies:
                "JavaScript, React, Node.js, Express, REST APIs, PostgreSQL, Git",

            current: false,
        },

        {
            company:
                "Software Development",

            position:
                "Frontend Developer",

            startDate:
                "2019-01",

            endDate:
                "2020-12",

            description:
                "Developed responsive user interfaces and interactive web experiences with an emphasis on usability, component reuse and maintainable frontend code.",

            technologies:
                "JavaScript, React, HTML5, CSS3, Git",

            current: false,
        },
    ];

    /*
     * Experience does not have a unique field in the
     * current schema.
     *
     * We therefore use a deterministic lookup before
     * creating records rather than relying on an unsafe
     * generated id.
     */

    for (const experience of experiences) {
        const existing =
            await prisma.experience.findFirst({
                where: {
                    company:
                        experience.company,

                    position:
                        experience.position,

                    startDate:
                        experience.startDate,
                },
            });

        if (existing) {
            await prisma.experience.update({
                where: {
                    id: existing.id,
                },

                data: {
                    endDate:
                        experience.endDate,

                    description:
                        experience.description,

                    technologies:
                        experience.technologies,

                    current:
                        experience.current,
                },
            });
        } else {
            await prisma.experience.create({
                data: {
                    company:
                        experience.company,

                    position:
                        experience.position,

                    startDate:
                        experience.startDate,

                    endDate:
                        experience.endDate,

                    description:
                        experience.description,

                    technologies:
                        experience.technologies,

                    current:
                        experience.current,
                },
            });
        }
    }

    console.log(
        `✓ Experience: ${experiences.length}`,
    );

    /*
     * =========================================================
     * FINAL SUMMARY
     * =========================================================
     */

    const [
        skillCount,
        projectCount,
        experienceCount,
        adminCount,
        profileCount,
    ] = await Promise.all([
        prisma.skill.count(),
        prisma.project.count(),
        prisma.experience.count(),
        prisma.adminUser.count(),
        prisma.profile.count(),
    ]);

    console.log("");
    console.log(
        "========================================",
    );
    console.log(
        "🌱 Portfolio seed completed successfully",
    );
    console.log(
        "========================================",
    );
    console.log(
        `Profile:     ${profileCount}`,
    );
    console.log(
        `Skills:      ${skillCount}`,
    );
    console.log(
        `Projects:    ${projectCount}`,
    );
    console.log(
        `Experience:  ${experienceCount}`,
    );
    console.log(
        `Admins:      ${adminCount}`,
    );
    console.log(
        "========================================",
    );
}

main()
    .catch((error) => {
        console.error(
            "❌ Portfolio seed failed:",
            error,
        );

        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });