import { useState } from "react";
import { useAuth } from "../state/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const { login } = useAuth();
  const [email,setEmail]=useState("admin@edecio.delivery");
  const [password,setPassword]=useState("admin123");
  const nav=useNavigate();
  async function onSubmit(e:any){ e.preventDefault(); const base=import.meta.env.VITE_API_URL||"http://localhost:3333"; const r=await fetch(base+"/auth/login",{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email, password }) }); if(!r.ok){ alert("Erro ao entrar"); return; } const data=await r.json(); login(data.token, data.user); nav("/"); }
  return (<form onSubmit={onSubmit} className="max-w-sm mx-auto card space-y-3"><h1 className="text-xl font-bold">Entrar</h1><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" /><button className="btn btn-primary w-full">Entrar</button><p className="text-sm text-zinc-500">Seu acesso fica salvo no navegador.</p></form>);
}
