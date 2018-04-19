import { Board, Coordinates, TileChain, CoordinatesCardEffect, Hotel, CoordinatesCardLegalStatus } from '../models';

export function getNeighboringCoordinatesList(board: Board, coordinates: Coordinates): Coordinates[] {
    const coordinatesList: Coordinates[] = [];

    const above = new Coordinates(coordinates.x, coordinates.y - 1),
        right = new Coordinates(coordinates.x + 1, coordinates.y),
        below = new Coordinates(coordinates.x, coordinates.y + 1),
        left = new Coordinates(coordinates.x - 1, coordinates.y);

    if (above.y >= 0) {
        coordinatesList.push(above);
    }
    if (right.x < board.width) {
        coordinatesList.push(right);
    }
    if (below.y < board.height) {
        coordinatesList.push(below);
    }
    if (left.x >= 0) {
        coordinatesList.push(left);
    }

    return coordinatesList;
}

export function getTileChain(board: Board, coordinates: Coordinates): TileChain | undefined {
    return board.tileChains.find((tileChain) => {
        return tileChain.coordinatesList.findIndex((c) => {
            return c.x === coordinates.x && c.y === coordinates.y;
        }) > -1;
    });
}

export function getNeighboringTileChains(board: Board, coordinates: Coordinates): TileChain[] {
    const neighboringTileChains: TileChain[] = [];

    const neighboringCoordinatesList = getNeighboringCoordinatesList(board, coordinates);

    neighboringCoordinatesList.forEach((neighboringCoordinates) => {
        const tileChain = getTileChain(board, neighboringCoordinates);

        if (
            tileChain !== undefined &&
            !neighboringTileChains.some((alreadyInListTileChain) => {
                return tileChain.hotelName === alreadyInListTileChain.hotelName;
            })
        ) {
            neighboringTileChains.push(tileChain);
        }
    });

    return neighboringTileChains;
}

export function getCoordinatesCardEffect(board: Board, coordinates: Coordinates): CoordinatesCardEffect {
    const neighboringTileChains = getNeighboringTileChains(board, coordinates);

    // no neighboring chains
    if (neighboringTileChains.length === 0) {
        return 'none';
    }
    // all neighboring chains do not have hotelId
    if (neighboringTileChains.every(neighboringTileChain => neighboringTileChain.hotelName === undefined)) {
        return 'setUp';
    }
    // not all neighboring chains have the same hotelId
    if (
        neighboringTileChains.some((neighboringTileChain) => {
            return neighboringTileChains[0].hotelName !== neighboringTileChain.hotelName;
        })
    ) {
        return 'merge';
    }
    // only 1 neighboring chain with hotelId
    if (neighboringTileChains.length === 1 && neighboringTileChains[0].hotelName !== undefined) {
        return 'enlarge';
    }

    // should not have reached here
    throw new Error('error at getCoordinatesCardEffect method');
}

export function getCoordinatesCardLegalStatus(board: Board, coordinates: Coordinates, effect: CoordinatesCardEffect,
    config: { hotelsCount: number, unmergeableHotelSize: number }): CoordinatesCardLegalStatus {
    if (effect === 'setUp' && getActiveHotelNames(board).length >= config.hotelsCount) {
        return 'currentlyIllegal';
    }
    if (effect === 'merge' && !isMergeLegal(board, coordinates, config.unmergeableHotelSize)) {
        return 'replaceable';
    }
    return 'legal';
}

export function getActiveHotelNames(board: Board): string[] {
    return board.tileChains
        .map(chain => chain.hotelName)
        .filter(name => name !== Hotel.NEUTRAL);
}

export function isMergeLegal(board: Board, coordinates: Coordinates, unmergeableHotelSize: number): boolean {
    const neighboringTileChains = getNeighboringTileChains(board, coordinates);

    return neighboringTileChains
        .filter(chain => chain.hotelName !== Hotel.NEUTRAL)
        .filter(chain => chain.coordinatesList.length >= unmergeableHotelSize)
        .length < 2;
}
