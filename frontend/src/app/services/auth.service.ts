import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../models/user';
import { ApiConnectionService } from './api-connection.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sessionStatus$ = new Subject<boolean>()
  loggedUser$ = new BehaviorSubject<User | null>(null)

  getSessionStatus$() {
    return this.sessionStatus$.asObservable()
  }

  getLoggedUser$() {
    return this.loggedUser$.asObservable()
  }

  constructor(private http: HttpClient, private api: ApiConnectionService, private router: Router) { }

}
