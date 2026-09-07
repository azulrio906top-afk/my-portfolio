"use client";
import {useState} from "react";

export default function ContentEditor({initialContent}:any){
 const [form,setForm]=useState(initialContent||{});
 async function save(){
  await fetch("/api/admin/content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
  alert("Saved");
 }
 return <div className="space-y-4">{["heroBadge","heroTitle","heroDescription","aboutTitle","aboutText","ctaTitle","ctaDescription"].map(k=><textarea key={k} className="w-full rounded-xl border p-3" placeholder={k} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}/>)}
 <button onClick={save} className="rounded-xl bg-black px-5 py-3 text-white">Save</button></div>
}
