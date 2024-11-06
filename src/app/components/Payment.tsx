import React, { useState } from 'react'
import { FaPix, FaCreditCard } from "react-icons/fa6"; // Adicione os ícones que precisar
import { FaMoneyBillWave } from "react-icons/fa";
import ModalPayment from './ModalPayment';
// Mapeamento dos métodos de pagamento para icones e nomes



const paymentOptions = {
  pix: { label: "Pix", icon: <FaPix className='text-pix' /> },
  debt: { label: "Mastercard Débito", icon: <FaCreditCard className='text-blue-500' /> },
  credit: { label: "Mastercard Crédito", icon: <FaCreditCard className='text-red-500' />},
  money: { label: "Dinheiro", icon: <FaMoneyBillWave  className='text-green-600'/>}
  // Adicione novos métodos conforme necessário
};



function Payment({ payment,setMarket,setPayment }) {
  const paymentInfo = paymentOptions[payment] || {};
  const [modalPayment,setModalPayment] = useState(false)
  const [selectedOption, setSelectedOption] = useState("online")
  const [selectedPayment, setSelectedPayment] = useState("pix")
  const [modalOptionsHome,setModalOptionsHome] = useState(false)
  


  const handleSelectOption = (option) => {
    setSelectedOption(option);

    if (option === "home") {
      

      setModalOptionsHome(true)
      
    } else {

      setModalOptionsHome(false)

    }
  };

  const handleSelectPayment = (option) => {
    setSelectedPayment(option);
    setPayment(option)
    setModalPayment(false)

    
  };

  const handleopenshowModal = () =>{

    setModalPayment(true)
    setMarket(true)
  
  
  }
  
  const handleClose = () => {
    setModalPayment(false);
    setMarket(true)
    
    
  };
  
  return (
    <div className="flex w-[420px] p-3 justify-between items-center border border-gray-300 rounded-lg bg-white gap-4 text-black cursor-pointer hover:border-purple-700 px-4">

      <ModalPayment show={modalPayment} handleClose={handleClose}>
        
        
      <div className='flex flex-col gap-5 justify-center items-center'>
       
              <div className="flex flex-col w-[500px] border border-gray-300 rounded-lg bg-white gap-4 text-black">
          <div className="flex flex-col w-full gap-2 justify-center items-start">
        
            <div className="p-5 hover:bg-gray-50 w-full flex justify-center items-center">
            <div className="flex gap-2">
        
        
        <div
          onClick={() => handleSelectOption("home")}
          className={`flex flex-col w-[200px] p-3 justify-center items-center border border-gray-300 rounded-lg bg-white gap-4 text-black cursor-pointer hover:border-purple-700
            ${selectedOption === "home" ? "border-purple-700 " : ""}`} // Aplica estilização se for selecionado
        >
          Pagar na entrega
        </div>

        <div
          onClick={() => handleSelectOption("online")}
          className={`flex flex-col w-[200px] p-3 justify-center items-center border border-gray-300 rounded-lg bg-white gap-4 text-black cursor-pointer hover:border-purple-700
            ${selectedOption === "online" ? "border-purple-700 " : ""}`} // Aplica estilização se for selecionado
        >
          Pagar online
        </div>
      </div>
            </div>
            <hr className="border-gray-300 border-1 w-full" />
        
            
            {modalOptionsHome ? (<div className="flex flex-col  w-full">
              

            <div className={`flex flex-col gap-5 p-5 w-full border hover:border-purple-500 overflow-y-auto rounded-md ${selectedPayment === "pix" ? " " : ""}`}  onClick={() => handleSelectPayment("pix")}>
            <div className='flex gap-3  items-center'>
              <FaPix className='text-pix' /> <p>Pix</p>
            </div>
            </div>
            <div className={`flex flex-col gap-5 p-5 w-full border hover:border-purple-500 overflow-y-auto rounded-md ${selectedPayment === "money" ? " " : ""}`}  onClick={() => handleSelectPayment("money")}>
              <div className='flex gap-3  items-center'>
              <FaMoneyBillWave className='text-green-600' /> <p>Dinheiro</p>
            </div>
            </div>
            <div className={`flex flex-col gap-5 p-5 w-full border hover:border-purple-500 overflow-y-auto rounded-md ${selectedPayment === "debt" ? " " : ""}`}  onClick={() => handleSelectPayment("debt")}>
            <div className='flex gap-3  items-center'>
              <FaCreditCard className='text-blue-500' /> <p>Mastercard Débito</p>
            </div>
            </div>
            <div className={`flex flex-col gap-5 p-5 w-full border hover:border-purple-500 overflow-y-auto rounded-md ${selectedPayment === "credit" ? " " : ""}`}  onClick={() => handleSelectPayment("credit")}>
            <div className='flex gap-3  items-center'>
              <FaCreditCard className='text-red-500' /> <p>Mastercard Crédito</p>
            </div>
            </div>
            
            </div>) : (<div className="flex flex-col w-full"> 
              <div className={`flex flex-col gap-5 p-5 w-full border hover:border-purple-500 overflow-y-auto rounded-md ${selectedPayment === "pix" ? " " : ""}`}  onClick={() => handleSelectPayment("pix")}>
              <div className='flex gap-3  items-center'>
              <FaPix className='text-pix' /> <p>Pix</p>
            </div>
            </div><div className={`flex flex-col gap-5 p-5 w-full border hover:border-purple-500 overflow-y-auto rounded-md ${selectedPayment === "debt" ? " " : ""}`}  onClick={() => handleSelectPayment("debt")}>
            <div className='flex gap-3  items-center'>
              <FaCreditCard className='text-blue-500' /> <p>Mastercard Débito</p>
            </div>
            </div><div className={`flex flex-col gap-5 p-5 w-full border hover:border-purple-500 overflow-y-auto rounded-md ${selectedPayment === "credit" ? " " : ""}`}  onClick={() => handleSelectPayment("credit")}>
            <div className='flex gap-3  items-center'>
              <FaCreditCard className='text-red-500' /> <p>Mastercard Crédito</p>
            </div>
            </div>
            </div>)}
            
          </div>
        </div>
        
      </div>
      
      </ModalPayment>
      <div className="gap-2 flex justify-center items-center">
        <div className="flex flex-col gap-3 text-sm">
          <p className='text-xs text-black font-bold'>Forma de pagamento</p>
          
          {paymentInfo.label ? (
            <div className='flex gap-2 items-center'>
              {paymentInfo.icon}
              <p className='text-sm'>{paymentInfo.label}</p>
            </div>
          ) : (
            <p className='text-sm text-red-500'>Método não disponível</p>
          )}
        </div>
      </div>
      <div className='flex flex-col'>
        <p className="text-red-500 font-semibold text-sm cursor-pointer" onClick={handleopenshowModal}>Trocar</p>
      </div>
    </div>
  );
}

export default Payment;
