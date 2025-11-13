import { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext";

export default function Orders(){
  const { api } = useAuth();
  const [orders,setOrders]=useState<any[]>([]);
  const [rating,setRating]=useState<Record<number,number>>({});
  const [comment,setComment]=useState<Record<number,string>>({});

  async function load(){ setOrders(await api("/orders")); }
  useEffect(()=>{ load(); },[]);

  async function sendReview(o:any){
    await api(`/reviews/order/${o.id}`, { method:"POST", body: JSON.stringify({ rating: rating[o.id]||5, comment: comment[o.id]||"" }) });
    await load();
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Meus Pedidos</h1>
      {orders.map(o=>(
        <div key={o.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">#{o.id} · {o.restaurant.name}</div>
              <div className="text-sm text-zinc-500">{o.address}</div>
            </div>
            <div className="text-sm">{(o.totalCents/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</div>
          </div>
          <div className="text-sm mt-2">Status: <span className="font-semibold">{o.status}</span></div>

          {o.status==="DELIVERED" && !o.review && (
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              <select className="input" value={rating[o.id]||5} onChange={e=>setRating(s=>({ ...s, [o.id]: Number(e.target.value) }))}>
                {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} estrelas</option>)}
              </select>
              <input className="input sm:col-span-2" placeholder="Deixe um comentário" value={comment[o.id]||""} onChange={e=>setComment(s=>({ ...s, [o.id]: e.target.value }))} />
              <button className="btn btn-primary" onClick={()=>sendReview(o)}>Enviar avaliação</button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
