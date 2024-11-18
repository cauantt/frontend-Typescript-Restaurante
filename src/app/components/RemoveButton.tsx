'use client'

import React, { useState } from 'react'
import { api } from '../services/api';
import Modal from './Modal';
import { useResetCookies } from './ResetCookiesContext';




function RemoveButton({ text, reset }) {
  
  const [showModal, setShowModal] = useState(false);
  const { resetCookies, profile, email, enterprise,userid } = useResetCookies();
  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    
  };


  const deleteProfile = async () => {
    try {
      await api.delete(`upload/profile/${userid}`);
      console.log('File deleted successfully');

     
      
      reset();
      handleClose();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className='bg-red-500 text-white w-36 rounded-md h-10 cursor-pointer flex font-extralight justify-center items-center'
      onClick={handleOpen}
    >
      <Modal show={showModal} handleClose={handleClose}>
        <div className="flex flex-col p-5 gap-4">
          <p className="text-black text-center font-bold text-lg">Excluir foto ?</p>
          <div className="flex gap-4">
            <button
              className="h-7 w-16 bg-gray-300 text-black"
              onClick={deleteProfile}
            >
              Sim
            </button>
            <button
              className="h-7 w-16 bg-gray-300 text-black"
              onClick={handleClose}
            >
              Não
            </button>
          </div>
        </div>
      </Modal>
      {text}
    </div>
  );
}

export default RemoveButton;
