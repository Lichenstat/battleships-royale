// Object class for creating and interacting with player grids

import { GenerateTable } from "./generate-table.js";
import { BsrPlot } from "./bsr-plot.js";
import { bsrTableProperties } from "./bsr-info.js";

export { BsrGrid }

class BsrGrid{
    constructor(){
        this.gamePlot = new BsrPlot();
        this.gameTable = new GenerateTable();
        this.gameTable.setHTMLTableProperties(bsrTableProperties.class, bsrTableProperties.id, bsrTableProperties.tableHeadColumnCount, bsrTableProperties.tableFootColumnCount, bsrTableProperties.rows, bsrTableProperties.columns, {'all' : this.gamePlot.getEnabledSquare()});
        this.gameGrid = this.gameTable.getHTMLTable();
        this.currentGameGrid = this.#generateGameGrid();
    }

    // generate the game grid
    #generateGameGrid(){
        return this.gameGrid;
    }

    // get and return the game grid
    getGameGrid(){
        return this.currentGameGrid;
    }

    // get grid position of clicked plot
    onGridPositionClicked(elementId){
        return this.gamePlot.getSquareLocation(elementId);
    }


}