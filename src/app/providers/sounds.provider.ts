import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SoundsService {

  library;
  volume;
  get online() { return this._online; }
  set online(val: boolean) {
    this._online = val;
    this.changeStatus$.next(val);
  }
  changeStatus$ = new Subject<boolean>();
  private _online: boolean;
  private wsUrl = 'ws://api.soundbox.alan-balbo.com/';
  private socketInterface: Subject<MessageEvent>;
  private socket;

  constructor(private http: HttpClient) {
    this.changeStatus$.subscribe((status) => {
      if (status) {
        this.socketInterface = this.initializeWebSocketConnection();
        this.socketInterface.subscribe((message: any) => {
          if (message.error) {
            this.online = false;
          } else if (message.broadcast) {
            this.play(message.content);
          }
        });
        this.socket.connect();
      } else {
        this.socket.disconnect();
      }
    });
  }

  initializeWebSocketConnection(): Subject<MessageEvent> {
    this.socket = io(this.wsUrl, {
      autoConnect: false,
    });

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    const observable = new Observable((obs) => {
        this.socket.on('broadcast', (data) => {
          obs.next({broadcast: true, content: JSON.parse(data)});
        });
        this.socket.on('message', (data) => {
          obs.next({message: true, content: data});
        });
        this.socket.on('connect', (data) => {
          obs.next({success: true, content: data});
        });
        this.socket.on('connect_error', (data) => {
          obs.next({error: true, content: data});
        });
        return () => {
          this.socket.disconnect();
        };
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    const observer = {
        next: (data: Object) => {
            this.socket.emit('message', JSON.stringify(data));
        },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }

  closeWebSocketConnection() {

  }

  loadSoundLibrary() {
    return this.http.get('http://api.soundbox.alan-balbo.com/api/commands')
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

  play(command) {
    if (command && command.url) {
      const audio = new Audio();
      audio.src = command.url;
      audio.volume = this.volume;
      audio.load();
      audio.play();
    }
  }

  publish(id) {
    this.socketInterface.next(id);
  }

  playSoundByName(name: string) {
    const sound = this.getSoundByName(name);
    if (!this.online) {
      this.play(sound);
    } else {
      this.publish(sound._id);
    }
  }
}
