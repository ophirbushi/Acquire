import { Component, OnInit } from '@angular/core';

import { AcquireEngine, InputProvider } from '../../../engine';
import { Acquire, AcquireConfig } from '../../../engine/store';
import { Observable } from 'rxjs/Observable';
import { Player, Board, getTileChain } from '../../../core';

import { fromEvent } from 'rxjs/observable/fromEvent';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, InputProvider {
  engine: AcquireEngine;
  players$: Observable<Player[]>;
  board$: Observable<Board>;

  message: string = '';

  ngOnInit() {
    this.engine = new AcquireEngine(this);

    this.board$ = this.engine.stateService.select('board');
    this.players$ = this.engine.stateService.select('players');

    this.engine.go();

    this.engine.stateService.store.select('board')
      .subscribe(state => console.log(JSON.stringify(state)));
  }

  async getInput(state: Acquire) {
    switch (state.phaseName) {
      case 'init':
        return <any>Promise.resolve(<AcquireConfig>{});
      case 'chooseCard':
        const choice = await this.prompt(`choose a card:`
          + ` ${state.players[state.currentPlayerIndex].coordinatesCards.length}`);
        return <any>Promise.resolve(choice);
      default:
        debugger;
        break;
    }
  }

  getHotelName(x, y) {
    const { board } = this.engine.stateService.snapshot;

    const chain = getTileChain(board, { x, y });

    return chain ? chain.hotelName : '';
  }

  getTileColor(x, y): string {
    const hotelName = this.getHotelName(x, y);

    switch (hotelName) {
      case 'Continental':
        return 'blue';
      case 'Europlaza':
        return 'pink';
      case 'Las Vegas':
        return 'yellow';
      case 'Olympia':
        return 'beige';
      case 'Park':
        return 'orange';
      case 'Riviera':
        return 'green';
      case 'Holiday':
        return 'darkgray';

      case 'NEUTRAL':
        return 'gray';

      default:
        return 'white';
    }
  }

  prompt(message: string): Promise<number> {
    this.message = message;
    return fromEvent(document.querySelector('button'), 'click')
      .pipe(
        map(() => +document.querySelector('input').value),
        take(1)
      )
      .toPromise();
  }

  enumerate(x: number): number[] {
    return new Array(x);
  }
}
