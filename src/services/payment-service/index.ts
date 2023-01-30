import { findPayment, insertPayment } from "@/repositories/payment-repository";
import { findTickectById, findTickectByType, updateTicketStatus } from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { PaymentRequest } from "@/protocols";
import { TicketStatus } from "@prisma/client";
import { ticketIdNotSendError, paymentIdNotFoundError, ticketIdNotFoundError, userdNotFoundError, ticketDoesNotBelongToUserError, missingPaymentDataError } from "./errors";

export const getPayment = async (ticketId: number, reqUserId: number) => {
  if (isNaN(ticketId)) throw ticketIdNotSendError();

  const ticket = await findTickectById(ticketId);
  if (!ticket) throw ticketIdNotFoundError();

  const enrollmentId = ticket.enrollmentId;
  const user = await enrollmentRepository.findUserByEnrollmentId(enrollmentId);

  if (!user) throw userdNotFoundError();

  const userId = user.userId;
  if (userId !== reqUserId) throw ticketDoesNotBelongToUserError();

  const payment = await findPayment(ticketId);
  if (!payment) throw paymentIdNotFoundError();

  return payment;
};

export const postPayment = async (body: PaymentRequest, reqUserId: number) => {
  if (!body.cardData || !body.ticketId) throw missingPaymentDataError();

  const ticket = await findTickectById(Number(body.ticketId));
  if (!ticket) throw ticketIdNotFoundError();

  const enrollmentId = ticket.enrollmentId;
  const user = await enrollmentRepository.findUserByEnrollmentId(enrollmentId);

  if (!user) throw userdNotFoundError();

  const userId = user.userId;
  if (userId !== reqUserId) throw ticketDoesNotBelongToUserError();

  const ticketType = await findTickectByType(ticket.ticketTypeId);

  const price = ticketType.price;
  const cardNumbers = body.cardData.number;
  const lastDigits = String(cardNumbers).slice(-4);

  const paymentInfo = {
    Ticket: { connect: { id: body.ticketId } },
    value: price,
    cardIssuer: body.cardData.issuer,
    cardLastDigits: lastDigits
  };

  await insertPayment(paymentInfo);

  const status = TicketStatus.PAID;

  await updateTicketStatus(status, body.ticketId);

  const confirmation = await findPayment(body.ticketId);
  return confirmation;
};
