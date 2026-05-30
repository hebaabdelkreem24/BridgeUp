import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Graduate from "../Models/graduateModel.js";
import Company from "../Models/companyModel.js";

export const getCompanyProfile = asyncHandler(async (req, res) =>{
    const company = req.user;

    const totalGraduates = await Graduate.countDocuments();
    const frontendCount  = await Graduate.countDocuments({track: "Frontend"});
    const backendCount  = await Graduate.countDocuments({track: "Backend"});

    res.status(200).json({
        status: "success",
        data: {
        company: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        phone: company.phone,
        website: company.website,
        location: company.location,
        industry: company.industry,
        companySize: company.companySize,
        description: company.description,
        commercialRegister: company.commercialRegister,
        taxCard: company.taxCard,
        isApproved: company.isApproved,
        isStarred: company.isStarred,
        createdAt: company.createdAt,  
        },
        stats: {
        totalGraduates,
        frontendGraduates: frontendCount,
        backendGraduates: backendCount,
        },
    },
    });
});

export const updateCompanyProfile = asyncHandler(async(req,res,next)=>{
const company = req.user ;

const allowedUpdates = [
    "companyName",
    "phone",
    "website",
    "location",
    "industry",
    "companySize",
    "description",
];
const updates = {};
Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
    }
});

const updatedCompany = await company.findByIdAndUpdate(
    company._id,
    updates,
    { new: true, runValidators: true }
).select("-password");
res.status(200).json({
    status: "success",
    message: "Company profile updated successfully",
    data: {company: updatedCompany},
}); 
});




