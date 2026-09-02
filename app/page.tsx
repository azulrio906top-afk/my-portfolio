import { ensureDatabase, prisma } from '@/lib/db';
import { PortfolioLanding } from '@/components/portfolio-landing';

function isMissingTableError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2021'
  );
}

const fallbackSkills: Array<{ id: number; name: string }> = [
  { id: 1, name: 'Next.js' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: 'React' },
  { id: 4, name: 'Prisma' },
  { id: 5, name: 'SQLite' },
  { id: 6, name: 'Node.js' },
  { id: 7, name: 'Tailwind CSS' },
  { id: 8, name: 'Framer Motion' },
];

// const fallbackProjects: Array<{
//   id: number;
//   title: string;
//   summary: string;
//   status: string;
//   url: string;
//   imageUrl: string;
//   tags: string;
// }> = [
//   {
//     id: 1,
//     title: 'Northstar Commerce',
//     summary: 'B2B marketplace redesign for higher conversion and brand clarity.',
//     status: 'active',
//     url: 'https://northstar.example',
//     imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
//     tags: 'Next.js, Commerce, UX',
//   },
//   {
//     id: 2,
//     title: 'Pulse Analytics',
//     summary: 'Executive dashboard for product and marketing performance insights.',
//     status: 'active',
//     url: 'https://pulse.example',
//     imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
//     tags: 'Dashboard, SaaS, Data',
//   },
//   {
//     id: 3,
//     title: 'Luma Studio',
//     summary: 'Modern portfolio site for a boutique creative studio.',
//     status: 'active',
//     url: 'https://luma.example',
//     imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
//     tags: 'Portfolio, Design, CMS',
//   },
// ];

export default async function HomePage() {
  await ensureDatabase();

  const loadSkills = async () => {
    try {
      return await prisma.skill.findMany({ orderBy: { order: 'asc' } });
    } catch (error) {
      if (isMissingTableError(error)) {
        return [] as Array<{ id: number; name: string; order?: number; category?: string }>;
      }
      throw error;
    }
  };

  const loadProjects = async () => {
    try {
      return await prisma.project.findMany({
        where: { featured: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      if (isMissingTableError(error)) {
        return [] as Array<{ id: number; title: string; summary: string; status: string; url?: string | null; imageUrl?: string | null; tags?: string | null; featured?: boolean; description?: string; createdAt?: Date; slug?: string; githubUrl?: string | null }>;
      }
      throw error;
    }
  };

  const [skills, projects] = await Promise.all([loadSkills(), loadProjects()]);

  const skillList: Array<{ id: number; name: string }> = skills.length ? skills : fallbackSkills;
  const projectList: Array<{
    id: number;
    title: string;
    summary: string;
    status: string;
    url?: string | null;
    imageUrl?: string | null;
    tags?: string | null;
  }> = projects;
  //}> = projects.length ? projects : fallbackProjects;

  return <PortfolioLanding skillList={skillList} projectList={projectList} />;
}
