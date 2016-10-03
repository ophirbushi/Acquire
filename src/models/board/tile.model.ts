import { Hotel } from '../hotels';
import { Coordinates } from './coordinates.model';

export class Tile {
    coordinates: Coordinates;
    isOccupied: boolean = false;
    hotel: Hotel;
}
