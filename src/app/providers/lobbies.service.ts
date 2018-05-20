import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { AuthService } from './auth.provider';
import { Observable } from 'rxjs/Observable';

export const LOBBY_URI = '/api/lobbies';

@Injectable()
export class LobbyService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  create(name: string) {
    return this.http.post(AppConfig.api + LOBBY_URI, { name });
  }

  loadLobbies() {
    return this.authService.getMe()
      .flatMap((me: any) => {
        console.log(me);
        return Observable.of(me.lobbies);
      });
  }

  getLobby(id: string) {
    return this.http.get(AppConfig.api + LOBBY_URI + '/' + id);
  }

  createInvite(lobbyId, invite: {expiresAt: number, code: string}) {
    return this.http.post(AppConfig.api + LOBBY_URI + '/' + lobbyId + '/invites', {expiresAt: invite.expiresAt, code: invite.code});
  }

  joinLobby(inviteLink: string) {
    const code = inviteLink.substring(inviteLink.lastIndexOf('/') + 1);
    return this.http.post(AppConfig.api + LOBBY_URI + '/join/', {code});
  }
}
