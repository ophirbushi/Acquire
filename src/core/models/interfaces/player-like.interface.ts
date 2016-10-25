import { CoordinatesCard, StockCard } from '../cards';

export interface PlayerLike {
    cash: number;
    coordinatesCards: CoordinatesCard[];
    stockCards: StockCard[];
}
