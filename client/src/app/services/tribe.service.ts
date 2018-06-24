import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs/internal/Subscription';
import {TribeActionTypes} from '../actions/tribe.actions';
import {AppState} from '../models/app.state';
import {ITribeState} from '../models/tribe.state';
import {IUserState} from '../models/user.state';
import {RestService} from './rest.service';

@Injectable()
export class TribeService {
  private _api: RestService;
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<AppState>, rest: RestService) {
    this._api = rest.all('tribe');
    this._subscriptions.push(this._store.pipe<IUserState | null>(select('User')).subscribe(v => this.userChanged(v)));
  }

  public createTribe(DisplayName: string, id: number, Dn: string, divisionId: string) {
    this._api.post(
      { content: { DisplayName, DepartmentId: id, DivisionId: divisionId, Dn, Id: DisplayName.toLocaleLowerCase().replace(' ', '_')}})
      .then(res => {
        this._store.dispatch({
          type: TribeActionTypes.ADD,
          tribe: res
        });
      });
  }

  private userChanged(user: IUserState | null) {
    if (user) {
      this._api.list<ITribeState>({}).then(tribes => {
        if (tribes) {
          this._store.dispatch({
            type: TribeActionTypes.ADD_MULTIPLE,
            tribes,
          });
        } else {
          this._store.dispatch({
            type: TribeActionTypes.RESET,
          });
        }
      });
    } else {
      this._store.dispatch({
        type: TribeActionTypes.RESET,
      });
    }
  }
}
