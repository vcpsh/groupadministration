import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs/internal/Subscription';
import {DivisionActionTypes} from '../actions/division.actions';
import {AppState} from '../models/app.state';
import {IDivisionState} from '../models/division.state';
import {IUserState} from '../models/user.state';
import {RestService} from './rest.service';

@Injectable()
export class DivisionService {
  private _api: RestService;
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<AppState>, rest: RestService) {
    this._api = rest.all('divisions');
    this._subscriptions.push(this._store.pipe<IUserState | null>(select('User')).subscribe(v => this.userChanged(v)));
  }

  private userChanged(user: IUserState | null) {
    if (user) {
      this._api.list<IDivisionState>({}).then(divisions => {
        if (divisions) {
          this._store.dispatch({
            type: DivisionActionTypes.ADD_MULTIPLE,
            divisions,
          });
        } else {
          this._store.dispatch({
            type: DivisionActionTypes.RESET,
          });
        }
      });
    } else {
      this._store.dispatch({
        type: DivisionActionTypes.RESET,
      });
    }
  }
}
