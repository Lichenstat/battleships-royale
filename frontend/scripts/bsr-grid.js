// Class for creating and interacting with grids

import { bsrGridProperties } from "./bsr-config.js";

export { BsrGrid }

class BsrGrid{

    #tableRowsCount;
    #tableRowsOffset;
    #tableColumnsCount;
    #tableColumnsOffset;

    #minRowPosition;
    #maxRowPosition;
    #minColumnPosition;
    #maxColumnPosition;

    #gridMinAndMaxPositions;

    #currentGameGrid;
    #saveGrid;

    constructor(grid){
        // for setting a current game grid if there isnt one by default;
        this.#currentGameGrid = grid;

        // if needing to use table rows and columns with offsets then the values exist
        this.#tableRowsCount = bsrGridProperties.rows - 1;
        this.#tableRowsOffset = Math.abs(this.#tableRowsCount - (bsrGridProperties.rows + Number(bsrGridProperties.tableHeadColumnCount > 0) + Number(bsrGridProperties.tableFootColumnCount > 0) + 1));
        this.#tableColumnsCount = bsrGridProperties.columns - 1;
        this.#tableColumnsOffset = Math.abs(this.#tableColumnsCount - (bsrGridProperties.columns + 1));

        this.#minRowPosition = this.getTableRowsOffset();
        this.#maxRowPosition = this.#minRowPosition + (this.getTableRowsCount() - 1);
        this.#minColumnPosition = this.getTableColumnsOffset();
        this.#maxColumnPosition = this.#minColumnPosition + (this.getTableColumnsCount() - 1);

        // have a way to get grid min and max indexes
        this.#gridMinAndMaxPositions = {
            minRowPosition : this.#minRowPosition,
            maxRowPosition : this.#maxRowPosition,
            minColumnPosition : this.#minColumnPosition,
            maxColumnPosition : this.#maxColumnPosition
        }

        // save a used grid for later on use
        this.#saveGrid;
    }

    // return count of the number of rows
    getTableRowsCount(){
        return this.#tableRowsCount;
    }

    // return the count of the number of columns
    getTableColumnsCount(){
        return this.#tableColumnsCount;
    }

    // get the count of the rows offset
    getTableRowsOffset(){
        return this.#tableRowsOffset;
    }

    // get the count of the columns offset
    getTableColumnsOffset(){
        return this.#tableColumnsOffset;
    }

    // get the table row and name index size
    getTableRowsAndNameIndexSize(){
        return bsrGridProperties.rowsNameAndIndexSize;
    }

    // get the columns index size
    getTableColumnIndexSize(){
        return bsrGridProperties.columnsIndexSize;
    }

    // get the grid min and max positions of rows and columns
    getGridMinAndMaxPositions(){
        return this.#gridMinAndMaxPositions;
    }

    // check if a location can fit in the grid
    checkIfLocationIsPlayableInGrid(location = [0,0]){
        let rowCheck = (this.#minRowPosition <= location[0] && this.#maxRowPosition >= location[0]);
        let columnCheck = (this.#minColumnPosition <= location[1] && this.#maxColumnPosition >= location[1]);
        if (rowCheck && columnCheck){
            return true;
        }
        return false;
    }

    // get all possible direction locations around a given local location 
    // (up, down, left, right) and exclude non interactable locations
    getPlayableLocationsAroundLocation(location = [0,0]){
        let directionLocations = {};
        let up = [location[0] - 1, location[1]];
        let down = [location[0] + 1, location[1]];
        let left = [location[0], location[1] - 1];
        let right = [location[0], location[1] + 1];
        if (this.checkIfLocationIsPlayableInGrid(up)) directionLocations.up = up;
        if (this.checkIfLocationIsPlayableInGrid(down)) directionLocations.down = down;
        if (this.checkIfLocationIsPlayableInGrid(left)) directionLocations.left = left;
        if (this.checkIfLocationIsPlayableInGrid(right)) directionLocations.right = right;
        return directionLocations;
    }

    // get and return the game grid
    getGrid(){
        return this.#currentGameGrid;
    }

    // save game grid
    saveGrid(tableString){
        this.#saveGrid = tableString;
    }

    // return the saved game grid
    loadGrid(){
        return this.#saveGrid;
    }

}