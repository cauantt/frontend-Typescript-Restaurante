"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/services/api"; // Adjust the path as necessary
import Image from "next/image";
import { notFound } from "next/navigation"; // For handling not found IDs
import { IoArrowBackOutline } from "react-icons/io5";
import Link from "next/link";
import Modal from "@/app/components/Modal";
import { CiShop } from "react-icons/ci";
import AddCart from "@/app/components/AddCart";
import { FaCartShopping } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";

import Cookies from "cookies-js";
import { set } from "cookies";
import Address from "@/app/components/Address";
import Payment from "@/app/components/Payment";
import ModalPayment from "@/app/components/ModalPayment";
import ModalAddress from "@/app/components/ModalAddress";

function RestaurantPage({ params }) {
  const [address, setAddress] = useState<any>(null); // Initialize as null for better conditional rendering
  const { id } = params; // Get ID dynamically from URL
  const [user, setUser] = useState(null);
  const [menuAddress, setMenuAddress] = useState(true)
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
 
  const [showModalMarket, setShowModalMarket] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [product, setProduct] = useState(null);
  const [observation, setObservation] = useState("");
  const [market, setMarket] = useState(true);
  const [productsTotal, setProductsTotal] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [selectedOption, setSelectedOption] = useState("deliver");
  const [deliveryPrice,setDeliveryPrice] = useState("0")
  const [delivery,setDelivery] = useState(true)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("pix")
  

  

  interface Order {
    status?: string;
    total?: number;
    customer?: number;
    establishment?: number;
    orderItems?: OrderItems[];
    delivery?: boolean;
    payment?: string;
    
    
  }

  interface OrderItems {
    quantity: number;
    observation: string;
    product: Product;
  }

  interface Product {
    productId: number;
    price: number;
    description: string;
    name: string;
    path: string;
  }

  interface Address {
    street: string;
    number: string;
    district: string;
    state: string;
    complement?: string;
    id ?: number; 
  }
  
  const [order, setOrder] = useState<Order>({ orderItems: [] });

  const handleSelectOption = (option) => {
    setSelectedOption(option);

    if (option === "deliver") {
      setDeliveryPrice(user.deliveryPrice),(setDelivery(true)),(setMenuAddress(true));
    } else {
      setDeliveryPrice("0"),(setDelivery(false)),(setMenuAddress(false));
    }
  };

  // Atualiza o total da ordem sempre que o deliveryPrice ou productsTotal mudar
  useEffect(() => {
    setTotalOrder(Number(productsTotal) + Number(deliveryPrice));
  }, [deliveryPrice, productsTotal]);

  const orderSubmit = async () => {
    try {
      const customer = Cookies.get("userId");
      const establishment = user.userId;
  
      const response = await api.post("orders", {
        status: "pendente",
        total: totalOrder,
        
        customer: {
          userId: customer,
        },
        delivery : delivery,
        payment : selectedPayment,
        establishment: {
          userId: establishment,
        },
        address:  selectedAddress.id,
        
        orderItems: order.orderItems,
      });
  
      handleCloseMarket();
      setOrder({
        orderItems: [], // Reinicia o array de orderItems para vazio
        // outros campos que você queira resetar
      });
  
      setTotalOrder(0);
      setProductsTotal(0);
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const addOrderItem = (product: Product, quantity: number) => {
    try {
      setProductsTotal(
        Number(productsTotal) + Number(product.price * quantity)
      );

      const currentOrder = {
        ...order,
        orderItems: [
          ...order.orderItems, // Manter os itens existentes
          {
            observation,
            product,
            quantity,
          },
        ],
      };
      setOrder(currentOrder);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (order) console.log(order);
  }, [order]);

  const handleOpen = (productId) => {
    setShowModal(true);
    setSelectedProductId(productId);
    fetchProduct(productId); // Passa o productId para a função fetchProduct
    setMarket(false);
    setDeliveryPrice(user.deliveryPrice);
    setSelectedOption("deliver")
  };

  const handleOpenMarket = () => {
    setShowModalMarket(true);
    setMarket(false);
    setDelivery(true)
  };

  

  const fetchProduct = async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      const data = response.data;
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProductId(null);
    setMarket(true); // Limpa o selectedProductId ao fechar o modal
  };

  const handleCloseMarket = () => {
    setShowModalMarket(false);
    setMarket(true);
  };

  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchCategories();
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!user.userId) {
    notFound(); 
  }

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        params: { userId: id },
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
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories", {
        params: { userId: id },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="flex flex-col relative">
      
      <Modal show={showModal} handleClose={handleClose}>
        <div className="flex  p-2 gap-4 text-black">
          {product ? (
            <div className="h-[500px] items-center flex row ">
              <div className="flex px-20">
                <Image alt="" src={product.path} width={400} height={400} />
              </div>

              <div className="flex-col flex h-full justify-start w-[500px] items-center">
                <p className="text-sm uppercase">{product.name}</p>

                <p className="text-xs mt-5">{product.description}</p>

                <div className="flex w-full items-start">
                  <p className="text-sm text-green-600 font-medium mt-5">
                    Apartir de R$ {product.price},00
                  </p>
                </div>

                <div className="flex flex-col gap-4 w-full items-start p-3 mt-5 border border-gray-300  rounded-lg">
                  <div className="flex gap-2">
                    <CiShop />
                    <p className="text-xs font-medium "> {user.enterprise}</p>
                  </div>

                  <div className="flex gap-3">
                    <p className="text-xs font-medium ">
                      {" "}
                      {user.deliveryTime}-{user.deliveryTime + 10} min
                    </p>
                    <p className="text-green-600 text-xs font-light whitespace-nowrap overflow-hidden truncate">
                      {user.deliveryPrice === "0"
                        ? "Grátis"
                        : `${user.deliveryPrice},00 R$`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col mt-4 gap-4 w-full ">
                  <label className="font-medium">Algum comentário?</label>
                  <textarea
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="Ex: tirar a cebola, maionese à parte etc."
                    className=" w-full h-20 p-2 justify-start items-start rounded-lg border border-gray-300"
                  ></textarea>
                </div>

                <AddCart
                  onClick={(quantity) => addOrderItem(product, quantity)}
                />
              </div>
            </div>
          ) : (
            <p>Loading product details...</p>
          )}
        </div>
      </Modal>

      <Modal show={showModalMarket} handleClose={handleCloseMarket}>
  <div className="flex gap-10 p-10">
    <div className="flex flex-col justify-center items-center gap-3">

    <div className="flex flex-col w-[500px] border border-gray-300 rounded-lg bg-white gap-4 text-black">
        <div className="flex flex-col w-full gap-2 justify-center items-start">
          
          <div className="px-4 py-3 items-center flex hover:bg-gray-50 w-full ">
            <div className="text-lg font-semibold flex flex-row items-center gap-5 text-center">          <Image
            className="rounded-full"
            src={user.path}
            width={40}
            height={40}
            alt={user.enterprise}
          />
          <div className="flex flex-col gap-1 justify-center items-start">
            <h1 className="font-semibold text-rs text-black">
              {user.enterprise} Catalão Centro
            </h1>

            <p className="text-red-600 text-sm cursor-pointer " onClick={handleCloseMarket}>Adicionar mais itens</p>
          </div>
          
          
          </div>
          </div>
          <hr className="border-gray-300 border-1 w-full" />
          
         
        </div>
      </div>
      
      <div className="flex flex-col w-[500px] border border-gray-300 rounded-lg bg-white gap-4 text-black">
        <div className="flex flex-col w-full gap-2 justify-center items-start">
          
          <div className="p-5 hover:bg-gray-50 w-full">
            <p className="text-lg font-semibold">Resumo do pedido</p>
          </div>
          <hr className="border-gray-300 border-1 w-full" />
          
          {/* Adicionando contêiner com rolagem */}
          <div className="flex flex-col gap-5 p-5 w-full max-h-[400px] overflow-y-auto">
            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item, index) => (
                <div key={index} className="flex w-full p-4 gap-4 items-start">
                  <Image
                    alt={item.product.name}
                    src={item.product.path}
                    width={50}
                    height={50}
                    className="rounded-md shadow-md"
                  />
                  <div className="flex flex-col justify-start items-start w-full max-w-xs">
                    <p className="text-sm font-bold uppercase w-full truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500 w-full truncate">
                      {item.product.description}
                    </p>
                    <p className="text-xs text-gray-400">Quantidade: {item.quantity}</p>
                    <p className="text-xs text-gray-500">Observação: {item.observation}</p>
                    <p className="text-sm text-green-600 font-semibold w-full truncate">
                      R$ {item.product.price},00
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum item no pedido.</p>
            )}
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col justify-center items-center gap-3">

    {menuAddress && <Address address={address} setAddress={setAddress} setSelectedAddress={setSelectedAddress} selectedAddress={selectedAddress}  />}

    
    <div className="flex gap-5">
              

              
              <div
                onClick={() => handleSelectOption("deliver")}
                className={`flex flex-col w-[200px] p-3 justify-center items-center border border-gray-300 rounded-lg bg-white gap-4 text-black cursor-pointer hover:border-purple-700
                  ${selectedOption === "deliver" ? "border-purple-700 " : ""}`} // Aplica estilização se for selecionado
              >
                Entregar no endereço
              </div>

             
              <div
                onClick={() => handleSelectOption("pickup")}
                className={`flex flex-col w-[200px] p-3 justify-center items-center border border-gray-300 rounded-lg bg-white gap-4 text-black cursor-pointer hover:border-purple-700
                  ${selectedOption === "pickup" ? "border-purple-700 " : ""}`} // Aplica estilização se for selecionado
              >
                Retirada no balcão
              </div>
            </div>


            <Payment payment={selectedPayment} setMarket={setShowModalMarket} setPayment={setSelectedPayment}/>

      <div className="flex flex-col w-[500px] border border-gray-300 rounded-lg bg-white gap-4 text-black">
        <div className="flex flex-col w-full gap-2 justify-center items-start">
          <div className="p-5 hover:bg-gray-50 w-full">
            <p className="text-lg font-semibold">Detalhes do pedido</p>
          </div>
          <hr className="border-gray-300 border-1 w-full" />
          <div className="flex flex-col gap-5 p-5 w-full">
            <div className="flex justify-between w-full">
              <p>Custo dos produtos</p>
              <p>R$ {productsTotal},00</p>
            </div>

            <div className="flex justify-between w-full">
              <p>Entrega</p>
              <p>R$ {deliveryPrice},00</p>
            </div>

            <div className="flex justify-between w-full">
              <p>Gorjeta do entregador</p>
              <p>R$ 0,00</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="font-bold">Total</p>
              <p className="font-bold">R$ {totalOrder},00</p>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={orderSubmit}
        className="flex w-[500px] border-gray-300 rounded-lg h-14 bg-purple-700 justify-center items-center font-semibold cursor-pointer"
      >
        Fazer um pedido
      </div>
    </div>
  </div>
