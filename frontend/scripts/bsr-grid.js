// Object class for creating and interacting with player grids

import { GenerateTable } from "./generate-table.js";
import { bsrGridProperties, bsrGridInternals } from "./bsr-config.js";

export { BsrGrid }

class BsrGrid{
    constructor(){
        this.gameTable = new GenerateTable();
        // default table that will be used
        this.gameTable.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, bsrGridProperties.content); // {'all' : this.gamePlot.getEnabledSquare()}
        this.gameGridDefault = this.gameTable.getHTMLTable();
        // for creating a drag and drop table
        this.gamePlacementPlot = Object.assign(bsrGridProperties.content , {'all' : bsrGridInternals.dragAndDrop});
        this.gameTable.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, this.gamePlacementPlot);
        this.gamePlacementTable = this.gameTable.getHTMLTable();

        this.currentGameGridDefault = this.#generateGameGridDefault();
        this.currentGameGridDragAndDrop = this.#generateGameGridDragAndDrop();
    }

    // generate the game grid
    #generateGameGridDefault(){
        return this.gameGridDefault;
    }

    // get and return the game grid
    getGameGridDefault(){
        return this.currentGameGridDefault;
    }

    // generate drag and drop grid
    #generateGameGridDragAndDrop(){
        return this.gamePlacementTable;
    }

    // get drag and drop table
    getGameGridDragAndDrop(){
        return this.currentGameGridDragAndDrop;
    }

    // get grid position of clicked plot
    onGridPositionClicked(elementId){
        return this.gamePlot.getSquareLocation(elementId);
    }

}