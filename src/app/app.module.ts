import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { DirectivesModule } from './directives/directives.module';
import { SoundsService } from './providers/sounds.provider';
import { NouisliderModule } from 'ng2-nouislider';
import 'rxjs/Rx';
import { PipesModule } from './pipes/pipes.module';
import { ClarityModule } from '@clr/angular';
import { LobbyService } from './providers/lobbies.service';
import { LobbyComponent } from './components/lobby/lobby.component';
import { AuthService } from './providers/auth.provider';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { TokenInterceptor } from './auth.interceptor';
import {ClipboardModule} from 'ngx-clipboard';
import { AppConfig } from './app.config';
import { AlertService } from './providers/alert.service';
import { PlayerComponent } from './components/player/player.component';
import { InviteComponent } from './components/invite/invite.components';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WebviewDirective,
    LobbyComponent,
    DashboardComponent,
    PlayerComponent,
    InviteComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    DirectivesModule,
    NouisliderModule,
    PipesModule,
    ClipboardModule,
    ClarityModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ElectronService,
    SoundsService,
    AuthGuard,
    AuthService,
    LobbyService,
    AlertService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
