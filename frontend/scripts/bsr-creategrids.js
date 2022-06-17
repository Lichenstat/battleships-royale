// static methods for calling what grids to return

import { CreateTable } from "./create-table.js";
import { BsrGrid } from "./bsr-grid.js";
import { BsrDragAndDropGrid } from "./bsr-draganddropgrid.js";
import { BsrButtonGrid } from "./bsr-buttongrid.js";
import { BsrPlayerGrid } from "./bsr-playergrid.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { bsrGridProperties, bsrGridInternals } from "./bsr-config.js";

export { BsrCreateGrids }

class BsrCreateGrids{

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
        let gamePlacementPlots = Object.assign(bsrGridProperties.content , {'(1,1)' : 'Setup', all : bsrGridInternals.dragAndDrop});
        table.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, gamePlacementPlots);
        let gamePlacementTable = table.getHTMLTable();
        return new BsrDragAndDropGrid(gamePlacementTable);
    }

    // method to return a buttons grid (mostly used for player interactions)
    static getButtonGrid(){
        let table = new CreateTable();
        // for creating a game button table (user choice attacking enemy)
        let gameButtonPlots = Object.assign(bsrGridProperties.content, {'(1,1)' : 'P2', all : bsrGridInternals.boardButtonEnabled});
        table.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, gameButtonPlots);
        let gameButtonTable = table.getHTMLTable();
        return new BsrButtonGrid(gameButtonTable);
    }

    // method to return a player grid with all the board pieces on it
    static getPlayerGrid(bsrPiecesData = new BsrPiecesData()){
        let positionPlotPieces = {};
        let piecesInfo = bsrPiecesData.getPiecesDataTable();
        let piecesInfoLength = Object.keys(piecesInfo).length;
        // get our internals to which we will set the players board pieces to
        for (var i = 0; i < piecesInfoLength; i++){
            let locationsLength = piecesInfo[i].locations.length;
            for (var j = 0; j < locationsLength; j++){
                let data = piecesInfo[i];
                let location = data.locations[j];
                let internal = data.internals[j];
                location = '(' + location[0] + ',' + location[1] + ')';
                // remove draggable features and assign player class and id attributes
                internal = internal.replace(new RegExp(bsrGridInternals.dragAndDropItemAttributeDraggable, 'g'), '').toString();
                internal = internal.replace(new RegExp(bsrGridInternals.dragAndDropItemAttributeOndragstart, 'g'), '').toString();
                internal = internal.replace(new RegExp(bsrGridInternals.dragAndDropItemClassName ,"g"), bsrGridInternals.playerPieceClassName).toString();
                internal = internal.replace(/(?=<\/div>)/g, bsrGridInternals.playerPieceBlankOutcomeImage)
                positionPlotPieces[location] = internal;
            }
        }
        // make regular plot pieces
        let gamePlayerPlots = Object.assign(bsrGridProperties.content, { '(1,1)' : 'P1', "all" : bsrGridInternals.playerPieceEmpty});
        //console.log(gamePlayerPlots);
        let table = new CreateTable();
        // combine with chosen player pieces
        let gamePlayerPlotsChosen = Object.assign(positionPlotPieces, gamePlayerPlots);
        //console.log(gamePlayerPlotsChosen);
        table.setHTMLTableProperties(bsrGridProperties.class, bsrGridProperties.id, bsrGridProperties.tableHeadColumnCount, bsrGridProperties.tableFootColumnCount, bsrGridProperties.rows, bsrGridProperties.columns, gamePlayerPlotsChosen);
        let gamePlayerTable = table.getHTMLTable();
        //console.log(gamePlayerTable);
        return new BsrPlayerGrid(gamePlayerTable, bsrPiecesData);
    }

}

