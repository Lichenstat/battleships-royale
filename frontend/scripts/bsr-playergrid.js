// Class to interact with player grid

import { BsrGrid } from "./bsr-grid.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";

export { BsrPlayerGrid }

class BsrPlayerGrid extends BsrGrid{

    #playerPiecesData;

    constructor(grid, bsrPiecesData = new BsrPiecesData()){
        super(grid);
        this.#playerPiecesData = bsrPiecesData;
    }

}