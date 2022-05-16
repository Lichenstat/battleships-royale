// Class for the set pieces that will be used in the bsr game (patrol boat, carrier, etc.)

export { BsrPlayPieces }

import { CreateTable } from './create-table.js';
import { bsrGridPieces, bsrGridInternals } from './bsr-config.js';
import { Helper } from './helper.js';

class BsrPlayPieces{
    
    #bsrTable;
    #bsrCarrierHorizontal;
    #bsrCarrierVertical;
    #bsrBattleshipHorizontal;
    #bsrBattleshipVertical;
    #bsrDestroyerHorizontal;
    #bsrDestroyerVertical;
    #bsrSubmarineHorizontal;
    #bsrSubmarineVertical;
    #bsrPatrolBoatHorizontal;
    #bsrPatrolBoatVertical;
    #savePieces;

    constructor(){
        // generate and set grid game pieces
        this.#bsrTable = new CreateTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.carrierHorizontal.class,    bsrGridPieces.carrierHorizontal.id,    0, 0, bsrGridPieces.carrierHorizontal.rows,    bsrGridPieces.carrierHorizontal.columns,    this.#createGridPieceContents(bsrGridPieces.carrierHorizontal.name,    bsrGridPieces.carrierHorizontal.rows,    bsrGridPieces.carrierHorizontal.columns));
        this.#bsrCarrierHorizontal = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.carrierVertical.class,      bsrGridPieces.carrierVertical.id,      0, 0, bsrGridPieces.carrierVertical.rows,      bsrGridPieces.carrierVertical.columns,      this.#createGridPieceContents(bsrGridPieces.carrierVertical.name,      bsrGridPieces.carrierVertical.rows,      bsrGridPieces.carrierVertical.columns));
        this.#bsrCarrierVertical = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.battleshipHorizontal.class, bsrGridPieces.battleshipHorizontal.id, 0, 0, bsrGridPieces.battleshipHorizontal.rows, bsrGridPieces.battleshipHorizontal.columns, this.#createGridPieceContents(bsrGridPieces.battleshipHorizontal.name, bsrGridPieces.battleshipHorizontal.rows, bsrGridPieces.battleshipHorizontal.columns));
        this.#bsrBattleshipHorizontal = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.battleshipVertical.class,   bsrGridPieces.battleshipVertical.id,   0, 0, bsrGridPieces.battleshipVertical.rows,   bsrGridPieces.battleshipVertical.columns,   this.#createGridPieceContents(bsrGridPieces.battleshipVertical.name,   bsrGridPieces.battleshipVertical.rows,   bsrGridPieces.battleshipVertical.columns));
        this.#bsrBattleshipVertical = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.destroyerHorizontal.class,  bsrGridPieces.destroyerHorizontal.id,  0, 0, bsrGridPieces.destroyerHorizontal.rows,  bsrGridPieces.destroyerHorizontal.columns,  this.#createGridPieceContents(bsrGridPieces.destroyerHorizontal.name,  bsrGridPieces.destroyerHorizontal.rows,  bsrGridPieces.destroyerHorizontal.columns));
        this.#bsrDestroyerHorizontal = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.destroyerVertical.class,    bsrGridPieces.destroyerVertical.id,    0, 0, bsrGridPieces.destroyerVertical.rows,    bsrGridPieces.destroyerVertical.columns,    this.#createGridPieceContents(bsrGridPieces.destroyerVertical.name,    bsrGridPieces.destroyerVertical.rows,    bsrGridPieces.destroyerVertical.columns));
        this.#bsrDestroyerVertical = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.submarineHorizontal.class,  bsrGridPieces.submarineHorizontal.id,  0, 0, bsrGridPieces.submarineHorizontal.rows,  bsrGridPieces.submarineHorizontal.columns,  this.#createGridPieceContents(bsrGridPieces.submarineHorizontal.name,  bsrGridPieces.submarineHorizontal.rows,  bsrGridPieces.submarineHorizontal.columns));
        this.#bsrSubmarineHorizontal = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.submarineVertical.class,    bsrGridPieces.submarineVertical.id,    0, 0, bsrGridPieces.submarineVertical.rows,    bsrGridPieces.submarineVertical.columns,    this.#createGridPieceContents(bsrGridPieces.submarineVertical.name,    bsrGridPieces.submarineVertical.rows,    bsrGridPieces.submarineVertical.columns));
        this.#bsrSubmarineVertical = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.patrolboatHorizontal.class, bsrGridPieces.patrolboatHorizontal.id, 0, 0, bsrGridPieces.patrolboatHorizontal.rows, bsrGridPieces.patrolboatHorizontal.columns, this.#createGridPieceContents(bsrGridPieces.patrolboatHorizontal.name, bsrGridPieces.patrolboatHorizontal.rows, bsrGridPieces.patrolboatHorizontal.columns));
        this.#bsrPatrolBoatHorizontal = this.#bsrTable.getHTMLTable();
        this.#bsrTable.setHTMLTableProperties(bsrGridPieces.patrolboatVertical.class,   bsrGridPieces.patrolboatVertical.id,   0, 0, bsrGridPieces.patrolboatVertical.rows,   bsrGridPieces.patrolboatVertical.columns,   this.#createGridPieceContents(bsrGridPieces.patrolboatVertical.name,   bsrGridPieces.patrolboatVertical.rows,   bsrGridPieces.patrolboatVertical.columns));
        this.#bsrPatrolBoatVertical = this.#bsrTable.getHTMLTable();

        // be able to get useable pieces
        this.pieces = this.#getUseablePieces();

        // use this later on in case of needing to save draggable pieces
        this.#savePieces;
    }

