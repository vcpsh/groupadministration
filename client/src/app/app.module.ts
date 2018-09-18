import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {SsoClientLibModule} from '@vcpsh/sso-client-lib';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {GroupListComponent} from './components/group-list/group-list.component';
import {GroupMemberAddDialogComponent} from './components/group-member-add-dialog/group-member-add-dialog.component';
import {GroupMemberListComponent} from './components/group-member-list/group-member-list.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {TribeCreateComponent} from './components/tribe-create/tribe-create.component';
import {TribeDetailComponent} from './components/tribe-detail/tribe-detail.component';
import {TribeListComponent} from './components/tribe-list/tribe-list.component';
import {VotedGroupAddMemberDialogComponent} from './components/voted-group-add-member-dialog/voted-group-add-member-dialog.component';
import {VotedGroupCreateDialogComponent} from './components/voted-group-create-dialog/voted-group-create-dialog.component';
import {VotedGroupDetailComponent} from './components/voted-group-detail/voted-group-detail.component';
import {VotedGroupListComponent} from './components/voted-group-list/voted-group-list.component';
import {VotedGroupRemoveMemberDialogComponent} from './components/voted-group-remove-member-dialog/voted-group-remove-member-dialog.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {InitialState} from './models/app.state';
import {BaseModule} from './modules/base-module/base.module';
import {divisionReducer} from './reducers/division.reducer';
import {memberReducer} from './reducers/member.reducer';
import {tribeReducer} from './reducers/tribe.reducer';
import {userReducer} from './reducers/user.reducer';
import {votedGroupReducer} from './reducers/voted-group.reducer';
import {DivisionService} from './services/division.service';
import {RestService} from './services/rest.service';
import {TribeService} from './services/tribe.service';
import {UserService} from './services/user.service';

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
    GroupMemberAddDialogComponent,
    GroupListComponent,
    VotedGroupListComponent,
    VotedGroupDetailComponent,
    VotedGroupCreateDialogComponent,
    VotedGroupAddMemberDialogComponent,
    VotedGroupRemoveMemberDialogComponent,
  ],
  imports: [
    BrowserModule,
    BaseModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(
      {
        User: userReducer as any,
        Tribes: tribeReducer as any,
        Divisions: divisionReducer as any,
        Members: memberReducer as any,
        VotedGroups: votedGroupReducer as any,
      },
      {
        initialState: InitialState as any,
      },
    ),
    StoreDevtoolsModule.instrument({}),
    SsoClientLibModule.forRoot({
      authority: 'https://account.vcp.sh',
      client_id: 'sh.vcp.gruppenverwaltung-client@1.0.0',
      response_type: 'id_token token',
      scope: 'openid profile sh.vcp.gruppenverwaltung@1.0.0 division tribe',
      automaticSilentRenew: true,
      loadUserInfo: true,
      debug: true,
    }),
    AppRoutingModule,
  ],
  providers: [DivisionService, UserService, RestService, TribeService],
  bootstrap: [AppComponent],
  entryComponents: [
    TribeCreateComponent,
    GroupMemberAddDialogComponent,
    VotedGroupCreateDialogComponent,
    VotedGroupAddMemberDialogComponent,
    VotedGroupRemoveMemberDialogComponent,
  ],
})
export class AppModule {
}
