import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";

export default function Navbar(){
  const { user, logout } = useAuth();
  const { items, total } = useCart();
  const nav = useNavigate();
  const totalBRL=(total/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
         <img src="/logo_edecio.png" alt="Logo" className="w-16 h-16 rounded-full object-cover" />
        <Link to="/" className="font-bold text-xl text-red-600">Edécio Delivery</Link>
        <nav className="ml-auto flex items-center gap-3">
          <Link to="/cart" className="btn">Carrinho ({items.length}) · {totalBRL}</Link>
          {user? (<>
            <Link to="/orders" className="btn">Pedidos</Link>
            {user.role==="ADMIN" && <Link to="/admin" className="btn btn-primary">Admin</Link>}
            <button className="btn" onClick={()=>{ logout(); nav("/"); }}>Sair</button>
          </>):(<Link to="/login" className="btn btn-primary">Entrar</Link>)}
        </nav>
      </div>
    </header>
  );
}
