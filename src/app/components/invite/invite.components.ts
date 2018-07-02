import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { LobbyService, LOBBY_IMAGES, LOBBY_URI } from '../../providers/lobbies.service';
import { AuthService } from '../../providers/auth.provider';

@Component({
  selector: 'app-invite',
  templateUrl: 'invite.component.html',
  styleUrls: ['./invite.component.scss'],
})

export class InviteComponent implements OnInit {
  inviteCode;
  invite;
  expired = false;
  error = false;
  img = '/assets/friendship.svg';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private lobbyService: LobbyService
  ) {
    this.route.params.subscribe((params) => {
      this.inviteCode = params.iid;
      this.loadInvite();
    });
  }

  loadInvite() {
    this.expired = false;
    this.error = false;
    this.http.get(AppConfig.api + '/api/invites/' + this.inviteCode)
      .subscribe(
        (invite: any) => {
          this.invite = invite;
          if (!invite.lobby) {
            return this.error = true;
          }
          if (invite.lobby.thumbnail) {
            this.img = LOBBY_IMAGES + invite.lobby.thumbnail;
          }
          if (this.invite.expiresAt < Date.now()) {
            this.expired = true;
          }
          if (invite.lobby.users.find((u) => u.user === this.auth.me._id)) {
            this.router.navigate(['/lobby/' + invite.lobby._id]);
          }
          console.log(this.invite);
        },
        (err) => this.error = err
      );
  }

  joinServer() {
    this.error = false;
    this.http.post(AppConfig.api + LOBBY_URI + '/join/', { code: this.invite.code })
    .subscribe((lobby: any) => {
      this.router.navigate(['/lobby/' + lobby._id]);
    }, (err) => {
      console.error(err);
      this.error = err.error;
    });
  }

  ngOnInit() { }
}
