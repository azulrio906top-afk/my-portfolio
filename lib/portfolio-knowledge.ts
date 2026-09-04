import { prisma } from '@/lib/db';

type PortfolioSkill = {
  id: number;
  name: string;
  category: string;
  order: number;
};

type PortfolioProject = {
  id: number;
  title: string;
  slug: string;
  status: string;
  summary: string;
  description: string;
  tags: string;
  url: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt: Date;
};

type PortfolioExperience = {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  current: boolean;
};

export type PortfolioIntent =
  | 'skills'
  | 'projects'
  | 'experience'
  | 'capabilities'
  | 'hiring'
  | 'profile'
  | 'general';

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clean(
  value: string | null | undefined,
): string {
  return value?.trim() ?? '';
}

function parseTags(
  value: string | null | undefined,
): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/* ============================================================
   INTENT
============================================================ */

function detectIntent(
  query: string,
): PortfolioIntent {
  const text = normalize(query);

  if (
    /\b(hire|hiring|freelance|freelancer|client|clients|price|pricing|rate|rates|cost|budget|quote|quotation|available for work|work with me|work for me|work on my project)\b/.test(
      text,
    )
  ) {
    return 'hiring';
  }

  if (
    /\b(what can you build|what do you build|what can you make|what do you make|what can you create|what do you create|can you build|can you make|services|service|capabilities|capable|help my business|business solution|business solutions)\b/.test(
      text,
    )
  ) {
    return 'capabilities';
  }

  if (
    /\b(skill|skills|technology|technologies|tech stack|stack|programming|language|languages|framework|frameworks|expertise|frontend|front end|backend|back end|database|databases)\b/.test(
      text,
    )
  ) {
    return 'skills';
  }

  if (
    /\b(experience|work history|career|career history|worked|job|jobs|company|companies|employment|professional background|professional experience|previous work|past work)\b/.test(
      text,
    )
  ) {
    return 'experience';
  }

  if (
    /\b(project|projects|portfolio|what have you built|what did you build|what have you made|what did you make|show me your projects|tell me about your projects|application|applications|website|websites|app|apps|dashboard|dashboards|saas)\b/.test(
      text,
    )
  ) {
    return 'projects';
  }

  if (
    /\b(who are you|who is he|who is flunco|about you|about him|about flunco|your name|his name|developer|developer name|location|where are you|where is he|bio|biography|headline|about the developer)\b/.test(
      text,
    )
  ) {
    return 'profile';
  }

  return 'general';
}

/* ============================================================
   KEYWORDS
============================================================ */

function getKeywords(
  query: string,
): string[] {
  const stopWords = new Set([
    'a',
    'about',
    'an',
    'and',
    'are',
    'be',
    'can',
    'could',
    'did',
    'do',
    'does',
    'for',
    'from',
    'he',
    'her',
    'his',
    'how',
    'i',
    'in',
    'is',
    'it',
    'me',
    'my',
    'of',
    'on',
    'or',
    'please',
    'should',
    'tell',
    'that',
    'the',
    'their',
    'them',
    'this',
    'to',
    'was',
    'were',
    'what',
    'which',
    'who',
    'why',
    'with',
    'would',
    'you',
    'your',
  ]);

  return Array.from(
    new Set(
      normalize(query)
        .split(/\s+/)
        .filter(
          (word) =>
            word.length >= 2 &&
            !stopWords.has(word),
        ),
    ),
  );
}

/* ============================================================
   MATCHING
============================================================ */

function scoreMatch(
  query: string,
  text: string,
): number {
  const normalizedQuery =
    normalize(query);

  const normalizedText =
    normalize(text);

  if (!normalizedText) {
    return 0;
  }

  let score = 0;

  if (
    normalizedQuery.length >= 3 &&
    normalizedText.includes(
      normalizedQuery,
    )
  ) {
    score += 20;
  }

  for (const keyword of getKeywords(query)) {
    if (
      normalizedText.includes(keyword)
    ) {
      score +=
        keyword.length >= 5
          ? 4
          : 2;
    }
  }

  return score;
}

/* ============================================================
   DATABASE
============================================================ */

