const { StatusCodes } = require('http-status-codes/build/cjs/status-codes');
const { AppError, ValidationError } = require('../utils/errors/index')
const { Booking } = require('../models/index')
class BookingRepository {
    async create(data) {
        try {
            const booking = Booking.create(data);
            return booking
        } catch (error) {
            if( error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);  
            }
            throw new AppError(
                'Repository Error',
                'Cannot create booking',
                'There was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }
}

module.exports = BookingRepository;