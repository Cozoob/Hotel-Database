import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../models/user';
import { ApiConnectionService } from './api-connection.service';
import { TokenService } from './token.service';
import { ApiUrls } from '../enums/api-urls';
import { Reservation } from '../models/reservation';
import { UserReservation } from '../models/user-reservations';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sessionStatus$ = new Subject<boolean>()
  loggedUser$ = new BehaviorSubject<User | null>(null)

  constructor(private tokenService: TokenService,
    private http: HttpClient, private handler: HttpBackend, private api: ApiConnectionService) {
    if (this.isLoggedIn()) {
      this.reLogin()
    } else {
      this.logout()
    }
  }

  getSessionStatus$() {
    return this.sessionStatus$.asObservable()
  }

  getLoggedUser$() {
    return this.loggedUser$.asObservable()
  }

  login(email: string, password: string) {
    return this.http.post<Response>(this.api.SIGNIN_URL, { email: email, password: password })
  }

  logout() {
    this.tokenService.deleteTokens()
    this.sessionStatus$.next(false)
    this.loggedUser$.next(null)
  }

  register(username: string, email: string, password: string) {
    return this.http.post<RegisterResponse>(this.api.SIGNUP_URL, { username: username, email: email, password: password })
  }

  setSession(authResult: Response): boolean {
    if (!authResult.login)
      return false

    const user = authResult.user;

    this.tokenService.setTokens({ access: authResult.access, refresh: authResult.refresh })

    let currentUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      roleID: user.roleID,
      reservations: user.reservations
    }

    this.loggedUser$.next(currentUser)
    this.sessionStatus$.next(true)

    return true
  }

  isLoggedIn() {
    return this.tokenService.isRefreshTokenValid()
  }


  reLogin() {
    if (!this.isLoggedIn())
      return


    return this.http.post<Response>(this.api.REFRESH_TOKEN_URL, { refresh: this.tokenService.getRefreshToken() }).subscribe(
      next => {
        this.setSession(next)
      },
      error => {
        alert("er")
        this.logout()
      }
    )
  }
}

interface Response {
  login: boolean,
  message: string,
  access: string,
  refresh: string,
  user: {
    _id: string,
    username: string,
    email: string,
    passwordHash: string,
    roleID: number,
    reservations: UserReservation[]
  }
}

interface RegisterResponse {
  registration: boolean,
  error: string
}
