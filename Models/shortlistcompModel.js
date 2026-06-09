import mongoose from 'mongoose';
const shortlistcompSchema = new mongoose.Schema(
    {
    
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true
    },
    graduate:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Graduate',
            required: true
        },
    },
{ timestamps: true }
);

    shortlistcompSchema.index({company: 1, graduate: 1}, {unique: true});

    const shortlistcomp = mongoose.model("shortlistcomp", shortlistcompSchema);
    export default shortlistcomp;
