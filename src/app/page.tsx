'use client'
import Image from "next/image";
import { useState } from "react";
import { apiauth } from "./services/apiauth"; 
import { useRouter } from "next/navigation";
import nookies from 'nookies';

export default function Home() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e ) => {
    e.preventDefault();

    try {
      console.log(email, password);

      const response = await apiauth.post('auth/login', {
        email: email,
        password: password
      });

      const data = response.data;

      // Armazenar os cookies usando `nookies`
      nookies.set(null, "access_token", String(data.access_token), {
        maxAge: 60 * 60 * 15, // 15 horas
        secure: true,
        path: '/'
      });
      nookies.set(null, "userId", data.userId, {
        maxAge: 60 * 60 * 15,
        secure: true
      });
      nookies.set(null, "profile", String(data.path), {
        maxAge: 60 * 60 * 15,
        secure: true,
        path: '/'
      });
      nookies.set(null, "email", data.email, {
        maxAge: 60 * 60 * 15,
        secure: true
      });
      nookies.set(null, "role", data.role, {
        maxAge: 60 * 60 * 15,
        secure: true
      });
      nookies.set(null, "enterprise", data.enterprise, {
        maxAge: 60 * 60 * 15,
        secure: true
      });

      // Redirecionar para o dashboard
      router.push("/dashboard");

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-black flex justify-center items-center w-screen h-screen">
      <div className="bg-white w-96 h-96">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10 p-20 justify-center items-center">
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            type="text"  
            placeholder="Email" 
            className="bg-gray-600 h-10 rounded-lg border-none p-1"
          />
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            type="password"  
            placeholder="Senha" 
            className="bg-gray-600 h-10 rounded-lg border-none p-1"
          />
          <button className="bg-gray-600 h-10 w-20">Enviar</button>
        </form>
      </div>
    </div>
  );
}
