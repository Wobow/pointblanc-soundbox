import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { AppConfig } from '../app.config';
import { mergeMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { AuthService } from './auth.provider';
import { LobbyService } from './lobbies.service';
export const COMMAND_URL = AppConfig.api + '/public/commands/';

@Injectable()
export class SoundsService {

  library;
  volume;
  queue$ = new Subject();
  queue = [];
  get online() { return this._online; }
  set online(val: boolean) {
    this._online = val;
    this.changeStatus$.next(val);
  }
  changeStatus$ = new Subject<boolean>();
  private _online: boolean;
  private wsUrl = 'ws://' + AppConfig.api.split(/https?:\/\//).join('');
  private socketInterface: Subject<MessageEvent>;
  private socket;
  queueEmpty = true;
  playing$ = new Subject<any[]>();
  playingQueue = [];
  commandUpdate$ = new Subject<any>();

  constructor(private http: HttpClient, private auth: AuthService, private lobby: LobbyService  ) {
    console.log('AppConfig', AppConfig);
    this.volume = 1;
    this.changeStatus$.subscribe((status) => {
      if (status) {
        this.socketInterface = this.initializeWebSocketConnection();
        this.socketInterface.subscribe((message: any) => {
          if (message.error) {
            this.online = false;
          } else if (message.broadcast) {
            this.commandUpdate$.next(message.content);
            this.play(message.content);
          }
        });
        this.socket.connect();
      } else {
        this.socket.disconnect();
      }
    });
    this.listenForQueue();
  }

  initializeWebSocketConnection(): Subject<MessageEvent> {
    console.log(this.wsUrl);
    if (this.socket) {
      this.socket.disconnect();
    }
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

  listenForQueue() {
    this.queue$.pipe(
      tap(() => this.queueEmpty = false),
      mergeMap(() => this.playCommand(this.queue.shift())),
    ).subscribe(() => {
      if (this.queue.length) {
        this.queue$.next();
      } else {
        this.queueEmpty = true;
      }
    });
  }

  private playCommand(command) {
    return new Observable((obs) => {
      this.playingQueue = [..._.reverse(this.queue), command];
      this.playing$.next(this.playingQueue);
      const audio = new Audio();
      audio.src = COMMAND_URL + command.url;
      audio.volume = this.volume;
      audio.load();
      audio.play();
      audio.onended = (ev) => {
        this.playingQueue = [..._.reverse(this.queue)];
        this.playing$.next(this.playingQueue);
        obs.next();
        obs.complete();
      };
    });
  }

  removeIndex(idx, playingIdx) {
    _.pullAt(this.queue, idx);
    _.pullAt(this.playingQueue, playingIdx);
    this.playing$.next(this.playingQueue);
  }

  closeWebSocketConnection() {

  }

  loadSoundLibrary(lobbyId) {
    return this.http.get(AppConfig.api + '/api/lobbies/' + lobbyId  + '/commands')
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
  getSoundById(id: string) {
    return this.library.find((item) => item._id === id);
  }

  play(command) {
    if (command && command.url) {
      this.queue.push(command);
      if (this.queueEmpty) { this.queue$.next(); }
      this.playingQueue = [command, ...this.playingQueue];
      this.playing$.next(this.playingQueue);
    }
  }

  publish(id, serverId?: string) {
    console.log(id);
    this.socketInterface.next(<any>{
      userId: this.auth.me._id,
      serverId: serverId,
      commandId: id,
    });
  }

  playSoundByName(name: string, serverId?: string) {
    const sound = this.getSoundByName(name);
    if (!this.online) {
      this.play(sound);
    } else {
      this.publish(sound._id, serverId);
    }
  }
  playSoundById(id: string, serverId?: string) {
    const sound = this.getSoundById(id);
    if (!this.online) {
      this.play(sound);
    } else {
      this.publish(sound._id, serverId);
    }
  }

  sendSound(name, file, lobbyId) {
    const formData = new FormData();
    formData.set('file', file);
    formData.set('name', name);
    formData.set('lobby', lobbyId);
    return this.http.post(AppConfig.api + '/api/commands', formData);
  }
}
