import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Rate } from '../models/rate';
import { ApiConnectionService } from './api-connection.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  allRatings: Rate[] = []
  observableAllRatings = new BehaviorSubject<Rate[]>(this.allRatings)
  loading$ = new BehaviorSubject<boolean>(true)
  ratingsObservers: Map<string, BehaviorSubject<Rate | null>> = new Map<string, BehaviorSubject<Rate | null>>()

  selectedRatings: Set<Rate> = new Set<Rate>()
  observableSelectedRatings = new BehaviorSubject<Set<Rate>>(this.selectedRatings)

  constructor(private http: HttpClient, private api: ApiConnectionService, private authService: AuthService) {
    this.authService.getSessionStatus$().subscribe(
      _ => {
        this.loading$.next(true)
        this.update()
      }
    )
    this.loading$.next(true)
    this.update()

    this.getRatings().subscribe(
      next => {
        this.allRatings = next
      }
    )
  }

  getRatingsData() {
    return this.allRatings
  }

  update() {
    this.getAllRatings().subscribe(
      next => {
        this.updateServiceAndObservers(next)
      },
      error => {
        this.loading$.next(false)
      }
    )
  }

  private updateServiceAndObservers(nextAllRatings: Rate[]) {
    this.allRatings = nextAllRatings
    this.observableAllRatings.next(this.allRatings)
    this.updateObservedRatings()
    this.loading$.next(false)
  }

  updateObservedRatings() {
    for (let rating of this.allRatings) {
      if (this.ratingsObservers.has(rating.room)) { // @ts-ignore
        this.ratingsObservers.get(rating.room).next(rating)
      }
    }
  }

  private getAllRatings(): Observable<Rate[]> {
    return this.http.get<Rate[]>(this.api.RATING_URL, { withCredentials: true })
  }


  getLoading$() {
    return this.loading$.asObservable()
  }


  getRatings(): Observable<Rate[]> {
    return this.observableAllRatings.asObservable()
  }

  async addRate(room: string, user: string, reservation: string, rating: number) {
    let rate = {
      user: user,
      reservation: reservation,
      rating: rating
    }

    let headers = new HttpHeaders({ "Content-Type": "application/json" })

    let newRating: Rate = await firstValueFrom(this.http.post<Rate>(this.api.RATING_URL + `/${room}`, rate, { headers }))
    this.allRatings.push(newRating)
    this.observableAllRatings.next(this.allRatings)
  }

  removeRating(id: string) {
    this.http.delete(this.api.RATING_URL + `/${id}`).subscribe({
      next: (res) => {
        for (let i = 0; i < this.allRatings.length; i++) {
          if (this.allRatings[i]._id === id) {
            this.allRatings.splice(i, 1)
          }
        }
      }
    })
  }
}

