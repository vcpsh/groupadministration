import {Component, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../models/app.state';
import {IGroupState} from '../../models/group.state';
import {IMinimalUser} from '../../models/member.state';
import {BaseComponent} from '../BaseComponent';

@Component({
  selector: 'app-group-member-list',
  templateUrl: './group-member-list.component.html',
  styleUrls: ['./group-member-list.component.scss'],
})
export class GroupMemberListComponent extends BaseComponent {
  @Input() public Group: IGroupState | null = null;
  @Input() public CanEdit = false;
  public Members: { [p: string]: IMinimalUser } = {};

  constructor(
    store: Store<AppState>,
  ) {
    super();
    this.addSub(
    store.select(s => ({
      members: s.Members ? s.Members : {},
    })).subscribe(data => {
      this.Members = data.members;
    }));
  }
}
