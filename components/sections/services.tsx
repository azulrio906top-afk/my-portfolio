export function ServicesSection(){
  const services=[
    {title:'AI Applications',text:'AI assistants, automation workflows, and intelligent product experiences.'},
    {title:'SaaS Products',text:'Scalable web platforms from idea validation to production deployment.'},
    {title:'Full-Stack Development',text:'Modern frontend, backend APIs, databases, and cloud-ready systems.'},
  ];
  return <section className="mx-auto max-w-7xl px-6 py-16" id="services">
    <h2 className="text-3xl font-black">What I Build</h2>
    <div className="mt-8 grid gap-6 md:grid-cols-3">{services.map((s)=><article key={s.title} className="rounded-3xl border p-6"><h3 className="text-xl font-bold">{s.title}</h3><p className="mt-3 text-slate-600">{s.text}</p></article>)}</div>
  </section>;
}
