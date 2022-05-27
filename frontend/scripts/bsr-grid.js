// Object class for creating and interacting with player grids

import { CreateTable } from "./create-table.js";
import { bsrGridProperties, bsrGridInternals } from "./bsr-config.js";

export { BsrGrid }

class BsrGrid extends CreateTable{

    #gameGridDefault;
    #gamePlacementPlot;
    #gamePlacementTable;
    #currentGameGridDefault;
    #currentGameGridDragAndDrop;
    #saveGrid;
    #saveDragAndDropGrid;

    constructor(){
        super();
        // default table that will be used
        this.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, bsrGridProperties.content);
        this.#gameGridDefault = this.getHTMLTable();
        // for creating a drag and drop table
        this.#gamePlacementPlot = Object.assign(bsrGridProperties.content , {'all' : bsrGridInternals.dragAndDrop});
        this.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, this.#gamePlacementPlot);
        this.#gamePlacementTable = this.getHTMLTable();

        this.#currentGameGridDefault = this.#createGameGridDefault();
        this.#currentGameGridDragAndDrop = this.#createGameGridDragAndDrop();

        // save a used grid for later on use
        this.#saveGrid;
        this.#saveDragAndDropGrid;
    }

    // generate the game grid
    #createGameGridDefault(){
        return this.#gameGridDefault;
    }

    // get and return the game grid
    getGameGridDefault(){
        return this.#currentGameGridDefault;
    }

    // save game grid
    saveGameGrid(tableString){
        this.#saveGrid = tableString;
    }

    // return the saved game grid
    getSavedGameGrid(tableString){
        this.#saveGrid = tableString;
    }

    // generate drag and drop grid
    #createGameGridDragAndDrop(){
        return this.#gamePlacementTable;
    }

    // get drag and drop table
    getGameGridDragAndDrop(){
        return this.#currentGameGridDragAndDrop;
    }

    // save a game grid drag and drop
    saveGameGridDragAndDrop(tableString){
        this.#saveDragAndDropGrid = tableString
    }

    // return the saved drag and drop grid
    getSavedGameGridDragAndDrop(){
        //let moveablePieces = this.#saveDragAndDropGrid.replace(new RegExp('draggable="false"', 'g'), 'draggable="true"');
        return this.#saveDragAndDropGrid;
    }

    // get grid position of clicked plot
    onGridPositionClicked(elementId){
        return this.gamePlot.getSquareLocation(elementId);
    }

    getDragAndDropCleanInternal(){
        return bsrGridInternals.dragAndDrop;
    }

}