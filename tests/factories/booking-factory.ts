import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createInvalidBooking(userId: number) {
    return prisma.booking.create({
        data: {
            userId,
            roomId: 0
        }
    });
}