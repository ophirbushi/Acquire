import { StockCard, CoordinatesCard } from '../cards';

export class Player {
    name: string;
    cash: number;
    coordinatesCards: CoordinatesCard[] = [];
    stockCards: StockCard[] = [];
}
