// Class for creating and interacting with drag and drop grids

import { BsrGrid } from "./bsr-grid.js";
import { bsrGridInternals, bsrGeneralInfo } from "./bsr-config.js";

export { BsrDragAndDropGrid }

class BsrDragAndDropGrid extends BsrGrid{

    #horizontal;
    #vertical;

    constructor(grid){
        super(grid);
        this.#horizontal = bsrGeneralInfo.horizontal;
        this.#vertical = bsrGeneralInfo.vertical;
    }

    // check if a piece location can be in the drag and drop grid
    checkIfPieceLocationsAreInGridBoundries(firstLocation = [0,0], lastLocation = [0,0], rotation = bsrGeneralInfo.horizontal){
        var draggedPieceFirstLocationMatch;
        var draggedPieceLastLocationMatch;
        if (rotation == this.#horizontal){
            // find starting positions
            // horizontal between 2 and 11, vertical between 3 and 12, meaning lowest value can be [3,2] and highest can be [12, 11]
            // corresponds to the actual table locations
            draggedPieceFirstLocationMatch = firstLocation[1];
            draggedPieceLastLocationMatch = lastLocation[1];
            //console.log('piece first location', draggedPieceFirstLocationMatch,'piece last location', draggedPieceLastLocationMatch);
            if (draggedPieceFirstLocationMatch < this.getTableColumnsOffset() || draggedPieceLastLocationMatch > this.getTableColumnsCount() + this.getTableColumnIndexSize()){
                return false;
            }
            return true;
        }
        if (rotation == this.#vertical){
            // find starting positions
            draggedPieceFirstLocationMatch = firstLocation[0];
            draggedPieceLastLocationMatch = lastLocation[0];
            //console.log('piece first location', draggedPieceFirstLocationMatch,'piece last location', draggedPieceLastLocationMatch);
            if (draggedPieceFirstLocationMatch < this.getTableRowsOffset() || draggedPieceLastLocationMatch > this.getTableRowsCount() + this.getTableRowsAndNameIndexSize()){
                console.log('cannot use piece');
                return false;
            }
            return true;
        }
    }

    // return a clean internal drag and drop plot
    getDragAndDropCleanInternal(){
        return bsrGridInternals.dragAndDrop;
    }

}