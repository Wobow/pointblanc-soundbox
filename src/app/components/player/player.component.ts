import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { SoundsService } from '../../providers/sounds.provider';
import { Animations } from '../../animations';
import { LobbyService } from '../../providers/lobbies.service';
import { AuthService } from '../../providers/auth.provider';
import { Router, ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  template: ''
})
export class PlayerComponent implements OnInit, AfterViewInit {
  server: any;
  volume;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private lobbyService: LobbyService,
    private soundsService: SoundsService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.server = params.server;
      this.volume = Number.parseInt(params.volume) || 100;
      this.soundsService.setVolume(this.volume / 100);
      this.listen();
    });
  }

  listen() {
    this.lobbyService.getLobby(this.server)
      .pipe(
        mergeMap((lobby) => this.soundsService.loadSoundLibrary(this.server)),
      )
      .subscribe((library) => {
        this.soundsService.online = true;
      });
  }

  ngAfterViewInit() {
    setTimeout(() => this.authService.noDisplayMode(), 200);
  }
}
