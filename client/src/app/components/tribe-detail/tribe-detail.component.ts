import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {BaseComponent} from '@vcpsh/sso-client-lib';
import {AppState} from '../../models/app.state';
import {ITribeState} from '../../models/tribe.state';
import {TribeService} from '../../services/tribe.service';

@Component({
  selector: 'app-tribe-detail',
  templateUrl: './tribe-detail.component.html',
  styleUrls: ['./tribe-detail.component.scss'],
})
export class TribeDetailComponent extends BaseComponent {
  public Tribe: ITribeState | null = null;
  public CanView = false;
  private _tribeId = '';
  private CanEdit = false;

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute,
    service: TribeService,
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
        if (data.admin) {
          this.CanEdit = true;
        } else if (data.tribe && data.lgsDivisions.includes(data.tribe.DivisionId)) {
          this.CanEdit = true;
        }
        if (!this.Tribe && data.tribe) {
          if (this.CanEdit) {
            service.loadTribeMembers(data.tribe.TribeId);
          } else {
            service.loadTribeSpecialMembers(data.tribe.TribeId);
          }
        }
        this.Tribe = data.tribe ? data.tribe : null;
        this.CanView = data.tribe ? data.divisions.includes(data.tribe.DivisionId) || data.tribes.includes(data.tribe.Id) : false;
      }));
  }


}
