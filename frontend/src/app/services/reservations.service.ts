import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
import { Room } from '../models/room';
import { ApiConnectionService } from './api-connection.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  allReservations: Reservation[] = []
  observableAllReservations = new BehaviorSubject<Reservation[]>(this.allReservations)
  loading$ = new BehaviorSubject<boolean>(true)
  reservationsObservers: Map<string, BehaviorSubject<Reservation | null>> = new Map<string, BehaviorSubject<Reservation | null>>()

  selectedReservations: Set<Reservation> = new Set<Reservation>()
  observableSelectedReservations = new BehaviorSubject<Set<Reservation>>(this.selectedReservations)

  constructor(private http: HttpClient, private api: ApiConnectionService, private userService: UserService, private authService: AuthService) {
    this.authService.getSessionStatus$().subscribe(
      _ => {
        this.loading$.next(true)
        this.update()
      }
    )

    this.loading$.next(true)
    this.update()
  }

  update() {
    this.getAllReservations().subscribe(next => {
      this.updateServiceAndObservers(next)
    },
      error => {
        this.loading$.next(false)
      }
    )
  }

  private updateServiceAndObservers(nextAllReservations: Reservation[]) {
    this.allReservations = nextAllReservations
    this.observableAllReservations.next(this.allReservations)
    this.updateObservedReservations()
    this.loading$.next(false)
  }

  updateObservedReservations() {
    for (let reservation of this.allReservations) {
      if (this.reservationsObservers.has(reservation._id)) { // @ts-ignore
        this.reservationsObservers.get(reservation._id).next(reservation)
      }
    }
  }

  private getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.api.RESERVATIONS_URL, { withCredentials: true })
  }


  getLoading$() {
    return this.loading$.asObservable()
  }


  getReservations(): Observable<Reservation[]> {
    return this.observableAllReservations.asObservable()
  }


  async addReservation(room: string, roomPrice: number, date: Date, numberOfDays: number) {
    let user = this.userService.getUserData()
    if (user === null)
      return

    let Reservation = {
      room: room,
      amount: roomPrice * numberOfDays,
      date: date,
      numberOfDays: numberOfDays,
      user: user._id
    }

    let headers = new HttpHeaders({ "Content-Type": "application/json" })
    let newReservation: Reservation = await firstValueFrom(this.http.post<Reservation>(this.api.RESERVATIONS_URL + `/${user._id}`, Reservation, { headers }))
    this.allReservations.push(newReservation)
    this.observableAllReservations.next(this.allReservations)
  }


  removeReservation(rid: string, uid: string) {
    this.http.delete(this.api.RESERVATIONS_URL + `/${uid}/${rid}`).subscribe({
      next: (res) => {
        for (let i = 0; i < this.allReservations.length; i++) {
          if (this.allReservations[i]._id === rid) {
            this.allReservations.splice(i, 1)
          }
        }
      }
    })
  }

}
