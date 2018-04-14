import { CoordinatesCard, Coordinates, Stocks } from '../../core';
import { AcquireConfig } from '.';

export function generateCoordinatesCards(config: AcquireConfig): CoordinatesCard[] {
    const { boardWidth, boardHeight } = config;

    const cards: CoordinatesCard[] = [];

    for (let x = 0; x < boardWidth; x++) {
        for (let y = 0; y < boardHeight; y++) {
            cards.push({ coordinates: { x, y } });
        }
    }

    return cards;
}

export function generateStocksForBank(config: AcquireConfig): Stocks {
    const { hotels, stocksPerHotel } = config;

    const stocks: Stocks = {};

    hotels.forEach(hotel => stocks[hotel.name] = stocksPerHotel);
    return stocks;
}

export function generateStocksForPlayer(config: AcquireConfig): Stocks {
    const { hotels } = config;

    const stocks: Stocks = {};

    hotels.forEach(hotel => stocks[hotel.name] = 0);
    return stocks;
}

export function shuffle(array: any[]) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        const index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        const temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

export function closestToA1(coor: Coordinates[]): number {
    const distanceDict: { [index: number]: number } = {};

    coor.forEach((c, i) => distanceDict[i] = distance(c, { x: 0, y: 0 }));

    const sorted = Object.keys(distanceDict)
        .map(index => ({ index, distance: distanceDict[index] }))
        .slice()
        .sort((a, b) => {
            return a.distance - b.distance;
        });

    return +sorted[0].index;
}

export function distance(a: Coordinates, b: Coordinates): number {
    return Math.sqrt((Math.pow(a.x, 2) - Math.pow(b.x, 2)) + (Math.pow(a.y, 2) - Math.pow(b.y, 2)));
}
