import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js";


const changeDisponibility = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: "Disponibilité modifiée avec succès" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API for doctor login
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Utilisateur inconnu" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {

            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })

        } else {
            return res.json({ success: false, message: "Identification invalides" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {

    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API Mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        // Vérifier si le rendez-vous est annulé
        if (appointmentData.cancelled) {
            return res.json({ 
                success: false, 
                message: "Impossible de marquer un rendez-vous annulé comme terminé" 
            });
        }

        if (appointmentData && appointmentData.docId === docId) {
            // Mettre à jour isCompleted et récupérer le document mis à jour
            const updatedAppointment = await appointmentModel.findByIdAndUpdate(
                appointmentId,
                { isCompleted: true },
                { new: true }
            );

            // Vérifier si l'appoinement est terminé
            if (updatedAppointment.isCompleted) {
                await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
            }

            return res.json({ success: true, message: "Rendez-vous marqué comme terminé" });
        } else {
            return res.json({ success: false, message: "Rendez-vous non trouvé ou ID incorrect" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req,res) => {

    try {

        const { docId, appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // Vérifier si le rendez-vous est terminé
        if (appointmentData.isCompleted) {
            return res.json({ 
                success: false, 
                message: "Impossible d'annuler un rendez-vous déjà terminé" 
            });
        }

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true})
            return res.json({ success: true, message: "Rendez-vous annulé avec succé" });

        } else {
            return res.json({ success: false, message: "Echec de l'annulation du rendez vous "})
        } 

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {

    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({docId})

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })
        
        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {

    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get update doctor profil
const updateDoctorProfile = async (req, res) => {

    try {

        const {docId, price, address, available} = req.body

        await doctorModel.findByIdAndUpdate(docId, {price, address, available})

        res.json({ success: true, message: 'Profil mis a jour avec succés' })
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { changeDisponibility, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile }