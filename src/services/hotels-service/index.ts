import { selectHotels, selectHotelById, selectRoomsByHotel } from "@/repositories/hotels-repository";
import { findTickects, findTickectByType } from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { noEnrollmentFound, ticketNotFound, ticketNotPaid, ticketDoesNotIncludesHotel, hotelNotFound, roomsNotFound } from "./errors";

export const findHotels = async (userId: number) => {
    const enrollment = await enrollmentRepository.findUserEnrollment(userId);
    if (!enrollment) throw noEnrollmentFound();

    const ticket = await findTickects(enrollment.id);

    if (!ticket) throw ticketNotFound();

    if (ticket.status === "RESERVED") throw ticketNotPaid();

    const ticketType = await findTickectByType(ticket.ticketTypeId);
    if (ticketType.includesHotel === false) throw ticketDoesNotIncludesHotel();

    const hotels = await selectHotels();
    return hotels;
};

export const findHotelRooms = async (userId: number, hotelId: number) => {
    const enrollment = await enrollmentRepository.findUserEnrollment(userId);
    if (!enrollment) throw noEnrollmentFound();

    const ticket = await findTickects(enrollment.id);
    if (!ticket) throw ticketNotFound();

    if (ticket.status !== "PAID") throw ticketNotPaid();

    const ticketType = await findTickectByType(ticket.ticketTypeId);

    if (ticketType.includesHotel === false) throw ticketDoesNotIncludesHotel();

    const hotel = await selectHotelById(hotelId);
    if (!hotel) throw hotelNotFound();

    const hotelRooms = await selectRoomsByHotel(hotelId);
    if (!hotelRooms) throw roomsNotFound();

    return {
        ...hotel,
        Rooms: hotelRooms,
    };
};