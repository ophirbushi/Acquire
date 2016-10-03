import { CoordinatesCard, StockCard } from '../cards';
import { PlayerLike } from '../interfaces';

export class Player implements PlayerLike {
    name: string;
    cash: number;
    coordinatesCards: CoordinatesCard[] = [];
    stockCards: StockCard[] = [];
}