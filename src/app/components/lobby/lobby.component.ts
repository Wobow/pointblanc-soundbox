import { Component, OnInit } from '@angular/core';
import { LobbyService } from '../../providers/lobbies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SoundsService } from '../../providers/sounds.provider';
import { Animations } from '../../animations';
import { mergeMap, finalize } from 'rxjs/operators';
import { AlertService } from '../../providers/alert.service';

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
  error;
  copiedText;
  invitePeople;
  commandName;
  inviteLink;
  file;
  addSoundModal;
  loading;
  baseURL = 'http://localhost:8080/invite/';
  config;
  updateConfig;

  constructor(
    private lobbyService: LobbyService,
    private route: ActivatedRoute,
    private soundService: SoundsService,
    private alertService: AlertService,
  ) {
    this.soundService.changeStatus$.subscribe((status) => this.status = status);
    this.soundService.commandUpdate$.subscribe((command) => {
      const cmd = this.sounds.find((c) => c._id === command._id);
      if (cmd) {
        cmd.played = command.played;
      }
    });
  }

  ngOnInit() {
    this.config = LobbyService.defaultConfig();
    this.route.params
      .pipe(
        mergeMap((params) => this.lobbyService.getLobby(params.id)),
        mergeMap((server) => {
          this.server = server;
          this.config = this.lobbyService.extractConfig(this.server);
          this.soundService.online = true;
          return this.soundService.loadSoundLibrary(this.server._id);
        })
      )
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
    this.soundService.playSoundById(command._id, this.server._id);
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

  fileAdded(event) {
    this.file = event.target.files[0];
  }

  loadCommands() {
    this.soundService.loadSoundLibrary(this.server._id)
    .subscribe((sounds) => this.sounds = sounds);
  }

  sendSound() {
    if (this.loading) { return; }
    this.loading = true;
    this.error = false;
    this.soundService.sendSound(this.commandName, this.file, this.server._id)
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe(
      (res) => {
        this.addSoundModal = false;
        this.alertService.toast('Son ajouté avec succès !', 'success');
        this.commandName = undefined;
        this.file = undefined;
        this.loadCommands();
      },
      (err) => this.error = true
    );
  }

  saveConfig() {
    if (this.updateConfig) { return; }
    this.updateConfig = true;
    console.log(this.config);
    this.lobbyService.setConfig(this.config, this.server._id)
      .pipe(
        finalize(() => this.updateConfig = false)
      )
      .subscribe(
        (res) => this.alertService.toast('Configuration mise à jour avec succès', 'success'),
        (err) => this.alertService.toast('Impossible de mettre à jour la config', 'error')
      );
  }
}
