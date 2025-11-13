import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DishCard from "../components/DishCard";

export default function Restaurant(){
  const { id } = useParams();
  const [r,setR]=useState<any|null>(null);
  const [featured,setFeatured]=useState<any[]>([]);
  const [q,setQ]=useState("");

  useEffect(()=>{
    fetch((import.meta.env.VITE_API_URL||"http://localhost:3333")+"/restaurants/"+id).then(r=>r.json()).then(setR).catch(console.error);
    fetch((import.meta.env.VITE_API_URL||"http://localhost:3333")+"/items/restaurant/"+id+"?featured=true").then(r=>r.json()).then(setFeatured).catch(console.error);
  },[id]);

  if(!r) return <div>Carregando...</div>;
  const filtered=r.items.filter((d:any)=>d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="space-y-6">
      <div className="relative">
        <div className="h-48 bg-zinc-200 rounded-2xl mb-3 bg-cover bg-center" style={{ backgroundImage:`url(${r.imageUrl||""})` }}></div>
        <h1 className="text-2xl font-bold">{r.name}</h1>
        <div className="text-zinc-500">{r.category||"Geral"}</div>
      </div>

      <div className="card">
        <input className="input" placeholder="Pesquisar produto..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      {featured.length>0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Destaques</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((d:any)=><DishCard key={d.id} d={d} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold mb-3">Tudo</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((d:any)=><DishCard key={d.id} d={d} />)}
        </div>
      </div>
    </section>
  );
}
