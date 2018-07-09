import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {AppState} from '../../models/app.state';
import {IGroupState} from '../../models/group.state';
import {IMinimalMember} from '../../models/member.state';
import {BaseComponent} from '../BaseComponent';
import {GroupMemberAddDialogComponent} from '../group-member-add-dialog/group-member-add-dialog.component';

@Component({
  selector: 'app-group-member-list',
  templateUrl: './group-member-list.component.html',
  styleUrls: ['./group-member-list.component.scss'],
})
export class GroupMemberListComponent extends BaseComponent {
  @Input() public Group: IGroupState | null = null;
  @Input() public CanEdit = false;
  public Members: { [p: string]: IMinimalMember } = {};

  constructor(
    private _dialog: MatDialog,
    store: Store<AppState>,
  ) {
    super();
    this.addSub(
    store.select(s => ({
      members: s.Members ? s.Members : {},
    })).subscribe(data => {
      this.Members = data.members;
    }));
  }

  public onMemberAddClick() {
    const dialogRef = this._dialog.open(GroupMemberAddDialogComponent, {
      data: { group: this.Group},
      disableClose: true,
      width: '60%',
    });
  }
}
