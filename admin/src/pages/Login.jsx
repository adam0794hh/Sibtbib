import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Login = () => {

  const [state,setState] = useState('Administrateur')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const {setAtoken,backendUrl} = useContext(AdminContext)
  const {setDtoken} = useContext(DoctorContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {

      if (state === 'Administrateur') {

        const {data} = await axios.post(backendUrl + '/api/admin/login', {email,password})
        if (data.success) {
          localStorage.setItem('atoken', data.token)
          setAtoken(data.token);
          navigate('/admin-dashboard')
        } else {
          toast.error(data.message)
        }

      } else {

        const {data} = await axios.post(backendUrl + '/api/doctor/login', {email, password})
        if (data.success) {
          localStorage.setItem('dtoken', data.token)
          setDtoken(data.token);
          navigate('/doctor-dashboard')
          
        } else {
          toast.error(data.message)
        }

      }
      
    } catch (error) {
      
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>Connexion<span className='text-primary'> {state}</span></p>

        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" autoComplete="email" required />
        </div>

        <div className='w-full'>
          <p>Mot de Passe</p>
          <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" autoComplete="current-password" required />
        </div>

        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Se Connecter</button>

        {
          state === 'Administrateur'
          ? <p>Connexion Médecin ? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Médecin')}>Cliquez ici</span></p>
          : <p>Connexion Administrateur ? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Administrateur')}>Cliquez ici</span></p>
        }

      </div>
    </form>
  )
}

export default Login