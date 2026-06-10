import asyncHandler from "express-async-handler";
import Company from "../Models/companyModel.js";
import Graduate from "../Models/graduateModel.js";
import Shortlist from "../Models/shortlistcompModel.js";
import Offer from "../Models/offerJobModel.js";  // ← NEW
import ApiError from "../utils/apiError.js";


export const getCompanyProfile = asyncHandler(async(req,res)=>{
    const company = req.user;
    
    const totalGraduates = await Graduate.countDocuments();
    const frontendCount = await Graduate.countDocuments({track:"Frontend"});
    const backendCount = await Graduate.countDocuments({track:"Backend"});


    const [totalContacted, acceptedOffers, shortlistedCount] = await Promise.all([
    Offer.countDocuments({ company: company._id }),
    Offer.countDocuments({ company: company._id, status: "accepted" }),
    Shortlist.countDocuments({ company: company._id }),
]);

    res.status(200).json({
        status: "success",
        data:{
            company:{
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
    stats:{
        totalGraduates,
        frontendGraduates : frontendCount,
        backendGraduates : backendCount,
        graduatesContacted: totalContacted,
        shortlistedCount,
        acceptedOffers,
    },
            },
        });
    });

export const updateCompanyProfile = asyncHandler(async(req,res,next)=>{
        const company = req.user;
        const allowedUpdates = [
            "companyName",
            "email",
            "phone",
            "website",
            "location",
            "industry",
            "companySize",
            "description",
                    ];
                    const updates = {};
                    Object.keys(req.body).forEach((key)=>{
                        if (allowedUpdates.includes(key)) {
                            updates[key] = req.body[key];
                        }
                    });
                    const updatedCompany = await Company.findByIdAndUpdate(
                        company._id,
                        updates,
                        {new: true, runValidators: true}
                    ).select("-password");
                    res.status(200).json({
                        status: "success",
                        data: {
                            company: updatedCompany,
                        },
                    });
    });

export const getAllGraduates = asyncHandler(async(req,res)=>{
    const {track,
        minEnglishScore ,
        minTechnicalScore ,
        minIQScore ,
        gender ,
        graduationYear} = req.query ;

    const query ={};

    if (track) query.track = track;
    if (gender) query.gender = gender;
    if (graduationYear) query.graduationYear = parseInt(graduationYear);


    if (minEnglishScore) query.englishScore = {$gte:parseInt(minEnglishScore)};
    if (minTechnicalScore) query.technicalScore = {$gte: parseInt(minTechnicalScore)};
    if (minIQScore) query.iqScore = {$gte: parseInt(minIQScore)};

    const graduates = await Graduate.find(query)
    .select("-password -passwordResetToken -passwordResetExpiredAt -passwordResetVerified")
    .sort("-createdAt");
    ;
    res.status(200).json({
        status: "success",
        results: graduates.length,
        data:{graduates}
        
    });
});

// @desc    Add Graduate to Shortlist
// @route   POST /api/v1/company/shortlist/:graduateId
// @access  Private (Company)
export const addToShortlist = asyncHandler(async(req,res,next)=>{
    const company = req.user._id ;
    const {graduateId} = req.params;

    const graduate = await Graduate.findById(graduateId);
    if(!graduate){
        return next(new ApiError("Graduate not found",404))
    }
    const shortlist = await Shortlist.create({
          company,
        graduate: graduateId,    })
        res.status(200).json({
            status:"success",
            data:{shortlist},
        });
});
// @desc    Remove from Shortlist
// @route   DELETE /api/v1/company/shortlist/:graduateId
// @access  Private (Company)
export const removeFromShortlist = asyncHandler(async(req,res,next)=>{
    const company = req.user._id ;
    const {graduateId} = req.params;
    const shortlistRemove = await Shortlist.findOneAndDelete({
        company,
        graduate: graduateId,
    });
    if(!shortlistRemove){
        return next (new ApiError("Graduate not found in shortlist",404));

    }
    res.status(200).json({
        status:"success",
        message:"Graduate removed from shortlist",});
    });
export const getShortlisted = asyncHandler(async(req,res)=>{
    const company =req.user._id;
    const shortlists= await Shortlist.find({company}).populate("graduate","-password -passwordResetCode -passwordResetExpiredAt -passwordResetVerified").sort("-createdAt");

        res.status(200).json({
            status:"success",
            results: shortlists.length,
            data:{shortlists},
        });
});