import {HttpClient, HttpClientModule} from '@angular/common/http';
import {InjectionToken, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule, MatDialogModule, MatFormFieldModule,
  MatGridListModule,
  MatIconModule, MatInputModule, MatListModule,
  MatMenuModule,
  MatToolbarModule, MatTreeModule,
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Action, ActionReducerMap, StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {VcpshSsoClientlib} from '@vcpsh/sso.clientlib';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {InitialState} from './models/app.state';
import {BaseModule} from './modules/base-module/base.module';
import {divisionReducer} from './reducers/division.reducer';
import {memberReducer} from './reducers/member.reducer';
import {tribeReducer} from './reducers/tribe.reducer';
import {userReducer} from './reducers/user.reducer';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import {DivisionService} from './services/division.service';
import {RestService} from './services/rest.service';
import {TribeService} from './services/tribe.service';
import {UserService} from './services/user.service';
import { TribeListComponent } from './components/tribe-list/tribe-list.component';
import { TribeCreateComponent } from './components/tribe-create/tribe-create.component';
import { TribeDetailComponent } from './components/tribe-detail/tribe-detail.component';
import { GroupMemberListComponent } from './components/group-member-list/group-member-list.component';
import { MemberImportComponent } from './modules/division-admin/components/member-import/member-import.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    WelcomeComponent,
    TribeListComponent,
    TribeCreateComponent,
    TribeDetailComponent,
    GroupMemberListComponent,
  ],
  imports: [
    BrowserModule,
    BaseModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      User: userReducer as any,
      Tribes: tribeReducer as any,
      Divisions: divisionReducer as any,
      Members: memberReducer as any,
      }, {
        initialState: InitialState as any,
    }),
    StoreDevtoolsModule.instrument({}),
    VcpshSsoClientlib.forRoot({
      authority: 'http://localhost:5000',
      client_id: 'sh.vcp.gruppenverwaltung-client@1.0.0',
      redirect_uri: 'http://localhost:4200/signin',
      response_type: 'id_token token',
      scope: 'openid profile sh.vcp.gruppenverwaltung@1.0.0 division tribe',
      automaticSilentRenew: true,
      post_logout_redirect_uri: 'http://localhost:4200',
      silent_redirect_uri: 'http://localhost:4200/silent-renew.html',
      loadUserInfo: true,
      debug: true,
    }),
    AppRoutingModule,
  ],
  providers: [
    DivisionService,
    UserService,
    RestService,
    TribeService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TribeCreateComponent
  ]
})

export class AppModule {
}
