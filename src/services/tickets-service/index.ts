import { findTickectTypes, findTickects } from "@/repositories/tickets-repository";
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

    if (!enrollment) throw notFoundError();

    const enrollmentId = enrollment.id;

    const tickets = await findTickects(enrollmentId);

    if (!tickets) throw notFoundError();

    return tickets;
}