import { selectBooking, selectRoom } from "@/repositories/booking-repository";
import { bookingNotFound, roomNotFound } from "./errors";

export const findBooking = async (userId: number) => {
    const booking = await selectBooking(userId);
    if (!booking) throw bookingNotFound();

    const room = await selectRoom(booking.roomId);
    if (!room) throw roomNotFound();

    return {
        id: booking.id,
        Room: room,
    }
};
