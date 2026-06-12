import Offer from "../Models/offerJobModel.js";
import ApiError from "../utils/apiError.js";

// ─────────────────────────────────────────────
// COMPANY SERVICES
// ─────────────────────────────────────────────

export const sendOfferService = async (companyId, { graduate, position, message }) => {
  const existing = await Offer.findOne({ company: companyId, graduate });
  if (existing) {
    throw new ApiError("You already sent an offer to this graduate", 400);
  }

  const offer = await Offer.create({
    company: companyId,
    graduate,
    position,
    message,
  });

  return offer;
};

export const getMySentOffersService = async (companyId) => {
  const offers = await Offer.find({ company: companyId })
    .populate("graduate", "fullName email track university profilePicture")
    .sort("-createdAt");

  return offers;
};

export const deleteOfferService = async (offerId, companyId) => {
  const offer = await Offer.findById(offerId);

  if (!offer) {
    throw new ApiError("Offer not found", 404);
  }

  if (offer.company.toString() !== companyId.toString()) {
    throw new ApiError("You are not authorized to delete this offer", 403);
  }

  await offer.deleteOne();
};

// ─────────────────────────────────────────────
// GRADUATE SERVICES
// ─────────────────────────────────────────────

export const getMyOffersService = async (graduateId) => {
  const offers = await Offer.find({ graduate: graduateId })
    .populate("company", "companyName email industry logo")
    .sort("-createdAt");

  return offers;
};

export const respondToOfferService = async (offerId, graduateId, status) => {
  const offer = await Offer.findById(offerId);

  if (!offer) {
    throw new ApiError("Offer not found", 404);
  }

  if (offer.graduate.toString() !== graduateId.toString()) {
    throw new ApiError("You are not authorized to respond to this offer", 403);
  }

  if (offer.status !== "pending") {
    throw new ApiError(`Offer is already ${offer.status}`, 400);
  }

  offer.status = status;
  await offer.save();

  return offer;
};

// ─────────────────────────────────────────────
// ADMIN SERVICES
// ─────────────────────────────────────────────

export const getAllOffersService = async () => {
  const offers = await Offer.find()
    .populate("company", "companyName email")
    .populate("graduate", "fullName email track")
    .sort("-createdAt");

  return offers;
};