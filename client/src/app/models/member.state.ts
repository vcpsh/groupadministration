export interface IMemberState {
  Id: string;
  Dn: string;
  Username?: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: Date;
  AccessionDate: Date;
  Gender: 'M' | 'F';
}
