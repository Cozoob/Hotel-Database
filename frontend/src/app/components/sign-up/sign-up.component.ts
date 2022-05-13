import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    let form = this.signUpForm.value;

    this.authService.register(form.login, form.eMail, form.password).subscribe(
      next => {
        alert("Success");
        this.authService.login(form.eMail, form.password).subscribe(
          next => {
            this.authService.setSession(next)
            this.router.navigateByUrl('/my-account')
          }
        )
      },
      error => {
        this.signUpForm.reset()
        alert("Incorrect data")
      }
    )
  }

}
