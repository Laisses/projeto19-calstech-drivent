import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

export const selectBooking = async (userId: number) => {
    return prisma.booking.findFirst({
        where: {
            userId,
        }
    });
};

export const countRoomOccupancy = async (roomId: number): Promise<number> => {
    return prisma.booking.count({
        where: {
            roomId,
        }
    });
};

export const selectRoom = async (id: number) => {
    return prisma.room.findFirst({
        where: {
            id,
        }
    });
};

export const createBooking = async (userId: number, roomId: number) => {
    return prisma.booking.create({
        data: {
            userId,
            roomId
        }
    })
};


/*

import { prisma } from "@/config";
import { Prisma, TicketStatus } from "@prisma/client";

export const findTickectTypes = async () => {
  return prisma.ticketType.findMany();
};

export const findTickectByType = async (id: number) => {
  return prisma.ticketType.findUnique({
    where: {
      id
    }
  });
};

export const findTickectById = async (id: number) => {
  return prisma.ticket.findFirst({
    where: {
      id
    }
  });
};

export const findTickects = async (enrollmentId: number) => {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId
    }
  });
};



export const updateTicketStatus = async (status: TicketStatus, id: number) => {
  return prisma.ticket.update({
    where: { id },
    data: {
      status
    }
  });
};
*/