import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.provider';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.auth$.next(true);
  }

}
