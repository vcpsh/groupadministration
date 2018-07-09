export enum GroupType {
  Group,
  Division,
  VotedGroup,
  Tribe,
  TribeGs,
  TribeSl,
  TribeLr,
  TribeLv,
}

export interface IGroupState {
  DisplayName: string;
  Id: string;
  Dn: string;
  MemberIds: string[];
  Type: GroupType;
}
