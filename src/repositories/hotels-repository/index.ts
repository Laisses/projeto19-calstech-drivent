import { prisma } from "@/config";

export const selectHotels = async () => {
  return prisma.hotel.findMany();
};

export const selectHotelById = async (hotelId: number) => {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId
    }
  });
};

export const selectRoomsByHotel = async (hotelId: number) => {
  return prisma.room.findMany({
    where: {
      hotelId
    }
  });
};
