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
  OfficialMail?: string;
  /**
   * Used internal only to keep track of loaded members for the group.
   * //TODO: implement it!
   */
  _membersLoaded: boolean;
}
