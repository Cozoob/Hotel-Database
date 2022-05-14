export interface Reservation {
    _id: string,
    room: string,
    amount: number,
    date: Date,
    numberOfDays: number,
    user: string,
    __v: number
}