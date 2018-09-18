import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {OidcService} from '@vcpsh/sso-client-lib';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {TribeDetailComponent} from './components/tribe-detail/tribe-detail.component';
import {VotedGroupDetailComponent} from './components/voted-group-detail/voted-group-detail.component';
import {WelcomeComponent} from './components/welcome/welcome.component';

export const routes: Route[] = [
  {path: 'start', component: DashboardComponent, canActivate: [OidcService]},
  {path: 'tribe/:division/:id', component: TribeDetailComponent, canActivate: [OidcService]},
  {path: 'votedgroup/:division/:id', component: VotedGroupDetailComponent, canActivate: [OidcService]},
  {path: 'admin', loadChildren: './modules/division-admin/division-admin.module#DivisionAdminModule'},
  {path: '', pathMatch: 'full', component: WelcomeComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
