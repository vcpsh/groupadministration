import {OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

export class BaseComponent implements OnDestroy {
  private _subs: Subscription[] = [];

  public addSub(...subs: Subscription[]) {
    this._subs = this._subs.concat(subs);
  }

  public ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }
}
