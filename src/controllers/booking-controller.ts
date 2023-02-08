import { findBooking } from "@/services";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { Response } from "express";

export const showBooking = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req;

    try {
        const booking = await findBooking(userId);
        res.status(httpStatus.OK).send(booking);
    } catch (error) {
        if (error.name === "BookingNotFound" || error.name === "RoomNotFound") {
            res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
};
