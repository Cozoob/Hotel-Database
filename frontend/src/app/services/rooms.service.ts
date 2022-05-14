import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Room } from '../models/room';
import { ApiConnectionService } from './api-connection.service';
import { AuthService } from './auth.service';
import { ThrowStmt } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  allRooms: Room[] = []
  observableAllRooms = new BehaviorSubject<Room[]>(this.allRooms)
  loading$ = new BehaviorSubject<boolean>(true)
  roomObservers: Map<string, BehaviorSubject<Room | null>> = new Map<string, BehaviorSubject<Room | null>>()

  selectedRooms: Set<Room> = new Set<Room>()
  observableSelectedRooms = new BehaviorSubject<Set<Room>>(this.selectedRooms)

  constructor(private http: HttpClient, private api: ApiConnectionService, private authService: AuthService) {
    this.authService.getSessionStatus$().subscribe(
      _ => {
        this.loading$.next(true)
        this.update()
      }
    )
    this.loading$.next(true)
    this.update()

    this.getRooms().subscribe(
      next => {
        this.allRooms = next
      }
    )
  }

  getRoomData() {
    return this.allRooms
  }

  update() {
    this.getAllRooms().subscribe(
      next => {
        this.updateServiceAndObservers(next)
      },
      error => {
        this.loading$.next(false)
      }
    )
  }

  private updateServiceAndObservers(nextAllRooms: Room[]) {
    this.allRooms = nextAllRooms
    this.observableAllRooms.next(this.allRooms)
    this.updateObservedRooms()
    this.loading$.next(false)
  }

  updateObservedRooms() {
    for (let room of this.allRooms) {
      if (this.roomObservers.has(room._id)) { // @ts-ignore
        this.roomObservers.get(room._id).next(room)
      }
    }
  }

  private getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.api.ROOMS_URL, { withCredentials: true })
  }


  getLoading$() {
    return this.loading$.asObservable()
  }


  getRooms(): Observable<Room[]> {
    return this.observableAllRooms.asObservable()
  }


  async addRoom(name: string, maxAvailableNumber: number, price: number, description: string, imageLink: string) {
    let room = {
      name: name,
      maxAvailableNumber: maxAvailableNumber,
      price: price,
      description: description,
      imageLink: imageLink
    }

    let headers = new HttpHeaders({ "Content-Type": "application/json" })
    let newRoom: Room = await firstValueFrom(this.http.post<Room>(this.api.ROOMS_URL, room, { headers }))
    this.allRooms.push(newRoom)
    this.observableAllRooms.next(this.allRooms)
  }


  removeRoom(id: string) {
    this.http.delete(this.api.ROOMS_URL + `/${id}`).subscribe({
      next: (res) => {
        for (let i = 0; i < this.allRooms.length; i++) {
          if (this.allRooms[i]._id === id) {
            this.unselectRoom(this.allRooms[i]._id)
            this.allRooms.splice(i, 1)
          }
        }
      }
    })
  }


  unselectRoom(id: string) {
    let room = this.getRoomWithID(id)
    if (room != null) {
      this.selectedRooms.delete(room)
      this.observableSelectedRooms.next(this.selectedRooms)
    }
  }


  getRoomWithID(id: string): Room | null {
    for (let room of this.allRooms) {
      if (room._id === id) {
        return room
      }
    }
    return null
  }

  getLocalRoomWithID(id: string): Room | null {
    for (let room of this.allRooms) {
      if (room._id === id) {
        return room
      }
    }
    return null
  }

  getLocalRoomObserverWithID(id: string): Observable<Room | null> {
    if (this.roomObservers.has(id)) {// @ts-ignore
      return this.roomObservers.get(id).asObservable()
    }

    let room = this.getLocalRoomWithID(id)
    let subject = new BehaviorSubject<Room | null>(room)
    this.roomObservers.set(id, subject)
    return subject
  }

}

interface Response {
  message: string,
  room: Room
}