import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rate } from 'src/app/models/rate';
import { Reservation } from 'src/app/models/reservation';
import { Room } from 'src/app/models/room';
import { AuthService } from 'src/app/services/auth.service';
import { RatingService } from 'src/app/services/rating.service';
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
  ratingsList: Rate[] = []
  loading: boolean = true
  loading2: boolean = true
  loading3: boolean = true

  constructor(public router: Router, private authService: AuthService, private reservationsService: ReservationsService, private roomService: RoomsService, private ratingService: RatingService) {
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

    ratingService.getLoading$().subscribe(
      next => {
        this.loading2 = next
      }
    )

    ratingService.getRatings().subscribe(next => {
      this.ratingsList = next
    })
  }

  ngOnInit(): void {
  }

  formatDate(date: Date) {
    let newDate = date.toString()
    newDate = newDate.substring(0, newDate.indexOf('T'))
    return newDate
  }

  removeReservationRate(id: string) {
    for (let rating of this.ratingsList) {
      if (rating.reservation === id)
        this.ratingService.removeRating(rating._id)
    }
  }

  removeReservation(reservation: Reservation, uid: string) {

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var dayDifference = (new Date(reservation.date).getTime() - new Date(date).getTime()) / 86400000;

    // admin może usunąć każdą rezerwacje z przyszłości
    if (dayDifference >= 0) {
      this.removeReservationRate(reservation._id)
      this.reservationsService.removeReservation(reservation._id, uid)
    }
    else {
      alert("Admin can delete bookings that start in a minimum of 0 days")
    }

  }

}
