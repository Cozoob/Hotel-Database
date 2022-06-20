import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Reservation } from 'src/app/models/reservation';
import { ReservationsService } from 'src/app/services/reservations.service';
import { UserReservation } from 'src/app/models/user-reservations';
import { UserService } from 'src/app/services/user.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Room } from 'src/app/models/room';
import { RatingService } from 'src/app/services/rating.service';
import { Rate } from 'src/app/models/rate';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  user: User | null = null
  reservationsList: Reservation[] = []
  roomsList: Room[] = []
  ratingsList: Rate[] = []
  loading: boolean = true
  loading2: boolean = true
  loading3: boolean = true
  loading4: boolean = true

  constructor(private authService: AuthService, private reservationsService: ReservationsService, public userService: UserService, private roomService: RoomsService, private ratingService: RatingService) {
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

    this.user = userService.getUserData()

    authService.getLoggedUser$().subscribe(
      next => {
        this.user = next
      }
    )

    ratingService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    ratingService.getRatings().subscribe(next => {
      this.ratingsList = next
    })
  }


  myReservations() {
    let myReservationsList: Reservation[] = []
    if (this.user === null)
      return myReservationsList

    for (let reservation of this.reservationsList) {
      for (let myRes of this.user.reservations) {
        if (myRes.reservation === reservation._id)
          myReservationsList.push(reservation)
      }
    }

    return myReservationsList
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

    // można usunąć jedynie rezerwacje z przyszłosci
    if (dayDifference >= 0) {
      this.removeReservationRate(reservation._id)
      this.reservationsService.removeReservation(reservation._id, uid)
    }
    else {
      alert("You can delete bookings that start in a minimum of 7 days")
    }
  }

  items: number[] = [1, 2, 3, 4, 5];
  item: number = 5;
  currentPage: number = 0;

  rateForm = new FormGroup({
    item: new FormControl()
  })

  itemChoice() {
    this.item = this.rateForm.value.item;
  }

  haveReserrvationRate(id: string) {
    for (let rating of this.ratingsList) {
      if (rating.reservation === id)
        return true
    }
    return false
  }

  addRating(room: string, user: string, reservation: string, rating: number) {
    if (!this.haveReserrvationRate(reservation)) {
      this.ratingService.addRate(room, user, reservation, rating)
      alert("Rate added")
    }
    else {
      alert("Can't add more than one rate to one reservation")
    }
  }
}
