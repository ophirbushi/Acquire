import { Component, OnInit } from '@angular/core';

import { AcquireEngine, InputProvider } from '../../../engine';
import { Acquire, AcquireConfig } from '../../../engine/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, InputProvider {
  engine: AcquireEngine;

  ngOnInit() {
    this.engine = new AcquireEngine(this);
    this.engine.go();

    this.engine.stateService.store.select('board')
      .subscribe(console.log);
  }

  getInput(state: Acquire) {
    switch (state.phaseName) {
      case 'init':
        return <any>Promise.resolve(<AcquireConfig>{});
      case 'putCardOnBoard':
        return <any>Promise.resolve(0);
      default:
        break;
    }
  }
}