    // fill original grid play pieces tables with drag and drop html content
    #createGridPieceContents(pieceName, rowCount, columnCount){
        let bsrPiecesContent = {};
        for (let i = 1; i <= rowCount; i++){
            for( let j = 1; j <= columnCount; j++){
                let location = '(' + i + ',' + j + ')';
                let newString = Helper.parsePartOfStringToReplace(bsrGridInternals.dragAndDropItem, 'bsr__boardpiece', 'bsr__boardpiece--' + pieceName + '-' + location);
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

    #getUseablePieces(){
        let horizontalPlayPieces = this.#getPiecesHorizontal();
        let verticalPlayPieces = this.#getPiecesVertical();
        let useablePieces = [
            { 'name' : bsrGridPieces.carrierHorizontal.name,    'count' : bsrGridPieces.carrierHorizontal.count,    'size' : bsrGridPieces.carrierHorizontal.size,    'placed' : bsrGridPieces.carrierHorizontal.count,    [bsrGridPieces.horizontal] : horizontalPlayPieces[bsrGridPieces.carrierHorizontal.name],    [bsrGridPieces.vertical] : verticalPlayPieces[bsrGridPieces.carrierVertical.name]},
            { 'name' : bsrGridPieces.battleshipHorizontal.name, 'count' : bsrGridPieces.battleshipHorizontal.count, 'size' : bsrGridPieces.battleshipHorizontal.size, 'placed' : bsrGridPieces.battleshipHorizontal.count, [bsrGridPieces.horizontal] : horizontalPlayPieces[bsrGridPieces.battleshipHorizontal.name], [bsrGridPieces.vertical] : verticalPlayPieces[bsrGridPieces.battleshipVertical.name]},
            { 'name' : bsrGridPieces.destroyerHorizontal.name,  'count' : bsrGridPieces.destroyerHorizontal.count,  'size' : bsrGridPieces.destroyerHorizontal.size,  'placed' : bsrGridPieces.destroyerHorizontal.count,  [bsrGridPieces.horizontal] : horizontalPlayPieces[bsrGridPieces.destroyerHorizontal.name],  [bsrGridPieces.vertical] : verticalPlayPieces[bsrGridPieces.destroyerVertical.name]},
            { 'name' : bsrGridPieces.submarineHorizontal.name,  'count' : bsrGridPieces.submarineHorizontal.count,  'size' : bsrGridPieces.submarineHorizontal.size,  'placed' : bsrGridPieces.submarineHorizontal.count,  [bsrGridPieces.horizontal] : horizontalPlayPieces[bsrGridPieces.submarineHorizontal.name],  [bsrGridPieces.vertical] : verticalPlayPieces[bsrGridPieces.submarineVertical.name]},
            { 'name' : bsrGridPieces.patrolboatHorizontal.name, 'count' : bsrGridPieces.patrolboatHorizontal.count, 'size' : bsrGridPieces.patrolboatHorizontal.size, 'placed' : bsrGridPieces.patrolboatHorizontal.count, [bsrGridPieces.horizontal] : horizontalPlayPieces[bsrGridPieces.patrolboatHorizontal.name], [bsrGridPieces.vertical] : verticalPlayPieces[bsrGridPieces.patrolboatVertical.name]}
        ]
        return useablePieces;
    }

    // for saving grid pieces
    savePiecesString(piecesString){
        this.#savePieces = piecesString;
    }

    // for loading grid pieces
    loadPiecesString(){
        return this.#savePieces;
    }

}