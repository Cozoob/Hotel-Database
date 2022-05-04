import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm = new FormGroup({
    eMail: new FormControl(null, Validators.required),
    login: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  })

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    //todo
  }

}
