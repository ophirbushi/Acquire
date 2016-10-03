import { CoordinatesCard, StockCard } from '../cards';
import { PlayerLike } from '../interfaces';

export class Bank implements PlayerLike {
    cash: number;
    coordinatesCards: CoordinatesCard[] = [];
    stockCards: StockCard[] = [];
    discardedCoordinatesCards: CoordinatesCard[] = [];
}
