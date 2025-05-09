import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 an')
  const [price, setPrice] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('Généraliste')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [wilaya, setWilaya] = useState('')

  const { backendUrl, atoken } = useContext(AdminContext);


  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {

      if (!docImg) {
        return toast.error('Image non sélectionnée')
      }

      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('price', Number(price))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
      formData.append('wilaya', wilaya)

      // console log formData
      formData.forEach((value, key) => {
        console.log(`${key} ${value}`);
      })

      const { data } = await axios.post(backendUrl + "/api/admin/add-doctor", formData, { headers: { atoken } })

      if (data.success) {

        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setAddress1('')
        setAddress2('')
        setWilaya('')
        setAbout('')
        setPrice('')
        setDegree('')

      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>

      <p className='font-medium mb-3 text-lg'>Ajouter un Médecin</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll '>
        <div className='flex items-center gap-4 mb-8 text gray-500'>
          <label htmlFor="doc-img">
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>Télécharger la<br />photo du Médecin</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Nom du Médecin</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Nom' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Email du Médecin</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" autoComplete="email" placeholder='Email' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Mot de passe du Médecin</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" autoComplete="current-password" placeholder='Mot de passe' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Expérience</p>
              <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2'>
                <option value="1 an">1 an</option>
                <option value="2 ans">2 ans</option>
                <option value="3 ans">3 ans</option>
                <option value="4 ans">4 ans</option>
                <option value="5 ans">5 ans</option>
                <option value="6 ans">6 ans</option>
                <option value="7 ans">7 ans</option>
                <option value="8 ans">8 ans</option>
                <option value="9 ans">9 ans</option>
                <option value="10 ans">10 ans</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Honoraires</p>
              <input onChange={(e) => setPrice(e.target.value)} value={price} className='border rounded px-3 py-2' type="number" placeholder='Honoraires' required />
            </div>

          </div>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Spécialité</p>
              <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2' name="" id="">
                <option value="Généraliste">Généraliste</option>
                <option value="Gynecologue">Gynecologue</option>
                <option value="Dermatologue">Dermatologue</option>
                <option value="Pédiatre">Pédiatre</option>
                <option value="Neurologue">Neurologue</option>
                <option value="Gastroenterologue">Gastroenterologue</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Diplôme</p>
              <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Diplôme' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Adresse</p>
              <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Adresse 1' required />
              <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Adresse 2' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Wilaya</p>
              <input onChange={(e) => setWilaya(e.target.value)} value={wilaya} className='border rounded px-3 py-2' type="text" placeholder='Numero de Wilaya' required />
            </div>
          </div>
        </div>

        <div>
          <p className='mt-4 mb-2'>À propos</p>
          <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Description du médecin' rows={5} required />
        </div>

        <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Ajouter le Médecin</button>

      </div>
    </form>
  )
}

export default AddDoctor