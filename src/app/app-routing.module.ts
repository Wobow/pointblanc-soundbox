import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from './components/lobby/lobby.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlayerComponent } from './components/player/player.component';
import { InviteComponent } from './components/invite/invite.components';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'player', component: PlayerComponent},
  {path: 'invite/:iid', canActivate: [AuthGuard], component: InviteComponent},
  {path: 'home', canActivate: [AuthGuard], component: DashboardComponent},
  {path: 'lobby/:id', canActivate: [AuthGuard], component: LobbyComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
