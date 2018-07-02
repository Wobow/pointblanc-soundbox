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
  mode$: Subject<string>;
  constructor(private http: HttpClient) {
    this.auth$ = new Subject();
    this.mode$ = new Subject();
  }

  noDisplayMode() {
    this.mode$.next('nodisplay');
  }

  setToken(token: any) {
    this.token = token;
    window.localStorage.setItem('token', token);
    this.isAuthenticated();
  }

  isAuthenticated() {
    this.token = window.localStorage.getItem('token');
    this.auth$.next(typeof this.token === 'string');
    this.silentlyGetMe();
    return typeof this.token === 'string';
  }

  silentlyGetMe() {
    this.getMe().subscribe();
  }

  getMe() {
    return this.http.get(AppConfig.api + USER_ROUTE + '/me').do((me) => this.me = me);
  }

  login(username: string, password: string) {
    return this.http.post(AppConfig.api + AUTH_ROUTE + '/login', { username, password });
  }

  logout() {
    this.token = undefined;
    this.me = undefined;
    this.auth$.next(false);
    window.localStorage.removeItem('token');
  }

  register(username, password) {
    return this.http.post(AppConfig.api + AUTH_ROUTE + '/register', { username, password });
  }

  updateProfile(userid, formData) {
    return this.http.put(AppConfig.api + USER_ROUTE + '/' + userid, formData);
  }

  deleteProfile() {
    return this.http.delete(AppConfig.api + USER_ROUTE + '/' + this.me._id);
  }
}
