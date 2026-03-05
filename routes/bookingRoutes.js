import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  getBookedDates
} from "../controllers/bookingController.js";

import { protect, authorizeAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, authorizeAdmin, getAllBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/house/:houseId/booked-dates", getBookedDates);

export default router;
