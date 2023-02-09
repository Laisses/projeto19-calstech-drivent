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

export function ticketIsRemote(): ApplicationError {
  return {
    name: "TicketIsRemote",
    message: "This ticket is remote and doesn't allow hotel",
  };
}

export function ticketDoesNotIncludesHotel(): ApplicationError {
  return {
    name: "TicketDoesNotIncludesHotel",
    message: "This ticket does not includes a hotel option",
  };
}

export function hotelNotFound(): ApplicationError {
  return {
    name: "HotelNotFound",
    message: "Hotel not found",
  };
}

export function roomsNotFound(): ApplicationError {
  return {
    name: "RoomsNotFound",
    message: "No rooms were found to this hotel",
  };
}
