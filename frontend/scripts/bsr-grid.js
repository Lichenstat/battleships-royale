// Class for creating and interacting with grids

export { BsrGrid }

class BsrGrid{

    #currentGameGrid;
    #saveGrid;

    constructor(grid){
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