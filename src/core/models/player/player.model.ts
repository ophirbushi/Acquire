import { CoordinatesCard, StockCard } from '../cards';
import { Referenceable, PlayerLike } from '../interfaces';

export interface Player extends PlayerLike {
    cash: number;
}
