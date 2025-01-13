import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACTEZ-<span className='text-gray-700 font-semibold'>NOUS</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm '>

        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />

        <div className='flex flex-col justifu-center items-start gap-6 '>
          <p className='font-semibold text-lg text-gray-600'>NOTRE BUREAU</p>
          <p className='text-gray-500'>00000 Willms Station <br />Suite 000, Washington, États-Unis</p>
          <p className='text-gray-500'>Téléphone: (000) 000-0000 <br />Mail: adamdev-16@hotmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>CARRIÈRES CHEZ SIBTBIB</p>
          <p className='text-gray-500'>En savoir plus sur nos équipes et nos offres d'emploi.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explorez Emplois</button>
        </div>
      </div>
    </div>
  )
}

export default Contact