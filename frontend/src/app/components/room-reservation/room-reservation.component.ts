import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Reservation } from 'src/app/models/reservation';
import { Room } from 'src/app/models/room';
import { ReservationsService } from 'src/app/services/reservations.service';

@Component({
  selector: 'app-room-reservation',
  templateUrl: './room-reservation.component.html',
  styleUrls: ['./room-reservation.component.css']
})
export class RoomReservationComponent implements OnInit {
  @Input() room!: Room;
  reservationsList: Reservation[] = []
  loading: boolean = true

  constructor(private reservationService: ReservationsService) {
    reservationService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    reservationService.getReservations().subscribe(next => {
      this.reservationsList = next
    })
  }

  ngOnInit(): void {
  }

  reservationForm = new FormGroup({
    from: new FormControl(null, Validators.required),
    noDays: new FormControl(null, Validators.required),
  })

  isRoomAvailable(room: Room, from: Date, noDays: number) {
    let cnt = 0

    //new reservation start and end date
    from = new Date(from)
    let to = new Date(from)
    let newStart = from.setDate(from.getDate())
    let newEnd = to.setDate(to.getDate() + noDays)

    for (let reservation of this.reservationsList) {
      if (reservation.room === this.room._id) {
        // creted reservation start and end date
        let fromR = new Date(reservation.date)
        let toR = new Date(reservation.date)
        let start = fromR.setDate(fromR.getDate())
        let end = toR.setDate(toR.getDate() + reservation.numberOfDays)

        if ((start < newEnd && newEnd <= end) || (start <= newStart && newStart < end) || (start <= newStart && newEnd <= end)) {
          cnt++
        }

      }
    }
    if (cnt < room.maxAvailableNumber)
      return true
    return false
  }

  onSubmit() {
    let form = this.reservationForm.value;

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var dayDifference = (new Date(form.from).getTime() - new Date(date).getTime()) / 86400000;


    if (this.reservationForm.valid && this.room !== null) {

      // nie można tworzyć rezerwacji w przeszłości
      if (dayDifference >= 0) {

        // nie można zarezerwować więcej tego typu pokoju w podanej dacie niż room.maxAvailableNumber
        if (this.isRoomAvailable(this.room, form.from, form.noDays)) {
          this.reservationService.addReservation(this.room._id, this.room.price, form.from, form.noDays)
          this.reservationService.update()
          this.reservationForm.reset();
          alert("Reservation created")
        }
        else {
          alert("Not enough available rooms in this term")
        }

      }
      else {
        alert("You can't create reservation for the day in the past ")
      }
    }
    else {
      alert("Reservation cant be added")
    }
  }
}
