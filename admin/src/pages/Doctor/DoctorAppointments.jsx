import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dtoken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel) return

    try {
      setCancelling(true)
      await cancelAppointment(appointmentToCancel._id)
    } finally {
      setCancelling(false)
      setAppointmentToCancel(null)
    }
  }

  useEffect(() => {
    if (dtoken) {
      getAppointments()
    }
  }, [dtoken])

  if (!appointments) {
    return <p>Chargement des données des rendez vous...</p>
  }

  return (
    <div className='w-full max-w-6xl mt-5'>
      <p className='mb-3 text-lg font-medium'>Tous les rendez vous</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Heure</p>
          <p>Prix</p>
          <p>Action</p>
        </div>

        {appointments.reverse().map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
            </div>
            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>Espèces</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{item.amount} {currency}</p>
            {
              item.cancelled
                ? <p className='text-red-500 text-xs font-medium'>Annulé</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Terminé</p>
                  : <div className='flex'>
                    <img
                      onClick={() => {
                        setAppointmentToCancel(item);
                      }}
                      className='w-10 cursor-pointer'
                      src={assets.cancel_icon}
                      alt=""
                    />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
            }
          </div>
        ))}
      </div>
      {appointmentToCancel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">

            <h2 className="text-lg font-semibold mb-2">Annuler le rendez-vous</h2>

            <p className="text-sm text-gray-600 mb-4">
              Tu es sur le point d’annuler le rendez-vous avec{" "}
              <span className="font-semibold">{appointmentToCancel.docData.name}</span>{" "}
              le {slotDateFormat(appointmentToCancel.slotDate)}.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAppointmentToCancel(null)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                disabled={cancelling}
              >
                Garder
              </button>

              <button
                onClick={confirmCancelAppointment}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={cancelling}
              >
                {cancelling ? "Annulation..." : "Annuler le RDV"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments