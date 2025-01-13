import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// Api pour ajouter les docteurs a partir du dashboard admin
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, price, address, wilaya } = req.body;
        const imageFile = req.file
        

        if (!name||!email||!password||!speciality||!degree||!experience||!about||!price||!address||! wilaya) {
            return res.json({success: false, message:"Détails manquants"})
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.json({success: false, message:"Veuillez entrer un e-mail valide"})
        }

        // Validating password strong
        if (password.length < 8) {
            return res.json({success: false, message:"Veuillez saisir un mot de passe à 8 caractères"})
        }

        // Hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageURL = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageURL,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            price,
            address: JSON.parse(address),
            wilaya,
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success: true, message:"Docteur ajouté avec succès"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message })
        
    }
}

// Api for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success: true, token})
        } else {
            res.json({success: false, message: "Informations non valides"})
        }

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel

const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({success: true, doctors})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message })
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {

    try {

        const appointments = await appointmentModel.find({})
        res.json({success: true, appointments})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message })
    }
}

// API to cancel appointment for the admmin
const appointmentCancel = async (req, res) => {

    try {

        const { appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true})

        const {docId, slotDate, slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Rendez-vous annulé avec succès" })
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {

    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            patients: users.length,
            appointments: appointments.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({ success: true, dashData })
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export {addDoctor,loginAdmin,allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}