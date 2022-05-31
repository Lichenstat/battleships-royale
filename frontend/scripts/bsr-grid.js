// Class for creating and interacting with grids

import { bsrGridProperties } from "./bsr-config.js";

export { BsrGrid }

class BsrGrid{

    #tableRowsCount;
    #tableRowsOffset;
    #tableColumnsCount;
    #tableColumnsOffset;

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

    getTableRowsAndNameIndexSize(){
        return bsrGridProperties.rowsNameAndIndexSize;
    }

    getTableColumnIndexSize(){
        return bsrGridProperties.columnsIndexSize;
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