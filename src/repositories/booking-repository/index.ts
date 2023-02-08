import { prisma } from "@/config";

export const selectBooking = async (userId: number) => {
    return prisma.booking.findFirst({
        where: {
            userId,
        }
    });
};

export const selectRoom = async (id: number) => {
    return prisma.room.findFirst({
        where: {
            id,
        }
    })
};
