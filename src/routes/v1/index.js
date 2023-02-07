const express = require("express");

const BookingController = require("../../controllers/booking-controller");
// const { bookingController } = require('../../controllers/index');

const router = express.Router();

const bookingController = new BookingController();

// router.use();

router.post("/bookings", bookingController.create);
// router.post('/publish', bookingController.sendMessageToQueue);

module.exports = router;
