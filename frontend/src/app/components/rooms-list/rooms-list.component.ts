import { AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from 'src/app/models/room';
import { Rate } from 'src/app/models/rate';
import { RatingService } from 'src/app/services/rating.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { UserService } from 'src/app/services/user.service';
import { RoomRate } from 'src/app/models/room-rate';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.css']
})
export class RoomsListComponent implements AfterViewChecked, OnInit, OnChanges {
  roomsList: Room[] = []
  ratingsList: Rate[] = []
  roomRatingsList: RoomRate[] = []
  loading: boolean = true
  loading2: boolean = true

  constructor(public roomService: RoomsService, private cd: ChangeDetectorRef, public userService: UserService, private router: Router, private activatedRoute: ActivatedRoute, private ratingService: RatingService) {
    roomService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    roomService.getRooms().subscribe(next => {
      this.roomsList = next
    })

    ratingService.getLoading$().subscribe(
      next => {
        this.loading = next
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

  reserve(room: Room) {
    this.router.navigate(['/rooms-list/' + room._id], { relativeTo: this.activatedRoute })
  }

  findRate(id: string) {
    let arr = this.ratingsList.find(x => x.room === id)
    if (arr == null) {
      return null;
    }
    return {
      room: arr.room,
      rating: arr.rating,
      amountOfRatings: arr.amountOfRatings
    }
  }


  getRoomRatingsList() {
    let result = []
    for (let room of this.roomsList) {
      if (this.findRate(room._id) != null) {
        result.push(this.findRate(room._id))
      }
    }

    return result
  }


}
