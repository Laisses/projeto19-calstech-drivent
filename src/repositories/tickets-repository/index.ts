import { prisma } from "@/config";

export const findTickectTypes = async () => {
    return prisma.ticketType.findMany();
};

export const findTickects = async () => {
    return prisma.ticket.findMany();
};

export const insertTicket = async () => {

};