async function loadPortfolio() {
  const [
    profile,
    skills,
    projects,
    experiences,
  ] = await Promise.all([
    prisma.profile.findFirst({
      orderBy: {
        id: 'asc',
      },
    }),

    prisma.skill.findMany({
      orderBy: [
        {
          order: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    }),

    prisma.project.findMany({
      orderBy: [
        {
          featured: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    }),

    prisma.experience.findMany({
      orderBy: [
        {
          current: 'desc',
        },
        {
          startDate: 'desc',
        },
      ],
    }),
  ]);

  return {
    profile,
    skills,
    projects,
    experiences,
  };
}

/* ============================================================
   PROFILE
============================================================ */

function formatProfile(
  profile: Awaited<
    ReturnType<
      typeof prisma.profile.findFirst
    >
  >,
): string {
  if (!profile) {
    return '';
  }

  return [
    '## PROFILE',

    `Name: ${clean(profile.name)}`,

    `Title: ${clean(profile.title)}`,

    `Headline: ${clean(profile.headline)}`,

    `Bio: ${clean(profile.bio)}`,

    `Email: ${clean(profile.email)}`,

    `Location: ${clean(profile.location)}`,

    `Summary: ${clean(profile.summary)}`,

    `Availability: ${clean(
      profile.availability,
    )}`,
  ]
    .filter(Boolean)
    .join('\n');
}

/* ============================================================
   SKILLS
============================================================ */

function formatSkills(
  skills: Awaited<
    ReturnType<
      typeof prisma.skill.findMany
    >
  >,
): string {
  if (!skills.length) {
    return '';
  }

  return [
    '## SKILLS',

    ...skills.map(
      (skill : PortfolioSkill) =>
        [
          `### ${clean(skill.name)}`,

          `Category: ${clean(
            skill.category,
          )}`,
        ]
          .filter(Boolean)
          .join('\n'),
    ),
  ].join('\n\n');
}

/* ============================================================
   PROJECTS
============================================================ */

function formatProjects(
  projects: Awaited<
    ReturnType<
      typeof prisma.project.findMany
    >
  >,
): string {
  if (!projects.length) {
    return '';
  }

  return [
    '## PROJECTS',

    ...projects.map(
      (project : PortfolioProject) => {
        const tags =
          parseTags(project.tags);

        return [
          `### ${clean(
            project.title,
          )}`,

          `Status: ${clean(
            project.status,
          )}`,

          `Summary: ${clean(
            project.summary,
          )}`,

          `Description: ${clean(
            project.description,
          )}`,

          tags.length > 0
            ? `Technologies/Tags: ${tags.join(
                ', ',
              )}`
            : '',

          project.url
            ? `Live URL: ${project.url}`
            : '',

          project.githubUrl
            ? `GitHub URL: ${project.githubUrl}`
            : '',

          project.featured
            ? 'Featured: Yes'
            : 'Featured: No',
        ]
          .filter(Boolean)
          .join('\n');
      },
    ),
  ].join('\n\n');
}

/* ============================================================
   EXPERIENCE
============================================================ */

function formatExperience(
  experiences: Awaited<
    ReturnType<
      typeof prisma.experience.findMany
    >
  >,
): string {
  if (!experiences.length) {
    return '';
  }

  return [
    '## EXPERIENCE',

    ...experiences.map(
      (experience : PortfolioExperience) =>
        [
          `### ${clean(
            experience.position,
          )}`,

          `Company: ${clean(
            experience.company,
          )}`,

          `Period: ${
            experience.startDate
          } - ${
            experience.endDate ??
            'Present'
          }`,

          `Description: ${clean(
            experience.description,
          )}`,
        ]
          .filter(Boolean)
          .join('\n'),
    ),
  ].join('\n\n');
}

/* ============================================================
   GENERAL KNOWLEDGE
============================================================ */

function buildGeneralKnowledge(
  profile: Awaited<
    ReturnType<
      typeof prisma.profile.findFirst
    >
  >,
  skills: Awaited<
    ReturnType<
      typeof prisma.skill.findMany
    >
  >,
  projects: Awaited<
    ReturnType<
      typeof prisma.project.findMany
    >
  >,
  experiences: Awaited<
    ReturnType<
      typeof prisma.experience.findMany
    >
  >,
): string {
  return [
    formatProfile(profile),

    formatSkills(
      skills.slice(0, 15),
    ),

    formatProjects(
      projects.slice(0, 8),
    ),

    formatExperience(
      experiences.slice(0, 5),
    ),
  ]
    .filter(Boolean)
    .join('\n\n');
}

/* ============================================================
   PUBLIC API
============================================================ */

export async function getPortfolioKnowledge(
  query: string,
): Promise<{
  intent: PortfolioIntent;
  knowledge: string;
}> {
  const {
    profile,
    skills,
    projects,
    experiences,
  } = await loadPortfolio();

  const intent =
    detectIntent(query);

  /* ----------------------------------------------------------
     GENERAL
  ---------------------------------------------------------- */

  if (intent === 'general') {
    return {
      intent,

      knowledge:
        buildGeneralKnowledge(
          profile,
          skills,
          projects,
          experiences,
        ),
    };
  }

  /* ----------------------------------------------------------
     PROFILE
  ---------------------------------------------------------- */

  if (intent === 'profile') {
    return {
      intent,

      knowledge:
        formatProfile(
          profile,
        ) ||
        'No profile information is currently available.',
    };
  }

  /* ----------------------------------------------------------
     SKILLS
  ---------------------------------------------------------- */

  if (intent === 'skills') {
    const rankedSkills =
      skills
        .map((skill : PortfolioSkill) => ({
          skill,

          score: scoreMatch(
            query,
            [
              skill.name,
              skill.category,
            ]
              .filter(Boolean)
              .join(' '),
          ),
        }))
        .sort(
          (a : {project: PortfolioProject, score: number}, b : {project: PortfolioProject, score: number}) =>
            b.score - a.score,
        );

    const matchedSkills =
      rankedSkills
        .filter(
          (item : {skill: PortfolioSkill, score: number}) =>
            item.score > 0,
        )
        .slice(0, 12)
        .map(
          (item : {skill: PortfolioSkill, score: number}) =>
            item.skill,
        );

    const selectedSkills =
      matchedSkills.length > 0
        ? matchedSkills
        : skills.slice(0, 15);

    return {
      intent,

      knowledge: [
        formatProfile(profile),

        formatSkills(
          selectedSkills,
        ),
      ]
        .filter(Boolean)
        .join('\n\n'),
    };
  }

  /* ----------------------------------------------------------
     PROJECTS
  ---------------------------------------------------------- */

  if (intent === 'projects') {
    const rankedProjects =
      projects
        .map((project : PortfolioProject) => ({
          project,

          score: scoreMatch(
            query,
            [
              project.title,
              project.slug,
              project.status,
              project.summary,
              project.description,
              project.tags,
            ]
              .filter(Boolean)
              .join(' '),
          ),
        }))
        .sort(
          (a : {project: PortfolioProject, score: number}, b : {project: PortfolioProject, score: number}) => {
            if (
              b.score !==
              a.score
            ) {
              return (
                b.score -
                a.score
              );
            }

            return (
              Number(
                b.project.featured,
              ) -
              Number(
                a.project.featured,
              )
            );
          },
        );

    const matchedProjects =
      rankedProjects
        .filter(
          (item : {project: PortfolioProject, score: number}) =>
            item.score > 0,
        )
        .slice(0, 6)
        .map(
          (item : {project: PortfolioProject, score: number}) =>
            item.project,
        );

    const selectedProjects =
      matchedProjects.length > 0
        ? matchedProjects
        : projects.slice(0, 8);

    return {
      intent,

      knowledge: [
        formatProfile(profile),

        formatProjects(
          selectedProjects,
        ),
      ]
        .filter(Boolean)
        .join('\n\n'),
    };
  }

  /* ----------------------------------------------------------
     EXPERIENCE
  ---------------------------------------------------------- */

  if (intent === 'experience') {
    const rankedExperience =
      experiences
        .map(
          (experience : PortfolioExperience) => ({
            experience,

            score: scoreMatch(
              query,
              [
                experience.position,
                experience.company,
                experience.description,
              ]
                .filter(Boolean)
                .join(' '),
            ),
          }),
        )
        .sort(
          (a : {experience: PortfolioExperience, score: number}, b : {experience: PortfolioExperience, score: number}) =>
            b.score - a.score,
        );

    const matchedExperience =
      rankedExperience
        .filter(
          (item : {experience: PortfolioExperience, score: number}) =>
            item.score > 0,
        )
        .slice(0, 6)
        .map(
          (item : {experience: PortfolioExperience, score: number}) =>
            item.experience,
        );

    const selectedExperience =
      matchedExperience.length >
      0
        ? matchedExperience
        : experiences.slice(0, 6);

    return {
      intent,

      knowledge: [
        formatProfile(profile),

        formatExperience(
          selectedExperience,
        ),
      ]
        .filter(Boolean)
        .join('\n\n'),
    };
  }

  /* ----------------------------------------------------------
     CAPABILITIES
  ---------------------------------------------------------- */

  if (
    intent === 'capabilities'
  ) {
    return {
      intent,

      knowledge: [
        formatProfile(profile),

        '## CAPABILITIES',

        '- Build new web products',

        '- Modernize existing applications',

        '- Build business dashboards and SaaS applications',

        '- Build AI-powered experiences',

        '- Build REST APIs and full-stack applications',

        formatSkills(
          skills.slice(0, 15),
        ),

        formatProjects(
          projects
            .filter(
              (project : PortfolioProject) =>
                project.featured,
            )
            .slice(0, 6),
        ),
      ]
        .filter(Boolean)
        .join('\n\n'),
    };
  }

  /* ----------------------------------------------------------
     HIRING
  ---------------------------------------------------------- */

  if (intent === 'hiring') {
    return {
      intent,

      knowledge: [
        formatProfile(profile),

        '## SERVICES',

        '- Build new web products',

        '- Modernize existing applications',

        '- Business dashboards and SaaS',

        '- AI-powered experiences',

        '- REST APIs and full-stack applications',

        formatSkills(
          skills.slice(0, 15),
        ),

        formatProjects(
          projects
            .filter(
              (project : PortfolioProject) =>
                project.featured,
            )
            .slice(0, 5),
        ),
      ]
        .filter(Boolean)
        .join('\n\n'),
    };
  }

  /* ----------------------------------------------------------
     FALLBACK
  ---------------------------------------------------------- */

  return {
    intent: 'general',

    knowledge:
      buildGeneralKnowledge(
        profile,
        skills,
        projects,
        experiences,
      ),
  };
}