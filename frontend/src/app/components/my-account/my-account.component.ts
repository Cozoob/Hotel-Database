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
        this.loading = next
      }
    )

    roomService.getRooms().subscribe(next => {
      this.roomsList = next
    })

  }

  ngOnInit(): void {
  }
}
