'use client';
import React, { useEffect, useState } from 'react';
import { IoLocationSharp } from "react-icons/io5";
import { api } from '../services/api';
import nookies from 'nookies';
import ModalAddress from './ModalAddress';

function Address({ address, setAddress, setSelectedAddress,selectedAddress }) {
  const [customerId, setCustomerId] = useState<string | null>("");
  const [showModalAddress, setShowModalAddress] = useState(false);
  const [test,setTest] = useState(false)

  const handleCloseAddress = () => {
    setShowModalAddress(false)
  };

  const handleOpenAddress = () => {
    setShowModalAddress(true)
  };

  useEffect(() => {
    const cookies = nookies.get(null); // 'null' significa que será no lado do cliente
    const savedCustomer = cookies.userId;
    if (savedCustomer) {
      setCustomerId(savedCustomer);
    }
  }, []);

  useEffect(() => {
    if (customerId) {
      const fetchAddress = async () => {
        try {
          const response = await api.get(`address/${customerId}`);
          setAddress(response.data);
          setSelectedAddress(response.data[0]);
          console.log(response.data)
        } catch (error) {
          console.log('Error fetching address:', error);
        }
      };
      fetchAddress();
    }
  }, [customerId,test]);

  return (
    <div className="flex w-[420px] p-3 justify-between items-center border border-gray-300 rounded-lg bg-white gap-4 text-black cursor-pointer hover:border-purple-700 px-4">
      <ModalAddress show={showModalAddress} setTest={setTest}  test={test} handleClose={handleCloseAddress} address={address} setSelectedAddress={setSelectedAddress} setShow={setShowModalAddress}/>
      <div className="gap-2 flex justify-center items-center">
        <IoLocationSharp className="text-3xl" />
        <div className="flex flex-col text-sm">
          {selectedAddress ? (
            <>
              <p>R. {selectedAddress.street}, {selectedAddress.number}</p>
              <p>{selectedAddress.district} - {selectedAddress.complement}</p>
            </>
          ) : (
            <p>Loading address...</p>
          )}
        </div>
      </div>
      <p className="text-red-500 font-semibold text-sm" onClick={handleOpenAddress}>Trocar</p>
    </div>
  );
}

export default Address;
