import { selectBooking, selectRoom, countRoomOccupancy, createBooking, updateRoom } from "@/repositories/booking-repository";
import { bookingNotFound, roomNotFound, atCapacity, bookingIdAndUserDontMatch } from "./errors";

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

const roomOccupancyValidation = async (roomId: number) => {
    const room = await roomValidation(roomId);
    const roomOccupancy = await countRoomOccupancy(roomId);

    if (roomOccupancy >= room.capacity) throw atCapacity();
};

export const findBooking = async (userId: number) => {
    const booking = await bookingValidation(userId);
    const room = await selectRoom(booking.roomId);

    return {
        id: booking.id,
        Room: room,
    }
};

export const chooseRoom = async (userId: number, roomId:number) => {
    await roomOccupancyValidation(roomId);

    const booking = await createBooking(userId, roomId);

    return { bookingId: booking.id };
};

export const changeRoom = async (userId: number, roomId: number, bookingId: number) => {
    const booking = await bookingValidation(userId);
    await roomValidation(roomId);
    await roomOccupancyValidation(roomId);

    if (booking.id !== bookingId) throw bookingIdAndUserDontMatch();

    await updateRoom(bookingId, roomId);

    return bookingId;
};
