import { Component, OnInit } from '@angular/core';
import { LobbyService, LOBBY_IMAGES } from '../../providers/lobbies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SoundsService } from '../../providers/sounds.provider';
import { Animations } from '../../animations';
import { mergeMap, finalize } from 'rxjs/operators';
import { AlertService } from '../../providers/alert.service';
import { AuthService } from '../../providers/auth.provider';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  animations: [Animations.showHide, Animations.accordionShowHide]
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
  loadingCombo;
  addSoundModal;
  loading;
  baseURL = window.location.host + '/#';
  config;
  updateConfig;
  role;
  thumbnail;
  more;
  currentCombo;
  serverimg = '/assets/friendship.svg';
  PROFILE_URI_IMAGE = AppConfig.api + '/public/images/';
  combo: string[];
  comboInput;
  comboError;
  twitchLink;

  constructor(
    private lobbyService: LobbyService,
    private route: ActivatedRoute,
    private soundService: SoundsService,
    private alertService: AlertService,
    private router: Router,
    private auth: AuthService,
  ) {
    this.soundService.changeStatus$.subscribe((status) => this.status = status);
    this.soundService.commandUpdate$.subscribe((command) => {
      if (this.sounds) {
        const cmd = this.sounds.find((c) => c._id === command._id);
        if (cmd) {
          cmd.played = command.played;
        } else {
          this.reloadSounds();
        }
      } else {
        this.reloadSounds();
      }
    });
  }

  ngOnInit() {
    this.loadLobby();
  }

  reloadSounds() {
    this.soundService.loadSoundLibrary(this.server._id).subscribe((s) => this.sounds = s);
  }

  loadLobby() {
    this.config = LobbyService.defaultConfig();
    this.route.params
      .pipe(
        mergeMap((params) => this.lobbyService.getLobby(params.id)),
        mergeMap((server) => {
          this.server = server;
          this.config = this.lobbyService.extractConfig(this.server);
          this.soundService.queueMode = this.config.queue.active;
          this.soundService.online = !this.config.offline.active;
          this.serverimg = LOBBY_IMAGES + this.server.thumbnail;
          this.role = this.server.users.find((u) => u.user._id === this.auth.me._id).role;
          console.log('role :', this.role);
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
    this.soundService.queueMode = this.config.queue.active;
    this.lobbyService.setConfig(this.config, this.server._id)
      .pipe(
        finalize(() => this.updateConfig = false)
      )
      .subscribe(
        (res) => {
          this.more = undefined;
          this.alertService.toast('Configuration mise à jour avec succès', 'success')
        },
        (err) => this.alertService.toast('Impossible de mettre à jour la config', 'error')
      );
  }

  preview(sound) {
    this.soundService.play(sound);
  }

  delete(sound) {
    this.lobbyService.deleteSound(this.server._id, sound)
      .subscribe(
        () => this.loadCommands(),
        (err) => this.alertService.toast('Impossible de supprimer la commande', 'error'),
      );
  }

  quitLobby() {
    this.lobbyService.quitLobby(this.server._id, this.auth.me._id)
    .subscribe(
      () => this.router.navigate(['/home']),
      (err) => this.alertService.toast(err.message, 'error'),
    );
  }

  deleteLobby() {
    this.lobbyService.deleteLobby(this.server._id)
    .subscribe(
      () => this.router.navigate(['/home']),
      (err) => this.alertService.toast(err.message, 'error'),
    );
  }

  setThumbnail(event) {
    this.thumbnail = event.target.files[0];
  }

  savePerso() {
    console.log(this.server.name, this.thumbnail);
    if (this.loading) { return; }
    this.loading = true;
    this.lobbyService
      .updateServer(this.server._id, {name: this.server.name, file: this.thumbnail})
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        () => {
          this.loadLobby();
          this.thumbnail = undefined;
          this.more = undefined;
          this.alertService.toast('Serveur mis à jour avec succès', 'success')
        },
        (err) => this.alertService.toast('Impossible de mettre à jour le serveur', 'error')
      );
  }

  addCombo() {
    this.comboInput = !this.comboInput;
    this.combo = [];
  }

  sendCombo() {
    if (this.loadingCombo) { return; }
    this.loadingCombo = true;
    const validCommands = [];
    const commands = this.currentCombo.split(',');
    this.comboError = false;
    commands.forEach((c) => {
      const toInsert = this.sounds.find((s) => s.name === c.replace(/^\s+|\s+$/g, ''));
      if (!toInsert) {
        return this.comboError = c;
      }
      validCommands.push(toInsert);
    });
    if (!this.comboError) {
      this.soundService.playCombo(validCommands, this.server._id);
      this.currentCombo = '';
    }
    this.loadingCombo = false;
  }

  addToCombo(name) {
    if (!this.comboInput) {
      this.comboInput = true;
    }
    if (this.currentCombo && this.currentCombo.length) {
      this.currentCombo += (this.currentCombo[this.currentCombo.length - 1] === ',' ? '' : ',') + name;
    } else {
      this.currentCombo = name;
    }
  }
}
