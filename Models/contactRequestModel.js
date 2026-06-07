import mongoose from 'mongoose';

const examResultSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    graduate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Graduate',
        required: true,
    },
    jobTitle: {
        type: String,
        required: [true, 'Please enter the job title'],
        trim: true,
    }
})