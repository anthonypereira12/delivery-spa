import { Link } from "react-router-dom";
import { useAuth } from "../../state/AuthContext";

export default function Admin(){
  const { user } = useAuth();
  if(!user) return <div>Faça login para continuar.</div>;
  if(user.role!=="ADMIN") return <div className="card">Acesso restrito — apenas administradores.</div>;
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Administração</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        <Link to="/admin/restaurants" className="card">Gerenciar Restaurantes</Link>
        <Link to="/admin/items" className="card">Gerenciar Itens</Link>
        <Link to="/admin/orders" className="card">Pedidos</Link>
        <Link to="/admin/analytics" className="card">Analytics (Victory)</Link>
      </div>
    </section>
  );
}
