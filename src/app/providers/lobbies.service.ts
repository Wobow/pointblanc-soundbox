import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';

export const LOBBY_URI = '/api/lobbies';

@Injectable()
export class LobbyService {

  constructor(private http: HttpClient) { }

  create(name: string) {
    return this.http.post(AppConfig.api + LOBBY_URI, { name });
  }

  loadLobbies() {
    return this.http.get(AppConfig.api + LOBBY_URI);
  }
}
