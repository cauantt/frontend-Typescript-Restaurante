import React, { useState } from 'react'
import Modal from './Modal';
import { api } from '../services/api';
import Cookies from 'js-cookie';


function AddCategory() {

  const [showModal, setShowModal] = useState(false);
  const userIds = parseInt(Cookies.get("userId"));

  const [categorys, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setSuccessMessage(''); // Limpa a mensagem de sucesso quando o modal é fechado
    setErrorMessage(''); // Limpa a mensagem de erro quando o modal é fechado
  };

  const newCategory = async () =>{

    try {

      
    const response = await api.post("categories",{

      category : categorys,
      userId : userIds


    })
    setSuccessMessage('Categoria criada com sucesso!');
  
  
  }

    catch(error){
      setErrorMessage('Ocorreu um erro ao criar o produto.');
      console.log(error)
    }
  
  
  }

  return (
    <div className=' text-purple-700  border cursor-pointer flex w-40 h-10 bg-white border-purple-700 rounded-md justify-between px-2 items-center text-center text' onClick={handleOpen}>
<Modal show={showModal} handleClose={handleClose}>
  <form onSubmit={newCategory}
    
    className='flex flex-col items-start gap-5 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto'
  >
    <h1 className='text-xl font-semibold text-gray-800'>Criar categoria</h1>
    
    

    <div className='w-full'>
      <label className='block text-sm font-medium text-gray-700 mt-10 mb-5'>Categoria</label>
      <input
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Digite o nome"
        className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500'
        
      />
    </div>


    

    <div className='flex justify-end w-full mt-5'>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200"
        type='submit'
      >
        Salvar
      </button>
    </div>

    {successMessage && <p className='text-green-500 mt-2'>{successMessage}</p>}
    {errorMessage && <p className='text-red-500 mt-2'>{errorMessage}</p>}
  </form>
</Modal>
        <p className='text-xl'>+</p>

      <p className='text-xs'>Adicionar Categoria</p>
    </div>
  )
}

export default AddCategory
