// Class for creating and interacting with grids

import { CreateTable } from "./create-table.js";

export { BsrGrid }

class BsrGrid extends CreateTable{

    #currentGameGrid;
    #saveGrid;

    constructor(grid){
        super();
        // for setting a current game grid if there isnt one by default;
        this.#currentGameGrid = grid;

        // save a used grid for later on use
        this.#saveGrid;
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