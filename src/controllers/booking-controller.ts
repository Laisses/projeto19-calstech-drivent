import { chooseRoom, findBooking, changeRoom } from "@/services";
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

export const bookRoom = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req;
    const { roomId } = req.body;

    try {
        const room = await chooseRoom(userId, roomId);
        res.status(httpStatus.OK).send(room);
    } catch (error) {
        if (error.name === "RoomNotFound") {
            res.sendStatus(httpStatus.NOT_FOUND);
        }

        if (error.name === "AtCapacity") {
            res.sendStatus(httpStatus.FORBIDDEN);
        }
    }
};

export const updateBooking = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req;
    const { roomId } = req.body;
    const { bookingId } = req.params;

    try {
        const update = await changeRoom(userId, roomId, Number(bookingId));
        res.status(200).send(update);
    } catch (error) {
        if (error.name === "BookingNotFound" || error.name === "RoomNotFound") {
            res.sendStatus(httpStatus.NOT_FOUND);
        }

        if (error.name === "AtCapacity") {
            res.sendStatus(httpStatus.FORBIDDEN);
        }
    }
};
