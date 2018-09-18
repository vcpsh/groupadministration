import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {BaseComponent} from '@vcpsh/sso-client-lib';
import {AppState} from '../../models/app.state';
import {IMinimalMember} from '../../models/member.state';
import {IVotedGroupState} from '../../models/voted-group.state';
import {GroupService} from '../../services/group.service';
import {VotedGroupService} from '../../services/voted-group.service';

@Component({
  selector: 'app-voted-group-add-member-dialog',
  templateUrl: './voted-group-add-member-dialog.component.html',
  styleUrls: ['./voted-group-add-member-dialog.component.scss'],
})
export class VotedGroupAddMemberDialogComponent extends BaseComponent {
  public Group: IVotedGroupState;
  public form: FormGroup;
  public PossibleMembers: IMinimalMember[] = [];
  public ShownMembers: string[] = [];

  constructor(
    private _service: VotedGroupService,
    private _groupService: GroupService,
    private _dialogRef: MatDialogRef<VotedGroupAddMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { Group: IVotedGroupState },
    private _store: Store<AppState>,
    fb: FormBuilder,
  ) {
    super();
    this.form = fb.group({
      filter: [''],
      NewMembers: ['', [Validators.required]],
      StartEvent: ['', [Validators.required, Validators.pattern(/L[R|V].20[\d]{2}.0[1-9]/)]],
      EndEvent: ['', [Validators.required, Validators.pattern(/L[R|V].20[\d]{2}.0[1-9]/)]],
      StartDate: [new Date(Date.now()), [Validators.required]],
    });

    this.addOnInit(() => {
      this.Group = this._data.Group;
      this._groupService.getPossibleMembers(this.Group)
        .then(pm => {
          this.PossibleMembers = pm.filter(m => !this.Group.MemberIds.includes(m.Id));
          this.ShownMembers = this.PossibleMembers.map(m => m.Id);
        });
    });
  }

  public onFilterChange() {
    const filter = this.form.value.filter.toLowerCase();
    this.ShownMembers = this.PossibleMembers.filter(m => {
      const name = `${m.FirstName} ${m.LastName}`.toLowerCase();
      return name.includes(filter) || m.Username && m.Username.toLowerCase().includes(filter);
    }).map(m => m.Id);
  }

  public onClickOk() {
    if (this.form.valid) {
      this._service.addMembers(this.Group, this.form.value).then(() => this._dialogRef.close());
    } else {
      this.form.markAsTouched();
    }
  }
}
