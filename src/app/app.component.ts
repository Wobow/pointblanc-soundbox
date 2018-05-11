import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from './app.config';
import { SoundsService } from './providers/sounds.provider';
import { LobbyService } from './providers/lobbies.service';
import { Animations } from './animations';
import { Router } from '@angular/router';
import { AuthService } from './providers/auth.provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [Animations.showHideHorizontal, Animations.showHide],
})
export class AppComponent implements OnInit {
  inviteLink;
  serverName;
  modalLoading;
  createNewServer;
  lobbies;
  error;
  isAuth;

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private soundsService: SoundsService,
    private authService: AuthService,
    private router: Router,
    private lobbyService: LobbyService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  ngOnInit() {
    this.isAuth = this.authService.isAuthenticated();
    this.authService.auth$.startWith(this.isAuth).subscribe((auth) => {
      setTimeout(() => this.isAuth = auth, 200);
      if (auth) {
        this.lobbyService.loadLobbies().subscribe((lobbies) => {
          this.lobbies = lobbies;
        });
      } else {
        this.lobbies = [];
      }
    });
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
      .subscribe((server: any) => {
        this.serverName = '';
        this.createNewServer = false;
        this.router.navigate(['/lobby/' + server._id]);
      }, (err) => {
        console.error(err);
        this.error = true;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
