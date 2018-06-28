import {AfterViewInit, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  private _subs: Subscription[] = [];
  private _cbsAfterViewInit: (() => void)[] = [];

  public addSub(...subs: Subscription[]) {
    this._subs = this._subs.concat(subs);
  }

  public addAfterViewInit(...cbs: (() => void)[]) {
    this._cbsAfterViewInit = this._cbsAfterViewInit.concat(cbs);
  }

  public ngOnInit() {

  }

  public ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  public ngAfterViewInit() {
    this._cbsAfterViewInit.forEach(cb => cb());
  }
}
