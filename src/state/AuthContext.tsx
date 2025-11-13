import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id:number; name:string; email:string; role:"USER"|"ADMIN" };
type CtxT = { user?:User; token?:string; login:(t:string,u:User)=>void; logout:()=>void; api:(path:string, init?:RequestInit)=>Promise<any> };
const Ctx = createContext<CtxT>(null!);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({children})=>{
  const [user,setUser]=useState<User|undefined>(); const [token,setToken]=useState<string|undefined>();
  useEffect(()=>{ const t=localStorage.getItem("token"); const u=localStorage.getItem("user"); if(t&&u){ setToken(t); setUser(JSON.parse(u)); }},[]);
  const login=(t:string,u:User)=>{ setToken(t); setUser(u); localStorage.setItem("token",t); localStorage.setItem("user",JSON.stringify(u)); };
  const logout=()=>{ setToken(undefined); setUser(undefined); localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href="/"; };
  const api=async(path:string,init:RequestInit={})=>{ const base=import.meta.env.VITE_API_URL||"http://localhost:3333"; const headers:any={"Content-Type":"application/json",...(init.headers||{})}; if(token) headers["Authorization"]="Bearer "+token; const r=await fetch(base+path,{...init,headers}); if(!r.ok) throw new Error((await r.json()).error||"Erro"); return r.json(); };
  return <Ctx.Provider value={{user,token,login,logout,api}}>{children}</Ctx.Provider>;
};
export const useAuth=()=>useContext(Ctx);
