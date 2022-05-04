import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signInForm = new FormGroup({
    eMail: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  })

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    // todo 
  }

}
