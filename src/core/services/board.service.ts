import { Board, Coordinates, TileChain } from '../models';

export class BoardService {
    constructor(private board: Board) { }

    getNeighboringCoordinatesList(coordinates: Coordinates): Coordinates[] {
        let coordinatesList: Coordinates[] = [];

        let above = new Coordinates(coordinates.x, coordinates.y - 1),
            right = new Coordinates(coordinates.x + 1, coordinates.y),
            below = new Coordinates(coordinates.x, coordinates.y + 1),
            left = new Coordinates(coordinates.x - 1, coordinates.y);

        if (above.y >= 0) {
            coordinatesList.push(above);
        }
        if (right.x < this.board.width) {
            coordinatesList.push(right);
        }
        if (below.y < this.board.height) {
            coordinatesList.push(below);
        }
        if (left.x >= 0) {
            coordinatesList.push(left);
        }

        return coordinatesList;
    }

    getTileChain(coordinates: Coordinates): TileChain | undefined {
        return this.board.tileChains.find(tileChain => tileChain.coordinatesList.includes(coordinates));
    }

    getNeighboringTileChains(coordinates: Coordinates): TileChain[] {
        let neighboringTileChains: TileChain[] = [];

        let neighboringCoordinatesList = this.getNeighboringCoordinatesList(coordinates);

        neighboringCoordinatesList.forEach(neighboringCoordinates => {
            let tileChain = this.getTileChain(neighboringCoordinates);
            if (tileChain !== undefined && !neighboringTileChains.some(alreadyInListTileChain => tileChain.id === alreadyInListTileChain.id)) {
                neighboringTileChains.push(tileChain);
            }
        });

        return neighboringTileChains;
    }
}
