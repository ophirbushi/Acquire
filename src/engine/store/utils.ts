import { CoordinatesCard, Coordinates } from '../../core';

export function generateCoordinatesCards(options: { width: number, height: number }): CoordinatesCard[] {
    const { width, height } = options;

    const cards: CoordinatesCard[] = [];

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            cards.push({ coordinates: { x, y } });
        }
    }

    return cards;
}
