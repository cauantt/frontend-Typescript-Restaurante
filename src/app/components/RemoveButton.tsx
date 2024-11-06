'use client'

import React, { useState } from 'react'
import { api } from '../services/api';
import Modal from './Modal';




function RemoveButton({ text, reset }) {
  
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    
  };


  const deleteProfile = async () => {
    try {
      await api.delete('upload/profile');
      console.log('File deleted successfully');

     
      const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/b/teste-d4080.appspot.com/twitter-novo-avatar-padrao-2017-bluebus.png';
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
