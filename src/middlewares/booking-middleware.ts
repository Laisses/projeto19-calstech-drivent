import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { findTickects, findTickectByType } from "@/repositories/tickets-repository";
import httpStatus from "http-status";

export const validateBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const {userId} = req;

    const enrollment = await enrollmentRepository.findUserEnrollment(userId);
    if (!enrollment) return res.sendStatus(httpStatus.NOT_FOUND);

    const ticket = await findTickects(enrollment.id);
    if (!ticket) return res.sendStatus(httpStatus.FORBIDDEN);
    if (ticket.status === "RESERVED") return res.sendStatus(httpStatus.FORBIDDEN);

    const ticketType = await findTickectByType(ticket.ticketTypeId);
    if (ticketType.isRemote === false) return res.sendStatus(httpStatus.FORBIDDEN);
    if (ticketType.includesHotel === false) return res.sendStatus(httpStatus.FORBIDDEN);

    next();
};
