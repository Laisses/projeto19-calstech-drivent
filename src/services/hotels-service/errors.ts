import { ApplicationError } from "@/protocols";

export function noEnrollmentFound(): ApplicationError {
  return {
    name: "NoEnrollmentFound",
    message: "No enrollment was found for this user"
  };
}

export function ticketNotFound(): ApplicationError {
  return {
    name: "TicketNotFound",
    message: "This ticket was not found",
  };
}

export function ticketNotPaid(): ApplicationError {
  return {
    name: "TicketNotPaid",
    message: "This ticket was not paid yet",
  };
}

export function ticketDoesNotIncludesHotel(): ApplicationError {
  return {
    name: "TicketDoesNotIncludesHotel",
    message: "This ticket does not includes a hotel option",
  };
}