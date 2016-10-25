import { Referenceable } from '../interfaces';
import { HotelPrestige } from './hotel-prestige.enum';

export class Hotel implements Referenceable {
    id: string;
    name: string;
    prestige: HotelPrestige;
}
 