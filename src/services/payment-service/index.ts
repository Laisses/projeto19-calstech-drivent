import { findPayment } from "@/repositories/payment-repository";
import { findTickectById } from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";
import { CompleteTicket } from "@/protocols";
import { TicketStatus } from "@prisma/client";
import { ticketIdNotSendError, paymentIdNotFoundError, ticketIdNotFoundError, userdNotFoundError, tickedDoesNotBelongToUserError } from "./errors";

export const getPayment = async (ticketId: number, reqUserId: number) => {
    if (isNaN(ticketId)) throw ticketIdNotSendError();

    const ticket = await findTickectById(ticketId);
    if (!ticket) throw ticketIdNotFoundError();

    const enrollmentId = ticket.enrollmentId;
    const user = await enrollmentRepository.findUserByEnrollmentId(enrollmentId);

    if (!user) throw userdNotFoundError();

    const userId = user.userId;
    if (userId !== reqUserId) throw tickedDoesNotBelongToUserError();

    const payment = await findPayment(ticketId);
    if (!payment) throw paymentIdNotFoundError();

    return payment;
};