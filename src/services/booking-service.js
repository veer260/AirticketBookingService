const { BookingRepository } = require("../repository/index");
const {
  FLIGHT_SERVICE_PATH,
  REMINDER_BINDING_KEY,
} = require("../config/server-config");
const axios = require("axios");
const { ServiceError } = require("../utils/errors/index");
const { createChannel, publishMessage } = require("../utils/messageQueue");

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
      if (data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError(
          "Something went wrong in the booking process",
          "Insufficient seats"
        );
      }
      const totalCost = data.noOfSeats * priceOfFlight;
      const bookingPayload = { ...data, totalCost };
      const booking = await this.bookingRepository.create(bookingPayload);

      const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
      //   console.log(updateFlightRequestURL);
      await axios.patch(updateFlightRequestURL, {
        totalSeats: flightData.totalSeats - booking.noOfSeats,
      });
      const finalBooking = await this.bookingRepository.update(booking.id, {
        status: "Booked",
      });
      //   console.log("booked");
      const payload = {
        message: {
          subject: "This an email",
          content: "Some queue will recieve this",
          recepientEmail: "veersinghdemo101@gmail.com ",
          notificationTime: "2023-01-09T03:15:07",
        },
        service: "CREATE_TICKET",
      };
      const channel = await createChannel();
      console.log("channel created");
      publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
      console.log("publish message called");
      //   res.status(200).json({
      //     message: "Successfully published a message",
      //   });
      console.log("booked");
      return finalBooking;
    } catch (error) {
      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        return error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
