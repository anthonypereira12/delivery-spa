import React, { createContext, useContext, useMemo, useState } from "react";
type CartItem={ itemId:number; name:string; priceCents:number; qty:number; restaurantId:number };
type CtxT={ items:CartItem[]; add:(i:CartItem)=>void; inc:(id:number)=>void; dec:(id:number)=>void; clear:()=>void; total:number; restaurantId?:number };
const Ctx=createContext<CtxT>(null!);
export const CartProvider:React.FC<{children:React.ReactNode}>=({children})=>{
  const [items,setItems]=useState<CartItem[]>([]);
  const restaurantId=items[0]?.restaurantId;
  const add=(i:CartItem)=>setItems(prev=>{ if(prev.length>0 && prev[0].restaurantId!==i.restaurantId) return [i]; const idx=prev.findIndex(p=>p.itemId===i.itemId); if(idx>=0){ const cp=[...prev]; cp[idx].qty+=i.qty; return cp; } return [...prev,i]; });
  const inc=(id:number)=>setItems(prev=>prev.map(p=>p.itemId===id?{...p,qty:p.qty+1}:p));
  const dec=(id:number)=>setItems(prev=>prev.flatMap(p=>p.itemId===id?(p.qty>1?[{...p,qty:p.qty-1}]:[]):[p]));
  const clear=()=>setItems([]);
  const total=useMemo(()=>items.reduce((s,i)=>s+i.priceCents*i.qty,0),[items]);
  return <Ctx.Provider value={{items,add,inc,dec,clear,total,restaurantId}}>{children}</Ctx.Provider>;
};
export const useCart=()=>useContext(Ctx);
