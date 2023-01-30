import { ApplicationError } from "@/protocols";

export function ticketIdNotSendError(): ApplicationError {
  return {
    name: "TicketIdNotSend",
    message: "You must use a ticket id on your request",
  };
}

export function paymentIdNotFoundError(): ApplicationError {
  return {
    name: "PaymentIdNotFound",
    message: "The payment for this ticket was not found",
  };
}

export function ticketIdNotFoundError(): ApplicationError {
  return {
    name: "TicketIdNotFoundError",
    message: "This ticket was not found",
  };
}

export function userdNotFoundError(): ApplicationError {
  return {
    name: "UserNotFound",
    message: "The userId was not found",
  };
}

export function ticketDoesNotBelongToUserError(): ApplicationError {
  return {
    name: "TicketDoesNotBelongToUserError",
    message: "This ticket could not be connect to this user",
  };
}

export function missingPaymentDataError(): ApplicationError {
  return {
    name: "MissingPaymentDataError",
    message: "Cannot process without cardData or ticket id",
  };
}
