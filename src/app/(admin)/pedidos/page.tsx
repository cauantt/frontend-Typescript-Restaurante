'use client';
import { api } from '@/app/services/api';
import React, { useEffect, useState } from 'react';
import Cookies from "cookies-js";
import { GoArrowRight } from "react-icons/go";
import Link from 'next/link';
import Modal from '@/app/components/Modal';
import { FaCheckCircle } from "react-icons/fa";
import {  FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { FaPix } from 'react-icons/fa6';
import { FaLocationDot } from "react-icons/fa6";

const paymentOptions = {
  pix: { label: "Pix", icon: <FaPix className='text-pix' /> },
  debt: { label: "Mastercard Débito", icon: <FaCreditCard className='text-blue-500' /> },
  credit: { label: "Mastercard Crédito", icon: <FaCreditCard className='text-red-500' /> },
  money: { label: "Dinheiro", icon: <FaMoneyBillWave className='text-green-600' /> },
  // Add new methods as needed
};

function Page() {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [showModal, setShowModal] = useState(false);
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
    const user = Cookies.get("userId");
    console.log('User ID:', user);

    const fetchOrder = async () => {
      try {
        const response = await api.get(`orders/${user}`);
        console.log('API Response:', response.data);
        setGroupedOrders(response.data);
      } catch (error) {
        console.log('Error fetching orders:', error);
      }
    };

    if (user) {
      fetchOrder();
    }

  }, []);

  return (
    <div className='flex flex-col '>
      {/* Modal component with selected order data */}
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
            <p className="text-gray-500">R$ {selectedOrder.total.toFixed(2)}</p>
            <p className="text-gray-500">
              {selectedOrder.establishment.deliveryPrice === 0 ? (
                <span className="text-green-600">Grátis</span>
              ) : (
                `R$ ${selectedOrder.establishment.deliveryPrice},00`
              )}
            </p>
            <p className="text-gray-600">
              R$ {parseInt(selectedOrder.total) + parseInt(selectedOrder.establishment.deliveryPrice)},00
            </p>
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


      
      <h2 className="text-black text-3xl mb-10">Histórico</h2>

      {Object.keys(groupedOrders).length > 0 ? (
        Object.keys(groupedOrders).map((date) => (
          <div key={date} className='mb-8 text-black'>
            <h3 className='text-lg font-semibold mb-4'>{new Date(date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <div className='flex flex-wrap gap-4'>
              {groupedOrders[date].map((order) => (
                <div key={order.id} className='bg-white shadow-md rounded-lg p-4 mb-4 w-full sm:w-1/2 lg:w-[450px]'> 
                  <div className='flex flex-col mb-2 gap-3'>
                    <Link key={order.establishment.userId} href={`/restaurantes/${order.establishment.userId}`}>
                      <div className='flex gap-5 hover:bg-gray-50 cursor-pointer p-2 justify-between items-center'>
                        <div className='flex text-center items-center gap-2'>
                          <img src={order.establishment.path} alt="Logo" className='h-12 w-12 rounded-full' />
                          <p>{order.establishment.enterprise}</p>
                        </div>
                        <GoArrowRight />
                      </div>
                    </Link>
                    <div className='ml-3 cursor-pointer' onClick={() => handleOpen(order)}>
                      <p className='font-semibold'>{order.establishmentName}</p>
                      <p className='text-sm text-gray-600'>Pedido Nº {order.id}</p>
                      <p className={`text-sm ${order.status === 'finalizado' ? 'text-green-500' : 'text-red-500'}`}>
                        {order.status}
                      </p>

                      {/* Check if orderItems is defined and render safely */}
                      {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                        <div className='mt-4 '>
                          <div className='text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap'>
                             {order.orderItems[0].quantity} - {order.orderItems[0].product.name}
                          </div>
                          {order.orderItems.length > 1 && (
                            <p className='text-sm font-semibold text-gray-600'>+ {order.orderItems.length - 1} itens</p>
                          )}
                        </div>
                      ) : (
                        <p className='text-sm text-gray-600'>Nenhum item no pedido</p>
                      )}
                    </div>
                  </div>
                  <p className='text-sm text-gray-600'>{order.itemCount} {order.itemDescription}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className='text-center text-gray-500'>Nenhum pedido encontrado</p>
      )}
    </div>
  );
}

export default Page;
