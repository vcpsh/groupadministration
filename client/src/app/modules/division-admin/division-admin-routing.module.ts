import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OidcService} from '@vcpsh/sso.clientlib';
import {MemberImportComponent} from './components/member-import/member-import.component';

const routes: Routes = [
  { path: ':id', children: [
      { path: 'import', component: MemberImportComponent, canActivate: [OidcService] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionAdminRoutingModule { }
