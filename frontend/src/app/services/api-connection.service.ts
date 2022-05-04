import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectionService {
  BASE_URL = "http://localhost:3000"
  ROOMS_URL = "http://localhost:3000/rooms"
  USER_URL = "http://localhost:3000/user"

  constructor() { }
}
