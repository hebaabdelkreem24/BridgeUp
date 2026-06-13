import asyncHandler from "express-async-handler";
import OfferJob from "../Models/offerJobModel.js";
import {
  sendOfferService,
  getMySentOffersService,
  deleteOfferService,
  getMyOffersService,
  respondToOfferService,
  getAllOffersService,
} from "../Services/offerJobService.js";
import { createNotification } from "../Services/notificationService.js";

// ─── COMPANY: Send Offer ─────────────────────────────
export const sendOffer = asyncHandler(async (req, res) => {
  const offer = await sendOfferService(req.user._id, req.body);

  // 1. Notification للخريج
  await createNotification({
    recipient: req.body.graduate,
    recipientRole: "graduate",
    sender: req.user._id,
    senderRole: "company",
    type: "new_offer",
    title: "💼 New Job Offer!",
    message: `You have a new job offer for "${req.body.position}" from ${req.user.companyName}.`,
  });

  // 2. Notification للشركة (عشان الشركة تشوف إنها بعتت offer)
  await createNotification({
    recipient: req.user._id,
    recipientRole: "company",
    sender: req.user._id,
    senderRole: "admin",
    type: "general",
    title: "✅ Offer Sent Successfully",
    message: `Your offer for "${req.body.position}" has been sent to the graduate.`,
  });

  res.status(201).json({
    status: "success",
    data: offer,
  });
});

// ─── COMPANY: Get My Sent Offers ─────────────────────
export const getMySentOffers = asyncHandler(async (req, res) => {
  const offers = await getMySentOffersService(req.user._id);

  res.status(200).json({
    status: "success",
    results: offers.length,
    data: offers,
  });
});

// ─── COMPANY: Get Offer Stats ────────────────────────────
export const getOfferStats = asyncHandler(async (req, res) => {
  const companyId = req.user._id;

  const total = await OfferJob.countDocuments({ company: companyId });
  const pending = await OfferJob.countDocuments({ company: companyId, status: "pending" });
  const accepted = await OfferJob.countDocuments({ company: companyId, status: "accepted" });
  const declined = await OfferJob.countDocuments({ company: companyId, status: "declined" });

  res.status(200).json({
    status: "success",
    data: {
      total,
      pending,
      accepted,
      declined,
    },
  });
});

// ─── COMPANY: Delete Offer ────────────────────────────
export const deleteOffer = asyncHandler(async (req, res) => {
  await deleteOfferService(req.params.id, req.user._id);

  res.status(200).json({
    status: "success",
    message: "Offer deleted successfully",
  });
});

// ─── GRADUATE: Get My Offers ─────────────────────────
export const getMyOffers = asyncHandler(async (req, res) => {
  const offers = await getMyOffersService(req.user._id);

  res.status(200).json({
    status: "success",
    results: offers.length,
    data: offers,
  });
});

// ─── GRADUATE: Accept Offer ──────────────────────────
export const acceptOffer = asyncHandler(async (req, res) => {
  const offer = await respondToOfferService(req.params.id, req.user._id, "accepted");

  // إرسال notification للشركة
  await createNotification({
    recipient: offer.company,
    recipientRole: "company",
    sender: req.user._id,
    senderRole: "graduate",
    type: "offer_accepted",
    title: "✅ Offer Accepted!",
    message: `${req.user.fullName} has accepted your job offer for "${offer.position}".`,
  });

  res.status(200).json({
    status: "success",
    data: offer,
  });
});

// ─── GRADUATE: Decline Offer ─────────────────────────
export const declineOffer = asyncHandler(async (req, res) => {
  const offer = await respondToOfferService(req.params.id, req.user._id, "declined");

  // إرسال notification للشركة
  await createNotification({
    recipient: offer.company,
    recipientRole: "company",
    sender: req.user._id,
    senderRole: "graduate",
    type: "offer_rejected",
    title: "❌ Offer Rejected",
    message: `${req.user.fullName} has rejected your job offer for "${offer.position}".`,
  });

  res.status(200).json({
    status: "success",
    data: offer,
  });
});

// ─── ADMIN: Get All Offers ───────────────────────────
export const getAllOffers = asyncHandler(async (req, res) => {
  const offers = await getAllOffersService();

  res.status(200).json({
    status: "success",
    results: offers.length,
    data: offers,
  });
});