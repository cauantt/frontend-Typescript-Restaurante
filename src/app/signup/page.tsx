'use client'
import { useState } from "react";
import { api } from "../services/api"; 
import { useRouter } from "next/navigation";
import nookies from 'nookies';

export default function SignUp() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [areaCode, setAreaCode] = useState(""); // Area code (DDD)
  const [enterprise, setEnterprise] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Always prefix the phone number with the country code "55"
    const fullPhoneNumber = `55${areaCode}${phoneNumber}`;

    try {
      const response = await api.post('users', {
        category: "cliente",
        role: 1,
        email,
        password,
        phone: fullPhoneNumber,
        enterprise
      });

      const data = response.data;

      // Store cookies with the response data
      nookies.set(null, "access_token", String(data.access_token), {
        maxAge: 60 * 60 * 15, // 15 hours
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
      nookies.set(null, "enterprise", data.enterprise, {
        maxAge: 60 * 60 * 15,
        secure: true
      });

      // Redirect to the login page
      router.push("/");

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-300 to-purple-700 flex justify-center items-center w-screen h-screen text-black">
      <div className="bg-white shadow-lg rounded-xl w-96 p-8">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Registrar-se</h2>
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
          <div className="flex gap-2">
            <input 
              onChange={(e) => setAreaCode(e.target.value)} 
              type="text"  
              placeholder="DDD" 
              className="w-16 bg-gray-100 h-12 rounded-lg p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              type="text"  
              placeholder="Telefone" 
              className="flex-1 bg-gray-100 h-12 rounded-lg p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input 
              onChange={(e) => setEnterprise(e.target.value)} 
              type="text"  
              placeholder="Nome completo" 
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
        <p className="text-center text-sm text-gray-600 mt-4">Já tem uma conta? <a href="/" className="text-blue-500 hover:underline">Log in</a></p>
      </div>
    </div>
  );
}
