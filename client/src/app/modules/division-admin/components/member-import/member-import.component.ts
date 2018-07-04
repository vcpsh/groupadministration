import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {BaseComponent} from '../../../../components/BaseComponent';
import {AppState} from '../../../../models/app.state';
import {IDivisionState} from '../../../../models/division.state';
import {IMemberState} from '../../../../models/member.state';
import {IImportMember, ImportService} from '../../services/import.service';

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

  // step new members
  public NewMembers: IImportMember[] = [];
  public NewMemberStepForm: FormGroup;
  public NewMemberPercentImported = 0;

  // step deleted members
  public DeletedMembers: IImportMember[] = [];
  public DeletedMemberStepForm: FormGroup;


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
        this._service.DivisionId = params['id'];
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
    this.NewMemberStepForm = fb.group({
      toImport: [0, Validators.max(0)]
    });
    this.DeletedMemberStepForm = fb.group({
      toImport: [0, Validators.max(0)]
    });
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
      this._service.setMapping(this.MappingStepForm.value)
        .then(_ => {
          this.NewMembers = this._service.NewMembers;
          this.DeletedMembers = this._service.DeletedMembers;
          this.NewMemberStepForm.setValue({ toImport: this.NewMembers.length });
          this.DeletedMemberStepForm.setValue({ toImport: this.DeletedMembers.length });
        });
    }
  }

  /**
   * Click handler for the continue button of the new member step.
   */
  public onNewMemberContinueClick() {
    if (this.NewMemberStepForm.valid) {
      console.log('read');
    } else {
      console.log(this.NewMemberStepForm.value);
    }
  }

  onNewMemberImportClick() {
    this.addSub(this._service.startNewMemberImport().subscribe(val => {
      this.NewMembers = this._service.NewMembers;
      this.NewMemberStepForm.setValue({ toImport: val });
      this.NewMemberPercentImported = this.NewMembers.length / 100 * (this.NewMembers.length - val);
      console.log(this.NewMemberPercentImported);
    }));
  }
}
