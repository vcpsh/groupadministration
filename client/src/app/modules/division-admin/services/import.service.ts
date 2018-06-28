import {Injectable} from '@angular/core';

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
  public static FieldNamesMember = [
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
    EMAIL
  ];

  public Mapping: { [key: string]: string } = {};
  private _rawMembers: { [key: string]: string }[];

  constructor(
  ) {
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
          {} as { [key: string]: string }
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

  public setMapping(mapping: { [key: string]: string}) {
    Object.keys(mapping).forEach(key => {
      if (this.Mapping[mapping[key]] !== undefined) {
        this.Mapping[mapping[key]] = key;
      }
    });
    window.localStorage.setItem(MAPPING_STORAGE_KEY, JSON.stringify(this.Mapping));
  }
}
