'use client'

import InsButton from '@/app/components/InsButton';
import RemoveButton from '@/app/components/RemoveButton';
import { useResetCookies } from '@/app/components/ResetCookiesContext'
import { api } from '@/app/services/api';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function page() {
  const { resetCookies, profile, email, enterprise,userid } = useResetCookies();
  const [show, setShow] = useState(false);
 
  const [newEmail, setNewEmail] = useState(email);
  const [newEnterprise, setNewEnterprise] = useState("");

  useEffect(() => {
    email && setNewEmail(email);
    enterprise && setNewEnterprise(enterprise);
  }, [email])

  const editInfos = async (e) => {
    try {
      e.preventDefault();
      const response = await api.patch(`users/${userid} `, {
        enterprise: newEnterprise,
        email: newEmail
      })
      resetCookies(profile)
    }

    catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="h-full   flex flex-col">
      <h2 className="text-black text-3xl">Minha Conta</h2>

      <div className="mt-14  bg-white p-3 rounded-lg flex flex-row gap-5 text items-center">
        <div className="w-24 h-24 bg-black relative overflow-hidden border-gray-300 rounded-full flex items-center justify-center font-semibold text-base">
          {profile && <Image
            src={profile}
            alt="Profile picture"
            layout="fill"
            objectFit="cover"
            className=""
          />}
        </div>

        <div className="flex flex-col">
          <span className="text-xl font-medium text-black max-lg:hidden">
            {enterprise}
          </span>
          <span className="text-sm font-light text-black max-lg:hidden">
            {email}
          </span>
        </div>

        <div className="flex ml-12 gap-10 flex-row">
          <InsButton  text="Editar foto" reset={resetCookies}  />
          <RemoveButton text="Remover " reset={resetCookies} />
        </div>
      </div>


      <div className="mt-6  bg-white p-3 rounded-lg flex flex-row gap-5 text items-center">

        <form onSubmit={editInfos} className="flex  gap-6 items-center" action="">


          <label className='block text-sm font-medium  text-gray-700'>Nome</label>
          <input
            onChange={(e) => setNewEnterprise(e.target.value)}
            type="text"
            placeholder='Digite o nome'
            className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500'
            value={newEnterprise}
          />


          <label className='block text-sm font-medium text-gray-700'>Email</label>
          <input
            onChange={(e) => setNewEmail(e.target.value)}
            type="text"
            placeholder='Digite o email'
            className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500'
            value={newEmail}
          />

          <button
            className=" bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200"
            type='submit'
          >
            Salvar
          </button>
        </form>






      </div>
    </div>
  )
}

export default page
