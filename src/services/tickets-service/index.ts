import { findTickectTypes, findTickects } from "@/repositories/tickets-repository";
import { Ticket, TicketType } from "@prisma/client";

export const getTicketsTypes = async () => {
    const tickets = await findTickectTypes();

    if (tickets) {
        return tickets;
    }
};

export const getTickets = async () => {
    const tickets = await findTickects();

    if (!tickets) {

    }
    return tickets;
}