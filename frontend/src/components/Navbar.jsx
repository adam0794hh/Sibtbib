import React, { useContext, useEffect, useState } from 'react'
import { assets } from "../assets/assets"
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {

    const naviguate = useNavigate();

    const { token, setToken, userData, backendUrl} = useContext(AppContext)

    const [showMenu, setShowMenu] = useState(false);

    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
        naviguate('/login')
    }

    const sendVerificationOtp = async () => {
        try {
            if (!userData?._id) {
                toast.error("Utilisateur non trouvé !");
                return;
            }

            axios.defaults.withCredentials = true;

            const { data } = await axios.post(backendUrl + '/api/user/send-verify-otp', {
                userId: userData._id
            }, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                naviguate("/email-verify");

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };


    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <img onClick={() => naviguate("/")} className='w-44 cursor-pointer' src={assets.logo} alt="" />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to={"/"}>
                    <li className='py-1'>ACCEUIL</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>

                <NavLink to={"/doctors"}>
                    <li className='py-1'>TOUS LES DOCTEURS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>

                <NavLink to={"/about"}>
                    <li className='py-1'>À PROPOS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>

                <NavLink to={"/contact"}>
                    <li className='py-1'>CONTACT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>

                <a target="_blank" href="https://sibtbib-admin.vercel.app/" className="border px-5 text-xs py-1.5 rounded-full">Admin Panel</a>
            </ul>
            <div className='flex items-center gap-4'>
                {token && userData
                    ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <img className='w-8 rounded-full' src={userData.image} alt='' ></img>
                        <img className='w-2.5' src={assets.dropdown_icon} alt='' ></img>
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                {!userData.isAccountVerified && <p onClick={sendVerificationOtp} className='text-red-400'>Compte non Vérifié !</p>}
                                <p onClick={() => naviguate("/my-profile")} className='hover:text-black cursor-pointer'>Mon Profil</p>
                                <p onClick={() => naviguate("/my-appointments")} className='hover:text-black cursor-pointer'>Mes Rendez-Vous</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Deconnexion</p>
                            </div>
                        </div>
                    </div>
                    : <button onClick={() => naviguate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Creer un compte</button>
                }
                <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
                {/* ------------- Menu mobile---------------- */}
                <div className={` ${showMenu ? "fixed w-full" : "w-0 h-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                    <div className='flex items-center justify-between py-6 px-5'>
                        <img className='w-36' src={assets.logo} alt="" />
                        <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
                    </div>
                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink onClick={() => setShowMenu(false)} to='/'><p className="px-4 py-2 rounded inline-block">ACCEUIL</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className="px-4 py-2 rounded inline-block">TOUS LES DOCTEURS</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/about'><p className="px-4 py-2 rounded inline-block">À PROPOS</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className="px-4 py-2 rounded inline-block">CONTACT</p></NavLink>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar