// class with methods to be used when interacting with bsr pieces data

import { BsrDragAndDropGrid } from './bsr-draganddropgrid.js';
import { BsrPlayPieces } from './bsr-playpieces.js';
import { bsrGeneralInfo } from './bsr-config.js';
import { Helper } from './helper.js';

export { BsrPiecesData }

class BsrPiecesData extends BsrPlayPieces{

    #piecesDataTable;
    #piecesDataTableCount;

    #horizontal;
    #vertical;

    constructor(){
        super();
        this.#piecesDataTable = [];
        this.#piecesDataTableCount = {};

        this.#horizontal = bsrGeneralInfo.horizontal;
        this.#vertical = bsrGeneralInfo.vertical;
    }

    // return the pieces data table
    getPiecesDataTable(){
        return this.#piecesDataTable;
    }

    // get placeable pieces left
    getPlaceablePiecesLeft(){
        return this.getNumberOfPlaceablePiecesLeft();
    }
        
    // return placement pieces
    getPlacementPieces(rotation){
        return this.getPlaceablePieces(rotation);
    }

    // get count of pieces that have locations left in the data table 
    getPiecesLeftByLocation(){
        let piecesInDataTable = structuredClone(this.#piecesDataTableCount);
        let dataTableLength = this.#piecesDataTable.length;
        for (let i = 0; i < dataTableLength; i++){
            if (!this.#piecesDataTable[i].locations.length){
                piecesInDataTable[this.#piecesDataTable[i].name] = piecesInDataTable[this.#piecesDataTable[i].name] - 1;
            }
        }
        //console.log(piecesInDataTable);
        return piecesInDataTable;
    }

    // get the count of each type of piece put into the data table
    #setCurrentPiecesCountUsingDataTable(){
        let originalPieces = this.getNumberOfPlayablePieces();
        let keys = Object.keys(originalPieces);
        let keysLength = keys.length;
        //console.log(keys);
        for (let i = 0; i < keysLength; i++){
            let allSimilarPieces = this.getDataTablePiecesByName(keys[i]);
            originalPieces[keys[i]] = allSimilarPieces.length;
        }
        this.#piecesDataTableCount = originalPieces;
        //console.log(this.#piecesDataTableCount);
    }

    // reset ids of pieces in a pieces data table
    #resetIdsOfPiecesDataTable(){
        this.#piecesDataTable.every(
            (piece, index) => {
                piece.id = index;
                return true;
            }
        )
    }

    // clear the pieces data table and reset pieces back to default state
    #clearPiecesDataTable(){
        this.#piecesDataTable = [];
        this.#resetIdsOfPiecesDataTable()
        this.resetPieces();
    }

    // return the desired piece from play pieces
    getPlayPieceTypeByName(pieceName){
        let desiredPiece = {};
        this.pieces.every(
            boardPiece => {
                if(pieceName == boardPiece.name){
                    desiredPiece = boardPiece;
                    return false;
                }
                return true;
            }
        );
        return desiredPiece;
    }

    // return a desired piece from play piece via a given data table piece id
    getPlayPieceTypeByDataTableId(pieceId){
        let desiredPiece = {};
        let piece = this.getDataTablePieceById(pieceId);
        desiredPiece = this.getPlayPieceTypeByName(piece.name);
        return desiredPiece;
    }

    // return the desired piece from the pieces data table by id
    getDataTablePieceById(pieceId){
        let desiredPiece = {};
        this.#piecesDataTable.every(
            (piece, index) => {
                if(index == pieceId){
                    desiredPiece = piece;
                    return false;
                }
                return true;
            }
        );
        return desiredPiece;
    }

    // return all pieces from the pieces data table that have the same name
    getDataTablePiecesByName(pieceName){
        let desiredPieces = [];
        this.#piecesDataTable.forEach(
            piece => {
                if (piece.name == pieceName){
                    desiredPieces.push(piece);
                }
            }
        )
        return desiredPieces;
    }

    // get piece internals that would belong in the dragged piece
    getPieceInternals(pieceName = 'patrolboat', pieceRotation = 'horizontal'){
        let pieceInternals = [];
        let internals = this.getInternalsOfPiece(pieceName, pieceRotation);
        for(const [key, value] of Object.entries(internals)){
            pieceInternals.push(value);
        }
        return pieceInternals;
    }

    // get all possible data table pieces that consist of the same locations
    getAllPiecesHavingDataTableOverlap(locations = [[]]){
        // console.log('checking locations', locations);
        // console.log('printing data table', this.#piecesDataTable);
        let pieces = [];
        let piecesDataTableLength = Object.keys(this.#piecesDataTable).length;
        // for data table pieces
        for (let i = 0; i < piecesDataTableLength; i++){
            let dataTableLocation = this.#piecesDataTable[i].locations;
            let dataTableLocationLength = dataTableLocation.length;
            // for data table pieces locations
            for (var j = 0; j < dataTableLocationLength; j++){
                let foundPiece = false;
                let currentLocaion = dataTableLocation[j];
                let locaionsLength = locations.length
                // for checking our passed by value pieces
                for (let k = 0; k < locaionsLength; k++){
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

    // check if the current piece will overlap with any currently set pieces in the data table
    getPieceHavingDataTableOverlap(locations = [[]]){
        //console.log('data table', this.#piecesDataTable);
        //console.log('desired piece locations', locations);
        let pieceDataLength = this.#piecesDataTable.length;
        let pieceLocationsLength = locations.length;
        for (let i = 0; i < pieceDataLength; i++){
            let currentData = this.#piecesDataTable[i].locations;
            let currentDataLength = currentData.length;
            for (let j = 0; j < currentDataLength; j++){
                for (let k = 0; k < pieceLocationsLength; k++){
                    if (Helper.checkIfArraysAreEqual(currentData[j], locations[k])){
                        return this.#piecesDataTable[i];
                    }
                }
            }
        }
        return false;
    }

    // get the ids that are formed along the grid piece locations
    getCreateIdsOfTableLocations(attributeId, locations){
        let gridPiecesIds = [];
        if (attributeId.lastIndexOf('(') != -1){
            let starting = attributeId.slice(0, attributeId.lastIndexOf('(') + 1);
            let ending = attributeId.slice(attributeId.lastIndexOf(')'), attributeId.length);
            locations.every(
                piece => {
                    gridPiecesIds.push(starting + piece[0] + ',' + piece[1] + ending);
                    return true;
            })
        }
        //console.log('local ids', gridPiecesIds);
        return gridPiecesIds;
    }

    // remove an undesired piece from the pieces data table
    removePieceInDataTable(pieceId){
        let bsrPlayPiece = this.getPlayPieceTypeByDataTableId(pieceId);
        bsrPlayPiece.count = bsrPlayPiece.count + 1;
        this.#piecesDataTable.every(
            (piece, index) => {
                if (piece.id == pieceId){
                    this.#piecesDataTable.splice(index, 1);
                    return false;
                }
                return true;
            }
        )
        this.#resetIdsOfPiecesDataTable();
        this.#setCurrentPiecesCountUsingDataTable()
    }

    // remove locations from pieces in the data table
    removeLocationsFromPiecesInDataTable(locations = [[]]){
        //console.log('removing locations', locations);
        let locationsSize = locations.length;
        for (let i = 0; i < locationsSize; i++){
            let piece = this.getPieceHavingDataTableOverlap([locations[i]]);
            if(piece){
                piece.locations = Helper.removeDuplicatesFromArrayUsingArray(piece.locations, [locations[i]]);
                console.log()
                this.#piecesDataTable[piece.id] = piece;
            }
        }
    }

    // relocate an already placed piece in the pieces data table
    relocatePlacedPieceInDataTable(pieceId, locations){
        this.#piecesDataTable.every(
            piece => {
                if (piece.id == pieceId){
                    piece.locations = locations;
                    return false;
                }
                return true;
            }
        )
    }

    // simply check if the count of the placeable piece in pieces is greater than 0 (meaning they can place more of these pieces)
    #checkIfPieceHasPlaceablesLeft(pieceName){
        if (this.getNumberOfPlaceablePiecesLeft()[pieceName] <= 0){
            return false;
        }
        return true;
    }

    // set the newly placed piece into the piece data table and increment the piece counter
    setNewlyPlacedPiece(pieceName = '', pieceRotation = this.#horizontal, pieceLocations = [0,0]){
        if(this.#checkIfPieceHasPlaceablesLeft(pieceName)){
            let internals = this.getPieceInternals(pieceName, pieceRotation);
            this.#piecesDataTable.push({'id' : this.#piecesDataTable.length, 'name' : pieceName, 'rotation' : pieceRotation, 'locations' : pieceLocations, 'internals' : internals})
            let bsrPlayPiece = this.getPlayPieceTypeByName(pieceName);
            bsrPlayPiece.count = bsrPlayPiece.count - 1;
            this.#setCurrentPiecesCountUsingDataTable()
        }
    }

    // get random parts for a given piece to be selected
    #getPieceRandomParts(){
        let bsrGrid = new BsrDragAndDropGrid();
        let rotation = Helper.getRandomInteger();
        if(rotation){
            rotation = this.#horizontal;
        }
        else{
            rotation = this.#vertical;
        }
        let rowMin = bsrGrid.getTableRowsOffset();
        let rowMax = rowMin + (bsrGrid.getTableRowsCount() - 1);
        let rowIndex = Helper.getRandomInteger(rowMin, rowMax);
        let columnMin = bsrGrid.getTableColumnsOffset();
        let columnMax = columnMin + (bsrGrid.getTableColumnsCount() - 1);
        let columnIndex = Helper.getRandomInteger(columnMin, columnMax);
        return {rotation : rotation, location : [rowIndex, columnIndex]}
    }

    // get possible piece locations in accordance to first piece
    getPiecePossibleLocations(pieceName = this.pieces[0].name, firstPieceLocation = [0,0], rotation = this.#horizontal){
        let pieceLocations = [];
        let piece = this.getPlayPieceTypeByName(pieceName);
        //checking if given piece can be placed in horizontally
        if (rotation == this.#horizontal){
            let size = piece.size + firstPieceLocation[1];
            for(let i = firstPieceLocation[1]; i < size; i++){
                pieceLocations.push([firstPieceLocation[0], i]);
            }
        }
        //checking if given piece can be placed in vertically
        if (rotation == this.#vertical){
            let size = piece.size + firstPieceLocation[0];
            for(let i = firstPieceLocation[0]; i < size; i++){
                pieceLocations.push([i, firstPieceLocation[1]]);
            }
        }
        //console.log(pieceLocations);
        return pieceLocations;
    }

    // set random pieces into the pieces data table
    fillDataTableRandomly(){
        if(!Helper.accumulateObjectValues(this.getPlaceablePiecesLeft())){
            this.#clearPiecesDataTable();
        }
        let bsrGrid = new BsrDragAndDropGrid();
        let iterate = 0;
        let size = this.pieces.length;
        // while we havent gone through all the pieces
        while(iterate < size){
            let pieceName = this.pieces[iterate].name;
            // while there are pieces of this type yet still to be placed
            while (this.pieces[iterate].count > 0){
                let parts = this.#getPieceRandomParts();
                //console.log(parts);
                let locations = this.getPiecePossibleLocations(this.pieces[iterate].name, parts.location, parts.rotation);
                //console.log(locations);
                let fits = bsrGrid.checkIfPieceLocationsAreInGridBoundries(locations[0], locations[locations.length - 1], parts.rotation);
                let overlap = this.getPieceHavingDataTableOverlap(locations);
                // if the piece does fit, put it in the pieces data table
                if (fits && !overlap){
                    this.setNewlyPlacedPiece(pieceName, parts.rotation, locations);
                }
            }
            iterate = iterate + 1;
        }
        //console.log(this.#piecesDataTable)
    }

    // get the current board pieces ids and internals (presumably being used for replacing pieces in cells)
    getPiecesWithIdsAndInternals(attributeIdWithCellLocation = "some__example-(0,0)"){
        let collectedPieces = [];
        let piecesDataTableLength = this.#piecesDataTable.length;
        for (let i = 0; i < piecesDataTableLength; i++){
            // set dragged pieces ids with the dragged element ids
            let ids = this.getCreateIdsOfTableLocations(attributeIdWithCellLocation, this.#piecesDataTable[i].locations);
            let internals = this.#piecesDataTable[i].internals;
            collectedPieces.push([ids, internals]);
        }
        return collectedPieces;
    }

}