import { getPayment } from "@/services";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { Response } from "express";

export const getPaymentInfo = async (req: AuthenticatedRequest, res: Response) => {
    const { ticketId } = req.query;
    const { userId } = req;

    try {
        const payment = await getPayment(Number(ticketId), userId);
        res.status(httpStatus.OK).send(payment);
    } catch (error) {
        if (error.name === "TicketIdNotSend") {
            res.sendStatus(httpStatus.BAD_REQUEST);
        }
        if (error.name === "PaymentIdNotFound" || error.name === "TicketIdNotFound" || error.name === "UserNotFound") {
            res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === "TickedDoesNotBelongToUserError") {
            res.sendStatus(httpStatus.UNAUTHORIZED);
        }
    }
};
