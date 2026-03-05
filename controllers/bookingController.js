import Booking from "../models/booking.js";
import House from "../models/House.js";

//Booking is done by user only
export const createBooking = async (req, res) => {
  try {
    const { houseId, startDate, endDate } = req.body;
    const house = await House.findOne({ homeId: houseId });

    // const house = await House.findOne({homeId: homeId});

    // Check if house exists
    if (!house) {
      return res.json({ status: 0, message: "House not found" });
    }

    // Check overlapping booking
    const start = new Date(startDate);
    const end = new Date(endDate);

    const overlappingBooking = await Booking.findOne({
      house: houseId,
      status: { $nin: ["cancelled", "rejected"] },
      $or: [
        {
          startDate: { $lt: end },
          endDate: { $gt: start }
        }
      ]
    });

    if (overlappingBooking) {
      return res.json({
        status: 0,
        message: "House is already booked for selected dates"
      });
    }

    const days = (end - start) / (1000 * 60 * 60 * 24);

    const totalPrice = days * house.price;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      house: houseId,
      startDate,
      endDate,
      totalPrice
    });

    res.json({
      status: 1,
      data: booking
    });

  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Get My Bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("house");

    res.json({
      status: 1,
      //             count: bookings.length,
      data: bookings
    });

  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Admin get All booking

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("house", "title price");

    res.json({
      status: 1,
      data: bookings
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

//Cancel the Booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.json({ status: 0, message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.json({ status: 0, message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      status: 1,
      message: "Booking cancelled"
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Get Booked Dates for House
export const getBookedDates = async (req, res) => {
  try {
    const { houseId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      house: houseId,
      status: { $nin: ["cancelled", "rejected"] },
      endDate: { $gte: today }
    }).select("startDate endDate -_id");

    res.json({
      status: 1,
      data: bookings
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// import Booking from '../models/Booking.js';
// import House from '../models/House.js';

// /*
//   @desc    Create Booking
//   @route   POST /api/bookings
//   @access  Private (User)
// */
// export const createBooking = async (req, res) => {
//   try {
//     const { houseId, startDate, endDate } = req.body;

//     // Validate input
//     if (!houseId || !startDate || !endDate) {
//       return res.json({
//         message: "House, start date and end date are required"
//       });
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     if (end <= start) {
//       return res.json({
//         message: "End date must be after start date"
//       });
//     }

//     // Check if house exists
//     const house = await House.findById(houseId);
//     if (!house) {
//       return res.json({ message: "House not found" });
//     }

//     // Check booking date conflict
//     const existingBooking = await Booking.findOne({
//       house: houseId,
//       $or: [
//         {
//           startDate: { $lt: end },
//           endDate: { $gt: start }
//         }
//       ]
//     });

//     if (existingBooking) {
//       return res.json({
//         message: "This house is already booked for the selected dates"
//       });
//     }

//     // Calculate number of days
//     const days = Math.ceil(
//       (end - start) / (1000 * 60 * 60 * 24)
//     );

//     // Calculate total price
//     const totalPrice = days * house.price;

//     // Create booking
//     const booking = await Booking.create({
//       house: houseId,
//       user: req.user._id,
//       startDate: start,
//       endDate: end,
//       totalPrice
//     });

//     res.json(booking);

//   } catch (error) {
//     res.json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };


// /*
//   @desc    Get My Bookings
//   @route   GET /api/bookings/my
//   @access  Private
// */
// export const getMyBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({
//       user: req.user._id
//     }).populate('house');

//     res.json(bookings);

//   } catch (error) {
//     res.json({ message: "Server error" });
//   }
// };


// /*
//   @desc    Get All Bookings
//   @route   GET /api/bookings
//   @access  Admin
// */
// export const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate('user', 'name email')
//       .populate('house', 'title price address');

//     res.json(bookings);

//   } catch (error) {
//     res.json({ message: "Server error" });
//   }
// };


// /*
//   @desc    Get Single Booking
//   @route   GET /api/bookings/:id
//   @access  Private
// */
// export const getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate('user', 'name email')
//       .populate('house');

//     if (!booking) {
//       return res.json({
//         message: "Booking not found"
//       });
//     }

//     // Owner or Admin
//     if (
//       booking.user._id.toString() !== req.user._id.toString() &&
//       !req.user.isAdmin
//     ) {
//       return res.json({
//         message: "Not authorized"
//       });
//     }

//     res.json(booking);

//   } catch (error) {
//     res.json({ message: "Server error" });
//   }
// };


// /*
//   @desc    Update Booking
//   @route   PUT /api/bookings/:id
//   @access  Private
// */
// export const updateBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.json({
//         message: "Booking not found"
//       });
//     }

//     // Owner or Admin
//     if (
//       booking.user.toString() !== req.user._id.toString() &&
//       !req.user.isAdmin
//     ) {
//       return res.json({
//         message: "Not authorized"
//       });
//     }

//     const updatedBooking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.json(updatedBooking);

//   } catch (error) {
//     res.json({ message: "Server error" });
//   }
// };


// /*
//   @desc    Delete Booking
//   @route   DELETE /api/bookings/:id
//   @access  Private
// */
// export const deleteBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.json({
//         message: "Booking not found"
//       });
//     }

//     // Owner or Admin
//     if (
//       booking.user.toString() !== req.user._id.toString() &&
//       !req.user.isAdmin
//     ) {
//       return res.json({
//         message: "Not authorized"
//       });
//     }

//     await booking.deleteOne();

//     res.json({
//       message: "Booking deleted successfully"
//     });

//   } catch (error) {
//     res.json({ message: "Server error" });
//   }
// };
