import { prisma } from "@/config";

export const findTickectTypes = async () => {
    return prisma.ticketType.findMany();
};

export const findTickects = async (id: number) => {
    return prisma.ticket.findUnique({
        where: {
            id
        }
    });
};

export const insertTicket = async () => {

};