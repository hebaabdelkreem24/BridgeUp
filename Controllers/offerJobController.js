import asyncHandler from "express-async-handler";
import {
  sendOfferService,
  getMySentOffersService,
  deleteOfferService,
  getMyOffersService,
  respondToOfferService,
  getAllOffersService,
} from "../Services/offerJobService.js";

// ─────────────────────────────────────────────
// COMPANY CONTROLLERS
// ─────────────────────────────────────────────

// @desc    Send a job offer to a graduate
// @route   POST /api/v1/offers
// @access  Private (Company only)
export const sendOffer = asyncHandler(async (req, res) => {
  const offer = await sendOfferService(req.user._id, req.body);

  res.status(201).json({
    status: "success",
    data: offer,
  });
});

// @desc    Get all offers sent by the logged-in company
// @route   GET /api/v1/offers/my-sent-offers
// @access  Private (Company only)
export const getMySentOffers = asyncHandler(async (req, res) => {
  const offers = await getMySentOffersService(req.user._id);

  res.status(200).json({
    status: "success",
    results: offers.length,
    data: offers,
  });
});

// @desc    Delete (cancel) an offer sent by the company
// @route   DELETE /api/v1/offers/:id
// @access  Private (Company only)
export const deleteOffer = asyncHandler(async (req, res) => {
  await deleteOfferService(req.params.id, req.user._id);

  res.status(200).send();
});

// ─────────────────────────────────────────────
// GRADUATE CONTROLLERS
// ─────────────────────────────────────────────

// @desc    Get all offers received by the logged-in graduate
// @route   GET /api/v1/offers/my-offers
// @access  Private (Graduate only)
export const getMyOffers = asyncHandler(async (req, res) => {
  const offers = await getMyOffersService(req.user._id);

  res.status(200).json({
    status: "success",
    results: offers.length,
    data: offers,
  });
});

// @desc    Accept a job offer
// @route   PATCH /api/v1/offers/:id/accept
// @access  Private (Graduate only)
export const acceptOffer = asyncHandler(async (req, res) => {
  const offer = await respondToOfferService(req.params.id, req.user._id, "accepted");

  res.status(200).json({
    status: "success",
    data: offer,
  });
});

// @desc    Decline a job offer
// @route   PATCH /api/v1/offers/:id/decline
// @access  Private (Graduate only)
export const declineOffer = asyncHandler(async (req, res) => {
  const offer = await respondToOfferService(req.params.id, req.user._id, "declined");

  res.status(200).json({
    status: "success",
    data: offer,
  });
});

// ─────────────────────────────────────────────
// ADMIN CONTROLLERS
// ─────────────────────────────────────────────

// @desc    Get all offers (admin overview)
// @route   GET /api/v1/offers
// @access  Private (Admin only)
export const getAllOffers = asyncHandler(async (req, res) => {
  const offers = await getAllOffersService();

  res.status(200).json({
    status: "success",
    results: offers.length,
    data: offers,
  });
});