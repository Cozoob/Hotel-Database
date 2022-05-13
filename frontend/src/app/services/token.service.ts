import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  ACCESS_TOKEN = 'access_token'
  REFRESH_TOKEN = 'refresh_token'
  constructor() { }

  isAccessTokenValid() {
    let token = this.getAccessToken()
    if (token !== null) {
      return true
    }
    return false
  }

  isRefreshTokenValid() {
    let token = this.getRefreshToken()
    if (token !== null) {
      return true
    }
    return false
  }

  setTokens(token: { access: string, refresh: string }) {
    this.deleteTokens()
    localStorage.setItem(this.ACCESS_TOKEN, token.access);
    localStorage.setItem(this.REFRESH_TOKEN, token.refresh);
  }

  deleteTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN)
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN)
  }
}
