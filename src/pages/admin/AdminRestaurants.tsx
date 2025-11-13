import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../state/AuthContext";

export default function AdminRestaurants(){
  const { api, user } = useAuth();
  const [list,setList]=useState<any[]>([]);
  const [name,setName]=useState(""); const [category,setCategory]=useState(""); const [imageUrl,setImageUrl]=useState("");

  useEffect(()=>{ api("/restaurants").then(setList); },[]);

  if(!user || user.role!=="ADMIN") return <div className="card">Acesso restrito.</div>;

  async function create(e:FormEvent){
    e.preventDefault();
    const r = await api("/restaurants",{ method:"POST", body: JSON.stringify({ name, category, imageUrl }) });
    setList(prev=>[...prev,r]); setName(""); setCategory(""); setImageUrl("");
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Restaurantes</h1>
      <form onSubmit={create} className="card grid gap-3 sm:grid-cols-4">
        <input className="input" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Categoria" value={category} onChange={e=>setCategory(e.target.value)} />
        <input className="input" placeholder="URL da imagem" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
        <button className="btn btn-primary">Criar</button>
      </form>
      <div className="grid-restaurants">
        {list.map(r=>(
          <div key={r.id} className="card">
            <div className="h-24 bg-zinc-200 rounded-xl mb-3 bg-cover bg-center" style={{ backgroundImage:`url(${r.imageUrl||""})` }} />
            <div className="font-semibold">{r.name}</div>
            <div className="text-sm text-zinc-500">{r.category}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
