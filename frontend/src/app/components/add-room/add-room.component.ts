import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  roomForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    maxAvailableNumber: new FormControl(null, [Validators.required, Validators.min(1)]),
    price: new FormControl(null, [Validators.required, Validators.min(1)]),
    description: new FormControl(null, Validators.required),
    imageLink: new FormControl(null, Validators.required)
  });

  constructor(private roomService: RoomsService, public router: Router,) { }

  ngOnInit(): void {
  }

  onSubmit() {
    let form = this.roomForm.value;

    if (this.roomForm.valid) {
      this.roomService.addRoom(form.name, form.maxAvailableNumber, form.price, form.description, form.imageLink)
      this.roomService.update()
      this.roomForm.reset();
      alert("Room created")
    }
    else {
      alert("Room can't be added")
    }

  }

}
