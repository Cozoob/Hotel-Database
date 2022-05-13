import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData: User | null = null

  constructor(private authService: AuthService) {
    authService.getLoggedUser$().subscribe(
      next => {
        this.userData = next
      }
    )
  }

  getUserData() {
    return this.userData
  }

  isLoggedIn() {
    return this.authService.isLoggedIn() && this.userData != null
  }

  isAdmin() {
    return this.userData !== null ? this.userData.roleID == 0 : false
  }

  isEmployee() {
    return this.userData !== null ? this.userData.roleID == 1 : false
  }

  isClient() {
    return this.userData !== null ? this.userData.roleID == 2 : false
  }
}
