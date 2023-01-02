const express = require('express');

const { bookingController } = require('../../controllers/index')

const router = express.Router();

// router.use();

router.post('/bookings', bookingController.create )

module.exports = router;