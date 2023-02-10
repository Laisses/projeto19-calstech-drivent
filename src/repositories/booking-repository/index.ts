import { prisma } from "@/config";

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
  });
};

export const updateRoom = async (bookingId: number, roomId: number) => {
  prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    }
  });
};
