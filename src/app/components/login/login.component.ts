import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { SoundsService } from '../../providers/sounds.provider';
import { Animations } from '../../animations';
import { LobbyService } from '../../providers/lobbies.service';
import { AuthService } from '../../providers/auth.provider';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username;
  password;
  loading;
  error;
  redirectFragment = '/home';
  registerMode;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((q) => {
      if (q.redirect) {
        this.redirectFragment = q.redirect;
      }
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.redirectFragment]);
    }
  }

  login() {
    if (this.loading) { return; }
    this.loading = true;
    this.authService.login(this.username, this.password)
      .subscribe((payload: any) => {
        this.authService.setToken(payload.token);
        this.router.navigate([this.redirectFragment]);
      }, (err) => {
        console.error(err);
        this.error = err.error || true;
        this.loading = false;
      });
  }

  register() {
    if (this.loading) { return; }
    this.loading = true;
    this.error = false;
    this.authService.register(this.username, this.password)
      .subscribe((payload: any) => {
        this.authService.setToken(payload.token);
        this.router.navigate([this.redirectFragment]);
      }, (err) => {
        console.error(err);
        this.error = err.error || true;
        this.loading = false;
      });
  }
}
