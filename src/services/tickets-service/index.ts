import { findTickectTypes, findTickects, findTickectByType, insertTicket } from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";
import { CompleteTicket } from "@/protocols";
import { TicketStatus } from "@prisma/client";

export const getTicketsTypes = async () => {
    const tickets = await findTickectTypes();

    if (tickets) {
        return tickets;
    }
};

export const getTicket = async (userId: number): Promise<CompleteTicket> => {
    const enrollment = await enrollmentRepository.findUserEnrollment(userId);

    const ticketInfo = await findTickects(enrollment.id);

    if (!ticketInfo) throw notFoundError();

    const ticketType = await findTickectByType(ticketInfo.id);

    return {
        id: ticketInfo.id,
        status: ticketInfo.status,
        ticketTypeId: ticketInfo.ticketTypeId,
        enrollmentId: ticketInfo.enrollmentId,
        TicketType: ticketType,
        createdAt: ticketInfo.createdAt,
        updatedAt: ticketInfo.updatedAt,
    }
};

export const createTicket = async (ticketTypeId: number, userId: number) => {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

    const ticket = {
        status: TicketStatus.RESERVED,
        TicketType: { connect: { id: ticketTypeId } },
        Enrollment: { connect: { id: enrollment.id } },
    };

    await insertTicket(ticket);

    const completedTicket = getTicket(userId);
    return completedTicket;
};