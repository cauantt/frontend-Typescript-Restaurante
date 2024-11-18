'use client'

import { api } from '@/app/services/api';
import React, { useEffect, useState } from 'react';
import Cookies from "cookies-js";
import { MdDeliveryDining } from "react-icons/md";
import { FaHotTubPerson } from "react-icons/fa6";
import Link from 'next/link';
import Modal from '@/app/components/Modal';
import { FaCheckCircle } from "react-icons/fa";
import {  FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { FaPix } from 'react-icons/fa6';
import { FaLocationDot } from "react-icons/fa6";
import { sendMessage } from '@/app/services/apievo';


const paymentOptions = {
    pix: { label: "Pix", icon: <FaPix className='text-pix' /> },
    debt: { label: "Mastercard Débito", icon: <FaCreditCard className='text-blue-500' /> },
    credit: { label: "Mastercard Crédito", icon: <FaCreditCard className='text-red-500' /> },
    money: { label: "Dinheiro", icon: <FaMoneyBillWave className='text-green-600' /> },
    // Add new methods as needed
  };

function Page() {
    const [orders, setOrders] = useState(null);
    const [messaorder,setMessageOrder] = useState(null)
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]); // Estado para os pedidos selecionados
    const [selectAllStatus, setSelectAllStatus] = useState({}); // Estado para checkbox de todos por status
    const [selectedOrder, setSelectedOrder] = useState(null);  // State for the selected order

    const handleOpen = (order) => {
        setSelectedOrder(order);  // Set the selected order
        setShowModal(true);        // Open the modal
      };
    
      const handleClose = () => {
        setShowModal(false);  // Close the modal
        setSelectedOrder(null); // Clear the selected order
      };
      

    useEffect(() => {
        

        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const user = Cookies.get("userId");
        console.log('User ID from cookie:', user); // Check if the user ID is being retrieved
        setUserId(user);

        if (user) {
            try {
                const response = await api.get(`/orders?userId=${user}`);
                setOrders(response.data);
                console.log('Fetched orders:', response.data);
            } catch (error) {
                setError('Failed to fetch orders');
            }
        }
    };

    // Utility function to format date and calculate time ago
    const formatDateAndTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);

        return `${formattedDate} `;
    };

    // Function to categorize orders by status
    const getOrdersByStatus = (status) => {
        if (!orders) return [];
        return orders.filter(order => order.status === status);
    };

    // Função para lidar com a seleção de pedidos
    const handleSelectOrder = (order) => {
        setMessageOrder(order);
        setSelectedOrders([order.id]); // Substitui o array de selecionados com o ID do item atual
    };
    

    const updateOrderStatus = async (orderStatus) => {

        
        const updatedOrders = selectedOrders.map(orderId => {
            const order = orders.find(o => o.id === orderId);
            let newStatus;
    
            // Definir novo status com base no status atual
           
            switch (order.status) {
                case 'pendente':

                    newStatus = 'aceito';
                    if (orderStatus.address && orderStatus.address.district) {
                    sendMessage(orderStatus.customer.phone, `Confirmação de Pedido - ${orderStatus.establishment.enterprise} \n\nOlá ${orderStatus.customer.enterprise}, seu pedido #${orderStatus.id} foi recebido com sucesso!\n\nPreço Total: R$ ${orderStatus.total},00 \n\nEndereço de Entrega: ${orderStatus.address.district}, R.${orderStatus.address.street} - N.${orderStatus.address.number}\n\nEm caso de dúvidas, estamos à disposição!\n\nObrigado por escolher ${orderStatus.establishment.enterprise}`);}

                    else {

                        
                        sendMessage(orderStatus.customer.phone, `Confirmação de Pedido - ${orderStatus.establishment.enterprise} \n\nOlá ${orderStatus.customer.enterprise}, seu pedido #${orderStatus.id} foi recebido com sucesso!\n\nPreço Total: R$ ${orderStatus.total},00 \n\nRetirada no estabelecimento\n\nEm caso de dúvidas, estamos à disposição!\n\nObrigado por escolher ${orderStatus.establishment.enterprise}`)
                    }


                    break;
                case 'aceito':
                    newStatus = 'delivery'
                     {orderStatus.delivery === false ? (
                      sendMessage(orderStatus.customer.phone, `Seu Pedido Está pronto!\n\nOlá ${orderStatus.customer.enterprise}, seu pedido #${orderStatus.id} já está aguardando ser retirado\n\nObrigado por confiar na gente!.`)
              ) : (
               
                sendMessage(orderStatus.customer.phone, `Seu Pedido Está a Caminho!\n\nOlá ${orderStatus.customer.enterprise}, seu pedido #${orderStatus.id} já saiu para entrega! Em breve, você o receberá no endereço informado\n\nObrigado por confiar na gente!.`)
              )}
                    


                    break;
                    
                case 'delivery':
                    newStatus = 'finalizado';
                    sendMessage(orderStatus.customer.phone, `Seu pedido #${orderStatus.id} foi finalizado com sucesso! Agradecemos pela sua compra e esperamos que tenha uma ótima experiência com nossos produtos.\n\nSe precisar de qualquer assistência, estamos à disposição.`);


                    break;
                default:
                    

            }
            
            
            return { id: orderId, status: newStatus }; // Cria um objeto para atualizar
        }).filter(Boolean); // Remove valores nulos
    
        try {
            const promises = updatedOrders.map(order => {
                return api.patch(`/orders/${order.id}`, { status: order.status }); // Chamada PATCH para atualizar status
            });
            await Promise.all(promises); // Aguarda todas as atualizações
            // Recarrega as ordens após a atualização
            fetchOrders()
            setSelectedOrders([]); // Limpa a seleção após a atualização
        } catch (error) {
            console.error('Erro ao atualizar ordens:', error);
            setError('Falha ao atualizar ordens');
        }
    };

    
    // Função para selecionar ou desmarcar todos os pedidos de um status
    const handleSelectAll = (status) => {
        const ordersByStatus = getOrdersByStatus(status);
        const allIds = ordersByStatus.map(order => order.id);

        setSelectAllStatus((prevState) => ({
            ...prevState,
            [status]: !prevState[status] // Alterna a seleção do status
        }));

        if (!selectAllStatus[status]) {
            // Se não estiver marcado, seleciona todos
            setSelectedOrders((prevSelected) => [...new Set([...prevSelected, ...allIds])]);
        } else {
            // Se estiver marcado, remove todos
            setSelectedOrders((prevSelected) => prevSelected.filter(id => !allIds.includes(id)));
        }
    };

    // Função para verificar se um pedido está selecionado
    const isSelected = (orderId) => selectedOrders.includes(orderId);

    return (
        <div className='flex flex-col h-full overflow-hidden'>  


<Modal show={showModal} handleClose={handleClose}>
  <div className="flex flex-col p-5 gap-4 text-black">
    <p className="text-black text-lg">Detalhes do pedido</p>
    {/* Display order details in the modal */}
    {selectedOrder && (
      <div className="flex flex-col">
        <div className="flex text-center items-center gap-2 justify-start">
          <img
            src={selectedOrder.establishment.path}
            alt="Logo"
            className="h-12 w-12 rounded-full"
          />
          <div className="flex flex-col justify-start items-start">
            <p>{selectedOrder.establishment.enterprise}</p>
            <div className="flex gap-2">
              <p>Pedido: {selectedOrder.id} -</p>
              <p>
                {new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Link
              key={selectedOrder.establishment.userId}
              href={`/restaurantes/${selectedOrder.establishment.userId}`}
            >
              <p className="text-red-600 text-sm cursor-pointer">
                Ver cardápio
              </p>
            </Link>
          </div>
        </div>

        <div className="p-2 rounded-lg flex justify-center items-center w-full bg-gray-100 mt-5 mb-5 gap-2">
          {/* Conditionally render icon based on order status */}
          {selectedOrder.status === 'finalizado' && (
            <FaCheckCircle className="text-green-600" />
          )}
          <p>
            Status: <span>{selectedOrder.status} às {new Date(selectedOrder.updatedAt).toLocaleTimeString('pt-BR')}</span>
          </p>
        </div>

        <p>
          <strong>Itens:</strong>
        </p>
        <ul>
          {selectedOrder.orderItems.map((item, index) => (
            <li
              key={index}
              className="text-sm text-gray-600 flex items-center gap-4 mt-5"
            >
              <img
                src={item.product.path}
                alt={item.product.name}
                className="h-16 w-16 object-cover rounded-full"
              />
              {/* Display product image */}
              <div>
                <p>
                  {item.quantity} - {item.product.name}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 p-4 gap-2 rounded-lg bg-gray-50 w-full flex justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">
              <strong>Total do Pedido:</strong>
            </p>
            <p className="text-sm text-gray-500">
              <strong>Preço da entrega:</strong>
            </p>
            <p className="text-sm text-gray-600">
              <strong>Total Final:</strong>
            </p>
            <p className="flex items-center">
              {paymentOptions[selectedOrder.payment] ? (
                <>
                  {paymentOptions[selectedOrder.payment].icon}
                  <span className="ml-2">
                    {paymentOptions[selectedOrder.payment].label}
                  </span>
                </>
              ) : (
                "Método de pagamento desconhecido"
              )}
            </p>
          </div>
          <div className="flex flex-col text-right gap-2 justify-start items-start">
            <p className="text-gray-500">R$ {parseInt(selectedOrder.total) - parseInt(selectedOrder.establishment.deliveryPrice)},00</p>
            <p className="text-gray-500">
              {selectedOrder.delivery === false ? (
                <span className="text-green-600">Grátis</span>
              ) : (
                `R$ ${selectedOrder.establishment.deliveryPrice},00`
              )}
            </p>

            {selectedOrder.delivery === false ? (
               <p className="text-gray-600">
              
               R$ {parseInt(selectedOrder.total) - parseInt(selectedOrder.establishment.deliveryPrice)},00
             </p>
              ) : (
                <p className="text-gray-600">
              
              R$ {parseInt(selectedOrder.total) },00
            </p>
              )}
            
          </div>
        </div>

        {/* Check if address exists before rendering */}
        {selectedOrder.address ? (
          <>
            <p className="mt-5 mb-5">
              <strong>Endereço de entrega:</strong>
            </p>
            <div className="flex gap-3">
              <FaLocationDot className="mt-3 text-lg" />
              <div className="flex flex-col">
                <p>
                  R. {selectedOrder.address.street}, {selectedOrder.address.number}
                </p>
                <p className="text-sm">
                  R. {selectedOrder.address.district}, {selectedOrder.address.city}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-5 mb-5 text-gray-500">
            <strong>Retirada no estabelecimento</strong>  
          </p>
        )}
      </div>
    )}
  </div>
</Modal>

            {error && <p className="text-red-500">{error}</p>}
            <button onClick={async (event) => {
  event.preventDefault(); // Prevent the default action if necessary
  await updateOrderStatus(messaorder); // Call the async function
}}
 className='w-48 self-end mb-4 rounded-md cursor-pointer bg-green-500 text-white py-2 rounded'>
            Atualizar Status
        </button>

            <div className='flex gap-4 flex-grow'>
                {/* Pendente */}
                <div className='flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col text-black'>
                    <div className='flex items-center justify-center w-full'>
                    {/*/<input 
                            type="checkbox" 
                            className='w-4'
                            checked={selectAllStatus['pendente'] || false} 
                            onChange={() => handleSelectAll('pendente')} 
                        />*/}
                        <div className='flex w-full justify-center items-center'>
                            <h3 className='text-lg font-semibold mb-5 text-center'>
                                Pendente
                            </h3>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 flex-grow overflow-y-auto max-h-[calc(100vh-150px)]'>
                        {getOrdersByStatus('pendente').map(order => (
                            <div key={order} className='bg-gray-100 p-3 rounded-lg h-[170px] flex justify-between'>
                                <div className="flex flex-col gap-3 w-full">
                                    <div className='flex justify-between w-full'>
                                        <div className='flex gap-3'>
                                            <input
                                                type="checkbox"
                                                checked={isSelected(order.id)}
                                                onChange={() => handleSelectOrder(order)}
                                            />
                                            <p className='text-sm font-medium text-black'>{order.id} - {order.customer.enterprise}</p>
                                        </div>
                                        <p className='text-sm font-medium text-black'>{formatDateAndTimeAgo(order.createdAt)}</p>
                                    </div>
                                    {order.delivery === true ? (
                                            <div className='flex gap-3 flex-col'>
                                            <p className='text-sm font-medium text-black'>R${order.total},00 - {order.address.district}</p>
                                            <p className='text-sm font-medium text-black'>{order.address.street} - N. {order.address.number}</p>
                                        </div>
                                        ) : (
                                            <div className='flex gap-3 flex-col'>
                                            <p className='text-sm font-medium text-black'>R${order.total},00 - Retirada no balcão</p>
                                            <p className='text-sm font-medium text-black'>Sem endereço</p>
                                        </div>
                                        )}
                                    <div className='flex justify-between gap-2 items-center'>
                                        <div className="w-8 h-8 flex justify-center items-center text-2xl text-white bg-red-600">
                                        {order.delivery === true ? (
                                            <div className="w-8 h-8 flex justify-center items-center text-2xl text-white bg-red-600">
                                                <MdDeliveryDining />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 flex justify-center items-center text-2xl text-white bg-blue-600">
                                                <FaHotTubPerson />
                                            </div>
                                        )}
                                        </div>
                                        <div className='w-14 h-10 bg-blue-500 mr-3 cursor-pointer text-white justify-center items-center rounded-md flex' onClick={() => handleOpen(order)}>ver</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Aceito */}
                <div className='flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col text-black'>
                    <div className='flex items-center justify-center w-full'>
                         {/*<input 
                            type="checkbox" 
                            className='w-4'
                            checked={selectAllStatus['aceito'] || false} 
                            onChange={() => handleSelectAll('aceito')} 
                        />*/}
                        <div className='flex w-full justify-center items-center'>
                            <h3 className='text-lg font-semibold mb-5 text-center'>
                                Aceito
                            </h3>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 flex-grow overflow-y-auto max-h-[calc(100vh-150px)]'>
                        {getOrdersByStatus('aceito').map(order => (
                            <div key={order.id} className='bg-gray-100 p-3 h-[170px] rounded-lg flex justify-between'>
                                <div className="flex flex-col gap-3 w-full">
                                    <div className='flex justify-between w-full'>
                                        <div className='flex gap-3'>
                                        <input
                                                type="checkbox"
                                                checked={isSelected(order.id)}
                                                onChange={() => handleSelectOrder(order)}
                                            />
                                            <p className='text-sm font-medium text-black'>{order.id} - {order.customer.enterprise}</p>
                                        </div>
                                        <p className='text-sm font-medium text-black'>{formatDateAndTimeAgo(order.createdAt)}</p>
                                    </div>
                                        
                                    {order.delivery === true ? (
                                            <div className='flex gap-3 flex-col'>
                                            <p className='text-sm font-medium text-black'>R${order.total},00 - {order.address.district}</p>
                                            <p className='text-sm font-medium text-black'>{order.address.street} - N. {order.address.number}</p>
                                        </div>
                                        ) : (
                                            <div className='flex gap-3 flex-col'>
                                            <p className='text-sm font-medium text-black'>R${order.total},00 - Retirada no balcão</p>
                                            <p className='text-sm font-medium text-black'>Sem endereço</p>
                                        </div>
                                        )}
                                    

                                    <div className='flex justify-between gap-2 items-center '>
                                        {order.delivery === true ? (
                                            <div className="w-8 h-8 flex justify-center items-center text-2xl text-white bg-red-600">
                                                <MdDeliveryDining />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 flex justify-center items-center text-2xl text-white bg-blue-600">
                                                <FaHotTubPerson />
                                            </div>
                                        )}
                                        <div className='w-14 h-10 bg-blue-500 mr-3 cursor-pointer text-white justify-center items-center rounded-md flex' onClick={() => handleOpen(order)}>ver</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Saiu para Entrega */}
                <div className='flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col text-black'>
                    <div className='flex items-center justify-center w-full'>
                         {/*<input 
                            type="checkbox" 
                            className='w-4'
                            checked={selectAllStatus['delivery'] || false} 
                            onChange={() => handleSelectAll('delivery')} 
                        />*/}
                        <div className='flex w-full justify-center items-center'>
                            <h3 className='text-lg font-semibold mb-5 text-center'>
                                Saiu para entrega
                            </h3>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 flex-grow overflow-y-auto max-h-[calc(100vh-150px)]'>
                        {getOrdersByStatus('delivery').map(order => (   
                            <div key={order.id} className='bg-gray-100 p-3  h-[170px] rounded-lg flex justify-between'>
                                <div className="flex flex-col gap-3 w-full">
                                    <div className='flex justify-between w-full'>
                                        <div className='flex gap-3'>
                                        <input
                                                type="checkbox"
                                                checked={isSelected(order.id)}
                                                onChange={() => handleSelectOrder(order)}
                                            />
                                            <p className='text-sm font-medium text-black'>{order.id} - {order.customer.enterprise}</p>
                                        </div>
                                        <p className='text-sm font-medium text-black'>{formatDateAndTimeAgo(order.createdAt)}</p>
                                    </div>
                                    {order.delivery === true ? (
                                            <div className='flex gap-3 flex-col'>
                                            <p className='text-sm font-medium text-black'>R${order.total},00 - {order.address.district}</p>
                                            <p className='text-sm font-medium text-black'>{order.address.street} - N. {order.address.number}</p>
                                        </div>
                                        ) : (
                                            <div className='flex gap-3 flex-col'>
                                            <p className='text-sm font-medium text-black'>R${order.total},00 - Retirada no balcão</p>
                                            <p className='text-sm font-medium text-black'>Sem endereço</p>
                                        </div>
                                        )}
                                    <div className='flex justify-between gap-2 items-center'>
                                        {order.delivery === true ? (
                                            <div className="w-8 h-8 flex justify-center items-center text-2xl text-white bg-red-600">
                                                <MdDeliveryDining />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 flex justify-center items-center text-2xl text-white bg-blue-600">
                                                <FaHotTubPerson />
                                            </div>
                                        )}
                                        <div className='w-14 h-10 bg-blue-500 mr-3 cursor-pointer text-white justify-center items-center rounded-md flex' onClick={() => handleOpen(order)}>ver</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
