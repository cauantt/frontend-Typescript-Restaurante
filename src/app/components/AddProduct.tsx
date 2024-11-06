import React, { useState } from 'react';
import Modal from './Modal';
import Cookies from 'js-cookie';
import { api } from '../services/api';

function AddProduct({ categories, fetchProducts }) {
  const userId = Cookies.get("userId");

  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState(''); // Armazena categoryId
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [storage, setStorage] = useState('');
  const [image, setImage] = useState(null); // Armazena objeto do arquivo
  const [product, setProduct] = useState(null); // Armazena ID do produto
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  

  const fetchProductImage = async (file, productId) => {
    try {

      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);

      const response = await api.post('/upload/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

     
    } catch (error) {
      console.error('Erro ao enviar imagem:', error.message);
      setErrorMessage('Erro ao enviar imagem');
    }
  };

  const newProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/products", {
        name,
        price,
        categoryId: category,
        storage: storage ,
        description : description,
        userId,
      });

      const data = response.data;
      const createdProductId = data.productId; // Define o ID do produto criado

      // Atualiza o ID do produto
      setProduct(createdProductId); 

      setSuccessMessage('Produto criado com sucesso!');
      setErrorMessage('');
   
      // Envia a imagem após criar o produto
      if (image) {
        await fetchProductImage(image, createdProductId);
      }

      fetchProducts(); 
      
      // Limpar os estados
      setName('');
      setDescription("")
      setPrice('');
      setCategory('');
      setImage(null);
      setProduct(null);
      handleClose();
    } catch (error) {
      console.error(error);
      setErrorMessage('Ocorreu um erro ao criar o produto.');
      setSuccessMessage('');
    }
  };

  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setSuccessMessage(''); // Limpa a mensagem de sucesso quando o modal é fechado
    setErrorMessage(''); // Limpa a mensagem de erro quando o modal é fechado
  };

  return (
    <div className='cursor-pointer flex w-40 h-10 bg-purple-700 rounded-md justify-between px-3 items-center text-center' onClick={handleOpen}>
      <Modal show={showModal} handleClose={handleClose}>
  <form
    onSubmit={newProduct}
    className='flex flex-col items-start gap-5 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto'
  >
    <h1 className='text-xl font-semibold text-gray-800'>Criar Produto</h1>
    
    <div className='w-full'>
      <label className='block text-sm font-medium text-gray-700'>Nome do produto</label>
      <input
        onChange={(e) => setName(e.target.value)}
        placeholder="Digite o nome"
        className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500'
        value={name}
      />
    </div>

    <div className='w-full'>
      <label className='block text-sm font-medium text-gray-700'>Categoria</label>
      <select
        name="Categorias"
        onChange={(e) => setCategory(e.target.value)}
        id="Categorias"
        className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500'
      >
        <option value="">Selecione uma categoria</option>
        {categories.length > 0 ? (
          categories.map((category) => (
            <option key={category.id} value={category.id} className='bg-white text-black'>
              {category.category}
            </option>
          ))
        ) : (
          <option>Nenhuma categoria encontrada</option>
        )}
      </select>
    </div>

    <div className='w-full'>
      <label className='block text-sm font-medium text-gray-700'>Preço</label>
      <input
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        step="any"
        placeholder='Digite o preço'
        className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500'
        value={price}
      />
    </div>

    <div className='w-full'>
      <label className='block text-sm font-medium text-gray-700'>Descrição</label>
      <input
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        
        placeholder='Descrição do produto'
        className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500'
        value={description}
      />
    </div>

    <div className='w-full'>
      <label className='block text-sm font-medium text-gray-700'>Estoque do produto</label>
      <input
        onChange={(e) => setStorage(e.target.value)}
        type="number"
        placeholder='Digite o estoque'
        className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500'
        value={storage}
      />
    </div>

    <div className='w-full'>
      <label className='block text-sm font-medium text-gray-700'>Imagem do Produto</label>
      <input
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
        className='mt-1 w-full text-gray-800'
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
      <p className='text-xs'>Adicionar Produto</p>
    </div>
  );
}

export default AddProduct;
