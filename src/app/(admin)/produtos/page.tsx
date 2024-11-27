"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Modal from "@/app/components/Modal";
import { FaTrashCan } from "react-icons/fa6";
import AddCategory from "@/app/components/AddCategory";
import AddProduct from "@/app/components/AddProduct";
import { api } from "@/app/services/api";
import { MdEdit } from "react-icons/md";
import ModalOptions from "@/app/components/ModalOptions";
import { SlOptions } from "react-icons/sl";
import ModalEdit from "@/app/components/ModalEdit";
import { MdDelete } from "react-icons/md";
import Image from "next/image"; 
import NotificationTrigger from "@/app/components/NotificationTrigger";
import { notify } from "@/app/components/Notification";


function Page() {
  const [showModal, setShowModal] = useState(false);
  const [showModalOptions, setShowModalOptions] = useState(false);
  const [showModalOptionsProduct, setShowModalOptionsProduct] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [ShowModalEditCategory, setShowModalEditCategory] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // State to store the productId to delete
  const userId = Cookies.get("userId");
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStorage, setProductStorage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const userIds = parseInt(Cookies.get("userId"));
  
 
  const [productPrice, setProductPrice] = useState("");

  const handleOpen = () => {
    // Set the selected productId when opening the modal
    setShowModal(true);
    setShowModalOptionsProduct(false);
  };

  const handleOpen2 = () => {
    // Set the selected productId when opening the modal
    setShowModal2(true);
    setShowModalOptions(false);
  };

  const handleOpenOptions = (event, categoryId) => {
    const iconPosition = event.target.getBoundingClientRect();
    setModalPosition({ top: iconPosition.top, left: iconPosition.left });
    setShowModalOptions(true);
    setSelectedCategoryId(categoryId);
  };

  const handleOpenOptionsProducts = (event, productId) => {
    const iconPosition = event.target.getBoundingClientRect();
    setModalPosition({ top: iconPosition.top, left: iconPosition.left });
    setShowModalOptionsProduct(true);
    setSelectedProductId(productId);
  };

  const handleOpenModalEdit = () => {
    // Set the selected productId when opening the modal
    setShowModalEdit(true);
    setShowModalOptionsProduct(false);
    fetchProductById();
    
  };

  const handleOpenModalEditCategory = () => {
    // Set the selected productId when opening the modal
    setShowModalEditCategory(true);
    setShowModalOptions(false);
    
    
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProductId(null); // Clear the selected productId when closing the modal
  };

  const handleClose2 = () => {
    setShowModal2(false);
    setSelectedCategoryId(null); // Clear the selected productId when closing the modal
  };

  const handleCloseOptions = () => {
    setShowModalOptions(false);
  };
  const handleCloseModalEdit = () => {
    setShowModalEdit(false);
  };

  const handleCloseModalEditCategory = () => {
    setShowModalEditCategory(false);
  };

  const handleCloseOptionsProduct = () => {
    setShowModalOptionsProduct(false);
  };

  const updateProduct = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await api.patch(`/products/${selectedProductId}`, {
        name: productName,
        price: productPrice,
        description : productDescription,
        storage: productStorage

      });
      console.log('Update response:', response);
      fetchProducts();
      handleCloseModalEdit()
      notify("O produto foi atualizado", "success")
    } catch (error) {
      console.error('Error updating product:', error);
      notify("Não foi possível atualizar o produto, tente novamente!!", "error")
    }
  };

  
  const updateCategory = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await api.patch(`/categories/${selectedCategoryId}`, {
        category: categoryName,
       
      });
      console.log('Update response:', response);
      fetchCategories();
      handleCloseModalEditCategory()
      notify("A categoria foi atualizada", "success")
    } catch (error) {
      console.error('Error updating product:', error);
      notify("Não foi possível atualizar a categoria, tente novamente!!", "error")
    }
  };

  const fetchProductById = async () => {
    try {
      const response = await api.get(`/products/${selectedProductId}`);
      const data = response.data;
  
      setProductName(data.name);
      setProductPrice(data.price);
      setProductStorage(data.storage); // Make sure this is set correctly
    } catch (error) {
      console.log(error);
    }
  };
  

  const fetchCategoryById = async () => {
    try {
      const response = await api.get(`/categories/${selectedProductId}`);

      const data = response.data;

      setCategoryName(data.name);
     
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
        const response = await api.get("/categories", {
            params: { userId: userIds }  // Send userId as a query parameter
        });
        
        setCategories(response.data);
    } catch (error) {
        console.error("Error fetching categories: ", error);
    }
};

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [userId]);

  const fetchProducts = async () => {
    if (userId) {
      try {
        const userIdNumber = parseInt(userId, 10);
        const response = await api.get("/products", {
          params: { userId: userIdNumber },
        });
        setProducts(response.data);

        const grouped = response.data.reduce((acc, product) => {
          if (!acc[product.category.id]) {
            acc[product.category.id] = {
              category: product.category,
              products: [],
            };
          }
          acc[product.category.id].products.push(product);
          return acc;
        }, {});
        setGroupedProducts(grouped);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  };

  const excluirProduct = async () => {
    try {
      await api.delete(`/products/${selectedProductId}`); // Use the selectedProductId to delete the product
      fetchProducts(); // Re-fetch products after deletion
      handleClose();
      notify("Produto removido", "success")
    } catch (error) {
      console.error("Error deleting product:", error);
      notify("não foi possível remover o produto", "error")
    }
  };

  const excluirCategory = async () => {
    try {
      await api.delete(`/categories/${selectedCategoryId}`);
      fetchCategories();
      handleClose2();
      notify("Categoria removida", "success")
    } catch (error) {
      console.error("Error deleting category:", error);
      notify("Não foi possível remover essa categoria, tente novamente!!", "error")
    }
  };

  return (
    <div className=" min-h-full w-full ">
       <NotificationTrigger message="This is an info notification" type="info" />
      <Modal show={showModal} handleClose={handleClose}>
        <div className="flex flex-col p-5 gap-4">
          <p className="text-black font-bold text-lg">Excluir produto?</p>
          <div className="flex gap-4">
            <button
              className="h-7 w-16 bg-gray-300 text-black"
              onClick={excluirProduct}
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

      <ModalEdit show={showModalEdit} handleClose={handleCloseModalEdit}>
  <form onSubmit={updateProduct} className="flex flex-col bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
    <h1 className="text-xl font-semibold text-gray-800 mb-4">Editar Produto</h1>

    <div className="flex flex-col gap-4">
      <div className="w-full">
        <label htmlFor="productName" className="text-sm font-medium text-gray-700">
          Nome do produto
        </label>
        <input
          id="productName"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      <div className="w-full">
        <label htmlFor="productPrice" className="text-sm font-medium text-gray-700">Preço</label>
        <input
          id="productPrice"
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>


      <div className="w-full">
        <label htmlFor="productDescription" className="text-sm font-medium text-gray-700">
          Descrição do produto
        </label>
        <input
          id="productDescription"
          type="text"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      <div className="w-full">
        <label htmlFor="productStorage" className="text-sm font-medium text-gray-700">Estoque</label>
        <input
          id="productStorage"
          type="number"
          value={productStorage}
          onChange={(e) => setProductStorage(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
    </div>

    <div className="flex justify-end mt-5">
      <button type="submit"
        className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
        
      >
        Salvar
      </button>
    </div>
  </form>
</ModalEdit>



<ModalEdit show={ShowModalEditCategory} handleClose={handleCloseModalEditCategory}>
  <form onSubmit={updateCategory} className="flex flex-col bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
    <h1 className="text-xl font-semibold text-gray-800 mb-4">Editar </h1>

    <div className="flex flex-col gap-4">
      <div className="w-full">
        <label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
          Nome da categoria
        </label>
        <input
          id="categoryName"
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

     
    </div>

    <div className="flex justify-end mt-5">
      <button type="submit"
        className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
        
      >
        Salvar
      </button>
    </div>
  </form>
</ModalEdit>


      <Modal show={showModal2} handleClose={handleClose2}>
        <div className="flex flex-col p-5 gap-4">
          <p className="text-black font-bold text-lg">Excluir categoria?</p>
          <div className="flex gap-4">
            <button
              className="h-7 w-16 bg-gray-300 text-black"
              onClick={excluirCategory}
            >
              Sim
            </button>
            <button
              className="h-7 w-16 bg-gray-300 text-black"
              onClick={handleClose2}
            >
              Não
            </button>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col">
        <div className="flex justify-between">
          <h1 className="text-black text-3xl font-bold font-light">Produtos</h1>
          <div className="flex gap-5">
            <AddProduct categories={categories} fetchProducts={fetchProducts} />
            <AddCategory  />
          </div>
        </div>

        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white relative border-gray-300 border w-full h-auto rounded-lg mt-5 p-5 flex flex-col"
            >
              <div
                className="bg-white w-10 h-10 rounded-full absolute top-5 right-2 transform translate-x-2 translate-y-[-50%] flex justify-center items-center text-black  text-lg cursor-pointer"
                onClick={(e) => handleOpenOptions(e, category.id)} // Pass productId when opening modal
              >
                <SlOptions />
              </div>

              <ModalOptions
                show={showModalOptions}
                handleClose={handleCloseOptions}
                position={modalPosition}
              >
                <div className="flex flex-col  text-black text-sm gap-1">
                  <div onClick={() => handleOpen2()} className="cursor-pointer flex items-center gap-2">

                  <MdDelete />
                    <p>Excluir</p>
                  </div>

                  <div
                            onClick={() => handleOpenModalEditCategory()}
                            className="cursor-pointer flex items-center gap-2" 
                          >
                            <MdEdit />
                            <p>Editar</p>
                          </div>
                </div>
              </ModalOptions>

              <p className="text-black text-xl font-light">
                {category.category}
              </p>
              <div className="mt-5 flex flex-wrap gap-5">
                {groupedProducts[category.id]?.products.length > 0 ? (
                  groupedProducts[category.id].products.map((product) => (
                    <div
                      key={product.productId}
                      className=" w-full sm:w-[480px] flex flex-col border-gray-300 border p-5 rounded-2xl
                      
                      relative"
                    >
                      <div
                        className="bg-white w-10 h-10 rounded-full absolute top-5 right-2 transform translate-x-2 translate-y-[-50%] flex justify-center items-center text-black  text-lg cursor-pointer"
                        onClick={(e) =>
                          handleOpenOptionsProducts(e, product.productId)
                        } // Pass productId when opening modal
                      >
                        <SlOptions />
                      </div>

                      <ModalOptions
                        show={showModalOptionsProduct}
                        handleClose={handleCloseOptionsProduct}
                        position={modalPosition}
                      >
                        <div className="flex flex-col  text-black text-sm gap-1">
                          <div
                            onClick={() => handleOpen()}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <MdDelete />
                            <p>Excluir</p>
                          </div>

                          <div
                            onClick={() => handleOpenModalEdit()}
                            className="cursor-pointer flex gap-2 items-center"
                          >
                            <MdEdit />
                            <p>Editar</p>
                          </div>
                        </div>
                      </ModalOptions>

                      <div className="flex flex-row-reverse justify-between items-center">
                       <Image alt="produto" src={product.path} width={150} height={150} />
                        <div className="flex flex-col w-3/6">
                          <p className="text-black text-base mt-2">
                            {product.name}
                          </p>
                          <p className="text-black text-xs mt-4">
                            {product.description}
                          </p>
                          <p className="text-green-600 text-sm mt-4">Apartir de R$ {product.price},00</p>
                          
                                                </div>
                        </div>
                    </div>
                  ))
                ) : (
                  <p className="text-black text-md mt-2">
                    No products found for this category
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No categories found</p>
        )}
      </div>
    </div>
  );
}

export default Page;
