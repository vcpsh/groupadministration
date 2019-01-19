import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {BaseComponent} from '@vcpsh/sso-client-lib';
import {AppState} from '../../models/app.state';
import {ITribeState} from '../../models/tribe.state';
import {TribeCreateComponent} from '../tribe-create/tribe-create.component';

@Component({
  selector: 'app-tribe-list',
  templateUrl: './tribe-list.component.html',
  styleUrls: ['./tribe-list.component.scss'],
})
export class TribeListComponent extends BaseComponent {
  public Divisions?: { divisionId: string; displayName: string; isLgs: boolean; tribes: ITribeState[] }[];

  constructor(
    private _store: Store<AppState>,
    private _dialog: MatDialog,
  ) {
    super();
    this.addSub(this._store.select(s => ({
      tribes: s.Tribes,
      divisions: s.Divisions,
      lgsDivisions: s.User ? s.User.DivisionsLgs : [],
    })).subscribe(obj => {
      const data: { divisionId: string; displayName: string, isLgs: boolean; tribes: ITribeState[] }[] = [];
      obj.divisions.forEach(div => {
        data.push({
          divisionId: div.Id,
          displayName: div.DisplayName,
          isLgs: obj.lgsDivisions === null ? false : obj.lgsDivisions.includes(div.Id),
          tribes: []
        });
      });
      obj.tribes.forEach(tribe => {
        const division = data.find(nod => nod.divisionId === tribe.DivisionId);
        if (division) {
          division.tribes.push(tribe);
        }
      });
      this.Divisions = data;
    }));
  }

  public onTribeCreateClick(divisionId: string) {
    const dialogRef = this._dialog.open(TribeCreateComponent, {
      data: {divisionId},
      disableClose: true,
      width: '60%',
    });
  }
}
