import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SoundsService {

  library;
  volume;
  constructor(private http: HttpClient) {
    this.volume = 1;
  }

  loadSoundLibrary() {
    return this.http.get('assets/sounds.json')
      .first()
      .do((result) => this.library = result);
  }

  setVolume(value) {
    this.volume = Math.min(1, Math.max(0, value));
  }

  getLibrary() {
    return this.library;
  }

  getSoundByName(name: string) {
    return this.library.find((item) => item.name === name);
  }

  playSoundByName(name: string) {
    const sound = this.getSoundByName(name);
    if (sound && sound.url) {
      const audio = new Audio();
      audio.src = sound.url;
      audio.volume = this.volume;
      audio.load();
      audio.play();
    }
  }
}
