import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

export const findPayment = async (ticketId: number) => {
    return prisma.payment.findFirst({
        where: {
            ticketId
        }
    });
};

export const insertTicket = async (data: Prisma.TicketCreateInput) => {
    return prisma.ticket.create({
        data
    });
};