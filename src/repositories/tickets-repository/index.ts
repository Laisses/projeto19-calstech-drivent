import { prisma } from "@/config";

export const findTickectTypes = async () => {
    return prisma.ticketType.findMany();
};

export const findTickectByType = async (id: number) => {
    return prisma.ticketType.findUnique({
        where: {
            id
        }
    })
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