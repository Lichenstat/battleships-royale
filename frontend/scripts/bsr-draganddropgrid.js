// Class for creating and interacting with drag and drop grids

import { BsrGrid } from "./bsr-grid.js";
import { bsrGridInternals } from "./bsr-config.js";

export { BsrDragAndDropGrid }

class BsrDragAndDropGrid extends BsrGrid{

    constructor(grid){
        super(grid);

    }

    // return a clean internal drag and drop plot
    getDragAndDropCleanInternal(){
        return bsrGridInternals.dragAndDrop;
    }

}