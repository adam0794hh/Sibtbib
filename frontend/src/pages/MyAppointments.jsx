import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const months = ["", "Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "juil", "Aou", "Sep", "Oct", "Nove", "Dec"]


  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('-')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }


  const getUserAppointments = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments);

      }

    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const cancelAppointments = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>Mes rendez-vous</p>
      <div>
        {
          appointments.map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-100' src={item.docData.image} alt="" />
              </div>

              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality} - Wilaya: {item.docData.wilaya}</p>
                <p className='text-sm text-neutral-700 font-medium mt-2'>Adresse:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-2'><span className='text-sm text-neutral-700 font-medium'>Date & Heure:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>

              <div></div>
              <div className="flex items-center justify-center w-full sm:w-1/4">
                {item.isCompleted ? (
                  // Si le rendez-vous est terminé, afficher ce bouton
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Rendez-vous Terminé
                  </button>
                ) : item.cancelled ? (
                  // Si le rendez-vous est annulé, afficher ce bouton
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Rendez-vous annulé
                  </button>
                ) : (
                  // Sinon, afficher le bouton pour annuler le rendez-vous
                  <button
                    onClick={() => cancelAppointments(item._id)}
                    className="text-sm sm:text-stone-500 text-center sm:min-w-48 py-2 px-2 border rounded transition-all duration-300 hover:bg-red-600 hover:text-white sm:hover:bg-red-600 sm:hover:text-white bg-red-600 text-white sm:bg-transparent mb-2 sm:mb-0"
                  >
                    Annuler le rendez-vous
                  </button>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments