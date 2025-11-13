import { useEffect, useState } from "react";
import { useAuth } from "../../state/AuthContext";

export default function AdminOrders(){
  const { api, user } = useAuth();
  const [orders,setOrders]=useState<any[]>([]);
  const [statusMap,setStatusMap]=useState<Record<number,string>>({});
  useEffect(()=>{ if(user?.role==="ADMIN") api("/orders").then(setOrders); },[user]);
  if(!user || user.role!=="ADMIN") return <div className="card">Acesso restrito.</div>;
  const statuses=["PENDING","CONFIRMED","PREPARING","OUT_FOR_DELIVERY","DELIVERED","CANCELED"];
  async function changeStatus(id:number){ const status=statusMap[id]; if(!status) return; await api("/orders/"+id+"/status",{ method:"PATCH", body: JSON.stringify({ status }) }); setOrders(await api("/orders")); }
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Pedidos</h1>
      {orders.map(o=>(
        <div key={o.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">#{o.id} · {o.restaurant.name} · {o.user?.name||"Cliente"}</div>
              <div className="text-sm text-zinc-500">{o.address}</div>
            </div>
            <div className="text-sm">{(o.totalCents/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</div>
          </div>
          <div className="mt-2 flex gap-2">
            <select className="input" value={statusMap[o.id]||o.status} onChange={e=>setStatusMap(s=>({ ...s, [o.id]: e.target.value }))}>
              {statuses.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary" onClick={()=>changeStatus(o.id)}>Atualizar</button>
          </div>
        </div>
      ))}
    </section>
  );
}
