import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ReservationsService } from 'src/app/services/reservations.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  usersList: User[] = []
  loading: boolean = true

  constructor(public router: Router, private userService: UserService, private reservationService: ReservationsService) {
    userService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    userService.getUsers().subscribe(next => {
      this.usersList = next
    })
  }

  ngOnInit(): void {
  }

  // delete user and all of his reservations
  deleteUser(user: User) {
    for (let reservation of user.reservations) {
      this.reservationService.removeReservation(reservation.reservation, user._id)
    }

    this.userService.removeUser(user._id)
  }

}
