// const create = require('prompt-sync');
const { BookingService } = require('../services/index');
const { StatusCodes } = require('http-status-codes');

const bookingService = new BookingService();

const create = async(req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            data: response,
            message: 'Successfully completed booking',
            err: {},
            success: true
        });
    } catch (error) {
        // console.log(error);
        return res.status(error.statusCode).json({
            data: {},
            message: error.message,
            err: error.explaination,
            success: false
        });
    }
}

module.exports = {
    create
}