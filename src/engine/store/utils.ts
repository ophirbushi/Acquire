import { CoordinatesCard, Coordinates, Stocks, Stocks } from '../../core';
import { AcquireConfig } from '.';

export function generateCoordinatesCards(config: AcquireConfig): CoordinatesCard[] {
    const { boardWidth, boardHeight } = config;

    const cards: CoordinatesCard[] = [];

    for (var x = 0; x < boardWidth; x++) {
        for (var y = 0; y < boardHeight; y++) {
            cards.push({ coordinates: { x, y } });
        }
    }

    return cards;
}

export function generateStocks(config: AcquireConfig): Stocks {
    const { hotels, stocksPerHotel } = config;

    const stocks: Stocks = {};

    hotels.forEach(hotel => stocks[hotel.name] = stocksPerHotel);
    return stocks;
}

export function shuffle(array: any[]) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}