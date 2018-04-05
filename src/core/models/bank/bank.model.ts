import { CoordinatesCard } from '../cards';
import { PlayerLike } from '../interfaces';

export interface Bank extends PlayerLike {
    discardedCoordinatesCards: CoordinatesCard[];
}
