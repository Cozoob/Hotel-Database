import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
import { Room } from '../models/room';
import { ApiConnectionService } from './api-connection.service';

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

  constructor(private http: HttpClient, private api: ApiConnectionService) {
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


  // async addReservation(rooms: Room[], amount: number, date: string, numberOfDays: number) {
  //   let Reservation = {
  //     rooms: rooms,
  //     amount: amount,
  //     date: date,
  //     numberOfDays: numberOfDays
  //   }

  //   let headers = new HttpHeaders({ "Content-Type": "application/json" })
  //   let newReservation: Reservation = await firstValueFrom(this.http.post<Reservation>(this.api.RESERVATIONS_URL, Reservation, { headers }))
  //   this.allReservations.push(newReservation)
  //   this.observableAllReservations.next(this.allReservations)
  // }


  // removeReservation(id: string) {
  //   this.http.delete(this.api.RESERVATIONS_URL + `/${id}`).subscribe({
  //     next: (res) => {
  //       for (let i = 0; i < this.allReservations.length; i++) {
  //         if (this.allReservations[i]._id === id) {
  //           this.unselectReservation(this.allReservations[i]._id)
  //           this.allReservations.splice(i, 1)
  //         }
  //       }
  //     }
  //   })
  // }


  // unselectReservation(id: string) {
  //   let Reservation = this.getReservationWithID(id)
  //   if (Reservation != null) {
  //     this.selectedReservations.delete(Reservation)
  //     this.observableSelectedReservations.next(this.selectedReservations)
  //   }
  // }


  // getReservationWithID(id: string): Reservation | null {
  //   for (let Reservation of this.allReservations) {
  //     if (Reservation._id === id) {
  //       return Reservation
  //     }
  //   }
  //   return null
  // }
}
