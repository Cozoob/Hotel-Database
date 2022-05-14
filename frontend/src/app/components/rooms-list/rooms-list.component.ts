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

  calculateRoomRating(id: string) {
    let sum = 0
    let arr = this.ratingsList.filter(res => res.room === id)

    for (let rating of arr) {
      sum += rating.rating
    }

    let avg = 0
    if (sum != 0) {
      avg = sum / arr.length
    }

    return {
      room: id,
      rating: avg,
      amountOfRatings: arr.length
    }
  }

  getRoomRatingsList() {
    let result: RoomRate[] = []
    for (let room of this.roomsList) {
      result.push(this.calculateRoomRating(room._id))
    }

    return result
  }


}
