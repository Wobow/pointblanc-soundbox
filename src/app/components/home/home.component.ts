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
  nameFilter;
  smallbtn;

  get volume() {
    return this._volume;
  }
  set volume(val) {
    this._volume = val;
    this.soundsService.setVolume(val);
  }

  constructor(private soundsService: SoundsService) { }

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
