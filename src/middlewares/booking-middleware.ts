import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { prisma } from "@/config";

export const validateBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { userId } = req;

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId }
  });

  if (!enrollment) return res.sendStatus(httpStatus.NOT_FOUND);

  const ticket = await prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollment.id
    }
  });

  if (!ticket) return res.sendStatus(httpStatus.FORBIDDEN);
  if (ticket.status === "RESERVED") return res.sendStatus(httpStatus.FORBIDDEN);

  const ticketType = await prisma.ticketType.findUnique({
    where: {
      id: ticket.ticketTypeId
    }
  });

  if (ticketType.isRemote === true) return res.sendStatus(httpStatus.FORBIDDEN);
  if (ticketType.includesHotel === false) return res.sendStatus(httpStatus.FORBIDDEN);

  next();
};
