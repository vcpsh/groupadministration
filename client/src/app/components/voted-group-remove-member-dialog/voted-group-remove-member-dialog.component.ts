import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BaseComponent} from '@vcpsh/sso-client-lib';
import {IMinimalMember} from '../../models/member.state';
import {IVotedGroupState} from '../../models/voted-group.state';
import {VotedGroupService} from '../../services/voted-group.service';

@Component({
  selector: 'app-voted-group-remove-member-dialog',
  templateUrl: './voted-group-remove-member-dialog.component.html',
  styleUrls: ['./voted-group-remove-member-dialog.component.scss']
})
export class VotedGroupRemoveMemberDialogComponent extends BaseComponent {
  public Group: IVotedGroupState;
  public form: FormGroup;

  constructor(
    private _service: VotedGroupService,
    private _dialogRef: MatDialogRef<VotedGroupRemoveMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { Group: IVotedGroupState, RemovedMembers: IVotedGroupState[] },
    fb: FormBuilder,
  ) {
    super();
    this.form = fb.group({
      RemovedMembers: [this._data.RemovedMembers],
      EndEvent: ['', [Validators.required, Validators.pattern(/L[R|V].20[\d]{2}.0[1-9]/)]],
      EndDate: [new Date(Date.now()), [Validators.required]],
    });

    this.addOnInit(() => {
      this.Group = this._data.Group;
    });
  }

  public onClickOk() {
    if (this.form.valid) {
      this._service.removeMembers(this.Group, this.form.value).then(() => this._dialogRef.close());
    } else {
      this.form.markAsTouched();
    }
  }
}
