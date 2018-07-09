import { Component } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {OidcService} from '@vcpsh/sso.clientlib';
import {Observable} from 'rxjs';
import {VERSION} from '../environments/version';
import {BaseComponent} from './components/BaseComponent';
import {AppState} from './models/app.state';
import {IUserState} from './models/user.state';
import {DivisionService} from './services/division.service';
import {GroupService} from './services/group.service';
import {TribeService} from './services/tribe.service';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {
  public Version = VERSION;
  public Date = { FullYear: new Date(Date.now()).getFullYear() };
  public CookieConsent = false;
  public StartIconVisible = false;
  public User: Observable<IUserState | null>;

  public constructor(
    private _store: Store<AppState>,
    private _oidc: OidcService,
    route: ActivatedRoute,
    router: Router,
    user: UserService /* Needed for init of service */,
    tribe: TribeService /* Needed for init of service */,
    division: DivisionService /* Needed for init of service */,
    group: GroupService /* Needed for init of the services */,
  ) {
    super();
    this.User = this._store.pipe(select('User'));
    if (document.cookie.split(';').filter(i => i.includes('consent=')).length) {
      this.CookieConsent = true;
    }
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.StartIconVisible = e.url !== '/start';
      }
    });
  }

  public navigateLogin() {
    this._oidc.login();
  }

  public onLogoutClick() {
    this._oidc.logout();
  }

  public onCookieConsentClick() {
    document.cookie = 'consent=true';
    this.CookieConsent = true;
  }
}
