'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { ensureDatabase, prisma } from '@/lib/db';

const isoNow = () => new Date().toISOString();

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await ensureDatabase();
}

export async function createSkill(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get('name') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const order = Number(formData.get('order') ?? '0');

  if (!name || !category) {
    return;
  }

  await prisma.skill.create({
    data: {
      name,
      category,
      order: Number.isFinite(order) ? order : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateSkill(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const name = String(formData.get('name') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const order = Number(formData.get('order') ?? '0');

  if (!id || !name || !category) {
    return;
  }

  await prisma.skill.update({
    where: { id },
    data: {
      name,
      category,
      order: Number.isFinite(order) ? order : 0,
      updatedAt: new Date().toISOString(),
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteSkill(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));

  if (!id) {
    return;
  }

  await prisma.skill.delete({ where: { id } });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createProject(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get('title') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const summary = String(formData.get('summary') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const url = String(formData.get('url') ?? '').trim();
  const githubUrl = String(formData.get('githubUrl') ?? '').trim();
  const imageUrl = String(formData.get('imageUrl') ?? '').trim();
  const tags = String(formData.get('tags') ?? '').trim();
  const featured = formData.get('featured') === 'on';
  const status = String(formData.get('status') ?? 'active').trim() || 'active';

  if (!title || !slug || !summary || !description) {
    return;
  }

  await prisma.project.create({
    data: {
      title,
      slug,
      summary,
      description,
      url: url || null,
      githubUrl: githubUrl || null,
      imageUrl: imageUrl || null,
      tags,
      featured,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateProject(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const title = String(formData.get('title') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const summary = String(formData.get('summary') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const url = String(formData.get('url') ?? '').trim();
  const githubUrl = String(formData.get('githubUrl') ?? '').trim();
  const imageUrl = String(formData.get('imageUrl') ?? '').trim();
  const tags = String(formData.get('tags') ?? '').trim();
  const featured = formData.get('featured') === 'on';
  const status = String(formData.get('status') ?? 'active').trim() || 'active';

  if (!id || !title || !slug || !summary || !description) {
    return;
  }

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug,
      summary,
      description,
      url: url || null,
      githubUrl: githubUrl || null,
      imageUrl: imageUrl || null,
      tags,
      featured,
      status,
      updatedAt: new Date().toISOString(),
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));

  if (!id) {
    return;
  }

  await prisma.project.delete({ where: { id } });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateProfile(
  formData: FormData,
) {
  await requireAdmin();

  const id = Number(
    formData.get('id') ?? '0',
  );

  const name = String(
    formData.get('name') ?? '',
  ).trim();

  const title = String(
    formData.get('title') ?? '',
  ).trim();

  const email = String(
    formData.get('email') ?? '',
  ).trim();

  const location = String(
    formData.get('location') ?? '',
  ).trim();

  const summary = String(
    formData.get('summary') ?? '',
  ).trim();

  const availability = String(
    formData.get('availability') ?? '',
  ).trim();

  if (!name || !title || !summary) {
    throw new Error(
      'Name, title and summary are required.',
    );
  }

  const data = {
    name,
    title,
    email: email || null,
    location: location || null,
    summary,
    availability: availability || null,
    updatedAt: new Date().toISOString(),
  };

  if (id) {
    await prisma.profile.update({
      where: { id },
      data,
    });
  } else {
    await prisma.profile.create({
      data: {
        ...data,
        createdAt: new Date().toISOString(),
      },
    });
  }

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createExperience(
  formData: FormData,
) {
  await requireAdmin();

  const company = String(
    formData.get('company') ?? '',
  ).trim();

  const position = String(
    formData.get('position') ?? '',
  ).trim();

  const startDate = String(
    formData.get('startDate') ?? '',
  ).trim();

  const endDate = String(
    formData.get('endDate') ?? '',
  ).trim();

  const description = String(
    formData.get('description') ?? '',
  ).trim();

  const technologies = String(
    formData.get('technologies') ?? '',
  ).trim();

  const current =
    formData.get('current') === 'on';

  if (
    !company ||
    !position ||
    !startDate ||
    !description
  ) {
    throw new Error(
      'Company, position, start date and description are required.',
    );
  }

  await prisma.experience.create({
    data: {
      company,
      position,
      startDate,
      endDate: endDate || null,
      description,
      technologies,
      current,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateExperience(
  formData: FormData,
) {
  await requireAdmin();

  const id = Number(
    formData.get('id') ?? '0',
  );

  const company = String(
    formData.get('company') ?? '',
  ).trim();

  const position = String(
    formData.get('position') ?? '',
  ).trim();

  const startDate = String(
    formData.get('startDate') ?? '',
  ).trim();

  const endDate = String(
    formData.get('endDate') ?? '',
  ).trim();

  const description = String(
    formData.get('description') ?? '',
  ).trim();

  const technologies = String(
    formData.get('technologies') ?? '',
  ).trim();

  const current =
    formData.get('current') === 'on';

  if (
    !id ||
    !company ||
    !position ||
    !startDate ||
    !description
  ) {
    throw new Error(
      'Invalid experience data.',
    );
  }

  await prisma.experience.update({
    where: { id },

    data: {
      company,
      position,
      startDate,
      endDate: endDate || null,
      description,
      technologies,
      current,
      updatedAt: new Date().toISOString(),
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteExperience(
  formData: FormData,
) {
  await requireAdmin();

  const id = Number(
    formData.get('id') ?? '0',
  );

  if (!id) {
    throw new Error(
      'Invalid experience ID.',
    );
  }

  await prisma.experience.delete({
    where: { id },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}