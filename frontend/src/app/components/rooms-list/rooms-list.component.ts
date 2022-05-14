import { AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from 'src/app/models/room';
import { RoomsService } from 'src/app/services/rooms.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.css']
})
export class RoomsListComponent implements AfterViewChecked, OnInit, OnChanges {
  roomsList: Room[] = []
  loading: boolean = true

  constructor(public roomService: RoomsService, private cd: ChangeDetectorRef, public userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
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

  ngAfterViewChecked() {
    this.cd.detectChanges()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cd.detectChanges()
  }

  reserve(room: Room) {
    this.router.navigate(['/rooms-list/' + room._id], { relativeTo: this.activatedRoute })
  }


}
