import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const wilayas = Array.from({ length: 58 }, (_, i) => (i + 1).toString().padStart(2, '0'));

const Doctors = () => {
  const naviguate = useNavigate();
  const { speciality, wilaya } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState(wilaya || '');
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    let filteredDoctors = doctors;

    // Filtrage par spécialité
    if (speciality) {
      filteredDoctors = filteredDoctors.filter(doc => doc.speciality === speciality);
    }

    // Filtrage par wilaya
    if (selectedWilaya) {
      filteredDoctors = filteredDoctors.filter(doc => doc.wilaya === selectedWilaya);
    }

    // Met à jour la liste des médecins filtrés
    setFilterDoc(filteredDoctors);
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, selectedWilaya]);

  const handleWilayaChange = (e) => {
    const newWilaya = e.target.value;
    setSelectedWilaya(newWilaya);
  };

  return (
    <div>
      <p className='text-gray-600'>Parcourez les médecins spécialistes dans votre Wilaya.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-primary text-white" : ""}`} onClick={() => setShowFilter(prev => !prev)}>Filtres</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'Généraliste' ? naviguate('/doctors') : naviguate('/doctors/Généraliste')} className={` w-[94vm] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Généraliste" ? "bg-indigo-100 text-black" : ""}`}>Généraliste</p>
          <p onClick={() => speciality === 'Gynecologue' ? naviguate('/doctors') : naviguate('/doctors/Gynecologue')} className={` w-[94vm] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologue" ? "bg-indigo-100 text-black" : ""}`}>Gynecologue</p>
          <p onClick={() => speciality === 'Dermatologue' ? naviguate('/doctors') : naviguate('/doctors/Dermatologue')} className={` w-[94vm] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologue" ? "bg-indigo-100 text-black" : ""}`}>Dermatologue</p>
          <p onClick={() => speciality === 'Pédiatre' ? naviguate('/doctors') : naviguate('/doctors/Pédiatre')} className={` w-[94vm] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pédiatre" ? "bg-indigo-100 text-black" : ""}`}>Pédiatre</p>
          <p onClick={() => speciality === 'Neurologue' ? naviguate('/doctors') : naviguate('/doctors/Neurologue')} className={` w-[94vm] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologue" ? "bg-indigo-100 text-black" : ""}`}>Neurologue</p>
          <p onClick={() => speciality === 'Gastroenterologue' ? naviguate('/doctors') : naviguate('/doctors/Gastroenterologue')} className={` w-[94vm] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologue" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologue</p>

          <div className="flex flex-col mt-10 gap-4 text-sm text-gray-600">
            <label htmlFor="wilaya-select" className="font-medium">
              Filtrer par wilaya (numéro) :
            </label>
            <select
              id="wilaya-select"
              value={selectedWilaya}
              onChange={handleWilayaChange}
              className="border border-gray-300 rounded px-3 py-2 cursor-pointer flex items-center"
            >
              <option value="">Toutes les wilayas</option>
              {wilayas.map((wilayaNumber) => (
                <option key={wilayaNumber} value={wilayaNumber}>
                  Wilaya {wilayaNumber}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div onClick={() => naviguate(`/appointments/${item._id}`)} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
              <img className='bg-blue-50' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                  <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p><p>{item.available ? 'Disponible' : 'Indisponible'}</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>
                <p className='text-gray-600 text-sm'>Wilaya: {item.wilaya}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  )
}

export default Doctors