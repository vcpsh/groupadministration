import {IGroupState} from './group.state';

export interface IVotedEntryState {
  Id: string;
  Dn: string;
  MemberId: string;
  Active: boolean;
  VoteStartEvent: string;
  VoteEndEvent?: string;
  VoteStartDate: Date;
  VoteEndDate?: Date;
}

export interface IVotedGroupState extends IGroupState {
  DivisionId: string;
  ActiveVoteEntries: IVotedEntryState[];
  InactiveVoteEntries: IVotedEntryState[];
}

