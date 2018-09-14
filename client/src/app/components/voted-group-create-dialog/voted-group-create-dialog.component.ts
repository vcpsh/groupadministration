import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {BaseComponent} from '@vcpsh/sso-client-lib';
import {AppState} from '../../models/app.state';
import {VotedGroupService} from '../../services/voted-group.service';

@Component({
  selector: 'app-voted-group-create-dialog',
  templateUrl: './voted-group-create-dialog.component.html',
  styleUrls: ['./voted-group-create-dialog.component.scss']
})
export class VotedGroupCreateDialogComponent extends BaseComponent {
  public DivisionName = '';
  public form: FormGroup;
  private _divisionDn = '';
  private _lastDisplayName = '';

  constructor(
    private _service: VotedGroupService,
    private _dialogRef: MatDialogRef<VotedGroupCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { divisionId: string },
    private _store: Store<AppState>,
    fb: FormBuilder,
  ) {
    super();
    this.addSub(this._store.select(s => ({divisions: s.Divisions})).subscribe(obj => {
      const div = obj.divisions.find(d => d.Id === this._data.divisionId);
      if (div) {
        this.DivisionName = div.DisplayName;
        this._divisionDn = div.Dn;
      }
    }));
    this.form = fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.email]],
      dn: [{value: `ou=groups,${this._divisionDn}`, disabled: true}],
    });

    this.form.valueChanges.subscribe(v => {
      if (this._lastDisplayName !== v.displayName) {
        this._lastDisplayName = v.displayName;
        v.dn = `cn=${v.displayName.toLocaleLowerCase().replace(' ', '_')},ou=groups,${this._divisionDn}`;
        this.form.setValue(v);
      }
    });
  }

  public clickOk() {
    this.form.markAsTouched();
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(field => {
        this.form.controls[field].markAsTouched({onlySelf: true});
      });
    } else {
      const val = this.form.getRawValue();
      this._service.createVotedGroup(val.displayName, val.dn, this._data.divisionId, val.email);
      this._dialogRef.close();
    }
  }
}
