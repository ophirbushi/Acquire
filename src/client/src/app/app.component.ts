import { Component, OnInit, EventEmitter } from '@angular/core';

import { AcquireEngine, InputProvider } from '../../../engine';
import { Acquire, AcquireConfig } from '../../../engine/store';
import { Observable } from 'rxjs/Observable';
import { Player, Board, getTileChain, CoordinatesCard, Coordinates } from '../../../core';

import { fromEvent } from 'rxjs/observable/fromEvent';
import { map, take, filter, tap } from 'rxjs/operators';

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
  currentPlayerIndex$: Observable<number>;
  hoveredCoordinates: Coordinates = { x: -1, y: -1 };
  message: string = '';

  get currentPlayer(): Player {
    const { currentPlayerIndex, players } = this.engine.stateService.snapshot;
    return players[currentPlayerIndex];
  }

  ngOnInit() {
    this.engine = new AcquireEngine(this);

    this.board$ = this.engine.stateService.select('board');
    this.players$ = this.engine.stateService.select('players');
    this.currentPlayerIndex$ = this.engine.stateService.select('currentPlayerIndex');

    this.engine.go();

    this.engine.stateService.store.select('board')
      .pipe(tap(b => {
        if (!b || !b.tileChains) return;
        console.log('chains count: ', b.tileChains.length);
      }))
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

  onTileMouseEnter(x, y) {
    if (this.isPossibleCard(x, y)) {
      this.hoveredCoordinates = { x, y };
    }
  }

  onTileMouseLeave(x, y) {
    this.hoveredCoordinates = { x: -1, y: -1 };
  }

  onTileClick(x, y) {
    if (this.isPossibleCard(x, y)) {
      const { currentPlayerIndex } = this.engine.stateService.snapshot;
      this.cardClick$.emit({ playerIndex: currentPlayerIndex, cardIndex: this.getCurrentPlayerCardIndex(x, y) });
    }
  }

  enumerate(x: number): number[] {
    return new Array(x);
  }

  isPossibleCard(x: number, y: number): boolean {
    return this.getCurrentPlayerCardIndex(x, y) > -1;
  }

  private getCurrentPlayerCardIndex(x, y): number {
    return this.currentPlayer.coordinatesCards.findIndex(c => c.coordinates.x === x && c.coordinates.y === y);
  }
}
