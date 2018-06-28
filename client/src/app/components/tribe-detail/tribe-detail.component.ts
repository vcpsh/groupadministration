import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../models/app.state';
import {ITribeState} from '../../models/tribe.state';
import {BaseComponent} from '../BaseComponent';

@Component({
  selector: 'app-tribe-detail',
  templateUrl: './tribe-detail.component.html',
  styleUrls: ['./tribe-detail.component.scss'],
})
export class TribeDetailComponent extends BaseComponent {
  private _tribeId = '';
  public Tribe: ITribeState | null = null;
  private CanEdit = false;
  public CanView = false;

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute,
  ) {
    super();
    this.addSub(
      this._route.params.subscribe(params => {
        this._tribeId = params['id'];
      }),
      this._store.select(s => ({
        tribe: s.Tribes.find(t => t.Id === this._tribeId),
        lgsDivisions: s.User ? s.User.DivisionsLgs : [],
        admin: s.User ? s.User.TribesAdmin.includes(this._tribeId) : false,
        divisions: s.User ? s.User.Divisions : [],
        tribes: s.User ? s.User.Tribes : [],
      })).subscribe(data => {
        this.Tribe = data.tribe ? data.tribe : null;
        this.CanEdit = data.admin;
        this.CanView = data.tribe ? data.divisions.includes(data.tribe.DivisionId) || data.tribes.includes(data.tribe.Id) : false;
      }));
  }


}
