'use client'

import { api } from '@/app/services/api';
import React, { useEffect, useState } from 'react';
import Cookies from "cookies-js";
import { MdDeliveryDining } from "react-icons/md";
import { FaHotTubPerson } from "react-icons/fa6";

function Page() {
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    const [selectedOrders, setSelectedOrders] = useState([]); // Estado para os pedidos selecionados
    const [selectAllStatus, setSelectAllStatus] = useState({}); // Estado para checkbox de todos por status

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
    const handleSelectOrder = (orderId) => {
        setSelectedOrders((prevSelected) => {
            if (prevSelected.includes(orderId)) {
                return prevSelected.filter(id => id !== orderId); // Remove da lista
            } else {
                return [...prevSelected, orderId]; // Adiciona à lista
            }
        });
    };

    const updateOrderStatus = async () => {
        const updatedOrders = selectedOrders.map(orderId => {
            const order = orders.find(o => o.id === orderId);
            let newStatus;
    
            // Definir novo status com base no status atual
            switch (order.status) {
                case 'pendente':
                    newStatus = 'aceito';
                    break;
                case 'aceito':
                    newStatus = 'delivery';
                    break;
                case 'delivery':
                    newStatus = 'finalizado';
                    break;
                default:
                    return null; // Se o status não é um dos esperados, ignoramos
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
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={updateOrderStatus} className='w-48 self-end mb-4 rounded-md cursor-pointer bg-green-500 text-white py-2 rounded'>
            Atualizar Status
        </button>

            <div className='flex gap-4 flex-grow'>
                {/* Pendente */}
                <div className='flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col text-black'>
                    <div className='flex items-center justify-center w-full'>
                        <input 
                            type="checkbox" 
                            className='w-4'
                            checked={selectAllStatus['pendente'] || false} 
                            onChange={() => handleSelectAll('pendente')} 
                        />
                        <div className='flex w-full justify-center items-center'>
                            <h3 className='text-lg font-semibold mb-5 text-center'>
                                Pendente
                            </h3>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 flex-grow overflow-y-auto max-h-[calc(100vh-150px)]'>
                        {getOrdersByStatus('pendente').map(order => (
                            <div key={order.id} className='bg-gray-100 p-3 rounded-lg h-[170px] flex justify-between'>
                                <div className="flex flex-col gap-3 w-full">
                                    <div className='flex justify-between w-full'>
                                        <div className='flex gap-3'>
                                            <input
                                                type="checkbox"
                                                checked={isSelected(order.id)}
                                                onChange={() => handleSelectOrder(order.id)}
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
                                                <MdDeliveryDining />
                                            ) : (
                                                <span><FaHotTubPerson /></span>
                                            )}
                                        </div>
                                        <div className='w-14 h-10 bg-blue-500 mr-3 cursor-pointer text-white justify-center items-center rounded-md flex'>ver</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Aceito */}
                <div className='flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col text-black'>
                    <div className='flex items-center justify-center w-full'>
                        <input 
                            type="checkbox" 
                            className='w-4'
                            checked={selectAllStatus['aceito'] || false} 
                            onChange={() => handleSelectAll('aceito')} 
                        />
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
                                                onChange={() => handleSelectOrder(order.id)}
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
                                        <div className='w-14 h-10 bg-blue-500 mr-3 cursor-pointer text-white justify-center items-center rounded-md flex'>ver</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Saiu para Entrega */}
                <div className='flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col text-black'>
                    <div className='flex items-center justify-center w-full'>
                        <input 
                            type="checkbox" 
                            className='w-4'
                            checked={selectAllStatus['delivery'] || false} 
                            onChange={() => handleSelectAll('delivery')} 
                        />
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
                                                onChange={() => handleSelectOrder(order.id)}
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
                                        <div className='w-14 h-10 bg-blue-500 mr-3 cursor-pointer text-white justify-center items-center rounded-md flex'>ver</div>
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
