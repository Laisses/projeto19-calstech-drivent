import { findHotels, findHotelRooms } from "@/services";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { Response } from "express";

export const showHotels = (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req;

    try {
        const hotels = findHotels(userId);
        res.status(httpStatus.OK).send(hotels);
    } catch (error) {
        if (error.name === "TicketNotPaid" || error.name === "TicketDoesNotIncludesHotel") {
            res.sendStatus(httpStatus.FORBIDDEN);
        }
        if (error.name === "TicketNotFound" || error.name === "NoEnrollmentFound") {
            res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
};

export const showHotelById = (req: AuthenticatedRequest, res: Response) => {
    const { hotelId } = req.params;
    const { userId } = req;

    try {
        const hotelRooms = findHotelRooms(userId, Number(hotelId));
        res.status(httpStatus.OK).send(hotelRooms);
    } catch (error) {
        if (error.name === "TicketNotPaid" || error.name === "TicketDoesNotIncludesHotel") {
            res.sendStatus(httpStatus.FORBIDDEN);
        }
        if (error.name === "TicketNotFound" || error.name === "NoEnrollmentFound" || "HotelNotFound" || "RoomsNotFound") {
            res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
};
