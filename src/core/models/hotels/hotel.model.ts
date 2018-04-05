import { Referenceable } from '../interfaces';
import { HotelPrestige } from './hotel-prestige.enum';

export interface Hotel extends Referenceable {
    id: string;
    name: string;
    prestige: HotelPrestige;
}
