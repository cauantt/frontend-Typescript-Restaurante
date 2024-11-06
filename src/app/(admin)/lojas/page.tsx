"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/services/api"; // Adjust the path as needed
import Image from "next/image";
import Link from "next/link";

function Page() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Async function to fetch and filter users
    const fetchUsers = async () => {
      try {
        // Wait for the API response
        const response = await api.get("users");
        // Filter users with role = 3
        const filteredUsers = response.data.filter((user) => user.role === 3);
        setUsers(filteredUsers);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col">
      <h2 className="text-black text-3xl mb-10">Lojas</h2>
      {users.length > 0 ? (
        <div className="flex gap-3 flex-wrap">
          {users.map((user) => (
            <Link key={user.id} href={`/restaurantes/${user.userId}`}>
              <div
              key={user.id}
              className="mt-3 w-72 cursor-pointer bg-white hover:shadow-xl p-3 rounded-lg flex flex-row gap-5 text flex-wrap transform transition-transform duration-300 ease-in-out hover:scale-105"
            >
                <Image className="rounded-lg" src={user.path} width={90} height={90} alt={user.enterprise} />
                <div className="max-w-80 flex flex-col gap-1 rounded-lg justify-center">
                  <p className="text-gray-700 text-base w-32 font-semibold whitespace-nowrap overflow-hidden truncate">
                    {user.enterprise}
                  </p>
                  <p className="text-gray-700 text-xs w-32 font-light whitespace-nowrap overflow-hidden truncate">
                    {user.category}
                  </p>
                  <div className="flex gap-2">
                    <p className="text-gray-700 text-xs font-light whitespace-nowrap overflow-hidden truncate">
                      {user.deliveryTime}-{user.deliveryTime + 10} min
                    </p>
                    <p className="text-green-600 text-xs font-light whitespace-nowrap overflow-hidden truncate">
                      {user.deliveryPrice === "0" ? "Grátis" : `${user.deliveryPrice},00 R$`}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>Nenhuma loja encontrada.</p>
      )}
    </div>
  );
}

export default Page;
