import { useCart } from "../state/CartContext";
export default function DishCard({ d }: { d:any }){
  const { add } = useCart();
  const price=(d.priceCents/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  return (
    <div className="card flex gap-4">
      <div className="w-28 h-28 bg-zinc-200 rounded-xl bg-cover bg-center" style={{ backgroundImage:`url(${d.imageUrl||""})` }} />
      <div className="flex-1">
        <div className="font-semibold">{d.name}</div>
        <div className="text-sm text-zinc-500">{d.description}</div>
        <div className="mt-2 font-semibold">{price}</div>
      </div>
      <button className="btn btn-primary h-fit" onClick={()=>add({ itemId:d.id, name:d.name, priceCents:d.priceCents, qty:1, restaurantId:d.restaurantId })}>Adicionar</button>
    </div>
  );
}
