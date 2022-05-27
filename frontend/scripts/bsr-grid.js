// Object class for creating and interacting with player grids

import { CreateTable } from "./create-table.js";
import { bsrGridProperties, bsrGridInternals } from "./bsr-config.js";

export { BsrGrid }

class BsrGrid extends CreateTable{

    #gameGridDefault;
    #currentGameGrid;
    #saveGrid;

    constructor(){
        super();
        // default table that will be used
        this.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, bsrGridProperties.content);
        this.#gameGridDefault = this.getHTMLTable();

        // for setting a current game grid if there isnt one by default;
        this.#currentGameGrid = this.#gameGridDefault;

        // save a used grid for later on use
        this.#saveGrid;
    }

    // set the current game grid 
    setGrid(grid){
        this.#currentGameGrid = grid;
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