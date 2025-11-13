import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";
import { useState } from "react";

export default function Cart(){
  const { items, inc, dec, total, restaurantId, clear } = useCart();
  const { api, user } = useAuth();
  const [address,setAddress]=useState("Rua Exemplo, 123 - Centro");
  const nav=useNavigate();
  const totalBRL=(total/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

  async function checkout(){
    if(!user) return nav("/login");
    if(!restaurantId) return;
    await api("/orders",{ method:"POST", body: JSON.stringify({ restaurantId, address, items: items.map(i=>({ itemId:i.itemId, qty:i.qty })) }) });
    clear(); nav("/orders");
  }

  if(items.length===0){
    return <div className="text-center"><p>Carrinho vazio</p><Link className="btn mt-3" to="/">Voltar</Link></div>;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Carrinho</h1>
      {items.map(i=>(
        <div key={i.itemId} className="card flex items-center justify-between">
          <div className="font-semibold">{i.name}</div>
          <div className="flex items-center gap-2">
            <button className="btn" onClick={()=>dec(i.itemId)}>-</button>
            <span>{i.qty}</span>
            <button className="btn" onClick={()=>inc(i.itemId)}>+</button>
          </div>
        </div>
      ))}
      <div className="card">
        <div className="mb-2 font-semibold">Endereço de entrega</div>
        <input className="input" value={address} onChange={e=>setAddress(e.target.value)} />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Total: {totalBRL}</div>
        <button className="btn btn-primary" onClick={checkout}>Finalizar pedido</button>
      </div>
    </section>
  );
}
