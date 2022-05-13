// Methods for interacting with the players (player interaction on clientside)

export { BsrLogic };

import { BsrPlayPieces } from "./bsr-playpieces.js";
import { BsrGrid } from "./bsr-grid.js";
import { Helper } from "./helper.js";
import { bsrGridProperties, bsrGridPieces, bsrPieceInteractors, bsrGridInternals } from "./bsr-config.js";

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
        this.desiredTypePiece = {};
        this.draggedPieceName = '';
        this.draggedPieceLocation = [];
        this.localPieceLocation = [];
        this.draggedOverPiece = [];
        this.previousDraggedOverPiece = [];
        this.possiblePlacementLocations = [];
        this.canUpdatePieces = true;
        this.draggablePieces = '';
        console.log(this.tableRowsOffset, this.tableColumnsOffset);
    }

    // set rotation of pieces during grid setup
    changeBoardPieceRotation(){
        if(this.pieceRotation == this.vertical ? this.pieceRotation = this.horizontal : this.pieceRotation = this.vertical);
        this.canUpdatePieces = true;
    }

    // a return to see if the current location can be used
    canUseCurrentLocation(){
        return this.canUpdatePieces;
    }

    // return currently used table
    getCurrentlyPlaceablePiece(){
        return this.possiblePlacementLocations;
    }

    // set dragged content
    setDraggedPiece(pieceId){
        this.draggedPieceLocation = Helper.parseElementIdForMatrixLocation(pieceId);
        let name = pieceId.match(/--.*-/g);
        name = name.toString().replace(/--|-/g, '');
        this.draggedPieceName = name.toString();
        console.log(this.draggedPieceLocation, this.draggedPieceName);
    }

    // set local gotten from piece
    setLocalPiece(pieceId){
        this.localPieceLocation = Helper.parseElementIdForMatrixLocation(pieceId);
        console.log(this.localPieceLocation);
    }

    // get content that piece was dragged onto
    setDraggedOverPiece(pieceId){
        this.draggedOverPiece = Helper.parseElementIdForMatrixLocation(pieceId);
        //console.log(this.draggedOverPiece);
    }

    // return the desired piece from pieces
    #getPieceTypeByName(){
        let desiredPiece;
        this.pieces.every(
            boardPiece => {
                if(this.draggedPieceName == boardPiece.name){
                    desiredPiece = boardPiece;
                    return false;
                }
                return true;
            }
        );
        return desiredPiece;
    }

    // return the desired piece from pieces
    #getDataTablePieceByLocation(location){
        let desiredPiece;
        // first loop gets to piece
        this.pieces.every(
            boardPiece => {
                // second loop compares data locations to a given location
                boardPiece.location.every(
                    dataLocation => {
                        if (Helper.checkIfArraysAreEqual(dataLocation, location)){
                            desiredPiece = boardPiece;
                            return false;
                        }
                    }
                )
                // if a desired piece has been found, we can return;
                if (desiredPiece){return false;}
                return true;
            }
        );
        return desiredPiece;
    }

    // check if the current piece will overlap with any currently set pieces in the data table
    #getPieceHavingDataTableOverlap(pieceLocations){
        //console.log(this.piecesDataTable);
        //console.log(pieceLocations);
        let pieceDataLength = this.piecesDataTable.length;
        let pieceLocationsLength = pieceLocations.length;
        for (var i = 0; i < pieceDataLength; i++){
            var currentData = this.piecesDataTable[i].locations;
            var currentDataLength = currentData.length;
            for (var j = 0; j < currentDataLength; j++){
                for (var k = 0; k < pieceLocationsLength; k++){
                    if (Helper.checkIfArraysAreEqual(currentData[j], pieceLocations[k])){
                        return this.piecesDataTable[i];
                    }
                }
            }
        }
        return false;
    }

    // check if a piece location can be in the grid
    checkIfPieceLocationCanBeInGrid(){

    }

    // check if a piece will fit horizontally in the table
    #checkDraggedPieceHorizontalFit(){

    }

    // check if a piece will fit horizontally in the table
    #checkDraggedPieceVerticalFit(){

    }

    // check if the piece can be put into the table by filling a temporary locations array of the current piece
    // and set the pieces to be able to be updated or not
    checkPieceLocations(){
        // make sure we aren't calculating the same dragged over piece again and again
        if (!Helper.checkIfArraysAreEqual(this.previousDraggedOverPiece, this.draggedOverPiece)){
            this.canUpdatePieces = true;
            this.previousDraggedOverPiece = this.draggedOverPiece;
            let pieceLocations = [];
            // get the size of the piece for looping
            this.desiredTypePiece = this.#getPieceTypeByName();
            if (this.desiredTypePiece.count <= 0){
                this.canUpdatePieces = false;
                return false;
            }
            //checking if given piece can be placed in horizontally
            if (this.pieceRotation == this.horizontal){
                // find starting positions
                // horizontal between 2 and 11, vertical between 3 and 12, meaning lowest value can be [3,2] and highest can be [12, 11]
                // corresponds to the actual table locations
                var draggedPieceFirstLocation = this.draggedOverPiece[1] - this.draggedPieceLocation[1] + 1;
                var draggedPieceLastLocation = this.draggedOverPiece[1] + (this.desiredTypePiece.size - Number(this.draggedPieceLocation[1]));
                //console.log('piece first location', draggedPieceFirstLocation,'piece last location', draggedPieceLastLocation);
                if (draggedPieceFirstLocation < this.tableColumnsOffset || draggedPieceLastLocation > this.tableColumnsCount + bsrGridProperties.columnsIndexSize){
                    this.canUpdatePieces = false;
                    return false;
                }
                var size = this.desiredTypePiece.size + draggedPieceFirstLocation;
                for(var i = draggedPieceFirstLocation; i < size; i++){
                    pieceLocations.push([this.draggedOverPiece[0], i]);
                }
            }
            //checking if given piece can be placed in vertically
            if (this.pieceRotation == this.vertical){
                // find starting positions
                var draggedPieceFirstLocation = this.draggedOverPiece[0] - this.draggedPieceLocation[0] + 1;
                var draggedPieceLastLocation = this.draggedOverPiece[0] + (this.desiredTypePiece.size - this.draggedPieceLocation[0]);
                //console.log('piece first location', draggedPieceFirstLocation,'piece last location', draggedPieceLastLocation);
                if (draggedPieceFirstLocation < this.tableRowsOffset || draggedPieceLastLocation > this.tableRowsCount + bsrGridProperties.rowsNameAndIndexSize){
                    this.canUpdatePieces = false;
                    return false;
                }
                var size = this.desiredTypePiece.size + draggedPieceFirstLocation;
                for(var i = draggedPieceFirstLocation; i < size; i++){
                    pieceLocations.push([i, this.draggedOverPiece[1]]);
                }
            }
            //console.log(pieceLocations);
            if(this.#getPieceHavingDataTableOverlap(pieceLocations)){
                this.canUpdatePieces = false;
                return false;
            }
            this.possiblePlacementLocations = pieceLocations;
        }
    }

    // if the piece can be set in the table, then do so
    setPieceLocation(){
        if(this.canUpdatePieces && this.draggedPieceName){
            this.piecesDataTable.push({'id' : this.pieceCounter, 'name' : this.draggedPieceName, 'locations' : this.possiblePlacementLocations})
            this.pieceCounter = this.pieceCounter + 1;
            this.desiredTypePiece.count = this.desiredTypePiece.count - 1;
        }
        console.log(this.piecesDataTable);
    }

    // update the drag pieces that could be put on the grid
    #updatePossiblePieces(){
        let piecesCombined = '';
        let currentPiece = '';
        // create a string of all the useable pieces and check if they can be used (draggable)
        this.draggablePieces = '';
        // if these pieces are going to be horizontal
        if (this.pieceRotation == this.horizontal){
            this.pieces.every(piece => {
                currentPiece = piece;
                //console.log(piece);
                if (piece.count <= 0){
                    // set draggable or not
                    currentPiece[this.horizontal] = Helper.parsePartOfStringToReplace(currentPiece[this.horizontal], 'draggable="true"', 'draggable="false"');
                }
                piecesCombined = piecesCombined + currentPiece[this.horizontal];
                //console.log(piecesCombined);
                return true;
            });
            this.draggablePieces = piecesCombined;
        }
        // if these pieces are going to be vertical
        if (this.pieceRotation == this.vertical){
            // create a string of all the useable pieces and check if they can be used (draggable)
            this.draggablePieces = '';
            this.pieces.every(piece => {
                currentPiece = piece;
                if (piece.count <= 0){
                    // set draggable or not
                    currentPiece[this.vertical] = Helper.parsePartOfStringToReplace(currentPiece[this.vertical], 'draggable="true"', 'draggable="false"');
                }
                piecesCombined = piecesCombined + currentPiece[this.vertical];
                return true;
            });
            this.draggablePieces = piecesCombined;
        }
    }

    getUpdatedPieces(){
        // if we can use the current location
        if (this.canUpdatePieces){
            this.#updatePossiblePieces();
        }
        // if we cannot use the piece just simply return the current pieces we already had
        return this.draggablePieces;
    }

    removePieces(){

    }

}