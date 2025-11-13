import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home(){
  const [restaurant, setRestaurant] = useState<any|null>(null);
  const [all, setAll] = useState<any[]>([]);
  useEffect(()=>{
    fetch((import.meta.env.VITE_API_URL||"http://localhost:3333")+"/restaurants")
      .then(r=>r.json()).then(list=>{ const r = list.find((x:any)=>x.name==="Delícias do Edécio") || list[0]; setRestaurant(r); setAll(list); }).catch(console.error);
  },[]);
  if(!restaurant) return <div>Carregando...</div>;
  return (
    <section className="space-y-6">
      <div className="hero">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Edécio Delivery</h1>
        <p className="mt-2 text-white/90 max-w-2xl">As melhores comidas da cidade, entregues com rapidez. Escolha seus favoritos no <span className="font-semibold">Delícias do Edécio</span>!</p>
        <Link to={`/restaurant/${restaurant.id}`} className="btn btn-primary mt-4">Ver cardápio</Link>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Todos os restaurantes</h2>
        <div className="grid-restaurants">
          {all.map(r=>(
            <Link key={r.id} to={`/restaurant/${r.id}`} className="card hover:shadow-lg transition block">
              <div className="h-32 bg-zinc-200 rounded-xl mb-3 bg-cover bg-center" style={{ backgroundImage:`url(${r.imageUrl||""})` }}></div>
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-zinc-500">{r.category||"Geral"} {r.avgRating?`· ⭐ ${r.avgRating.toFixed(1)}`:""}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
