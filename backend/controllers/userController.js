import validator from "validator"
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import transporter from "../config/nodemailer.js"
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from "../config/emailTemplate.js"

// API to User register

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Détails manquants" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Veuillez entrer un e-mail valide" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Veuillez saisir un mot de passe à 8 caractères" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { name, email, password: hashedPassword };
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Bienvenue dans Sibtbib",
            text: `Bienvenue sur le site web Sibtbib. Votre compte a été créé avec cette adresse email: ${email}`
        };
        await transporter.sendMail(mailOptions);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to User login

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, message: "Détails manquants" })
        }

        // Check if user exists in the database
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "L'utilisateur n'existe pas" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            return res.json({ success: false, message: "Informations non valides" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data

const getProfile = async (req, res) => {

    try {

        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, wilaya, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !address || !wilaya || !dob || !gender) {
            return res.json({ success: false, message: "Veuillez remplir tous les champs" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), wilaya, dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: "Profil mis à jour avec succès" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to book appointments

const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({ success: false, message: "Médecin non disponible" })
        }

        let slots_booked = docData.slots_booked

        // Checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Créneau non disponible" })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId, docId,
            userData, docData,
            amount: docData.price,
            slotDate, slotTime,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // Save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Rendez-vous réservé avec succès" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for the frontend

const listAppointments = async (req, res) => {

    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment

const cancelAppointment = async (req, res) => {

    try {

        const { userId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // Verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Action non autorisée" })
        }

        // Vérifier si le rendez-vous est déjà annulé
        if (appointmentData.isCompleted) {
            return res.json({ success: false, message: "Le rendez-vous est déjà terminé" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        const { docId, slotDate, slotTime } = appointmentData
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

// API to send verify OTP
const sendVerifyOtp = async (req, res) => {

    try {

        const { userId } = req.body

        const user = await userModel.findById(userId)

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Compte déjà vérifié" });
        };

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Verification d'adresse email via OTP",
            // text: `Votre code OTP est: ${otp}. Veuillez le saisir pour vérifier votre adresse email.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Code d'activation envoyé à votre adresse email" });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};

// API to verify userEmail
const verifyEmail = async (req, res) => {

    const { userId, otp } = req.body

    if (!userId ||!otp) {
        return res.json({ success: false, message: "Paramètres manquants" });
    }

    try {

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "Utilisateur non trouvé" });
        };

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Code d'activation incorrect" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "Code d'activation a expiré" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: "Votre compte a été vérifié avec succès" });
        
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
    
};
// Check if user is authenticated
const isAuthenticated = (req, res) => {

    try {

        return res.json({ success: true });
        
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};

// Send Password Reset OTP
const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Veuillez entrer votre adresse email" });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Utilisateur non trouvé" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Réinitialisation du mot de passe via OTP",
            // text: `Votre code OTP pour réinitialiser votre mot de passe est: ${otp}. Utilisez cet OTP pour procéder à la réinitialisation de votre mot de passe`
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        } 

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Code d'activation envoyé à votre adresse email" });
        
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
};

// Reset User Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    
    if (!email ||!otp ||!newPassword) {
        return res.json({ success: false, message: "Paramètres manquants" });
    }

    try {

        const user = await userModel.findOne({email});
        
        if (!user) {
            return res.json({ success: false, message: "Utilisateur non trouvé" });
        }

        if (user.resetOtp === '' || user.resetOtp!== otp) {
            return res.json({ success: false, message: "Code d'activation incorrect" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "Code d'activation a expiré" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Mot de passe réinitialisé avec succès" });
         
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword };