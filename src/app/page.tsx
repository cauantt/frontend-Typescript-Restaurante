'use client'
import Image from "next/image";
import { useState } from "react";
import { apiauth } from "./services/apiauth"; 
import { useRouter } from "next/navigation";
import nookies from 'nookies';
import { notify } from "./components/Notification";
import NotificationTrigger from "./components/NotificationTrigger";

export default function Home() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
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
      router.push("/lojas");
  
    } catch (error) {
      console.log(error);
  
      // Verifique se o erro é de autenticação (código 401 ou uma mensagem específica)
      if (error.response) {
        // Quando a resposta da API contém um erro
        if (error.response.status === 401) {
          // Erro de autenticação (senha ou usuário incorretos)
          notify("Usuário ou senha incorretos! Tente novamente.", "error");
        } else if (error.response.data.message) {
          // Caso a API tenha uma mensagem customizada no erro
          notify(error.response.data.message, "error");
        } else {
          notify("Ocorreu um erro inesperado. Tente novamente.", "error");
        }
      } else {
        // Caso haja algum erro sem resposta, como um problema de rede
        notify("Falha na conexão. Tente novamente mais tarde.", "error");
      }
    }
  };
  

  return (
    <div className="bg-gradient-to-r from-purple-300 to-purple-700 flex justify-center items-center w-screen h-screen text-black">
       <NotificationTrigger message="This is an info notification" type="info" />
      <div className="bg-white shadow-lg rounded-xl w-96 p-8">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              type="text"  
              placeholder="Email" 
              className="w-full bg-gray-100 h-12 rounded-lg p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              type="password"  
              placeholder="Senha" 
              className="w-full bg-gray-100 h-12 rounded-lg p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition duration-300"
          >
            Enviar
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">Ainda não possui uma conta? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a></p>
      </div>
    </div>
  );
}
