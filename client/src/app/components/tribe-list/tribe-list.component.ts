import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/internal/Subscription';
import {AppState} from '../../models/app.state';
import {ITribeState} from '../../models/tribe.state';
import {BaseComponent} from '../BaseComponent';
import {TribeCreateComponent} from '../tribe-create/tribe-create.component';

@Component({
  selector: 'app-tribe-list',
  templateUrl: './tribe-list.component.html',
  styleUrls: ['./tribe-list.component.scss'],
})
export class TribeListComponent extends BaseComponent  {
  public Divisions?: { divisionId: string; displayName: string; isLgs: boolean; tribes: ITribeState[] }[];

  constructor(
    private _store: Store<AppState>,
    private _dialog: MatDialog,
    private _router: Router,
  ) {
    super();
    this.addSub(this._store.select(s => ({
      tribes: s.Tribes,
      divisions: s.Divisions,
      lgsDivisions: s.User ? s.User.DivisionsLgs : [],
    })).subscribe(obj => {
      const data: { divisionId: string; displayName: string, isLgs: boolean; tribes: ITribeState[] }[] = [];
      obj.tribes.forEach(tribe => {
        let division = data.find(nod => nod.divisionId === tribe.DivisionId);
        if (!division) {
          const div = obj.divisions.find(d => d.Id === tribe.DivisionId);
          division = {
            divisionId: tribe.DivisionId,
            displayName: div ? div.DisplayName : tribe.DivisionId,
            isLgs: obj.lgsDivisions === null ? false : obj.lgsDivisions.includes(tribe.DivisionId),
            tribes: [],
          };
          data.push(division);
        }
        division.tribes.push(tribe);
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
