import { prisma } from "@/lib/db";
import ContentEditor from "./content-editor";

export default async function Page(){
 const content = await prisma.siteContent.findFirst();
 return <main className="p-8"><h1 className="text-3xl font-black mb-6">Content CMS</h1><ContentEditor initialContent={content}/></main>;
}
