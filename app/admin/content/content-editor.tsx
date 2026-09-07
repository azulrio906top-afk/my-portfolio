"use client";
import { useState } from "react";

type Content = { heroBadge?: string|null; heroTitle?: string|null; heroDescription?: string|null; aboutTitle?: string|null; aboutText?: string|null; ctaTitle?: string|null; ctaDescription?: string|null; ctaPrimaryText?: string|null; ctaSecondaryText?: string|null; services?: Array<{title:string;description:string}>|null };

export default function ContentEditor({ initialContent }: { initialContent: Content|null }) {
  const [form,setForm]=useState<Content>({ heroBadge:initialContent?.heroBadge??"", heroTitle:initialContent?.heroTitle??"", heroDescription:initialContent?.heroDescription??"", aboutTitle:initialContent?.aboutTitle??"", aboutText:initialContent?.aboutText??"", ctaTitle:initialContent?.ctaTitle??"", ctaDescription:initialContent?.ctaDescription??"", ctaPrimaryText:initialContent?.ctaPrimaryText??"", ctaSecondaryText:initialContent?.ctaSecondaryText??"", services:initialContent?.services??[] });
  const [saving,setSaving]=useState(false);
  const update=(key:keyof Content,value:string)=>setForm(prev=>({...prev,[key]:value}));
  const save=async()=>{setSaving(true); try { const res=await fetch("/api/admin/content",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}); if(!res.ok) throw new Error("Save failed"); alert("Homepage content saved."); } catch { alert("Could not save homepage content."); } finally { setSaving(false); }};
  return <div className="space-y-6">
    <Section title="Hero"><Field label="Badge" value={form.heroBadge??""} onChange={v=>update("heroBadge",v)}/><Field label="Title" value={form.heroTitle??""} onChange={v=>update("heroTitle",v)}/><Field label="Description" value={form.heroDescription??""} onChange={v=>update("heroDescription",v)}/></Section>
    <Section title="About"><Field label="Title" value={form.aboutTitle??""} onChange={v=>update("aboutTitle",v)}/><Field label="Text" value={form.aboutText??""} onChange={v=>update("aboutText",v)}/></Section>
    <Section title="Call to Action"><Field label="Title" value={form.ctaTitle??""} onChange={v=>update("ctaTitle",v)}/><Field label="Description" value={form.ctaDescription??""} onChange={v=>update("ctaDescription",v)}/><Field label="Primary button" value={form.ctaPrimaryText??""} onChange={v=>update("ctaPrimaryText",v)}/><Field label="Secondary button" value={form.ctaSecondaryText??""} onChange={v=>update("ctaSecondaryText",v)}/></Section>
    <button onClick={save} disabled={saving} className="rounded-2xl bg-blue-600 px-7 py-3.5 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60">{saving?"Saving…":"Save Changes"}</button>
  </div>;
}
function Section({title,children}:{title:string;children:React.ReactNode}){return <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-black text-slate-950">{title}</h2>{children}</section>}
function Field({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">{label}</span><textarea rows={3} value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"/></label>}
