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

export const insertTicket = async (data: Prisma.TicketCreateInput) => {
  return prisma.ticket.create({
    data
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
