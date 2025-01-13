import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>À PROPOS DE <span className='text-gray-700 font-medium'>NOUS</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Bienvenue chez Sibtbib, votre partenaire de confiance pour gérer vos besoins de santé de manière pratique et efficace. Chez Sibtbib, nous comprenons les défis auxquels les individus sont confrontés lorsqu'il s'agit de planifier des rendez-vous chez le médecin et de gérer leurs dossiers de santé.</p>
          <p>Sibtbib s'engage à l'excellence dans la technologie des soins de santé. Nous nous efforçons continuellement d'améliorer notre plate-forme, en intégrant les dernières avancées pour améliorer l'expérience utilisateur et offrir un service supérieur. Que vous preniez votre premier rendez-vous ou que vous gériez des soins continus, Sibtbib est là pour vous aider à chaque étape du processus.</p>
          <b className='text-gray-800'>Notre Vision</b>
          <p>Notre vision chez Sibtbib est de créer une expérience de soins de santé transparente pour chaque utilisateur. Nous visons à combler le fossé entre les patients et les fournisseurs de soins de santé, ce qui vous permet d'accéder plus facilement aux soins dont vous avez besoin, quand vous en avez besoin.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>POURQUOI <span className='text-gray-700 font-semibold'>NOUS CHOISIR ?</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICACITÉ:</b>
          <p>Planification des rendez-vous simplifiée qui s'intègre dans votre style de vie occupé.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>COMMODITÉ:</b>
          <p>Accès à un réseau de professionnels de la santé de confiance dans votre région.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONNALISATION:</b>
          <p>Recommandations et rappels personnalisés pour vous aider à rester au top de votre santé.</p>
        </div>
      </div>

    </div>
  )
}

export default About