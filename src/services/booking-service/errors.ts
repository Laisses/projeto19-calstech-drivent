import { ApplicationError } from "@/protocols";

export function bookingNotFound(): ApplicationError {
    return {
        name: "BookingNotFound",
        message: "No booking was found for this user"
    };
}

export function roomNotFound(): ApplicationError {
    return {
        name: "RoomNotFound",
        message: "No room was found under this id"
    };
}

export function atCapacity(): ApplicationError {
    return {
        name: "AtCapacity",
        message: "This room is already at full capacity"
    };
}

export function bookingIdAndUserDontMatch(): ApplicationError {
    return {
        name: "BookingIdAndUserDontMatch",
        message: "The bookingId and user don't match"
    };
}
