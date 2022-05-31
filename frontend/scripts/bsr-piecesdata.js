// class with methods to be used when interacting with bsr pieces data

import { Helper } from './helper.js';
import { BsrPlayPieces } from './bsr-playpieces.js';
import { bsrGeneralInfo } from './bsr-config.js';

export { BsrPiecesData }

class BsrPiecesData extends BsrPlayPieces{

    #piecesDataTable;
    #piecesCounter;

    #horizontal;
    #vertical;

    constructor(){
        super();
        this.#piecesDataTable = [];

        this.#piecesCounter = this.#piecesDataTable.length;

        this.#horizontal = bsrGeneralInfo.horizontal;
        this.#vertical = bsrGeneralInfo.vertical;
    }

    // return the pieces data table
    getPieceDataTable(){
        return this.#piecesDataTable;
    }

    // get play pieces left
    getPlayPiecesLeft(){
        return this.getNumberOfPlayablePiecesLeft();
    }

    // return placement pieces
    getPlacementPieces(rotation){
        return this.getPlaceablePieces(rotation);
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

    // get piece internals that would belong in the dragged piece
    getPieceInternals(pieceName, pieceRotation){
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
        for (var i = 0; i < piecesDataTableLength; i++){
            var dataTableLocation = this.#piecesDataTable[i].locations;
            var dataTableLocationLength = dataTableLocation.length;
            // for data table pieces locations
            for (var j = 0; j < dataTableLocationLength; j++){
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

    // check if the current piece will overlap with any currently set pieces in the data table
    getPieceHavingDataTableOverlap(locations = [[]]){
        //console.log('data table', this.#piecesDataTable);
        //console.log('desired piece locations', locations);
        let pieceDataLength = this.#piecesDataTable.length;
        let pieceLocationsLength = locations.length;
        for (var i = 0; i < pieceDataLength; i++){
            var currentData = this.#piecesDataTable[i].locations;
            var currentDataLength = currentData.length;
            for (var j = 0; j < currentDataLength; j++){
                for (var k = 0; k < pieceLocationsLength; k++){
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
        this.#piecesCounter = this.#piecesCounter - 1;
        this.#resetIdsOfPiecesDataTable();
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

    // simply check if the count of the piece in pieces is greater than 0 (meaning they can place more of these pieces)
    #checkIfPieceCanBeUsed(pieceName){
        if (this.getNumberOfPlayablePiecesLeft()[pieceName] <= 0){
            return false;
        }
        return true;
    }

    // set the newly placed piece into the piece data table and increment the piece counter
    setNewlyPlacedPiece(pieceName, pieceRotation, pieceLocations){
        if(this.#checkIfPieceCanBeUsed(pieceName)){
            let internals = this.getPieceInternals(pieceName, pieceRotation);
            this.#piecesDataTable.push({'id' : this.#piecesCounter, 'name' : pieceName, 'rotation' : pieceRotation, 'locations' : pieceLocations, 'internals' : internals})
            this.#piecesCounter = this.#piecesCounter + 1;
            let bsrPlayPiece = this.getPlayPieceTypeByName(pieceName);
            bsrPlayPiece.count = bsrPlayPiece.count - 1;
        }
    }

    // get the current board pieces ids and internals (presumably being used for replacing pieces in cells)
    getPiecesWithIdsAndInternals(attributeIdWithCellLocation){
        let collectedPieces = [];
        var piecesDataTableLength = this.#piecesDataTable.length;
        for (var i = 0; i < piecesDataTableLength; i++){
            // set dragged pieces ids with the dragged element ids
            let ids = this.getCreateIdsOfTableLocations(attributeIdWithCellLocation, this.#piecesDataTable[i].locations);
            let internals = this.#piecesDataTable[i].internals;
            collectedPieces.push([ids, internals]);
        }
        return collectedPieces;
    }

}