import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from './app.config';
import { SoundsService } from './providers/sounds.provider';
import { LobbyService } from './providers/lobbies.service';
import { Animations } from './animations';
import { Router } from '@angular/router';
import { AuthService } from './providers/auth.provider';
import { AlertService } from './providers/alert.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [Animations.showHideHorizontal, Animations.showHide, Animations.accordionShowHide],
})
export class AppComponent implements OnInit {
  inviteLink;
  serverName;
  modalLoading;
  createNewServer;
  lobbies;
  error;
  isAuth;
  queue;
  profile;
  profileName;
  profilePic;
  profileModal;
  newPassword;
  confirmDeletionModale;
  loading;

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private soundsService: SoundsService,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
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
        this.authService.getMe().subscribe((me: any) => {
          this.profile = me;
          this.profileName = me.username;
        });
        this.lobbyService.loadLobbies().subscribe((lobbies) => {
          this.lobbies = lobbies;
        });
      } else {
        this.lobbies = [];
      }
    });
    this.alertService.alert$.subscribe((content) => {

    });
    this.soundsService.playing$.subscribe((queue) => {
      this.queue = queue;
    });
  }

  remove(index) {
    if (index >= this.soundsService.queue.length) { return; }

    this.soundsService.removeIndex(this.soundsService.queue.length - index - 1, index);
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
        this.modalLoading = false;
        this.createNewServer = false;
        this.router.navigate(['/lobby/' + server._id]);
        this.lobbyService.loadLobbies().subscribe((lobbies) => {
          this.lobbies = lobbies;
        });
      }, (err) => {
        console.error(err);
        this.modalLoading = false;
        this.error = true;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  join() {
    this.error = false;
    this.lobbyService.joinLobby(this.inviteLink).subscribe((lobby: any) => {
      this.router.navigate(['/lobby/' + lobby._id]);
      this.createNewServer = false;
      this.lobbyService.loadLobbies().subscribe((lobbies) => {
        this.lobbies = lobbies;
      });
    }, (err) => {
      console.error(err);
      this.error = err.error;
    });
  }

  setProfilePic(event) {
    this.profilePic = event.target.files[0];
  }

  updateProfile() {
    const updatePayload: FormData = new FormData();
    if (this.profileName) { updatePayload.set('username' , this.profileName); }
    if (this.profilePic)  { updatePayload.set('image' , this.profilePic); }
    if (this.newPassword)  { updatePayload.set('password' , this.newPassword); }
    this.authService.updateProfile(this.profile._id, updatePayload)
      .subscribe((res) => {this.profile = res; this.profileModal = false; });
  }

  deleteProfile() {
    if (this.loading) { return; }
    this.loading = true;
    this.authService
      .deleteProfile()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        () => {
          this.profileModal = false;
          this.confirmDeletionModale = false;
          this.logout();
          this.alertService.toast('Profil supprimé :(', 'success');
        },
        (err) => this.alertService.toast('Impossible de supprimer votre profile !', 'error')
      );
  }
}
