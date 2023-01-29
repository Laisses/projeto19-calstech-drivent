import { findTickectTypes, findTickects, findTickectByType } from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { invalidDataError, notFoundError } from "@/errors";

export const getTicketsTypes = async () => {
    const tickets = await findTickectTypes();

    if (tickets) {
        return tickets;
    }
};

export const getTicket = async (userId: number) => {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

    const ticketInfo = await findTickects(enrollment.id);

    if (!ticketInfo) throw notFoundError();

    const ticketType = await findTickectByType(ticketInfo.id);

    return {
        id: ticketInfo.id,
        status: ticketInfo.status,
        ticketTypeId: ticketInfo.ticketTypeId,
        enrollmentId: ticketInfo.enrollmentId,
        TicketType: {
            id: ticketType.id,
            name: ticketType.name,
            price: ticketType.price,
            isRemote: ticketType.isRemote,
            includesHotel: ticketType.includesHotel,
            createdAt: ticketType.createdAt,
            updatedAt: ticketType.updatedAt,
        },
        createdAt: ticketInfo.createdAt,
        updatedAt: ticketInfo.updatedAt,
    }
};

export const createTicket = async (ticketTypeId: number, userId: number) => {
    console.log("criou");
};