import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

export const findPayment = async (ticketId: number) => {
  return prisma.payment.findFirst({
    where: {
      ticketId
    }
  });
};

export const insertPayment = async (data: Prisma.PaymentCreateInput) => {
  return prisma.payment.create({
    data
  });
};
