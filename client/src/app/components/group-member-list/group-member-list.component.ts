import {Component, Input} from '@angular/core';
import {IGroupState} from '../../models/group.state';
import {BaseComponent} from '../BaseComponent';

@Component({
  selector: 'app-group-member-list',
  templateUrl: './group-member-list.component.html',
  styleUrls: ['./group-member-list.component.scss'],
})
export class GroupMemberListComponent extends BaseComponent {
  @Input() public Group: IGroupState | null = null;
  @Input() public CanEdit = false;
}
