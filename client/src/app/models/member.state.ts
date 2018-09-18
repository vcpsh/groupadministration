export interface IInternalMinimalMember {
  Id: string;
  Dn: string;
  Username?: string;
  FirstName: string;
  LastName: string;
}

export type IMinimalMember = IInternalMinimalMember & { Type: UserType.MinimalUser | UserType.ContactUser | UserType.FullUser };

export interface IInternalContactMember {
  OfficialMail?: string;
}

export type IContactMember = IInternalMinimalMember & IInternalContactMember & { Type: UserType.ContactUser | UserType.FullUser };

export interface IInternalFullMember {
  DateOfBirth: Date;
  AccessionDate: Date;
  Gender: 'M' | 'F';
}

export type IFullMember = IInternalMinimalMember & IInternalContactMember & IInternalFullMember & { Type: UserType.FullUser };

export enum UserType {
  FullUser = 0,
  ContactUser = 1,
  MinimalUser = 2,
}

export type IMemberState = IMinimalMember | IContactMember | IFullMember;
