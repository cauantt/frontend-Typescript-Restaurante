import React from 'react';

function MenuComponent({ option, Icon }) {
  return (
    <div className='border border-transparent hover:border-purple-800 h-10 flex pl-3 gap-4 items-center cursor-pointer rounded-md'>
      {/* Renderiza o ícone se ele for passado */}
      {Icon && <Icon className="text-black" />}
      <p className='text-black'>{option}</p>
    </div>
  );
}

export default MenuComponent;
