import { getTicketsTypes } from "@/services";
import httpStatus from "http-status";
import { Response, Request } from "express";

export const getTicketsByTypes = async (_req: Request, res: Response) => {
    try {
        const tickets = await getTicketsTypes();
        return res.status(httpStatus.OK).send(tickets);
    } catch (err) {
        console.log(err)
    }
};