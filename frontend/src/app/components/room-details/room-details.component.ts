import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from 'src/app/models/room';
import { ReservationsService } from 'src/app/services/reservations.service';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {
  room: Room | null = null
  roomsList: Room[] = []
  loading: boolean = true
  id: string | null = null

  constructor(private roomService: RoomsService, public router: Router, private activatedRoute: ActivatedRoute, private reservationService: ReservationsService) {

    activatedRoute.paramMap.subscribe(async params => {
      this.id = <string>params.get('id')

      roomService.getLocalRoomObserverWithID(this.id).subscribe(
        next => {
          if (this.id === null)
            return
          this.room = roomService.getLocalRoomWithID(this.id)

        })
    })
  }

  reservationForm = new FormGroup({
    from: new FormControl(null, Validators.required),
    noDays: new FormControl(null, Validators.required),
  })

  ngOnInit() {
  }

}
