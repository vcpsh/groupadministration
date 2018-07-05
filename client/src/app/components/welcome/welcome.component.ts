import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {OidcService} from '@vcpsh/sso.clientlib';
import {AppState} from '../../models/app.state';
import {BaseComponent} from '../BaseComponent';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent extends BaseComponent {

  constructor(
    store: Store<AppState>,
    router: Router,
    private _oidc: OidcService,
  ) {
    super();
    this.addSub(store.pipe(select('User')).subscribe(u => {
      if (u != null) {
        router.navigateByUrl('start');
      }
    }));
  }

  public onLoginClick() {
    this._oidc.login();
  }
}
