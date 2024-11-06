import React from 'react'

export default function Button({text}) {
  return (
    <button type='submit'   className='bg-padrao rounded-full text-white font-bold p-2'>{text}</button>
  )
}
