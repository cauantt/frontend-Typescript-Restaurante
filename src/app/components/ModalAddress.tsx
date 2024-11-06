import React, { useState } from 'react';
import { SlOptionsVertical } from "react-icons/sl";
import { FaHome } from "react-icons/fa";
import ModalNewAddress from './ModalNewAddres';
import ModalOptions from './ModalOptionsLeft';
import { MdDelete, MdEdit } from 'react-icons/md';

const ModalAddress = ({ show, handleClose, address, setSelectedAddress,setShow }) => {
  if (!show) return null;

  const [showModalNewAddres,setShowModalNewAddres ] = useState(false)
  const [showModalOptions, setShowModalOptions] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const handleOpenModal = () => {

    setShowModalNewAddres(true)
    




  }

  const handleOpenOptions = (event, categoryId) => {
    const iconPosition = event.target.getBoundingClientRect();
    setModalPosition({ top: iconPosition.top, left: iconPosition.left });
    setShowModalOptions(true);
    
  };

  const handleCloseModal = () => {


    setShowModalNewAddres(false)

    
  }

  const handleCloseOptions = () => {
    setShowModalOptions(false);
  };
 
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-50" onClick={handleClose}>
      <ModalOptions
                show={showModalOptions}
                handleClose={handleCloseOptions}
                position={modalPosition}
              >
                <div className="flex flex-col  text-black text-sm gap-1">
                  <div  className="cursor-pointer flex items-center gap-2">

                  <MdDelete />
                    <p>Excluir</p>
                  </div>

                  <div
                           
                            className="cursor-pointer flex items-center gap-2" 
                          >
                            <MdEdit />
                            <p>Editar</p>
                          </div>
                </div>
              </ModalOptions>
      <ModalNewAddress show={showModalNewAddres} handleClose={handleCloseModal} setShow={setShowModalNewAddres}/>
       
      <div className="bg-white rounded-lg shadow-lg relative p-10" onClick={(e) => e.stopPropagation()}>
        {/* Botão de Fechar */}
        <button 
          onClick={handleClose} 
          className="absolute top-2 right-4 text-black text-xl font-bold"
        >
          &times;
        </button>

        <div className="flex flex-col border border-gray-300 rounded-lg w-[500px]">

          <div className="p-5 hover:bg-gray-50 w-full flex justify-center items-center">
            <div className="flex gap-2 justify-center items-center">
              <p>Endereços</p>
            </div>
          </div>

          {/* Conteúdo dos endereços com rolagem */}
          <div className='flex flex-col gap-2 p-5 w-full h-[400px] overflow-y-auto'>
            {address.map((item) => (
              <div 
                key={item.id} 
                className='flex justify-between w-full items-center p-5 border hover:border-purple-500 rounded-md text-sm cursor-pointer'
                
              >
                <div className='flex gap-8 items-center w-full'onClick={() => {
                  setSelectedAddress(item);
                  handleClose();
                }}>
                  <FaHome className='text-2xl'/>
                  <div className='flex flex-col gap-1'>
                    <p className='font-bold'>R. {item.street}, {item.number}</p>
                    <p>{item.district}</p>
                    <p>{item.city} - {item.state}</p>
                    {item.complement && <p>{item.complement}</p>}
                  </div>
                </div>
                <SlOptionsVertical className='self-start cursor-pointer justify-self-end' onClick={(e) => handleOpenOptions(e, item.id)}/>
              </div>
            ))}
          </div>
        </div>

        <button className='w-full bg-purple-500 h-12 mt-5 rounded-lg text-white hover:bg-purple-600' onClick={handleOpenModal}>Novo endereço</button>
      </div>
    </div>
  );
};

export default ModalAddress;