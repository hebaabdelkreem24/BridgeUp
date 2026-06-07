import mongoose from 'mongoose';


const contactUsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your first name'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        lowercase: true,
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Please enter your message'],
        trim: true,
    },
}, { timestamps: true });  

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

export default ContactUs;