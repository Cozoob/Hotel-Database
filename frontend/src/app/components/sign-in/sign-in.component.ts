import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    let form = this.signInForm.value;

    this.authService.login(form.eMail, form.password).subscribe(
      next => {
        this.authService.setSession(next)
        this.router.navigateByUrl('/my-account')
      },
      error => {
        this.signInForm.reset()
        alert("Incorrect data")
      }
    )
  }

}
