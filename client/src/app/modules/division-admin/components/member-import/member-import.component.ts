import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {BaseComponent} from '../../../../components/BaseComponent';
import {AppState} from '../../../../models/app.state';
import {IDivisionState} from '../../../../models/division.state';
import {ImportService} from '../../services/import.service';

@Component({
  selector: 'app-member-import',
  templateUrl: './member-import.component.html',
  styleUrls: ['./member-import.component.scss'],
})
export class MemberImportComponent extends BaseComponent {
  private _divisionId: string | null = null;
  public Division: IDivisionState | null = null;
  public FileStepForm: FormGroup;
  public MappingStepForm: FormGroup;
  public FieldNamesMember = ImportService.FieldNamesMember;

  @ViewChild('fileInput') private _fileInput: ElementRef;
  public MappingKeys: string[] = [];
  constructor(
    route: ActivatedRoute,
    private _store: Store<AppState>,
    fb: FormBuilder,
    private _service: ImportService,
  ) {
    super();
    this.addSub(
      route.params.subscribe(params => {
        this._divisionId = params['id'];
      }),
      this._store.select(s => ({division: s.Divisions.find(d => d.Id === this._divisionId)})).subscribe(data => {
        this.Division = data.division ? data.division : null;
      }));
    this.FileStepForm = fb.group({
      fileSelect: ['', Validators.required],
    });
    const kvreversedMapping: {[key: string]: string} = {};
    Object.keys(this._service.Mapping).forEach(key => {
      if (this._service.Mapping[key] !== '') {
        kvreversedMapping[this._service.Mapping[key]] = key;
      }
    });
    const mappingFormObj: { [key: string]: any } = {};
    ImportService.FieldNamesMember.forEach(val => {
      mappingFormObj[val] = [kvreversedMapping[val] !== undefined ? kvreversedMapping[val] : '', Validators.required ];
    });
    this.MappingStepForm = fb.group(mappingFormObj);
  }

  /**
   * Click handler for the continue button of the first step.
   */
  public onFileContinueClick() {
    if (this.FileStepForm.valid) {
      const fileList = this._fileInput.nativeElement.files as FileList;
      this._service.readFile(fileList.item(0))
        .then(_ => {
          this.MappingKeys = Object.keys(this._service.Mapping);
        });
    }
  }

  /**
   * Click handler for the continue button of the second step.
   */
  public onMappingContinueClick() {
    if (this.MappingStepForm.valid) {
      this._service.setMapping(this.MappingStepForm.value);
    }
  }
}
