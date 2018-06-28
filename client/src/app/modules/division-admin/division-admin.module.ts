import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatStepperModule} from '@angular/material/stepper';
import {BaseModule} from '../base-module/base.module';
import {MemberImportComponent} from './components/member-import/member-import.component';
import {DivisionAdminRoutingModule} from './division-admin-routing.module';
import {ImportService} from './services/import.service';

@NgModule({
  imports: [
    CommonModule,
    BaseModule,
    DivisionAdminRoutingModule,
    MatStepperModule,
  ],
  providers: [
    ImportService,
  ],
  declarations: [
    MemberImportComponent,
  ]
})
export class DivisionAdminModule { }
