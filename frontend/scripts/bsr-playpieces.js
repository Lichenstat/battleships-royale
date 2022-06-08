// Class for the set pieces that will be used in the bsr game (patrol boat, carrier, etc.)

import { CreateTable } from './create-table.js';
import { bsrGridPieces, bsrGeneralInfo, bsrGridInternals } from './bsr-config.js';
import { Helper } from './helper.js';

export { BsrPlayPieces }

class BsrPlayPieces{

    #bsrTable;
    #bsrCarrierHorizontal;
    #bsrCarrierHorizontalContent;
    #bsrCarrierVertical;
    #bsrCarrierVerticalContent;
    #bsrBattleshipHorizontal;
    #bsrBattleshipHorizontalContent;
    #bsrBattleshipVertical;
    #bsrBattleshipVerticalContent;
    #bsrDestroyerHorizontal;
    #bsrDestroyerHorizontalContent;
    #bsrDestroyerVertical;
    #bsrDestroyerVerticalContent;
    #bsrSubmarineHorizontal;
    #bsrSubmarineHorizontalContent;
    #bsrSubmarineVertical;
    #bsrSubmarineVerticalContent;
    #bsrPatrolBoatHorizontal;
    #bsrPatrolBoatHorizontalContent;
    #bsrPatrolBoatVertical;
    #bsrPatrolBoatVerticalContent;

    #defaultPieces;
    #originalPlayPiecesCount;
    #currentPlaceablePiecesCount;

    #savePieces;

