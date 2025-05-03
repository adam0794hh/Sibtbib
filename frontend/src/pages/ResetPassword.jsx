import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)

  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate();

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    try {

      const { data } = await axios.post(backendUrl + '/api/user/send-reset-otp', { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)

    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmited(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {

      const { data } = await axios.post(backendUrl + '/api/user/reset-password', { email, otp, newPassword })
      
      data.success? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen mt-15'>
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-primary p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reinitialisation de votre mot de passe</h1>
          <p className='text-center mb-6 text-white'>Entrez votre adresse email</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img className='w-3 h-3' src={assets.mail_icon} alt="" />
            <input className='bg-transparent outline-none text-white' type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button className='w-full py-3 bg-[#35d5bd] text-white rounded-full'>Confirmer</button>
        </form>
      }

      {/* otp input form */}
      {!isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitOtp} className='bg-primary p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Modification de votre mot de passe via code OTP</h1>
          <p className='text-center mb-6 text-white'>Entrez le code à 6 chiffres envoyé à votre adresse mail, penser a verifier vos couriers indesirables</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type='text' maxLength={1} key={index} required
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)} />
            ))}
          </div>
          <button className='w-full py-2.5 bg-[#35d5bd] text-white rounded-full'>Confirmer</button>
        </form>
      }

      {/* Enter a new Password */}
      {isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className='bg-primary p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Nouveau mot de passe</h1>
          <p className='text-center mb-6 text-white'>Veuillez Entrez votre nouveau mot de passe</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img className='w-3 h-3' src={assets.lock_icon} alt="" />
            <input className='bg-transparent outline-none text-white' type="password" placeholder="Mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </div>
          <button className='w-full py-3 bg-[#35d5bd] text-white rounded-full'>Confirmer</button>
        </form>
      }
    </div>
  )
}

export default ResetPassword