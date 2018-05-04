import { Component, OnInit, OnChanges } from '@angular/core';
import { SoundsService } from '../../providers/sounds.provider';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading;
  error;
  lib;
  _volume;
  _online;
  nameFilter;
  smallbtn;
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

  constructor(private soundsService: SoundsService) {
    this.volume = 1;
    this.online = true;
    this.soundsService.changeStatus$.subscribe((online) => this._online = online);
  }

  ngOnInit() {
    this.load();
    this.volume = 100;
  }

  load() {
    if (this.loading) { return; }
    this.loading = true;
    this.soundsService.loadSoundLibrary()
      .finally(() => this.loading = false)
      .subscribe((res: any) => {
        this.lib = res.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        this.error = false;
      }, () => this.error = true);
  }

  playSound(name) {
    this.soundsService.playSoundByName(name);
  }

}
