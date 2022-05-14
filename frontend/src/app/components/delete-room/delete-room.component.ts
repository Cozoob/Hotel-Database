import { AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation';
import { Room } from 'src/app/models/room';
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
  loading: boolean = true
  loading2: boolean = true

  constructor(public router: Router, public roomService: RoomsService, private cd: ChangeDetectorRef, public userService: UserService, private activatedRoute: ActivatedRoute, private reservationService: ReservationsService) {
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
  }

  ngOnInit(): void {
  }


  ngAfterViewChecked() {
    this.cd.detectChanges()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cd.detectChanges()
  }

  // remove room and all room reservations
  removeRoom(room: Room) {
    for (let reservation of this.reservationsList) {
      if (reservation.room == room._id) {
        this.reservationService.removeReservation(reservation._id, reservation.user)
      }
    }

    this.roomService.removeRoom(room._id)
  }

}
