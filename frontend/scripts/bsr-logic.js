// Methods for interacting with the players (player interaction on clientside)

export { BsrLogic };

import { BsrPlayPieces } from "./bsr-playpieces.js";
import { BsrGrid } from "./bsr-grid.js";
import { Helper } from "./helper.js";
import { bsrGridProperties, bsrGridPieces } from "./bsr-config.js";

class BsrLogic{
    constructor(tableRowsCount = bsrGridProperties.rows - 1, tableColumnsCount = bsrGridProperties.columns - 1, pieceRotation = 'horizontal'){
        this.bsrPlayPieces = new BsrPlayPieces();
        this.horizontalPlayPieces = this.bsrPlayPieces.getPiecesHorizontal();
        this.verticalPlayPieces = this.bsrPlayPieces.getPiecesVertical();
        this.tableRowsCount = tableRowsCount;
        this.tableRowsOffset = Math.abs(this.tableRowsCount - (bsrGridProperties.rows + Number(bsrGridProperties.tableHeadColumnCount > 0) + Number(bsrGridProperties.tableFootColumnCount > 0) + 1));
        this.tableColumnsCount = tableColumnsCount;
        this.tableColumnsOffset = Math.abs(this.tableColumnsCount - (bsrGridProperties.columns + 1));
        this.pieceRotation = pieceRotation;
        this.horizontal = 'horizontal';
        this.vertical = 'vertical';
        this.piecesDataTable = [];// Array(this.tableRowsCount).fill().map(() => Array(this.tableColumnsCount).fill(0));
        // create and assign pieces objects to be used with the grid
        this.pieces = [
            { 'name' : bsrGridPieces.carrierHorizontal.name,    'count' : bsrGridPieces.carrierHorizontal.count,    'size' : bsrGridPieces.carrierHorizontal.size,    'placed' : bsrGridPieces.carrierHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.carrierHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.carrierVertical.name]},
            { 'name' : bsrGridPieces.battleshipHorizontal.name, 'count' : bsrGridPieces.battleshipHorizontal.count, 'size' : bsrGridPieces.battleshipHorizontal.size, 'placed' : bsrGridPieces.battleshipHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.battleshipHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.battleshipVertical.name]},
            { 'name' : bsrGridPieces.destroyerHorizontal.name,  'count' : bsrGridPieces.destroyerHorizontal.count,  'size' : bsrGridPieces.destroyerHorizontal.size,  'placed' : bsrGridPieces.destroyerHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.destroyerHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.destroyerVertical.name]},
            { 'name' : bsrGridPieces.submarineHorizontal.name,  'count' : bsrGridPieces.submarineHorizontal.count,  'size' : bsrGridPieces.submarineHorizontal.size,  'placed' : bsrGridPieces.submarineHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.submarineHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.submarineVertical.name]},
            { 'name' : bsrGridPieces.patrolboatHorizontal.name, 'count' : bsrGridPieces.patrolboatHorizontal.count, 'size' : bsrGridPieces.patrolboatHorizontal.size, 'placed' : bsrGridPieces.patrolboatHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.patrolboatHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.patrolboatVertical.name]}
        ];
        this.pieceCounter = 1;
        this.draggedPieceName = '';
        this.draggedPiece = [];
        this.draggedOntoPiece = [];
        this.lastDraggedOntoPiece = [];
        this.temporaryLocations = [];
        this.canUseTemporaryLocations = true;
        console.log(this.tableRowsOffset, this.tableColumnsOffset);
    }

    // set rotation of pieces during grid setup
    changeBoardPieceRotation(rotation){
        if(rotation == 1 || rotation == this.vertical ? this.pieceRotation = this.vertical : this.pieceRotation = this.horizontal);
    }

    // set dragged content
    setDraggedPiece(pieceId){
        this.draggedPiece = Helper.parseElementIdForMatrixLocation(pieceId);
        let name = pieceId.match(/--.*-/g);
        name = name.toString().replace(/--|-/g, '');
        this.draggedPieceName = name.toString();
        console.log(this.draggedPiece, this.draggedPieceName);
    }

    // get content that piece was dragged onto
    setDraggedOntoPiece(pieceId){
        this.draggedOntoPiece = Helper.parseElementIdForMatrixLocation(pieceId);
        console.log(this.draggedOntoPiece);
    }

    // check if the current piece will overlap with any currently set pieces in the data table
    #checkPieceForDataTableOverlap(pieceLocations){
        //console.log(this.piecesDataTable);
        //console.log(pieceLocations);
        let pieceDataLength = this.piecesDataTable.length;
        let pieceLocationsLength = pieceLocations.length
        for (var i = 0; i < pieceDataLength; i++){
            var currentData = this.piecesDataTable[i].locations;
            var currentDataLength = currentData.length;
            for (var j = 0; j < currentDataLength; j++){
                for (var k = 0; k < pieceLocationsLength; k++){
                    if (Helper.checkIfArraysAreEqual(currentData[j], pieceLocations[k])){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // check if the piece can be put into the table by making a temporary locations table of the current piece
    checkPieceLocation(){
        // make sure we aren't calculating the same dragged over piece again and again
        if (!Helper.checkIfArraysAreEqual(this.lastDraggedOntoPiece, this.draggedOntoPiece)){
            this.canUseTemporaryLocations = true;
            this.lastDraggedOntoPiece = this.draggedOntoPiece;
            let pieceLocations = [];
            // get the size of the piece for looping
            let desiredPiece;
            this.pieces.forEach(
                boardPiece => {
                    if(this.draggedPieceName == boardPiece.name){
                        desiredPiece = boardPiece;
                    }
                }
            );
            console.log(desiredPiece.size);
            //checking if given piece can be placed in horizontally
            if (this.pieceRotation == this.horizontal){
                // find starting positions
                var draggedPieceFirstLocation = this.draggedOntoPiece[1] - this.draggedPiece[1] + 1;
                var draggedPieceLastLocation = this.draggedOntoPiece[1] + (desiredPiece.size - Number(this.draggedPiece[1]));
                //console.log('piece first location', draggedPieceFirstLocation,'piece last location', draggedPieceLastLocation);
                if (draggedPieceFirstLocation < this.tableColumnsOffset || draggedPieceLastLocation > this.tableColumnsCount + bsrGridProperties.columnsIndexSize){
                    this.canUseTemporaryLocations = false;
                    return false;
                }
                var size = desiredPiece.size + draggedPieceFirstLocation;
                for(var i = draggedPieceFirstLocation; i < size; i++){
                    pieceLocations.push([this.draggedOntoPiece[0], i]);
                }
            }
            //checking if given piece can be placed in vertically
            if (this.pieceRotation == this.vertical){
                // find starting positions
                var draggedPieceFirstLocation = this.draggedOntoPiece[0] - this.draggedPiece[0] + 1;
                var draggedPieceLastLocation = this.draggedOntoPiece[0] + (desiredPiece.size - this.draggedPiece[0]);
                //console.log('piece first location', draggedPieceFirstLocation,'piece last location', draggedPieceLastLocation);
                if (draggedPieceFirstLocation < this.tableRowsOffset || draggedPieceLastLocation > this.tableRowsCount + bsrGridProperties.rowsNameAndIndexSize){
                    this.canUseTemporaryLocations = false;
                    return false;
                }
                var size = desiredPiece.size + draggedPieceFirstLocation;
                for(var i = draggedPieceFirstLocation; i < size; i++){
                    pieceLocations.push([i, this.draggedOntoPiece[1]]);
                }
            }
            //console.log(pieceLocations);
            if(this.#checkPieceForDataTableOverlap(pieceLocations)){
                console.log('bad tlocation');
                this.canUseTemporaryLocations = false;
                return false;
            }
            this.temporaryLocations = pieceLocations;
        }
    }

    // if the piece can be set in the table, then do so
    setPieceLocation(){
        console.log(this.canUseTemporaryLocations);
        if(this.canUseTemporaryLocations){
            this.piecesDataTable.push({'id' : this.pieceCounter, 'name' : this.draggedPieceName, 'locations' : this.temporaryLocations})
            this.pieceCounter = this.pieceCounter + 1;
        }
        console.log(this.piecesDataTable);
    }







}