    constructor(){
        // generate and set grid game pieces
        this.#bsrTable = new CreateTable();

        this.#bsrCarrierHorizontalContent = this.#createGridPieceContents(bsrGridPieces.carrierHorizontal.name, bsrGeneralInfo.horizontal, bsrGridPieces.carrierHorizontal.rows, bsrGridPieces.carrierHorizontal.columns);
        this.#bsrCarrierVerticalContent = this.#createGridPieceContents(  bsrGridPieces.carrierVertical.name,   bsrGeneralInfo.vertical,   bsrGridPieces.carrierVertical.rows,   bsrGridPieces.carrierVertical.columns);
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.carrierHorizontal.class,    bsrGridPieces.carrierHorizontal.id,    0, 0, bsrGridPieces.carrierHorizontal.rows,    bsrGridPieces.carrierHorizontal.columns,    this.#bsrCarrierHorizontalContent);
        this.#bsrCarrierHorizontal = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.carrierVertical.class,      bsrGridPieces.carrierVertical.id,      0, 0, bsrGridPieces.carrierVertical.rows,      bsrGridPieces.carrierVertical.columns,      this.#bsrCarrierVerticalContent);
        this.#bsrCarrierVertical = this.#bsrTable.getHTMLTable();
        
        this.#bsrBattleshipHorizontalContent = this.#createGridPieceContents(bsrGridPieces.battleshipHorizontal.name, bsrGeneralInfo.horizontal, bsrGridPieces.battleshipHorizontal.rows, bsrGridPieces.battleshipHorizontal.columns);
        this.#bsrBattleshipVerticalContent = this.#createGridPieceContents(bsrGridPieces.battleshipVertical.name,     bsrGeneralInfo.vertical,   bsrGridPieces.battleshipVertical.rows,   bsrGridPieces.battleshipVertical.columns);
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.battleshipHorizontal.class, bsrGridPieces.battleshipHorizontal.id, 0, 0, bsrGridPieces.battleshipHorizontal.rows, bsrGridPieces.battleshipHorizontal.columns, this.#bsrBattleshipHorizontalContent);
        this.#bsrBattleshipHorizontal = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.battleshipVertical.class,   bsrGridPieces.battleshipVertical.id,   0, 0, bsrGridPieces.battleshipVertical.rows,   bsrGridPieces.battleshipVertical.columns,   this.#bsrBattleshipVerticalContent);
        this.#bsrBattleshipVertical = this.#bsrTable.getHTMLTable();
        
        this.#bsrDestroyerHorizontalContent = this.#createGridPieceContents(bsrGridPieces.destroyerHorizontal.name, bsrGeneralInfo.horizontal, bsrGridPieces.destroyerHorizontal.rows, bsrGridPieces.destroyerHorizontal.columns);
        this.#bsrDestroyerVerticalContent = this.#createGridPieceContents(bsrGridPieces.destroyerVertical.name,     bsrGeneralInfo.vertical,   bsrGridPieces.destroyerVertical.rows,   bsrGridPieces.destroyerVertical.columns);
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.destroyerHorizontal.class,  bsrGridPieces.destroyerHorizontal.id,  0, 0, bsrGridPieces.destroyerHorizontal.rows,  bsrGridPieces.destroyerHorizontal.columns,  this.#bsrDestroyerHorizontalContent);
        this.#bsrDestroyerHorizontal = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.destroyerVertical.class,    bsrGridPieces.destroyerVertical.id,    0, 0, bsrGridPieces.destroyerVertical.rows,    bsrGridPieces.destroyerVertical.columns,    this.#bsrDestroyerVerticalContent);
        this.#bsrDestroyerVertical = this.#bsrTable.getHTMLTable();
        
        this.#bsrSubmarineHorizontalContent = this.#createGridPieceContents(bsrGridPieces.submarineHorizontal.name, bsrGeneralInfo.horizontal, bsrGridPieces.submarineHorizontal.rows, bsrGridPieces.submarineHorizontal.columns);
        this.#bsrSubmarineVerticalContent = this.#createGridPieceContents(bsrGridPieces.submarineVertical.name,     bsrGeneralInfo.vertical,   bsrGridPieces.submarineVertical.rows,   bsrGridPieces.submarineVertical.columns);
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.submarineHorizontal.class,  bsrGridPieces.submarineHorizontal.id,  0, 0, bsrGridPieces.submarineHorizontal.rows,  bsrGridPieces.submarineHorizontal.columns,  this.#bsrSubmarineHorizontalContent);
        this.#bsrSubmarineHorizontal = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.submarineVertical.class,    bsrGridPieces.submarineVertical.id,    0, 0, bsrGridPieces.submarineVertical.rows,    bsrGridPieces.submarineVertical.columns,    this.#bsrSubmarineVerticalContent);
        this.#bsrSubmarineVertical = this.#bsrTable.getHTMLTable();
        
        this.#bsrPatrolBoatHorizontalContent = this.#createGridPieceContents(bsrGridPieces.patrolboatHorizontal.name, bsrGeneralInfo.horizontal, bsrGridPieces.patrolboatHorizontal.rows, bsrGridPieces.patrolboatHorizontal.columns);
        this.#bsrPatrolBoatVerticalContent = this.#createGridPieceContents(bsrGridPieces.patrolboatVertical.name,     bsrGeneralInfo.vertical,   bsrGridPieces.patrolboatVertical.rows,   bsrGridPieces.patrolboatVertical.columns);
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.patrolboatHorizontal.class, bsrGridPieces.patrolboatHorizontal.id, 0, 0, bsrGridPieces.patrolboatHorizontal.rows, bsrGridPieces.patrolboatHorizontal.columns, this.#bsrPatrolBoatHorizontalContent);
        this.#bsrPatrolBoatHorizontal = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.patrolboatVertical.class,   bsrGridPieces.patrolboatVertical.id,   0, 0, bsrGridPieces.patrolboatVertical.rows,   bsrGridPieces.patrolboatVertical.columns,   this.#bsrPatrolBoatVerticalContent);
        this.#bsrPatrolBoatVertical = this.#bsrTable.getHTMLTable();

        //default pieces made at beginning
        this.#defaultPieces = this.#getUseablePieces();

        // be able to get useable pieces
        this.pieces = this.#getUseablePieces();

        // overall play pieces count (should not be changed, sends back original amount of pieces with piece name)
        this.#originalPlayPiecesCount = {}
        this.#setNumberOfPlayablePieces();
        // get the number of placeable pieces left
        this.#currentPlaceablePiecesCount = {};

        // use this later on in case of needing to save draggable pieces
        this.#savePieces;
    }

