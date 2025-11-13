import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../state/AuthContext";

export default function AdminItems(){
  const { api, user } = useAuth();
  const [restaurants,setRestaurants]=useState<any[]>([]);
  const [items,setItems]=useState<any[]>([]);

  const [form,setForm]=useState({
    restaurantId: "",
    name:"",
    priceCents:"",
    description:"",
    imageUrl:"",
    featured:false
  });

  // Buscar restaurantes
  useEffect(()=>{
    api("/restaurants").then(setRestaurants);
  },[]);

  // Buscar itens ao escolher restaurante
  useEffect(()=>{
    if(form.restaurantId)
      api("/items/restaurant/"+form.restaurantId).then(setItems);
  },[form.restaurantId]);

  if(!user || user.role!=="ADMIN") 
    return <div className="card">Acesso restrito.</div>;

  async function create(e:FormEvent){
    e.preventDefault();

    if (!form.restaurantId) {
      alert("Selecione um restaurante");
      return;
    }

    const body = {
      restaurantId: Number(form.restaurantId),
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      featured: form.featured,
      priceCents: Number(form.priceCents)
    };

    const item = await api("/items", { 
      method:"POST", 
      body: JSON.stringify(body) 
    });

    setItems(prev => [...prev, item]);

    // Resetar formulário
    setForm({
      restaurantId: form.restaurantId,
      name:"",
      priceCents:"",
      description:"",
      imageUrl:"",
      featured:false
    });
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Itens do Cardápio</h1>

      <form onSubmit={create} className="card grid gap-3 sm:grid-cols-6">
        
        <select
          className="input"
          value={form.restaurantId}
          onChange={e => setForm(f => ({ ...f, restaurantId: e.target.value }))}
        >
          <option value="">Selecione o restaurante</option>
          {restaurants.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Nome do prato"
          value={form.name}
          onChange={e=>setForm(f=>({...f, name:e.target.value}))}
        />

        <input
          className="input"
          type="number"
          placeholder="Preço (centavos)"
          value={form.priceCents}
          onChange={e=>setForm(f=>({...f, priceCents:e.target.value}))}
        />

        <input
          className="input"
          placeholder="URL da imagem"
          value={form.imageUrl}
          onChange={e=>setForm(f=>({...f, imageUrl:e.target.value}))}
        />

        <input
          className="input sm:col-span-2"
          placeholder="Descrição"
          value={form.description}
          onChange={e=>setForm(f=>({...f, description:e.target.value}))}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
          />
          Destaque
        </label>

        <input type="submit" value="Criar" className="btn btn-primary" />
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(i => (
          <div key={i.id} className="card">
            <div className="font-semibold">{i.name}</div>
            <div className="text-sm text-zinc-500">{i.description}</div>
            <div className="text-sm">
              Preço: {(i.priceCents/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
            </div>
            <div className="text-sm">
              {i.featured ? <span className="badge">Destaque</span> : ""}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
