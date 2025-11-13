import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster, toast } from "sonner";
import { useAuth } from "../state/AuthContext";
import { useEffect, useRef } from "react";

function StatusWatcher(){
  const { user, api } = useAuth();
  const last = useRef<Record<number,string>>({});
  useEffect(()=>{
    let t:any;
    async function poll(){
      try{
        if(user){
          const orders = await api('/orders');
          const map:Record<number,string> = {}; orders.forEach((o:any)=>{ map[o.id]=o.status; });
          const prev=last.current;
          Object.keys(map).forEach(k=>{
            const id=Number(k); const st=map[id];
            if(prev[id] && prev[id]!==st){
              const img = orders.find((o:any)=>o.id===id)?.restaurant?.imageUrl;
              toast(`Pedido #${id} atualizado: ${st}`, { description:"Acompanhe em Meus Pedidos.", icon: img ? <img src={img} style={{width:24,height:24,borderRadius:6}}/> : undefined });
            }
          });
          last.current = map;
        }
      }catch(e){}
      t=setTimeout(poll,6000);
    }
    poll();
    return ()=>clearTimeout(t);
  },[user]);
  return null;
}

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-6">
        <StatusWatcher />
        <Outlet />
        <Toaster richColors />
      </main>
      <footer className="border-t py-6 text-center text-sm text-zinc-500">Edécio Delivery © {new Date().getFullYear()}</footer>
    </div>
  );
}
