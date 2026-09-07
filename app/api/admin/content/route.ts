import {prisma} from "@/lib/db";
import {NextResponse} from "next/server";

export async function POST(req:Request){
 const data=await req.json();
 const old=await prisma.siteContent.findFirst();
 const result=old
 ? await prisma.siteContent.update({where:{id:old.id},data})
 : await prisma.siteContent.create({data});
 return NextResponse.json(result);
}
