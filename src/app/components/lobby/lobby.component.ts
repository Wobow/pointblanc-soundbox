import { Component, OnInit } from '@angular/core';
import { LobbyService } from '../../providers/lobbies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SoundsService } from '../../providers/sounds.provider';
import { Animations } from '../../animations';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  animations: [Animations.showHide]
})
export class LobbyComponent implements OnInit {

  server;
  sounds;
  size = 'details';
  status;
  queueMode;
  slowMode;
  comboMode;
  subOnly;
  members;
  params;
  twitchApiKey;
  interval;
  nolimit;
  maxCmd;
  filter;
  sortType;
  
  invitePeople;
  inviteLink;
  baseURL = 'http://localhost:8080/invite/';
  constructor(private lobbyService: LobbyService, private route: ActivatedRoute, private soundService: SoundsService) {
    this.soundService.changeStatus$.subscribe((status) => this.status = status);
  }

  ngOnInit() {
    this.route.params
      .flatMap((params) => {
        return this.lobbyService.getLobby(params.id);
      })
      .flatMap((server) => {
        this.server = server;
        return this.soundService.loadSoundLibrary();
      })
      .subscribe((sounds) => {
        this.sounds = sounds;
      }, (err) => {
        // handle error
      });
  }

  goOffline() {
    this.soundService.online = false;
  }

  goOnline() {
    this.soundService.online = true;
  }

  play(command) {
    this.soundService.playSoundById(command._id);
  }

  makeid() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  invite() {
    this.invitePeople = true;
    if (!this.inviteLink) {
      this.inviteLink = {
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        code: this.makeid()
      };
      this.lobbyService.createInvite(this.server._id, this.inviteLink).subscribe();
    }
  }
}
