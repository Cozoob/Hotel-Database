import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { ApiConnectionService } from './api-connection.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData: User | null = null

  allUsers: User[] = []
  observableAllUsers = new BehaviorSubject<User[]>(this.allUsers)
  loading$ = new BehaviorSubject<boolean>(true)
  usersObservers: Map<string, BehaviorSubject<User | null>> = new Map<string, BehaviorSubject<User | null>>()

  selectedUsers: Set<User> = new Set<User>()
  observableSelectedUsers = new BehaviorSubject<Set<User>>(this.selectedUsers)

  constructor(private authService: AuthService, private http: HttpClient, private api: ApiConnectionService, private tokenService: TokenService) {
    authService.getLoggedUser$().subscribe(
      next => {
        this.userData = next
      }
    )

    this.authService.getSessionStatus$().subscribe(
      _ => {
        this.loading$.next(true)
        this.update()
      }
    )

    this.loading$.next(true)
    this.update()
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

  update() {
    this.getAllUsers().subscribe(next => {
      this.updateServiceAndObservers(next)
    },
      error => {
        this.loading$.next(false)
      }
    )
  }

  private updateServiceAndObservers(nextAllUsers: User[]) {
    this.allUsers = nextAllUsers
    this.observableAllUsers.next(this.allUsers)
    this.updateObservedUsers()
    this.loading$.next(false)
  }

  updateObservedUsers() {
    for (let user of this.allUsers) {
      if (this.usersObservers.has(user._id)) { // @ts-ignore
        this.usersObservers.get(user._id).next(user)
      }
    }
  }

  private getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.api.USER_URL)
  }


  getLoading$() {
    return this.loading$.asObservable()
  }


  getUsers(): Observable<User[]> {
    return this.observableAllUsers.asObservable()
  }

  removeUser(id: string) {
    this.http.delete(this.api.USER_URL + `/${id}`).subscribe({
      next: (res) => {
        for (let i = 0; i < this.allUsers.length; i++) {
          if (this.allUsers[i]._id === id) {
            this.allUsers.splice(i, 1)
          }
        }
      }
    })
  }
}
