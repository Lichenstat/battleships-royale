// Methods for interacting with the players using grid pieces and grid (player interaction on clientside)

export { BsrLogic };

import { BsrPlayPieces } from "./bsr-playpieces.js";
import { BsrGrid } from "./bsr-grid.js";
import { Helper } from "./helper.js";
import { bsrGridProperties, bsrGridPieces, bsrPieceInteractors, bsrGridInternals } from "./bsr-config.js";

class BsrLogic{

    #bsrPlayPieces;
    #piecesDataTable;

    #tableRowsCount;
    #tableRowsOffset;
    #tableColumnsCount;
    #tableColumnsOffset;
    #pieceRotation;
    #horizontal;
    #vertical;

    #pieceCounter;
    #desiredPiecesType;

    #draggedPieceName;
    #draggedPieceIds;
    #draggedPieceInternals;
    #draggedPieceClickedLocation;
    #draggedPieceFirstLocation;
    #draggedPieceLastLocation;

    #gridPieceClickedId;
    #gridPieceClickedIdDefault;
    #gridPieceIds;
    #gridPieceClickedLocation;
    #gridPieceLocationChecked;
    #draggedOverGridPieceId;
    #draggedOverGridPiece;
    #previousDraggedOverGridPiece;

    #possiblePlacementLocations;
    
    #canUpdatePieces;
    #isUsingPlacedPiece;
    #usingPlacedPiece;

