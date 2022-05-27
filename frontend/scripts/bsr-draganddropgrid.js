// Object class for creating and interacting with player grids

import { BsrGrid } from "./bsr-grid.js";
import { bsrGridProperties, bsrGridInternals } from "./bsr-config.js";

export { BsrDragAndDropGrid }

class BsrDragAndDropGrid extends BsrGrid{

    #gamePlacementPlots;
    #gamePlacementTable;

    constructor(){
        super();
        // for creating a drag and drop table
        this.#gamePlacementPlots = Object.assign(bsrGridProperties.content , {'all' : bsrGridInternals.dragAndDrop});
        this.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, this.#gamePlacementPlots);
        this.#gamePlacementTable = this.getHTMLTable();

        // set the drag and drop grid
        this.setGrid(this.#gamePlacementTable);
    }

    // return a clean internal drag and drop plot
    getDragAndDropCleanInternal(){
        return bsrGridInternals.dragAndDrop;
    }

}