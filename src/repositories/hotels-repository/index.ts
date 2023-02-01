import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

export const selectHotels = async () => {
  return prisma.hotel.findMany();
}