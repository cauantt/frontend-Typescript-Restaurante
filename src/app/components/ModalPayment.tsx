import React from 'react';

const ModalPayment = ({ show, handleClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-50" onClick={handleClose}>
       
      <div className="bg-white  rounded-lg shadow-lg relative p-10" onClick={(e) => e.stopPropagation()}>
        {/* Botão de Fechar */}
        <button 
          onClick={handleClose} 
          className="absolute top-2 right-4 text-black text-xl font-bold"
        >
          &times;
        </button>

        {/* Conteúdo do Modal */}
        {children}
      </div>
    </div>
  );
};

export default ModalPayment;
