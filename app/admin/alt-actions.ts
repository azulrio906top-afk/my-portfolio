'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }
}

export async function createSkillAlt(formData: FormData) {
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
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateSkillAlt(formData: FormData) {
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
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteSkillAlt(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));

  if (!id) {
    return;
  }

  await prisma.skill.delete({ where: { id } });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createProjectAlt(formData: FormData) {
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
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateProjectAlt(formData: FormData) {
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
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteProjectAlt(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));

  if (!id) {
    return;
  }

  await prisma.project.delete({ where: { id } });

  revalidatePath('/admin');
  revalidatePath('/');
}
