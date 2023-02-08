import { selectHotels, selectHotelById, selectRoomsByHotel } from "@/repositories/hotels-repository";
import { selectBooking, selectRoom } from "@/repositories/booking-repository";
import { bookingNotFound, roomNotFound } from "./errors";

const bookingValidation = async (userId: number) => {
    const booking = await selectBooking(userId);
    if (!booking) throw bookingNotFound();
    return booking;
};

const roomValidation = async (roomId: number) => {
    const room = await selectRoom(roomId);
    if (!room) throw roomNotFound();
    return room;
};

export const findBooking = async (userId: number) => {
    const booking = await bookingValidation(userId);
    const room = await roomValidation(booking.id);

    return {
        id: booking.id,
        Room: room,
    }
};

