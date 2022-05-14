import { AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rate } from 'src/app/models/rate';
import { Reservation } from 'src/app/models/reservation';
import { Room } from 'src/app/models/room';
import { RatingService } from 'src/app/services/rating.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-room',
  templateUrl: './delete-room.component.html',
  styleUrls: ['./delete-room.component.css']
})
export class DeleteRoomComponent implements AfterViewChecked, OnInit, OnChanges {
  roomsList: Room[] = []
  reservationsList: Reservation[] = []
  ratingsList: Rate[] = []
  loading: boolean = true
  loading2: boolean = true
  loading3: boolean = true

  constructor(public router: Router, public roomService: RoomsService, private cd: ChangeDetectorRef, public userService: UserService, private activatedRoute: ActivatedRoute, private reservationService: ReservationsService, private ratingService: RatingService) {
    roomService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    roomService.getRooms().subscribe(next => {
      this.roomsList = next
    })

    reservationService.getLoading$().subscribe(
      next => {
        this.loading2 = next
      }
    )

    reservationService.getReservations().subscribe(next => {
      this.reservationsList = next
    })

    ratingService.getLoading$().subscribe(
      next => {
        this.loading3 = next
      }
    )

    ratingService.getRatings().subscribe(next => {
      this.ratingsList = next
    })
  }

  ngOnInit(): void {
  }


  ngAfterViewChecked() {
    this.cd.detectChanges()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cd.detectChanges()
  }

  removeRoomRate(id: string) {
    for (let rating of this.ratingsList) {
      if (rating.room === id)
        this.ratingService.removeRating(rating._id)
    }
  }

  // remove room, all room reservations, all room ratings
  removeRoom(room: Room) {
    for (let reservation of this.reservationsList) {
      if (reservation.room == room._id) {
        this.reservationService.removeReservation(reservation._id, reservation.user)
      }
    }
    this.removeRoomRate(room._id)
    this.roomService.removeRoom(room._id)
  }

}
