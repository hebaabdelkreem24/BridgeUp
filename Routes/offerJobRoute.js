import express from "express";
import {
  sendOffer,
  getMySentOffers,
  deleteOffer,
  getMyOffers,
  acceptOffer,
  declineOffer,
  getAllOffers,
  getOfferStats,
} from "../Controllers/offerJobController.js";
import { protect, allowOnly } from "../Services/authService.js";

const offerRouter = express.Router();

// Graduate: view and respond to their offers
offerRouter.get("/my-offers", protect, allowOnly("graduate"), getMyOffers);
offerRouter.patch("/:id/accept", protect, allowOnly("graduate"), acceptOffer);
offerRouter.patch("/:id/decline", protect, allowOnly("graduate"), declineOffer);

// Company: send, view, stats, and cancel offers
offerRouter.post("/", protect, allowOnly("company"), sendOffer);
offerRouter.get("/my-sent-offers", protect, allowOnly("company"), getMySentOffers);
offerRouter.get("/stats", protect, allowOnly("company"), getOfferStats);
offerRouter.delete("/:id", protect, allowOnly("company"), deleteOffer);

// Admin: full overview
offerRouter.get("/", protect, allowOnly("admin"), getAllOffers);

export default offerRouter;