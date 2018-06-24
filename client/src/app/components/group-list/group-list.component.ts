import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material';
import {select, Store} from '@ngrx/store';
import {of as observableOf} from 'rxjs';
import {Subscription} from 'rxjs/internal/Subscription';
import {AppState} from '../../models/app.state';

export class Node {
  constructor(
    public title: string,
    public type: string,
    public children: Node[] = [],
  ) {}
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit, OnDestroy {
  public treeControl: NestedTreeControl<Node>;
  public dataSource: MatTreeNestedDataSource<Node>;

  private _subs: Subscription[] = [];

  constructor(
    private _store: Store<AppState>,
  ) {
    this.treeControl = new NestedTreeControl<Node>(this._getChildren);
    this.dataSource = new MatTreeNestedDataSource();
    this._subs.push(this._store.pipe(select('Tribes')).subscribe(tribes => {
      const data: Node[] = [];
      tribes.forEach(tribe => {
        let division = data.find(nod => nod.title === tribe.DivisionId);
        if (!division) {
          division = new Node(tribe.DivisionId, 'division', []);
          data.push(division);
        }
        const node = new Node(tribe.DisplayName, 'tribe');
        division.children.push(node);
      });
      this.dataSource.data = data;
    }));
  }

  public ngOnInit() {
  }

  public ngOnDestroy() {
    this._subs.forEach(s => s.unsubscribe());
  }

  public hasNestedChild(_: number, node: Node) {
    console.log(node);
    return node.type === 'division';
  }

  private _getChildren(node: Node) {
    return observableOf(node.children);
  }

}
