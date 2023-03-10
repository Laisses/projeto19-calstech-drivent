import { findHotels, findHotelRooms } from "@/services";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { Response } from "express";

export const showHotels = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req;

  try {
    const hotels = await findHotels(userId);
    res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "TicketDoesNotIncludesHotel" || error.name ==="TicketIsRemote") {
      res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(error.name === "TicketNotPaid") {
      res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === "TicketNotFound" || error.name === "NoEnrollmentFound") {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
};

export const showHotelById = async (req: AuthenticatedRequest, res: Response) => {
  const { hotelId } = req.params;
  const { userId } = req;

  try {
    const hotelRooms = await findHotelRooms(userId, Number(hotelId));
    res.status(httpStatus.OK).send(hotelRooms);
  } catch (error) {
    if (error.name === "TicketDoesNotIncludesHotel") {
      res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(error.name === "TicketNotPaid") {
      res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === "TicketNotFound" || error.name === "NoEnrollmentFound" || error.name === "HotelNotFound" || error.name === "RoomsNotFound") {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
};
