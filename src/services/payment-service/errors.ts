import { ApplicationError } from "@/protocols";

export function ticketIdNotSendError(): ApplicationError {
    return {
      name: "TicketIdNotSend",
      message: "You must use a ticked id on your request",
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
      name: "TicketIdNotFound",
      message: "This ticket was not found",
    };
  }

  export function userdNotFoundError(): ApplicationError {
    return {
      name: "UserNotFound",
      message: "The userId was not found",
    };
  }

  export function tickedDoesNotBelongToUserError(): ApplicationError {
    return {
      name: "TickedDoesNotBelongToUserError",
      message: "This ticket could not be connect to this user",
    };
  }