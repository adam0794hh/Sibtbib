import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dtoken, dashData, setDashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)
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
      getDashData()
    }
  }, [dtoken])

  if (!dashData) {
    return <p>Chargement des données du tableau de bord...</p>
  }

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.earnings} {currency} </p>
            <p className='text-gray-400'>Gains</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments} </p>
            <p className='text-gray-400'>Rendez-vous</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients} </p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Dernières réservations</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <img className='rounded-full w-10' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.userData.name} </p>
                <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
              </div>
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
      </div>
      {appointmentToCancel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">

            <h2 className="text-lg font-semibold mb-2">Annuler le rendez-vous</h2>

            <p className="text-sm text-gray-600 mb-4">
              Tu es sur le point d’annuler le rendez-vous avec{" "}
              <span className="font-semibold">{appointmentToCancel.userData.name}</span>{" "}
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

export default DoctorDashboard