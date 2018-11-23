import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {BaseComponent} from '@vcpsh/sso-client-lib';
import {AppState} from '../../models/app.state';
import {TribeService} from '../../services/tribe.service';

@Component({
  selector: 'app-tribe-create',
  templateUrl: './tribe-create.component.html',
  styleUrls: ['./tribe-create.component.scss'],
})
export class TribeCreateComponent extends BaseComponent {
  public DivisionName = '';
  public form: FormGroup;
  private _divisionDn = '';
  private _lastDisplayName = '';

  constructor(
    private _tribeService: TribeService,
    private _dialogRef: MatDialogRef<TribeCreateComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { divisionId: string },
    private _store: Store<AppState>,
    fb: FormBuilder,
  ) {
    super();
    this.addSub(this._store.select(s => ({tribes: s.Tribes, divisions: s.Divisions})).subscribe(obj => {
      const div = obj.divisions.find(d => d.Id === this._data.divisionId);
      if (div) {
        this.DivisionName = div.DisplayName;
        this._divisionDn = div.Dn;
      }
    }));
    this.form = fb.group({
      displayName: ['', Validators.required],
      tribeId: ['', Validators.compose([Validators.required, Validators.pattern(/[0-9]{6}/)])],
      dn: [{value: `ou=tribes,${this._divisionDn}`, disabled: true}],
    });

    this.form.valueChanges.subscribe(v => {
      if (this._lastDisplayName !== v.displayName) {
        this._lastDisplayName = v.displayName;
        v.dn = `cn=${v.displayName.toLocaleLowerCase().replace(' ', '_')},ou=tribes,${this._divisionDn}`;
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
      this._tribeService.createTribe(val.displayName, val.tribeId, val.dn, this._data.divisionId);
      this._dialogRef.close();
    }
  }
}
