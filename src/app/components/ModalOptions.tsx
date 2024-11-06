import React from 'react';

const ModalOptions = ({ show, handleClose, position, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={handleClose}>
      <div 
        className="bg-white p-3  rounded-lg shadow-lg absolute" 
        // Mover o modal 20 pixels para a esquerda
        style={{ top: position.top, left: position.left - 20 }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {/* Modal content */}
        {children}
      </div>
    </div>
  );
};

export default ModalOptions;
