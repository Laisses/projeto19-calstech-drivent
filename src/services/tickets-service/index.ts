import { findTickectTypes } from "@/repositories/tickets-repository";

export const getTicketsTypes = async () => {
    const tickets = await findTickectTypes();
    return tickets;
}