import { Referenceable } from '../interfaces';
import { Coordinates } from './coordinates.model';

export class TileChain implements Referenceable {
    id: string;
    coordinatesList: Coordinates[];
    hotelId: string;
}