    // fill original grid play pieces tables with drag and drop html content
    #createGridPieceContents(pieceName, pieceRotation, rowCount, columnCount){
        let bsrPiecesContent = {};
        for (let i = 1; i <= rowCount; i++){
            for( let j = 1; j <= columnCount; j++){
                let location = '(' + i + ',' + j + ')';
                // set piece class and id with locations
                let newString = Helper.parsePartOfStringToReplace(bsrGridInternals.dragAndDropItem, 'bsr__boardpiece--', 'bsr__boardpiece--' + pieceName + '-' + location);
                // as well as set the image for use with the piece
                newString = Helper.parsePartOfStringToReplace(newString, 'src=""', 'src="./assets/board-pieces/' + pieceRotation + '/' + pieceName + '-' + location + '.png"');
                bsrPiecesContent[location] = newString;
            }
        }
        return bsrPiecesContent;
    }

    // return horizontal grid pieces
    #getPiecesHorizontal(){
        return { carrier : this.#bsrCarrierHorizontal, battleship : this.#bsrBattleshipHorizontal, destroyer : this.#bsrDestroyerHorizontal, submarine : this.#bsrSubmarineHorizontal, patrolboat : this.#bsrPatrolBoatHorizontal};
    }

    // return vertical grid pieces
    #getPiecesVertical(){
        return { carrier : this.#bsrCarrierVertical, battleship : this.#bsrBattleshipVertical, destroyer : this.#bsrDestroyerVertical, submarine : this.#bsrSubmarineVertical, patrolboat : this.#bsrPatrolBoatVertical};
    }

    // get the useable pieces
    #getUseablePieces(){
        let horizontalPlayPieces = this.#getPiecesHorizontal();
        let verticalPlayPieces = this.#getPiecesVertical();
        let useablePieces = [
            { 'name' : bsrGridPieces.carrierHorizontal.name,    'count' : bsrGridPieces.carrierHorizontal.count,    'size' : bsrGridPieces.carrierHorizontal.size,    'placed' : bsrGridPieces.carrierHorizontal.count,    [bsrGeneralInfo.horizontal] : horizontalPlayPieces[bsrGridPieces.carrierHorizontal.name],    [bsrGeneralInfo.vertical] : verticalPlayPieces[bsrGridPieces.carrierVertical.name]},
            { 'name' : bsrGridPieces.battleshipHorizontal.name, 'count' : bsrGridPieces.battleshipHorizontal.count, 'size' : bsrGridPieces.battleshipHorizontal.size, 'placed' : bsrGridPieces.battleshipHorizontal.count, [bsrGeneralInfo.horizontal] : horizontalPlayPieces[bsrGridPieces.battleshipHorizontal.name], [bsrGeneralInfo.vertical] : verticalPlayPieces[bsrGridPieces.battleshipVertical.name]},
            { 'name' : bsrGridPieces.destroyerHorizontal.name,  'count' : bsrGridPieces.destroyerHorizontal.count,  'size' : bsrGridPieces.destroyerHorizontal.size,  'placed' : bsrGridPieces.destroyerHorizontal.count,  [bsrGeneralInfo.horizontal] : horizontalPlayPieces[bsrGridPieces.destroyerHorizontal.name],  [bsrGeneralInfo.vertical] : verticalPlayPieces[bsrGridPieces.destroyerVertical.name]},
            { 'name' : bsrGridPieces.submarineHorizontal.name,  'count' : bsrGridPieces.submarineHorizontal.count,  'size' : bsrGridPieces.submarineHorizontal.size,  'placed' : bsrGridPieces.submarineHorizontal.count,  [bsrGeneralInfo.horizontal] : horizontalPlayPieces[bsrGridPieces.submarineHorizontal.name],  [bsrGeneralInfo.vertical] : verticalPlayPieces[bsrGridPieces.submarineVertical.name]},
            { 'name' : bsrGridPieces.patrolboatHorizontal.name, 'count' : bsrGridPieces.patrolboatHorizontal.count, 'size' : bsrGridPieces.patrolboatHorizontal.size, 'placed' : bsrGridPieces.patrolboatHorizontal.count, [bsrGeneralInfo.horizontal] : horizontalPlayPieces[bsrGridPieces.patrolboatHorizontal.name], [bsrGeneralInfo.vertical] : verticalPlayPieces[bsrGridPieces.patrolboatVertical.name]}
        ]
        return useablePieces;
    }

    // reset the pieces object
    resetPieces(){
        this.pieces = this.#getUseablePieces();
    }
    
    // get the internals of a specific piece
    getInternalsOfPiece(pieceName, pieceRotation){
        if(pieceRotation == bsrGeneralInfo.horizontal){
            if(pieceName == bsrGridPieces.carrierHorizontal.name)
                return this.#bsrCarrierHorizontalContent;
            if(pieceName == bsrGridPieces.battleshipHorizontal.name)
                return this.#bsrBattleshipHorizontalContent;
            if(pieceName == bsrGridPieces.destroyerHorizontal.name)
                return this.#bsrDestroyerHorizontalContent;
            if(pieceName == bsrGridPieces.submarineHorizontal.name)
                return this.#bsrSubmarineHorizontalContent;
            if(pieceName == bsrGridPieces.patrolboatHorizontal.name)
                return this.#bsrPatrolBoatHorizontalContent;
        }
        if (pieceRotation == bsrGeneralInfo.vertical){
            if(pieceName == bsrGridPieces.carrierVertical.name)
                return this.#bsrCarrierVerticalContent;
            if(pieceName == bsrGridPieces.battleshipVertical.name)
                return this.#bsrBattleshipVerticalContent;
            if(pieceName == bsrGridPieces.destroyerVertical.name)
                return this.#bsrDestroyerVerticalContent;
            if(pieceName == bsrGridPieces.submarineVertical.name)
                return this.#bsrSubmarineVerticalContent;
            if(pieceName == bsrGridPieces.patrolboatVertical.name)
                return this.#bsrPatrolBoatVerticalContent;
        }
    }

    // get count of remaining pieces left to place on the game board
    #setNumberOfPlaceablePiecesLeft(){
        let bsrPiecesLength = this.pieces.length;
        for (let i = 0; i < bsrPiecesLength; i++){
            this.#currentPlaceablePiecesCount[this.pieces[i].name] = this.pieces[i].count;
        }
    }

    // return count of the number of playable pieces left
    getNumberOfPlaceablePiecesLeft(){
        this.#setNumberOfPlaceablePiecesLeft();
        return this.#currentPlaceablePiecesCount;
    }

    // set the number of overall avalable pieces
    #setNumberOfPlayablePieces(){
        let useablePiecesLength = this.#defaultPieces.length;
        for (let i = 0; i < useablePiecesLength; i++){
            this.#originalPlayPiecesCount[this.#defaultPieces[i].name] = this.#defaultPieces[i].count;
        }
    }

    // get the number of playable pieces
    getNumberOfPlayablePieces(){
        return this.#originalPlayPiecesCount;
    }

    // update the drag pieces that could be put on the grid
    #updatePossiblePlaceablePieces(pieceRotation){
        // create a string of all the useable pieces
        let piecesCombined = {};
        let currentPiece = '';
        // if these pieces are going to be horizontal
        if (pieceRotation == bsrGeneralInfo.horizontal){
            this.pieces.every(piece => {
                currentPiece = piece;
                piecesCombined[piece.name] = piece[bsrGeneralInfo.horizontal];
                return true;
            });
            // save pieces as playable placeable pieces
            this.#savePlacementPieces(piecesCombined);
        }
        // if these pieces are going to be vertical
        if (pieceRotation == bsrGeneralInfo.vertical){
            // create a string of all the useable pieces
            this.pieces.every(piece => {
                currentPiece = piece;
                piecesCombined[piece.name] = piece[bsrGeneralInfo.vertical];
                return true;
            });
            // save pieces as playable placeable pieces
            this.#savePlacementPieces(piecesCombined);
        }
    }

    // for saving grid pieces
    #savePlacementPieces(placeablePieces){
        this.#savePieces = placeablePieces;
    }

    // for loading grid pieces
    #loadPlacementPieces(pieceRotation){
        this.#updatePossiblePlaceablePieces(pieceRotation);
        return this.#savePieces;
    }

    // get the unplaced pieces waiting to be placed on the board
    getPlaceablePieces(pieceRotation){
        return this.#loadPlacementPieces(pieceRotation)
    }

}