import { z } from "zod";

const optionalUrl = z
    .string()
    .trim()
    .url()
    .optional()
    .nullable();

const optionalText = z
    .string()
    .trim()
    .optional()
    .nullable();

export const skillCreateSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Skill name is required.")
        .max(100, "Skill name is too long."),

    category: z
        .string()
        .trim()
        .min(1, "Skill category is required.")
        .max(100, "Skill category is too long."),

    order: z
        .coerce
        .number()
        .int()
        .min(0)
        .default(0),
});

export const skillUpdateSchema =
    skillCreateSchema.partial();

export const projectCreateSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Project title is required.")
        .max(200),

    slug: z
        .string()
        .trim()
        .min(1, "Project slug is required.")
        .max(200)
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain lowercase letters, numbers and hyphens only.",
        ),

    summary: z
        .string()
        .trim()
        .min(1, "Project summary is required.")
        .max(500),

    description: z
        .string()
        .trim()
        .min(1, "Project description is required."),

    url: optionalUrl,

    githubUrl: optionalUrl,

    imageUrl: optionalText,

    featured: z
        .coerce
        .boolean()
        .default(false),

    status: z
        .string()
        .trim()
        .min(1)
        .max(50)
        .default("active"),

    tags: z
        .string()
        .trim()
        .max(1000)
        .default(""),
});

export const projectUpdateSchema =
    projectCreateSchema.partial();

export const profileUpdateSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1)
        .max(200),

    title: z
        .string()
        .trim()
        .min(1)
        .max(200),

    headline: z
        .string()
        .trim()
        .min(1)
        .max(300),

    bio: optionalText,

    email: z
        .string()
        .trim()
        .email()
        .optional()
        .nullable(),

    location: optionalText,

    summary: z
        .string()
        .trim()
        .min(1)
        .max(1000),

    availability: optionalText,
});

export const experienceCreateSchema =
    z.object({
        name: z.string().trim().max(200).default(""),

        company: z
            .string()
            .trim()
            .min(1)
            .max(200),

        position: z
            .string()
            .trim()
            .min(1)
            .max(200),

        location: z.string().trim().max(200).optional().nullable(),

        startDate: z
            .string()
            .trim()
            .min(1)
            .max(50),

        endDate: z
            .string()
            .trim()
            .max(50)
            .optional()
            .nullable(),

        description: z
            .string()
            .trim()
            .min(1),

        technologies: z
            .string()
            .trim()
            .max(1000)
            .default(""),

        current: z
            .coerce
            .boolean()
            .default(false),
    });

export const experienceUpdateSchema =
    experienceCreateSchema.partial();