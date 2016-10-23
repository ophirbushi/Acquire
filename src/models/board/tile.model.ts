import { Coordinates } from './coordinates.model';

export class Tile {
    coordinates: Coordinates;
    isOccupied: boolean = false;
    hotelId: string;
}
