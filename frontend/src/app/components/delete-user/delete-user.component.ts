import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rate } from 'src/app/models/rate';
import { User } from 'src/app/models/user';
import { RatingService } from 'src/app/services/rating.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  usersList: User[] = []
  ratingsList: Rate[] = []
  loading: boolean = true
  loading2: boolean = true

  constructor(public router: Router, private userService: UserService, private reservationService: ReservationsService, private ratingService: RatingService) {
    userService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    userService.getUsers().subscribe(next => {
      this.usersList = next
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

  deleteUserRate(id: string) {
    for (let rating of this.ratingsList) {
      if (rating.user === id)
        this.ratingService.removeRating(rating._id)
    }
  }


  // delete user, user reservations, user rating
  deleteUser(user: User) {
    for (let reservation of user.reservations) {
      this.reservationService.removeReservation(reservation.reservation, user._id)
    }
    this.deleteUserRate(user._id)
    this.userService.removeUser(user._id)
  }

}
