import {IGroupState} from './group.state';

export interface ITribeState extends IGroupState {
  DivisionId: string;
  TribeId: number;
  Sl: IGroupState;
  Gs: IGroupState;
  Lr: IGroupState;
  Lv: IGroupState;
}
