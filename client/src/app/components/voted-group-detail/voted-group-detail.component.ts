import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSelectionList} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {BaseComponent} from '@vcpsh/sso-client-lib';
import {AppState} from '../../models/app.state';
import {IContactMember} from '../../models/member.state';
import {IVotedGroupState} from '../../models/voted-group.state';
import {GroupService} from '../../services/group.service';
import {VotedGroupService} from '../../services/voted-group.service';
import {GroupMemberAddDialogComponent} from '../group-member-add-dialog/group-member-add-dialog.component';
import {VotedGroupAddMemberDialogComponent} from '../voted-group-add-member-dialog/voted-group-add-member-dialog.component';
import {VotedGroupRemoveMemberDialogComponent} from '../voted-group-remove-member-dialog/voted-group-remove-member-dialog.component';

@Component({
  selector: 'app-voted-group-detail',
  templateUrl: './voted-group-detail.component.html',
  styleUrls: ['./voted-group-detail.component.scss']
})
export class VotedGroupDetailComponent extends BaseComponent {
  public Group: IVotedGroupState | null = null;
  public Members: { [key: string]: IContactMember} = {};
  public CanView = false;
  private _groupId = '';
  private CanEdit = false;
  @ViewChild('selectionList') public selectionList: MatSelectionList;

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute,
    private _dialog: MatDialog,
    service: VotedGroupService,
    private _groupService: GroupService,
  ) {
    super();
    this.addSub(
      this._route.params.subscribe(params => {
        this._groupId = params['id'];
      }),
      this._store.select(s => ({
        group: s.VotedGroups.find(t => t.Id === this._groupId),
        lgsDivisions: s.User ? s.User.DivisionsLgs : [],
        divisions: s.User ? s.User.Divisions : [],
        members: s.Members,
      })).subscribe(data => {
        if (data.group && data.lgsDivisions.includes(data.group.DivisionId)) {
          this.CanEdit = true;
        }
        if (!this.Group && data.group) {
          this._groupService.loadMembers(data.group);
        }
        this.Members = data.members as { [key: string]: IContactMember};
        this.Group = data.group ? data.group : null;
        this.CanView = data.group ? data.divisions.includes(data.group.DivisionId) : false;
      }));
  }

  public onMemberAddClick() {
    const dialogRef = this._dialog.open(VotedGroupAddMemberDialogComponent, {
      data: {Group: this.Group},
      disableClose: true,
      width: '60%',
    });
  }



  public onMemberRemoveClick() {
    if (this.Group) {
      const voteEntries = this.Group.ActiveVoteEntries;
      const removedMembers = this.selectionList.selectedOptions.selected
        .map(v => v.value)
        .map(v => voteEntries.filter(ve => ve.MemberId === v))
        .map(v => v[0]);
      const dialogRef = this._dialog.open(VotedGroupRemoveMemberDialogComponent, {
        data: {Group: this.Group, RemovedMembers: removedMembers},
        disableClose: true,
        width: '60%'
      });
    }
  }
}
