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

    if (neighboringTileChains.length === 0) {
        return 'none';
    }
    if (neighboringTileChains.every(chain => chain.hotelName === Hotel.NEUTRAL)) {
        return 'setUp';
    }
    if (neighboringTileChains.filter(chain => chain.hotelName && chain.hotelName !== Hotel.NEUTRAL).length === 1) {
        return 'enlarge';
    }
    if (neighboringTileChains.filter(chain => chain.hotelName && chain.hotelName !== Hotel.NEUTRAL).length > 1) {
        return 'merge';
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

export function mergeTileChains(board: Board, coordinates: Coordinates): Board {
    const boardClone: Board = cloneBoard(board);
    const tileChain = getTileChain(boardClone, coordinates);
    const neighbors = getNeighboringTileChains(boardClone, coordinates);

    neighbors.forEach((neighbor) => {
        const index = boardClone.tileChains.findIndex(chain => chain === neighbor);
        tileChain.coordinatesList.push(...neighbor.coordinatesList.splice(0, neighbor.coordinatesList.length));
        boardClone.tileChains.splice(index, 1);
    });

    return boardClone;
}

export function addTileChain(board: Board, coordinatesList: Coordinates[], hotelName: string): Board {
    const boardClone: Board = cloneBoard(board);
    boardClone.tileChains.push({ coordinatesList, hotelName });
    return boardClone;
}

export function cloneBoard(board: Board): Board {
    return {
        ...board,
        tileChains: board.tileChains.map(chain => ({ ...chain, coordinatesList: chain.coordinatesList.slice() }))
    };
}
