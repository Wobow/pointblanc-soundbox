import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { SoundsService } from '../../providers/sounds.provider';
import { Animations } from '../../animations';
import { LobbyService } from '../../providers/lobbies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [Animations.showHideHorizontal, Animations.showHide],
})
export class HomeComponent implements OnInit, AfterViewInit {
  loading;
  error;
  lib;
  _volume;
  _online;
  nameFilter;
  smallbtn;
  inviteLink;
  serverName;
  modalLoading;
  createNewServer;
  lobbies;
  get online() {
    return this._online;
  }
  set online(val) {
    this._online = val;
    this.soundsService.online = val;
  }

  get volume() {
    return this._volume;
  }
  set volume(val) {
    this._volume = val;
    this.soundsService.setVolume(val);
  }

  constructor(private soundsService: SoundsService, private lobbyService: LobbyService) {
    this.volume = 1;
    this.online = true;
    this.soundsService.changeStatus$.subscribe((online) => this._online = online);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inviteLink = '';
      this.serverName = '';
    }, 200);
  }

  ngOnInit() {
    this.load();
    this.volume = 100;
  }

  load() {
    this.lobbyService.loadLobbies()
      .subscribe((lobbies) => this.lobbies = lobbies);
  }

  createServer() {
    if (this.modalLoading) { return; }
    this.modalLoading = true;
    this.error = false;
    this.lobbyService.create(this.serverName)
      .first()
      .finally(() => {
        this.modalLoading = false;
      })
      .subscribe((server) => {
        this.serverName = '';
        this.createNewServer = false;
      }, (err) => {
        console.error(err);
        this.error = true;
      });
  }

}