    constructor(tableRowsCount = bsrGridProperties.rows - 1, tableColumnsCount = bsrGridProperties.columns - 1, pieceRotation = 'horizontal'){
        // create and assign pieces objects to be used with the grid
        this.#bsrPlayPieces = new BsrPlayPieces();
        this.#piecesDataTable = [];

        this.#tableRowsCount = tableRowsCount;
        this.#tableRowsOffset = Math.abs(this.#tableRowsCount - (bsrGridProperties.rows + Number(bsrGridProperties.tableHeadColumnCount > 0) + Number(bsrGridProperties.tableFootColumnCount > 0) + 1));
        this.#tableColumnsCount = tableColumnsCount;
        this.#tableColumnsOffset = Math.abs(this.#tableColumnsCount - (bsrGridProperties.columns + 1));
        this.#pieceRotation = pieceRotation;
        this.#horizontal = bsrGridPieces.horizontal;
        this.#vertical = bsrGridPieces.vertical;

        this.#pieceCounter = 1;
        this.#desiredPiecesType = {};

        this.#draggedPieceName = '';
        this.#draggedPieceIds = [];
        this.#draggedPieceInternals = [];
        this.#draggedPieceClickedLocation = [];
        this.#draggedPieceFirstLocation = [];
        this.#draggedPieceLastLocation = [];
        
        this.#gridPieceClickedId = '';
        this.#gridPieceClickedIdDefault = "bsr__table-cell-(0,0)";
        this.#gridPieceIds = [];
        this.#gridPieceClickedLocation = [];
        this.#gridPieceLocationChecked = false;
        this.#draggedOverGridPieceId = '';
        this.#draggedOverGridPiece = [];
        this.#previousDraggedOverGridPiece = [];
        
        this.#possiblePlacementLocations = [];

        this.#canUpdatePieces = true;
        this.#isUsingPlacedPiece = false;
        this.#usingPlacedPiece = {};
        
        console.log(this.#tableRowsOffset, this.#tableColumnsOffset);
    }

    // set rotation of pieces during grid setup
    changeBoardPieceRotation(){
        if(this.#pieceRotation == this.#vertical ? this.#pieceRotation = this.#horizontal : this.#pieceRotation = this.#vertical);
        this.#canUpdatePieces = true;
    }

    // a return to see if the current location can be used
    canUseCurrentLocation(){
        return this.#canUpdatePieces;
    }

    // return currently used table
    getCurrentlyPlaceablePiece(){
        return this.#possiblePlacementLocations;
    }

    // return the already placed piece id's
    getPlacedPieceIds(){
        return this.#gridPieceIds;
    }
    
    // return the dragged piece ids
    getDraggedPieceIdsAndInternals(){
        return [this.#draggedPieceIds, this.#draggedPieceInternals];
    }

    // set dragged content
    setDraggedPiece(pieceId){
        this.#draggedPieceClickedLocation = Helper.parseElementIdForMatrixLocation(pieceId);
        let name = pieceId.match(/--.*-/g);
        name = name.toString().replace(/--|-/g, '');
        this.#draggedPieceName = name.toString();
        console.log("dragged piece", this.#draggedPieceClickedLocation, this.#draggedPieceName);
    }

    // set local gotten from grid piece
    setLocalPiece(pieceId){
        this.#gridPieceClickedId = pieceId;
        this.#gridPieceClickedLocation = Helper.parseElementIdForMatrixLocation(pieceId);
        this.#gridPieceLocationChecked = false;
        this.#gridPieceIds = [];
        console.log("local click", this.#gridPieceClickedLocation);
    }

    // get content that piece was dragged onto
    setDraggedOverPiece(pieceId){
        this.#draggedOverGridPieceId = pieceId;
        this.#draggedOverGridPiece = Helper.parseElementIdForMatrixLocation(pieceId);
        //console.log('dragged over', this.#draggedOverGridPieceId, this.#draggedOverGridPiece);
    }

    // reset id of pieces in a pieces data table
    #resetIdsOfPiecesDataTable(){
        this.#piecesDataTable.every(
            (piece, index) => {
                piece.id = index + 1;
            }
        )
    }

    // get all possible data table pieces that consist of the same locations
    #getPiecesByLocation(locations){
        // console.log('checking locations', locations);
        // console.log('printing data table', this.#piecesDataTable);
        let pieces = [];
        let piecesDataTableLength = Object.keys(this.#piecesDataTable).length;
        // for data table pieces
        for (var i = 0; i < piecesDataTableLength; i++){
            var dataTableLocation = this.#piecesDataTable[i].locations;
            var dtll = dataTableLocation.length;
            // for data table pieces locations
            for (var j = 0; j < dtll; j++){
                let foundPiece = false;
                let currentLocaion = dataTableLocation[j];
                var locaionsLength = locations.length
                // for checking our passed by value pieces
                for (var k = 0; k < locaionsLength; k++){
                    if (Helper.checkIfArraysAreEqual(currentLocaion, locations[k])){
                        pieces.push(dataTableLocation);
                        foundPiece = true;
                        break;
                    }
                }
                if (foundPiece){
                    break;
                }
            }
        }
        return pieces;
    }

    // return the desired piece from pieces
    #getPieceTypeByName(){
        let desiredPiece;
        this.#bsrPlayPieces.pieces.every(
            boardPiece => {
                if(this.#draggedPieceName == boardPiece.name){
                    desiredPiece = boardPiece;
                    return false;
                }
                return true;
            }
        );
        return desiredPiece;
    }

    // check if the current piece will overlap with any currently set pieces in the data table
    #getPieceHavingDataTableOverlap(pieceLocations){
        //console.log('data table', this.#piecesDataTable);
        //console.log('desired piece locations', pieceLocations);
        let pieceDataLength = this.#piecesDataTable.length;
        let pieceLocationsLength = pieceLocations.length;
        for (var i = 0; i < pieceDataLength; i++){
            var currentData = this.#piecesDataTable[i].locations;
            var currentDataLength = currentData.length;
            for (var j = 0; j < currentDataLength; j++){
                for (var k = 0; k < pieceLocationsLength; k++){
                    if (Helper.checkIfArraysAreEqual(currentData[j], pieceLocations[k])){
                        return this.#piecesDataTable[i];
                    }
                }
            }
        }
        return false;
    }

