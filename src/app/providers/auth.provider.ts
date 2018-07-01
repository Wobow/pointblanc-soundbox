import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { Subject } from 'rxjs';

export const AUTH_ROUTE = '/api/auth';
export const USER_ROUTE = '/api/users';

@Injectable()
export class AuthService {

  token;
  me;
  auth$: Subject<boolean>;

  constructor(private http: HttpClient) {
    this.auth$ = new Subject();
  }

  setToken(token: any) {
    this.token = token;
    window.localStorage.setItem('token', token);
    this.isAuthenticated();
  }

  isAuthenticated() {
    this.token = window.localStorage.getItem('token');
    this.auth$.next(typeof this.token === 'string');
    return typeof this.token === 'string';
  }

  getMe() {
    return this.http.get(AppConfig.api + USER_ROUTE + '/me').do((me) => this.me = me);
  }

  login(username: string, password: string) {
    return this.http.post(AppConfig.api + AUTH_ROUTE + '/login', { username, password });
  }

  logout() {
    this.token = undefined;
    this.auth$.next(false);
    window.localStorage.removeItem('token');
  }

  register(username, password) {
    return this.http.post(AppConfig.api + AUTH_ROUTE + '/register', { username, password });
  }
}
