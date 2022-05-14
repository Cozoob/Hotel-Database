import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Reservation } from 'src/app/models/reservation';
import { ReservationsService } from 'src/app/services/reservations.service';
import { UserReservation } from 'src/app/models/user-reservations';
import { UserService } from 'src/app/services/user.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Room } from 'src/app/models/room';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  user: User | null = null
  reservationsList: Reservation[] = []
  roomsList: Room[] = []
  loading: boolean = true
  loading2: boolean = true
  loading3: boolean = true


  constructor(private authService: AuthService, private reservationsService: ReservationsService, public userService: UserService, private roomService: RoomsService) {
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
  }

  myReservations() {
    let myReservationsList: Reservation[] = []
    if (this.user === null)
      return myReservationsList

    for (let myRes of this.user.reservations) {
      for (let reservation of this.reservationsList) {
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

  removeReservation(reservation: Reservation, uid: string) {

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var dayDifference = (new Date(reservation.date).getTime() - new Date(date).getTime()) / 86400000;

    // można usunąć rezerwacje minimum z 7 dniowym wyprzedzeniem
    if (dayDifference >= 7) {
      this.reservationsService.removeReservation(reservation._id, uid)
    }
    else {
      alert("You can delete bookings that start in a minimum of 7 days")
    }

  }
}
