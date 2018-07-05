export interface IInternalMinimalUser {
  Id: string;
  Dn: string;
  Username?: string;
  FirstName: string;
  LastName: string;
}

export type IMinimalUser = IInternalMinimalUser & { Type: UserType.MinimalUser };

export interface IInternalContactUser {
}

export type IContactUser = IInternalMinimalUser & IInternalContactUser & { Type: UserType.ContactUser };

export interface IInternalFullUser {
  DateOfBirth: Date;
  AccessionDate: Date;
  Gender: 'M' | 'F';
}

export type IFullUser = IInternalMinimalUser & IInternalContactUser & IInternalFullUser & { Type: UserType.FullUser };

export enum UserType {
  FullUser,
  ContactUser,
  MinimalUser,
}

export type IMemberState = IMinimalUser | IContactUser | IFullUser;
