import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/room';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.css']
})
export class RoomsListComponent implements OnInit {
  roomsList: Room[] = []
  loading: boolean = true

  constructor(private roomService: RoomsService, private cd: ChangeDetectorRef) {
    roomService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    roomService.getRooms().subscribe(next => {
      this.roomsList = next
    })
    console.log(this.roomsList)
  }

  ngOnInit(): void {
  }

  removeRoom(room: Room) {
    this.roomService.removeRoom(room._id)
  }

}
