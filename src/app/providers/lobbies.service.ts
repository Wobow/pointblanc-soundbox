import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { AuthService } from './auth.provider';
import { Observable } from 'rxjs/Observable';

export const LOBBY_URI = '/api/lobbies';

@Injectable()
export class LobbyService {

  static defaultConfig = () => ({
    slow: {
      name: 'slow',
      options: {},
      active: false
    },
    queue: {
      name: 'queue',
      options: {},
      active: false
    },
    combo: {
      name: 'combo',
      options: {},
      active: false
    },
    subOnly: {
      name: 'subOnly',
      options: {},
      active: false
    },
    offline: {
      name: 'offline',
      options: {},
      active: false
    }
  })
  constructor(private http: HttpClient, private authService: AuthService) { }

  create(name: string) {
    return this.http.post(AppConfig.api + LOBBY_URI, { name });
  }

  extractConfig(server: any) {
    console.log(server.rules);
    if (!server.rules || !server.rules.length) { return LobbyService.defaultConfig(); }
    const out = {};
    server.rules.forEach((c) => {
      out[c.name] = c;
      if (!out[c.name].options) {
        out[c.name].options = {};
      }
    });
    Object.keys(LobbyService.defaultConfig()).forEach((key) => {
      if (!out[key]) {
        out[key] = LobbyService.defaultConfig()[key];
      }
    });
    console.log(out);
    return out;
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

  setConfig(config: any, serverId: string) {
    const toUpload =  Object.keys(config).map((r: any) => ({name: config[r].name, options: config[r].options, active: config[r].active}));
    console.log(toUpload);
    return this.http.put(AppConfig.api + LOBBY_URI + '/' + serverId + '/rules', { rules: toUpload });
  }
}
