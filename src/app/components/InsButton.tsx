'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../services/api';
import Cookies from 'js-cookie';
import { useResetCookies } from './ResetCookiesContext'; 
import { notify } from './Notification';



function InsButton({ text,reset}) {


  const { userid } = useResetCookies();


  const handleImageChange = async (event) => {
   
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
       
        console.log(userid);
        const response = await api.post(`upload/profile/${userid}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        

        // Handle response (update state, notify user, etc.)
        console.log('File uploaded successfully:');
        

        
        
        
        reset(response.data.imageUrl);
        notify("Foto atualizada!" ,"success")
        
      } catch (error) {
        console.error('Error uploading file:', error);
        notify("Não foi possível atualizar sua foto" ,"error")
      }
    }
  };

  return (
    <div className='relative cursor-pointer'>
      <div className='bg-gray-200 text-black w-36 rounded-md h-10 cursor-pointer flex font-extralight justify-center items-center'>
        {text}
      </div>
      <input
        type='file'
        className='absolute inset-0 opacity-0 cursor-pointer'
        accept='image/*'
        onChange={handleImageChange}
      />
    </div>
  );
}

export default InsButton;