    // check if a piece location can be in the grid
    #checkAndSetIfPieceLocationsAreInGridBoundries(){
        var draggedPieceFirstLocationMatch;
        var draggedPieceLastLocationMatch;
        if (this.#pieceRotation == this.#horizontal){
            // find starting positions
            // horizontal between 2 and 11, vertical between 3 and 12, meaning lowest value can be [3,2] and highest can be [12, 11]
            // corresponds to the actual table locations
            draggedPieceFirstLocationMatch = this.#draggedOverGridPiece[1] - this.#draggedPieceClickedLocation[1] + 1;
            draggedPieceLastLocationMatch = this.#draggedOverGridPiece[1] + (this.#desiredPiecesType.size - Number(this.#draggedPieceClickedLocation[1]));
            //console.log('piece first location', draggedPieceFirstLocationMatch,'piece last location', draggedPieceLastLocationMatch);
            if (draggedPieceFirstLocationMatch < this.#tableColumnsOffset || draggedPieceLastLocationMatch > this.#tableColumnsCount + bsrGridProperties.columnsIndexSize){
                this.#canUpdatePieces = false;
            }
            this.#draggedPieceFirstLocation = [this.#draggedOverGridPiece[0], draggedPieceFirstLocationMatch];
            this.#draggedPieceLastLocation = [this.#draggedOverGridPiece[0], draggedPieceLastLocationMatch];
            //console.log(this.#draggedPieceFirstLocation, this.#draggedPieceLastLocation);
        }
        if (this.#pieceRotation == this.#vertical){
            // find starting positions
            draggedPieceFirstLocationMatch = this.#draggedOverGridPiece[0] - this.#draggedPieceClickedLocation[0] + 1;
            draggedPieceLastLocationMatch = this.#draggedOverGridPiece[0] + (this.#desiredPiecesType.size - this.#draggedPieceClickedLocation[0]);
            //console.log('piece first location', draggedPieceFirstLocationMatch,'piece last location', draggedPieceLastLocationMatch);
            if (draggedPieceFirstLocationMatch < this.#tableRowsOffset || draggedPieceLastLocationMatch > this.#tableRowsCount + bsrGridProperties.rowsNameAndIndexSize){
                this.#canUpdatePieces = false;
            }
            this.#draggedPieceFirstLocation = [draggedPieceFirstLocationMatch, this.#draggedOverGridPiece[1]];
            this.#draggedPieceLastLocation = [draggedPieceLastLocationMatch, this.#draggedOverGridPiece[1]];
            //console.log(this.#draggedPieceFirstLocation, this.#draggedPieceLastLocation);
        }
    }

    // simply check if the count of the piece in pieces is greater than 0 (meaning they can place more of these pieces)
    #checkIfPieceCanBeUsed(){
        if (this.#desiredPiecesType.count <= 0){
            this.#canUpdatePieces = false;
        }
    }

    // set the placement locations of the piece in correspondence to the grid
    #setPossiblePlacementLocations(){
        let pieceLocations = [];
        //checking if given piece can be placed in horizontally
        if (this.#pieceRotation == this.#horizontal){
            var size = this.#desiredPiecesType.size + this.#draggedPieceFirstLocation[1];
            for(var i = this.#draggedPieceFirstLocation[1]; i < size; i++){
                pieceLocations.push([this.#draggedOverGridPiece[0], i]);
            }
        }
        //checking if given piece can be placed in vertically
        if (this.#pieceRotation == this.#vertical){
            var size = this.#desiredPiecesType.size + this.#draggedPieceFirstLocation[0];
            for(var i = this.#draggedPieceFirstLocation[0]; i < size; i++){
                pieceLocations.push([i, this.#draggedOverGridPiece[1]]);
            }
        }
        //console.log(pieceLocations);
        this.#possiblePlacementLocations = pieceLocations;
    }

    // check to see if a piece will overlap a placed piece or not
    #checkIfPieceWillOverlapPlacedPiece(){
        // check if there is an overlap in possible placements
        let overlap = this.#getPieceHavingDataTableOverlap(this.#possiblePlacementLocations);
        if(overlap){
            if(this.#usingPlacedPiece){
                let isSamePiece = Helper.checkIfArraysAreEqual(overlap.locations, this.#usingPlacedPiece.locations);
                // if the overlap is coming from the same placed piece that we are dragging
                if(isSamePiece){
                    // check and see if the overlap would go out of bounds or would be accidentally overlapping another seperate piece
                    this.#checkAndSetIfPieceLocationsAreInGridBoundries();
                    let overallPossibleOverlapLocations = this.#possiblePlacementLocations.concat(this.#usingPlacedPiece.locations);
                    //console.log('checking placement locations', overallPossibles);
                    let overlappingPieces = this.#getPiecesByLocation(overallPossibleOverlapLocations);
                    //console.log('overlap', overlappingPieces);
                    if (overlappingPieces.length > 1){
                        this.#canUpdatePieces = false;
                    }
                }
                else{
                    this.#canUpdatePieces = false;
                }
            }
            if(!this.#usingPlacedPiece){
                this.#canUpdatePieces = false;
                }
        }
    }

    // simply check if a piece was already placed on the board (we will have to update the pieces new location then)
    #checkIfPieceWasAlreadyPlaced(){
        this.#isUsingPlacedPiece = false;
        this.#draggedPieceIds = [];
        this.#usingPlacedPiece = this.#getPieceHavingDataTableOverlap([this.#gridPieceClickedLocation]);
        if(this.#usingPlacedPiece){
            this.#isUsingPlacedPiece = true;
            this.#canUpdatePieces = true;
        }
    }

    // get the local piece ids that are formed around the grid piece being dragged
    #getDraggedOverPieceIds(locations){
        let gridPiecesIds = [];
        if (this.#draggedOverGridPieceId.lastIndexOf('(') != -1){
            let starting = this.#draggedOverGridPieceId.lastIndexOf('(') + 1;
            let ending = this.#draggedOverGridPieceId.lastIndexOf(')');
            locations.every(
                piece => {
                    gridPiecesIds.push(this.#draggedOverGridPieceId.slice(0, starting) + piece[0] + ',' + piece[1] + this.#draggedOverGridPieceId.slice(ending, this.#gridPieceClickedId.length));
                    return true;
            })
        }
        //console.log('local ids', gridPiecesIds);
        return gridPiecesIds;
    }

    // gets ids of the placed grid piece that was clicked on
    #getPlacedPieceIds(locations){
        let gridPiecesIds = [];
        if (this.#gridPieceClickedId.lastIndexOf('(') != -1){
            let starting = this.#gridPieceClickedId.lastIndexOf('(') + 1;
            let ending = this.#gridPieceClickedId.lastIndexOf(')');
            locations.every(
                piece => {
                    gridPiecesIds.push(this.#gridPieceClickedId.slice(0, starting) + piece[0] + ',' + piece[1] + this.#gridPieceClickedId.slice(ending, this.#gridPieceClickedId.length));
                    return true;
            })
        }
        //console.log('placed ids', gridPiecesIds);
        return gridPiecesIds;
    }

    // set piece internals that would belong in the dragged piece
    #setPieceInternals(){
        let pieceInternals = [];
        let internals = this.#bsrPlayPieces.getInternalsOfPiece(this.#draggedPieceName, this.#pieceRotation);
        for(const [key, value] of Object.entries(internals)){
            pieceInternals.push(value);
        }
        this.#draggedPieceInternals = pieceInternals;
    }

    // check if the piece can be put into the table by filling a temporary locations array of the current piece
    // and set the pieces to be able to be updated or not
    checkPieceLocations(){
        // make sure we aren't calculating the same dragged over piece again and again
        if (!Helper.checkIfArraysAreEqual(this.#previousDraggedOverGridPiece, this.#draggedOverGridPiece)){
            this.#canUpdatePieces = true;
            this.#previousDraggedOverGridPiece = this.#draggedOverGridPiece;
            // get the desired piece type for checking and setting
            this.#desiredPiecesType = this.#getPieceTypeByName();
            this.#setPieceInternals();
            this.#checkIfPieceCanBeUsed();
            this.#checkIfPieceWasAlreadyPlaced();
            this.#checkAndSetIfPieceLocationsAreInGridBoundries();
            this.#setPossiblePlacementLocations();
            this.#draggedPieceIds = this.#getDraggedOverPieceIds(this.#possiblePlacementLocations);
            if (!this.#gridPieceLocationChecked && this.#isUsingPlacedPiece){
                this.#gridPieceIds = this.#getPlacedPieceIds(this.#usingPlacedPiece.locations);
            }
            this.#checkIfPieceWillOverlapPlacedPiece();
            this.#gridPieceLocationChecked = true;
        }
    }

    // remove an undesired piece from the piecesdatatable
    removePiece(){
        this.#piecesDataTable.every(
            (piece, index) => {
                if (piece.id == this.#usingPlacedPiece.id){
                    this.#piecesDataTable.splice(index, 1);
                    return false;
                }
                return true;
            }
        )
        this.#pieceCounter = this.#pieceCounter - 1;
        this.#desiredPiecesType.count = this.#desiredPiecesType.count + 1;
        this.#resetIdsOfPiecesDataTable();
    }

    // reset an already placed piece slocation
    #relocatePlacedPiece(){
        this.#piecesDataTable.every(
            piece => {
                if (piece.id == this.#usingPlacedPiece.id){
                    piece.locations = this.#possiblePlacementLocations;
                    return false;
                }
                return true;
            }
        )
    }

    #setNewlyPlacedPiece(){
        this.#piecesDataTable.push({'id' : this.#pieceCounter, 'name' : this.#draggedPieceName, 'locations' : this.#possiblePlacementLocations})
        this.#pieceCounter = this.#pieceCounter + 1;
        this.#desiredPiecesType.count = this.#desiredPiecesType.count - 1;
    }

    // if the piece can be set in the table, then do so
    setPieceLocations(){
        if(this.#canUpdatePieces && this.#draggedPieceName){
            if(this.#usingPlacedPiece){
                this.#relocatePlacedPiece();
            }
            if(!this.#usingPlacedPiece){
                this.#setNewlyPlacedPiece()
            }
        }
        console.log(this.#piecesDataTable);
    }

    // update the drag pieces that could be put on the grid
    #updatePossiblePieces(){
        // create a string of all the useable pieces and set what can be used (draggables)
        let piecesCombined = '';
        let currentPiece = '';
        // if these pieces are going to be horizontal
        if (this.#pieceRotation == this.#horizontal){
            this.#bsrPlayPieces.pieces.every(piece => {
                currentPiece = piece;
                //console.log(piece);
                //if (piece.count <= 0){
                //    // set draggable or not
                //    currentPiece[this.#horizontal] = Helper.parsePartOfStringToReplace(currentPiece[this.#horizontal], 'draggable="true"', 'draggable="false"');
                //}
                piecesCombined = piecesCombined + currentPiece[this.#horizontal];
                //console.log(piecesCombined);
                return true;
            });
            this.#bsrPlayPieces.savePiecesString(piecesCombined);
        }
        // if these pieces are going to be vertical
        if (this.#pieceRotation == this.#vertical){
            // create a string of all the useable pieces and check if they can be used (draggable)
            this.#bsrPlayPieces.pieces.every(piece => {
                currentPiece = piece;
                //if (piece.count <= 0){
                //    // set draggable or not
                //    currentPiece[this.#vertical] = Helper.parsePartOfStringToReplace(currentPiece[this.#vertical], 'draggable="true"', 'draggable="false"');
                //}
                piecesCombined = piecesCombined + currentPiece[this.#vertical];
                return true;
            });
            this.#bsrPlayPieces.savePiecesString(piecesCombined);
        }
    }

    getUpdatedPieces(){
        // if we can use the current location
        if (this.#canUpdatePieces){
            this.#updatePossiblePieces();
        }
        // if we cannot use the piece just simply return the current pieces we already had
        return this.#bsrPlayPieces.loadPiecesString();
    }



}