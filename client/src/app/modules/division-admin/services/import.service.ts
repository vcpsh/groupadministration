import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IMemberState, UserType} from '../../../models/member.state';
import {RestError, RestService} from '../../../services/rest.service';
import * as moment from 'moment';

export type IImportMember = IMemberState & { Imported: boolean, Error: string | null, TribeId: string };

const MAPPING_STORAGE_KEY = 'IMPORT_MAPPING';

const CN = 'cn';
const FIRST_NAME = 'firstname';
const LAST_NAME = 'lastname';
const TRIBE_ID = 'tribeid';
const ACCESSION_DATE = 'accessiondate';
const DATE_OF_BIRTH = 'dateofbirth';
const PHONE_NUMBER = 'phonenumber';
const GENDER = 'gender';
const STREET = 'street';
const TOWN = 'town';
const POSTAL_CODE = 'postalcode';
const TITLE = 'title';
const EMAIL = 'email';

@Injectable()
export class ImportService {
  public static FieldNamesMember: string[] = [
    CN,
    FIRST_NAME,
    LAST_NAME,
    TRIBE_ID,
    ACCESSION_DATE,
    DATE_OF_BIRTH,
    PHONE_NUMBER,
    GENDER,
    STREET,
    TOWN,
    POSTAL_CODE,
    TITLE,
    EMAIL,
  ];

  private _reverseMapping: { [key: string]: string } = {};
  public Mapping: { [key: string]: string } = {};
  private _rawMembers: { [key: string]: string }[];
  public NewMembers: IImportMember[] = [];
  public DeletedMembers: IImportMember[] = [];
  private _memberApi: RestService;
  public DivisionId: string;

  constructor(
    rest: RestService,
  ) {
    this._memberApi = rest.all('member');
    const mapping = window.localStorage.getItem(MAPPING_STORAGE_KEY);
    if (mapping) {
      this.Mapping = JSON.parse(mapping);
    }
  }

  /**
   * reads the csv table to an internal representation of the data for the importer.
   * @param {File} file
   */
  public readFile(file: File) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        // parse the string result
        const lines: string[] = reader.result.split(/[\r\n]+/g);
        const dataRaw = lines.map(val => val.split(/;/));
        const newMapping = dataRaw[0].reduce(
          (prev, curr) => {
            prev[curr] = '';
            return prev;
          },
          {} as { [key: string]: string },
        );
        dataRaw.shift(); // remove the first line with the mapping

        // check if the mapping changed from last use of the importer.
        if (!Object.keys(newMapping).every(val => this.Mapping[val] !== undefined)
        ) {
          console.log('Mapping changed', newMapping);
          this.Mapping = newMapping;
        }

        // change the data keys to the mapping keys
        this._rawMembers = dataRaw.map(row => {
          const obj: { [key: string]: string } = {};
          Object.keys(this.Mapping).forEach((str, index) => {
            obj[str] = row[index];
          });
          return obj;
        });
        resolve();
      };
      reader.readAsText(file);
    });
  }

  public setMapping(mapping: { [key: string]: string }) {
    return new Promise(resolve => {
      // update mapping
      Object.keys(mapping).forEach(key => {
        if (this.Mapping[mapping[key]] !== undefined) {
          this.Mapping[mapping[key]] = key;
        }
      });

      this._reverseMapping = {};
      Object.keys(this.Mapping).forEach(key => {
        if (this.Mapping[key] !== '') {
          this._reverseMapping[this.Mapping[key]] = key;
        }
      });

      window.localStorage.setItem(MAPPING_STORAGE_KEY, JSON.stringify(this.Mapping));

      // parse to member state
      const members: IImportMember[] = this._rawMembers.map(m => {
        const dateOfBirth = moment(m[this._reverseMapping[DATE_OF_BIRTH]], 'DD.MM.YY');
        let accessionDate = moment(m[this._reverseMapping[ACCESSION_DATE]], 'DD.MM.YY');
        if (dateOfBirth.isValid() === false) {
          console.log('invalid date', m);
        }
        if (accessionDate.isValid() === false) {
          if (m[this._reverseMapping[ACCESSION_DATE]] === '') {
            // some people do not have an accession date. use this as fallback
            accessionDate = moment('01.01.1900', 'DD.MM.YYYY');
          }
        }
        return {
          Id: m[this._reverseMapping[CN]],
          Dn: '',
          FirstName: m[this._reverseMapping[FIRST_NAME]],
          LastName: m[this._reverseMapping[LAST_NAME]],
          TribeId: m[this._reverseMapping[TRIBE_ID]],
          DateOfBirth: dateOfBirth.toDate(),
          AccessionDate: accessionDate.toDate(),
          Gender: m[this._reverseMapping[GENDER]] === 'Herrn' ? 'M' : 'F' as 'M' | 'F',
          Type: UserType.FullUser,
          Imported: false,
          Error: null,
        };
      });

      // load all members from the server
      this._memberApi.list<IMemberState>({url: `division/${this.DivisionId}`})
        .then(serverMembers => {
          this.NewMembers = members.filter(m => {
            const serverMember = serverMembers.find(sm => sm.Id === m.Id);
            return serverMember === undefined;
          });

          this.DeletedMembers = serverMembers.filter(sm => {
            const member = members.find(m => sm.Id === m.Id);
            return member === undefined;
          }).map(sm => {
            (sm as IImportMember).Imported = false;
            return sm as IImportMember;
          });
          resolve();
        });
    });
  }

  public startNewMemberImport(): Observable<number> {
    const obs = new BehaviorSubject(this.NewMembers.length);
    const fnImportOne = () => {
        const unimportedNew = this.NewMembers.find(m => !m.Imported && m.Error == null);
        if (!unimportedNew) {
          obs.next(this.NewMembers.filter(m => !m.Imported).length);
          return;
        }
        this._memberApi.post({ url: `create/${unimportedNew.TribeId}`, content: unimportedNew})
          .then(res => {
            unimportedNew.Imported = true;
            fnImportOne();
            obs.next(this.NewMembers.filter(m => !m.Imported).length);
          })
          .catch((err: RestError) => {
            if (err.Code === 400) {
              unimportedNew.Error = err.Message;

              // if the tribe does not exist mark all members of the tribe as not importable
              if (err.Message === `The tribe ${unimportedNew.TribeId} does not exist.`) {
                this.NewMembers
                  .filter(m => m.TribeId === unimportedNew.TribeId)
                  .forEach(m => m.Error = err.Message);
              }
            }
            fnImportOne();
          });
    };
    const p = new Promise(resolve => fnImportOne());
    return obs.asObservable();
  }
}
