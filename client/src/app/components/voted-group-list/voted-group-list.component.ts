import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {BaseComponent} from '@vcpsh/sso-client-lib';
import {AppState} from '../../models/app.state';
import {IVotedGroupState} from '../../models/voted-group.state';
import {TribeCreateComponent} from '../tribe-create/tribe-create.component';
import {VotedGroupCreateDialogComponent} from '../voted-group-create-dialog/voted-group-create-dialog.component';

@Component({
  selector: 'app-voted-group-list',
  templateUrl: './voted-group-list.component.html',
  styleUrls: ['./voted-group-list.component.scss'],
})
export class VotedGroupListComponent extends BaseComponent {
  public Divisions?: { divisionId: string; displayName: string; isLgs: boolean; votedGroups: IVotedGroupState[] }[];

  constructor(
    private _store: Store<AppState>,
    private _dialog: MatDialog,
    private _router: Router,
  ) {
    super();
    this.addSub(this._store.select(s => ({
      votedGroups: s.VotedGroups,
      divisions: s.Divisions,
      lgsDivisions: s.User ? s.User.DivisionsLgs : [],
    })).subscribe(obj => {
      const data: { divisionId: string; displayName: string, isLgs: boolean; votedGroups: IVotedGroupState[] }[] = [];
      obj.votedGroups.forEach(group => {
        let division = data.find(nod => nod.divisionId === group.DivisionId);
        if (!division) {
          const div = obj.divisions.find(d => d.Id === group.DivisionId);
          division = {
            divisionId: group.DivisionId,
            displayName: div ? div.DisplayName : group.DivisionId,
            isLgs: obj.lgsDivisions === null ? false : obj.lgsDivisions.includes(group.DivisionId),
            votedGroups: [],
          };
          data.push(division);
        }
        division.votedGroups.push(group);
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

  public onVotedGroupCreateClick(divisionId: string) {
    const dialogRef = this._dialog.open(VotedGroupCreateDialogComponent, {
      data: {divisionId},
      disableClose: true,
      width: '60%',
    });
  }
}
