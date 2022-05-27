// Object class for creating and interacting with player grids

import { BsrGrid } from "./bsr-grid.js";
import { bsrGridProperties, bsrGridInternals } from "./bsr-config.js";

export { BsrButtonGrid }

class BsrButtonGrid extends BsrGrid{

    #gameButtonPlots;
    #gameButtonTable;

    constructor(){
        super();
        // for creating a game button table (user choice attacking enemy)
        this.#gameButtonPlots = Object.assign(bsrGridProperties.content, {'all' : bsrGridInternals.boardButton});
        this.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, this.#gameButtonPlots);
        this.#gameButtonTable = this.getHTMLTable();

        // set the drag and drop grid
        this.setGrid(this.#gameButtonTable);
    }

}