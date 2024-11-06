import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";



function AddCart({onClick}) {

    const [quantity,setQuantity] = useState(1)

    const Add = () =>{

        setQuantity(quantity+1);

    }

    const Minus = () =>{

        if (quantity > 1) {

            setQuantity(quantity-1);

        }


    }


  return (
    <div className='h-full flex  gap-2 justify-end items-end w-full'   >
       
        
        <div className=' text-black  w-28 h-10 bg-transparent border border-black rounded-md items-center justify-around flex cursor-pointer'>
            
        
        <div onClick={Minus}>
            <FaMinus className='text-purple-700'/>
        </div>
        <p>{quantity}</p>

        <div onClick={Add}>
            <FaPlus className='text-purple-700'/>
        </div>
        
        </div>

        <button onClick={() => onClick(quantity)} className=' text-white  w-40 h-10 bg-purple-700 rounded-md items-center justify-center flex cursor-pointer'>
        
        adicionar
    
    </button>
    </div>
  )
}

export default AddCart
