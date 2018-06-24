import { NgModule } from '@angular/core';
import {Routes, RouterModule, Route} from '@angular/router';
import {OidcService} from '@vcpsh/sso.clientlib';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {WelcomeComponent} from './components/welcome/welcome.component';

export const routes: Route[] = [
  {path: 'start', component: DashboardComponent, canActivate: [OidcService]},
  // {
  //   path: 'tribe',
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       component: TribeListComponent,
  //       canActivate: [ViewService],
  //     },
  //     {
  //       path: ':id',
  //       component: TribeViewComponent,
  //       canActivate: [ViewService],
  //     },
  //   ],
  // },
  {path: '', pathMatch: 'full', component: WelcomeComponent},
  {path: '**', component: PageNotFoundComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
