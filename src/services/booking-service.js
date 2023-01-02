const { BookingRepository } = require('../repository/index')
const { FLIGHT_SERVICE_PATH } = require('../config/server-config')
const axios = require('axios');
const { ServiceError } = require('../utils/errors/index');

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const flight = await axios.get(getFlightRequestURL);
            const flightData = flight.data.response;
            let priceOfFlight = flightData.price;
            // console.log(priceOfFlight);
            if ( data.noOfSeats > flightData.totalSeats){
                throw new ServiceError(
                    'Something went wrong in the booking process',
                    'Insufficient seats'
                    )
            }
            const totalCost = data.noOfSeats*priceOfFlight;
            // console.log(totalCost);
            const bookingPayload = {...data, totalCost}
            const booking  = await this.bookingRepository.create(bookingPayload);
            
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            console.log(updateFlightRequestURL);
            await axios.patch(updateFlightRequestURL, {totalSeats: flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status: 'Booked'});
            // console.log(booking);   
            // console.log('After');
            return finalBooking;
        } catch (error) {
            if ( error.name == 'RepositoryError' || error.name == 'ValidationError') {
                return error;
            }
            // console.log('error: ')
            // console.log(error)
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;