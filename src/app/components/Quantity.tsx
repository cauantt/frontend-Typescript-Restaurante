import React from 'react'
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";

function Quantity() {
  return (
    <div className=' text-black  w-28 h-10 bg-transparent border border-black rounded-md items-center justify-around flex cursor-pointer'>
        

    <FaMinus className='text-red-600'/>
    <p>1</p>
    <FaPlus className='text-red-600'/>
  
</div>
  )
}

export default Quantity
