// class having parsing options for the various data going in and coming out from the server

import { BsrGrid } from "./bsr-grid.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { BsrPlayPieces } from "./bsr-playpieces.js";

export {BsrPlayParse}

class BsrPlayParse{

    // example of what should be sent through as data
    //#dataDefault = { playerTurn : 1, pieceClicked : [3,2], pieceHit : true, pieceName : "patrolboat" , pieceLocations : [[3,2][3,3]], gameover : false}
    #dataDefault = { playerTurn : 0, pieceClicked : [], pieceHit : false, pieceName : "" , pieceLocations : [], gameover : false}

    // changes a raw locations to the grid stylized locations of a game grid
    static normalizeLocationPieceToGrid(pieceLocation = [0,0]){
        let bsrGrid = new BsrGrid();
        let normaizedRow = pieceLocation[0];
        let normalizedColumn = pieceLocation[1];
        normaizedRow = normaizedRow + bsrGrid.getTableRowsOffset();
        normalizedColumn = normalizedColumn + bsrGrid.getTableColumnsOffset();
        return [normaizedRow, normalizedColumn];
    }

    // changes the piece clicked location and piece locations to raw locations on a matrix
    // reduces location down as if there were no identifier locations or name tag on the grid
    static convertLocationPieceToRawLocation(pieceLocation = [0,0]){
        let bsrGrid = new BsrGrid();
        let normaizedRow = pieceLocation[0];
        let normalizedColumn = pieceLocation[1];
        normaizedRow = normaizedRow - bsrGrid.getTableRowsOffset();
        normalizedColumn = normalizedColumn - bsrGrid.getTableColumnsOffset();
        return [normaizedRow, normalizedColumn];
    }

    // change the grid location to local battleship location for ease of users
    static convertIndexLocationToBattleshipIndexLocation(pieceLocation = [0,0]){
        //console.log(pieceLocation);
        let bsrGrid = new BsrGrid();
        if (bsrGrid.checkIfLocationIsPlayableInGrid(pieceLocation)){
            let offset = bsrGrid.getTableRowsAndNameIndexSize();
            let rowLocation = (pieceLocation[0] - offset) % 26;
            return '(' + String.fromCharCode(rowLocation + 64) + ',' + (pieceLocation[1] - 1) + ')';
        }
        return 'No Locations';
    }

    // parse pieces data for sending over to server
    static parseDataForServerFormat(piecesData = new BsrPiecesData()){
        let piecesDataTable = structuredClone(piecesData.getPiecesDataTable());
        let tableLength = piecesDataTable.length;
        // go to individual piece in pieces data table, delete internals
        for (let i = 0; i < tableLength; i++){
            delete piecesDataTable[i].internals;
            let locationLength = piecesDataTable[i].locations.length;
            let newLocations = [];
            // replace current locations with raw locations without the given index grid shift of numbers or letters
            for (let j = 0; j < locationLength; j++){
                newLocations.push(this.convertLocationPieceToRawLocation(piecesDataTable[i].locations[j]));
            }
            piecesDataTable[i].locations = newLocations;
        }
        //console.log("going to send to server ", piecesDataTable);
        return piecesDataTable;
    }

    // parse pieces data table for client format (return as pieces data)
    static parseDataForClientFormat(piecesDataTable = []){
        let playPieces = new BsrPlayPieces();
        let tableLength = piecesDataTable.length;
        // go to individual piece and get its internals
        for (let i = 0; i < tableLength; i++){
            let pieceInternals = playPieces.getInternalsOfPiece(piecesDataTable[i].name, piecesDataTable[i].rotation);
            piecesDataTable[i].internals = Object.values(pieceInternals);
            let locaionsLength = piecesDataTable[i].locations.length;
            let newLocations = [];
            // replace current raw locations with normalized grid locations (add the number and letter indexes size onto the location)
            for (let j = 0; j < locaionsLength; j++){
                newLocations.push(this.normalizeLocationPieceToGrid(piecesDataTable[i].locations[j]));
            }
            piecesDataTable[i].locations = newLocations;
        }
        //console.log("after getting from server ", piecesDataTable);
        return new BsrPiecesData(piecesDataTable);
    }

}