import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectionService {
  readonly BASE_URL = "http://localhost:8000/"
  readonly ROOMS_URL = this.BASE_URL + "rooms"
  readonly USER_URL = this.BASE_URL + "user"
  readonly SIGNIN_URL = this.BASE_URL + "login"
  readonly SIGNUP_URL = this.BASE_URL + "register"
  readonly RESERVATIONS_URL = this.BASE_URL + "reservations"
  readonly REFRESH_TOKEN_URL = this.BASE_URL + "token/refresh"
  readonly RATING_URL = this.BASE_URL + "rating"
  constructor() { }
}
