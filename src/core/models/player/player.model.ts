import { CoordinatesCard, StockCard } from '../cards';
import { Referenceable, PlayerLike } from '../interfaces';

export class Player implements Referenceable, PlayerLike {
    id: string;
    name: string;
    cash: number;
    coordinatesCards: CoordinatesCard[] = [];
    stockCards: StockCard[] = [];
}
