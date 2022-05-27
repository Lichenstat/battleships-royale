// static methods for calling what grids to return

import { CreateTable } from "./create-table.js";
import { BsrGrid } from "./bsr-grid.js";
import { BsrDragAndDropGrid } from "./bsr-draganddropgrid.js";
import { BsrButtonGrid } from "./bsr-buttongrid.js";
import { BsrPlayerGrid } from "./bsr-playergrid.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { bsrGridProperties, bsrGridInternals } from "./bsr-config.js";

export { BsrGrids }

class BsrGrids{

    // method to return a default grid (mostly just used as a palceholder grid in this case)
    static getDefaultGrid(){
        let table = new CreateTable();
        // default table that will be used
        table.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, bsrGridProperties.content);
        let defaultGrid = table.getHTMLTable();
        return new BsrGrid(defaultGrid);
    }

    // method to return a drag and drop grid (used to move pieces around)
    static getDragAndDropGrid(){
        let table = new CreateTable();
        // for creating a drag and drop table
        let gamePlacementPlots = Object.assign(bsrGridProperties.content , {'all' : bsrGridInternals.dragAndDrop});
        table.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, gamePlacementPlots);
        let gamePlacementTable = table.getHTMLTable();
        return new BsrDragAndDropGrid(gamePlacementTable);
    }

    // method to return a buttons grid (mostly used for player interactions)
    static getButtonGrid(){
        let table = new CreateTable();
        // for creating a game button table (user choice attacking enemy)
        let gameButtonPlots = Object.assign(bsrGridProperties.content, {'all' : bsrGridInternals.boardButton});
        table.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, gameButtonPlots);
        let gameButtonTable = table.getHTMLTable();
        return new BsrButtonGrid(gameButtonTable);
    }

    // method to return a player grid with all the board pieces on it
    static getPlayerGrid(bsrPiecesData){
        
    }

    // method to create internals to use with the grid at hand
    static #createGridInternals(){

    }


}

