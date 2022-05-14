import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectionService {
  BASE_URL = "http://localhost:3000"
  ROOMS_URL = "http://localhost:3000/rooms"
  USER_URL = "http://localhost:3000/user"
  SIGNIN_URL = "http://localhost:3000/login"
  SIGNUP_URL = "http://localhost:3000/register"
  RESERVATIONS_URL = "http://localhost:3000/reservations"
  REFRESH_TOKEN_URL = 'http://localhost:3000/token/refresh'
  RATING_URL = 'http://localhost:3000/rating'
  constructor() { }
}
