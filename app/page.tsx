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
  name: "Flunco Ruiz",
  title: "Full-Stack Developer & Product Designer",
  headline: "I build digital products that move businesses forward.",
  bio: "Full-stack developer and product designer helping startups and growing businesses turn ideas into fast, elegant and production-ready software.",
  email: null,
  location: "United States",
  summary: "I design and build modern web applications with a strong focus on usability, performance, maintainability and real business value.",
  availability: "Available for selected freelance projects",
};

export default async function HomePage() {
  await ensureDatabase();

  const [profile, skills, projects] = await Promise.all([
    prisma.profile.findFirst({ orderBy: { id: "asc" } }).catch(() => null),
    prisma.skill.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    prisma.project.findMany({
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    }).catch(() => []),
  ]);

  return (
    <PortfolioLanding
      profile={profile ?? fallbackProfile}
      skillList={skills.length ? skills : fallbackSkills}
      projectList={projects}
    />
  );
}
