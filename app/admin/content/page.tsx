import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import ContentEditor from "./content-editor";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const content = await prisma.siteContent.findFirst();
  return <main className="min-h-screen bg-slate-50 p-6 sm:p-10"><div className="mx-auto max-w-5xl"><div className="mb-8"><p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">Portfolio CMS</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Homepage Content</h1><p className="mt-2 text-slate-500">Edit the words your visitors see without changing code.</p></div><ContentEditor initialContent={content} /></div></main>;
}
