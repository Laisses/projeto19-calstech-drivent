import { getTicketsTypes, getTicket, createTicket } from "@/services";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { Response } from "express";

export const getTicketsByTypes = async (_req: AuthenticatedRequest, res: Response) => {
    try {
        const tickets = await getTicketsTypes();
        return res.status(httpStatus.OK).send(tickets);
    } catch (err) {
        console.log(err);
    }
};

export const getTicketByCustomer = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req;

    try {
        const tickets = await getTicket(userId);
        return res.status(httpStatus.OK).send(tickets);
    } catch (err) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
};

export const createNewTicket = async (req: AuthenticatedRequest, res: Response) => {
    //const { userId } = req;
    const userId = 41;
    const { ticketTypeId } = req.body;

    await createTicket(ticketTypeId, userId);
}