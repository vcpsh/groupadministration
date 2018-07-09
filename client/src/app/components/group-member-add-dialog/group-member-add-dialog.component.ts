import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectionList} from '@angular/material';
import {IGroupState} from '../../models/group.state';
import {IMinimalMember} from '../../models/member.state';
import {GroupService} from '../../services/group.service';
import {BaseComponent} from '../BaseComponent';
import {TribeCreateComponent} from '../tribe-create/tribe-create.component';

@Component({
  selector: 'app-group-member-add-dialog',
  templateUrl: './group-member-add-dialog.component.html',
  styleUrls: ['./group-member-add-dialog.component.scss']
})
export class GroupMemberAddDialogComponent extends BaseComponent {
  public Group: IGroupState;
  public PossibleMembers: IMinimalMember[] = [];
  @ViewChild('membersToAdd') public MembersToAdd: MatSelectionList;
  constructor(
    private _service: GroupService,
    private _dialogRef: MatDialogRef<TribeCreateComponent>,
    @Inject(MAT_DIALOG_DATA) data: { group: IGroupState },
  ) {
    super();
    this.Group = data.group;
    this._service.getPossibleMembers(data.group)
      .then(pm => {
        this.PossibleMembers = pm.filter(m => !this.Group.MemberIds.includes(m.Id));
      });
  }

  public onOkClick() {
    const membersToAdd = this.MembersToAdd.selectedOptions.selected.map(i => i.value);
    this._service.setMembers(this.Group, membersToAdd.concat(this.Group.MemberIds))
      .then(_ => {
        this._dialogRef.close();
      });
  }
}
