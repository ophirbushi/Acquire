import { CoordinatesCard, Stocks } from '../cards';
import { PlayerLike } from '../interfaces';

export interface Player extends PlayerLike {
    cash: number;
}
