'use client';
import { api } from '@/app/services/api';
import React, { useEffect, useState } from 'react';
import Cookies from "cookies-js";
import { GoArrowRight } from "react-icons/go";
import Link from 'next/link';

function Page() {
  const [groupedOrders, setGroupedOrders] = useState({});

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
                    <div className='ml-3'>
  <p className='font-semibold'>{order.establishmentName}</p>
  <p className='text-sm text-gray-600'>Pedido Nº {order.id}</p>
  <p className={`text-sm  ${order.status === 'finalizado' ? 'text-green-500' : 'text-red-500'}`}>
    {order.status}
  </p>

  {/* Check if orderItems is defined and render safely */}
  {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
    <div className='mt-4'>
      {/* Show the first product with ellipsis if too long */}
      <div className='text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap'>
         {order.orderItems[0].quantity  } -  {order.orderItems[0].product.name}
      </div>
      {/* Check if there are more items */}
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
                  <div className='flex space-x-1 mt-2'>
                    {/* Star rating could be added here if needed */}
                  </div>
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
