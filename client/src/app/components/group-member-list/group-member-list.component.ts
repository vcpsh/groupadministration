import {Component, Input, ViewChild} from '@angular/core';
import {MatDialog, MatSelectionList} from '@angular/material';
import {Store} from '@ngrx/store';
import {BaseComponent} from '@vcpsh/sso-client-lib';
import {AppState} from '../../models/app.state';
import {IGroupState} from '../../models/group.state';
import {IMinimalMember} from '../../models/member.state';
import {GroupService} from '../../services/group.service';
import {GroupMemberAddDialogComponent} from '../group-member-add-dialog/group-member-add-dialog.component';

@Component({
  selector: 'app-group-member-list',
  templateUrl: './group-member-list.component.html',
  styleUrls: ['./group-member-list.component.scss'],
})
export class GroupMemberListComponent extends BaseComponent {
  @Input() public Group: IGroupState | null = null;
  @Input() public CanEdit = false;
  @ViewChild('selectionList') public selectionList: MatSelectionList;
  public Members: { [p: string]: IMinimalMember } = {};

  constructor(
    private _dialog: MatDialog,
    store: Store<AppState>,
    private _service: GroupService,
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
      data: {group: this.Group},
      disableClose: true,
      width: '60%',
    });
  }

  public onMemberRemoveClick() {
    if (this.Group) {
      const removedMembers = this.selectionList.selectedOptions.selected.map(v => v.value);
      let newMembers = this.Group.MemberIds;
      newMembers = newMembers.filter(v => !removedMembers.includes(v));
      this._service.setMembers(this.Group, newMembers);
    }
  }
}
