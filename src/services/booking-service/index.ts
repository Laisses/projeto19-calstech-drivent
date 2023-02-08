import { selectHotels, selectHotelById, selectRoomsByHotel } from "@/repositories/hotels-repository";
import { findTickects, findTickectByType } from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { noEnrollmentFound, ticketNotFound, ticketNotPaid, ticketDoesNotIncludesHotel, hotelNotFound, roomsNotFound } from "../hotels-service/errors";