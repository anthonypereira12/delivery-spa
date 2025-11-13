import { useEffect, useState } from "react";
import { useAuth } from "../../state/AuthContext";
import { useForm } from "react-hook-form";

type ItemForm = {
  restaurantId: string;
  name: string;
  priceCents: string;
  description: string;
  imageUrl: string;
  featured: boolean;
};

export default function AdminItems(){
  const { api, user } = useAuth();
  const [restaurants,setRestaurants]=useState<any[]>([]);
  const [items,setItems]=useState<any[]>([]);

  const { 
    register, 
    handleSubmit, 
    watch,
    reset
  } = useForm<ItemForm>({
    defaultValues: {
      restaurantId: "",
      name: "",
      priceCents: "",
      description: "",
      imageUrl: "",
      featured: false
    }
  });

  const restaurantId = watch("restaurantId");

  // Buscar restaurantes
  useEffect(()=>{
    api("/restaurants").then(setRestaurants);
  },[]);

  // Buscar itens ao escolher restaurante
  useEffect(()=>{
    if(restaurantId){
      api("/items/restaurant/" + restaurantId).then(setItems);
    }
  },[restaurantId]);

  if(!user || user.role!=="ADMIN") 
    return <div className="card">Acesso restrito.</div>;

  // Função substituindo o create()
  const createItem = async (data: ItemForm) => {
    if (!data.restaurantId) {
      alert("Selecione um restaurante");
      return;
    }
  
    const priceCents = Math.round(
      parseFloat(data.priceCents.replace(",", ".")) * 100
    );
  
    const body = {
      restaurantId: Number(data.restaurantId),
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      featured: data.featured,
      priceCents
    };
  
    const item = await api("/items", {
      method: "POST",
      body: JSON.stringify(body),
    });
  
    setItems(prev => [...prev, item]);
  
    reset({
      restaurantId: data.restaurantId,
      name: "",
      priceCents: "",
      description: "",
      imageUrl: "",
      featured: false,
    });
  };
  

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Itens do Cardápio</h1>

      <form onSubmit={handleSubmit(createItem)} className="card grid gap-3 sm:grid-cols-6">
        
        <select
          className="input"
          {...register("restaurantId")}
        >
          <option value="">Selecione o restaurante</option>
          {restaurants.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Nome do prato"
          {...register("name")}
        />

        <input
          className="input"
          type="number"
          placeholder="Preço (centavos)"
          step="0.01"
          {...register("priceCents")}
        />

        <input
          className="input"
          placeholder="URL da imagem"
          {...register("imageUrl")}
        />

        <input
          className="input sm:col-span-2"
          placeholder="Descrição"
          {...register("description")}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("featured")}
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