</Modal>




      <div className="flex justify-between text-center justify-center items-center ">
        <div className="flex gap-3 items-center">
          <Link href={`/lojas`}>
            <IoArrowBackOutline className="text-black text-xl" />
          </Link>
          <Image
            className="rounded-full"
            src={user.path}
            width={80}
            height={80}
            alt={user.enterprise}
          />
          <h1 className="font-semibold text-2xl text-black">
            {user.enterprise} Catalão Centro
          </h1>
        </div>

        {market && (
          <div
            onClick={handleOpenMarket}
            className="fixed top-10 right-12 cursor-pointer  p-3 rounded-full bg-purple-700 z-50"
          >
            <FaCartShopping className="text-white text-2xl" />
          </div>
        )}
      </div>

      {categories.length > 0 ? (
        categories.map((category) => (
          <div
            key={category.id}
            className="bg-white relative border-gray-300 border w-full h-auto rounded-lg mt-5 p-5 flex flex-col"
          >
            <p className="text-black text-xl font-light">{category.category}</p>
            <div className="mt-5 flex flex-wrap gap-5">
              {groupedProducts[category.id]?.products.length > 0 ? (
                groupedProducts[category.id].products.map((product) => (
                  <div
                    key={product.productId}
                    onClick={() => handleOpen(product.productId)} // Corrected typo here
                    className="w-full sm:w-[460px] flex flex-col hover:border-purple-700 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 border-gray-300 border p-5 rounded-2xl relative"
                  >
                    <div className="flex flex-row-reverse justify-between items-center">
                      <Image
                        alt=""
                        src={product.path}
                        width={150}
                        height={150}
                      />

                      <div className="flex flex-col w-3/6">
                        <p className="text-black text-base mt-2">
                          {product.name}
                        </p>
                        <p className="text-black text-xs mt-4">
                          {product.description}
                        </p>
                        <p className="text-green-600 text-sm mt-4">
                          A partir de R$ {product.price},00
                        </p>
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
  );
}

export default RestaurantPage;
