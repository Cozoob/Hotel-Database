import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation';
import { Room } from 'src/app/models/room';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-delete-reservations',
  templateUrl: './delete-reservations.component.html',
  styleUrls: ['./delete-reservations.component.css']
})
export class DeleteReservationsComponent implements OnInit {
  reservationsList: Reservation[] = []
  roomsList: Room[] = []
  loading: boolean = true
  loading2: boolean = true

  constructor(public router: Router, private authService: AuthService, private reservationsService: ReservationsService, private roomService: RoomsService) {
    reservationsService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    reservationsService.getReservations().subscribe(next => {
      this.reservationsList = next
    })

    roomService.getLoading$().subscribe(
      next => {
        this.loading2 = next
      }
    )

    roomService.getRooms().subscribe(next => {
      this.roomsList = next
    })
  }

  ngOnInit(): void {
  }

  formatDate(date: Date) {
    let newDate = date.toString()
    newDate = newDate.substring(0, newDate.indexOf('T'))
    return newDate
  }

  removeReservation(reservation: Reservation, uid: string) {

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var dayDifference = (new Date(reservation.date).getTime() - new Date(date).getTime()) / 86400000;

    // admin może usunąć każdą rezerwacje z przyszłości
    if (dayDifference >= 0) {
      this.reservationsService.removeReservation(reservation._id, uid)
    }
    else {
      alert("Admin can delete bookings that start in a minimum of 0 days")
    }

  }

}
