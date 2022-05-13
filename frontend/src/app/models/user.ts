import { UserReservation } from "./user-reservations";

export interface User {
    _id: string,
    username: string,
    email: string,
    passwordHash: string,
    roleID: number,
    reservations: UserReservation[]
}