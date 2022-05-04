import { Room } from "./room";

export interface Reservation {
    _id: string,
    rooms: Room[],
    amount: number,
    date: string,
    numberOfDays: number
}