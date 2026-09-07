import { ensureDatabase, prisma } from "@/lib/db";
import { PortfolioLanding } from '@/components/portfolio-landing';

const fallbackSkills: Array<{ id: number; name: string }> = [
  { id: 1, name: "Next.js" },
  { id: 2, name: "TypeScript" },
  { id: 3, name: "React" },
  { id: 4, name: "Prisma" },
  { id: 5, name: "Node.js" },
  { id: 6, name: "Tailwind CSS" },
];

type ProfileData = {
  name: string;
  title: string;
  headline: string;
  bio: string;
  email: string | null;
  location: string | null;
  summary: string;
  availability: string | null;
};

const fallbackProfile: ProfileData = {
  name: "Frunco Ruiz",
  title: "Full-Stack Developer | AI Product Builder",
  headline: "I build AI-powered web applications and digital products that help businesses grow faster.",
  bio: "I help startups and businesses transform ideas into scalable software through full-stack development, AI integration, and modern product design.",
  email: null,
  location: "United States",
  summary: "I design and build modern web applications with a strong focus on usability, performance, maintainability and real business value.",
  availability: "Available for selected freelance projects",
};

export default async function HomePage() {
  await ensureDatabase();

  const [profile, skills, projects, siteContent] = await Promise.all([
    prisma.profile.findFirst({ orderBy: { id: "asc" } }).catch(() => null),
    prisma.skill.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    prisma.project.findMany({
      include: {
        projectSkills: { include: { skill: true } },
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    }).catch(() => []),
    prisma.siteContent.findFirst().catch(() => null),
  ]);

  return (
    <PortfolioLanding
      profile={profile ?? fallbackProfile}
      content={siteContent}
      skillList={skills.length
        ? skills.map((skill: typeof skills[number]) => ({
            id: skill.id, 
            name: skill.name,
            category: skill.category,
          }))
        : fallbackSkills}
      projectList={projects.map((project: typeof projects[number]) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        status: project.status,
        featured: project.featured,
        url: project.url,
        githubUrl: project.githubUrl,
        imageUrl: project.imageUrl,
        tags: project.tags,
        skills: project.projectSkills.map(
            ({ skill }: (typeof project.projectSkills)[number]) => ({
              id: skill.id,
              name: skill.name,
              category: skill.category,
            })
          ),
      }))}
    />
  );
}
