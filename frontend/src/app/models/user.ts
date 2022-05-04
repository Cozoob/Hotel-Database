import { Reservation } from "./reservation";

export interface User {
    _id: string,
    username: string,
    email: string,
    passwordHash: string,
    roleID: number,
    reservations: Reservation[]
}