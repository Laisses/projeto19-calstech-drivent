import { prisma } from "@/config";
import { TicketType } from "@prisma/client";

export const findTickectTypes = async () => {
    return prisma.ticketType.findMany();
};
