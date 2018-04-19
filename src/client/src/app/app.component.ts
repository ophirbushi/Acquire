import { Component, OnInit, EventEmitter } from '@angular/core';

import { AcquireEngine, InputProvider } from '../../../engine';
import { Acquire, AcquireConfig } from '../../../engine/store';
import { Observable } from 'rxjs/Observable';
import { Player, Board, getTileChain, CoordinatesCard, Coordinates } from '../../../core';

import { fromEvent } from 'rxjs/observable/fromEvent';
import { map, take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, InputProvider {
  engine: AcquireEngine;
  players$: Observable<Player[]>;
  board$: Observable<Board>;

  cardClick$ = new EventEmitter<{ playerIndex: number, cardIndex: number }>();

  hoveredCoordinates: Coordinates = { x: -1, y: -1 };

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
        this.message = `player ${state.currentPlayerIndex + 1} - choose a card:`;
        return this.cardClick$
          .pipe(
            filter(e => e.playerIndex === state.currentPlayerIndex),
            take(1),
            map(e => e.cardIndex),
        )
          .toPromise();
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

  onCardClick(playerIndex: number, cardIndex: number) {
    this.cardClick$.emit({ playerIndex, cardIndex });
  }

  onCardMouseEnter(card: CoordinatesCard) {
    this.hoveredCoordinates = card.coordinates;
  }

  onCardMouseLeave() {
    this.hoveredCoordinates = { x: -1, y: -1 };
  }

  enumerate(x: number): number[] {
    return new Array(x);
  }
}
