// Object class for creating and interacting with player grids

import { GenerateTable } from "./generate-table";
import { BsrPlot } from "./bsr-plot";
import { bsrTableProperties } from "./bsr-info";

export { BsrGrid }

class BsrGrid{
    constructor(){
        this.bsrPlot = new BsrPlot();
        this.gameTable = new GenerateTable();
        this.ganeTable.setHTMLTableProperties(bsrTableProperties.class, bsrTableProperties.id, bsrTableProperties.tableHeadColumnCount, bsrTableProperties.tableFootColumnCount, bsrTableProperties.rows, bsrTableProperties.columns);
        this.gameGrid = this.bsrTable.getHTMLTable;
        this.currentGameGrid = this.#generateGameGrid();
    }

    #generateGameGrid(){
        
    }


}