import { RoomReservation } from "./room-reservation";

export interface Reservation {
    _id: string,
    rooms: RoomReservation[],
    amount: number,
    date: string,
    numberOfDays: number,
    __v: number
}