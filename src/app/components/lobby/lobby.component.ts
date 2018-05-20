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
}
