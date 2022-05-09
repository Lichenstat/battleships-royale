// Class for the set pieces that will be used in the bsr game (patrol boat, carrier, etc.)

export { BsrPlayPieces }

import { GenerateTable } from './generate-table.js';
import { bsrGridPieces, bsrGridInternals } from './bsr-config.js';
import { Helper } from './helper.js';

class BsrPlayPieces{
    constructor(){
        // generate and set grid game pieces
        let bsrTable = new GenerateTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.carrierHorizontal.class, bsrGridPieces.carrierHorizontal.id, 0, 0, bsrGridPieces.carrierHorizontal.rows, bsrGridPieces.carrierHorizontal.columns, this.#createBoardPieceContents(bsrGridPieces.carrierHorizontal.name, bsrGridPieces.carrierHorizontal.rows, bsrGridPieces.carrierHorizontal.columns));
        this.bsrCarrierHorizontal = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.carrierVertical.class, bsrGridPieces.carrierVertical.id, 0, 0, bsrGridPieces.carrierVertical.rows, bsrGridPieces.carrierVertical.columns, this.#createBoardPieceContents(bsrGridPieces.carrierVertical.name, bsrGridPieces.carrierVertical.rows, bsrGridPieces.carrierVertical.columns));
        this.bsrCarrierVertical = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.battleshipHorizontal.class, bsrGridPieces.battleshipHorizontal.id, 0, 0, bsrGridPieces.battleshipHorizontal.rows, bsrGridPieces.battleshipHorizontal.columns, this.#createBoardPieceContents(bsrGridPieces.battleshipHorizontal.name, bsrGridPieces.battleshipHorizontal.rows, bsrGridPieces.battleshipHorizontal.columns));
        this.bsrBattleshipHorizontal = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.battleshipVertical.class, bsrGridPieces.battleshipVertical.id, 0, 0, bsrGridPieces.battleshipVertical.rows, bsrGridPieces.battleshipVertical.columns, this.#createBoardPieceContents(bsrGridPieces.battleshipVertical.name, bsrGridPieces.battleshipVertical.rows, bsrGridPieces.battleshipVertical.columns));
        this.bsrBattleshipVertical = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.destroyerHorizontal.class, bsrGridPieces.destroyerHorizontal.id, 0, 0, bsrGridPieces.destroyerHorizontal.rows, bsrGridPieces.destroyerHorizontal.columns, this.#createBoardPieceContents(bsrGridPieces.destroyerHorizontal.name, bsrGridPieces.destroyerHorizontal.rows, bsrGridPieces.destroyerHorizontal.columns));
        this.bsrDestroyerHorizontal = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.destroyerVertical.class, bsrGridPieces.destroyerVertical.id, 0, 0, bsrGridPieces.destroyerVertical.rows, bsrGridPieces.destroyerVertical.columns, this.#createBoardPieceContents(bsrGridPieces.destroyerVertical.name, bsrGridPieces.destroyerVertical.rows, bsrGridPieces.destroyerVertical.columns));
        this.bsrDestroyerVertical = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.submarineHorizontal.class, bsrGridPieces.submarineHorizontal.id, 0, 0, bsrGridPieces.submarineHorizontal.rows, bsrGridPieces.submarineHorizontal.columns, this.#createBoardPieceContents(bsrGridPieces.submarineHorizontal.name, bsrGridPieces.submarineHorizontal.rows, bsrGridPieces.submarineHorizontal.columns));
        this.bsrSubmarineHorizontal = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.submarineVertical.class, bsrGridPieces.submarineVertical.id, 0, 0, bsrGridPieces.submarineVertical.rows, bsrGridPieces.submarineVertical.columns, this.#createBoardPieceContents(bsrGridPieces.submarineVertical.name, bsrGridPieces.submarineVertical.rows, bsrGridPieces.submarineVertical.columns));
        this.bsrSubmarineVertical = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.patrolboatHorizontal.class, bsrGridPieces.patrolboatHorizontal.id, 0, 0, bsrGridPieces.patrolboatHorizontal.rows, bsrGridPieces.patrolboatHorizontal.columns, this.#createBoardPieceContents(bsrGridPieces.patrolboatHorizontal.name, bsrGridPieces.patrolboatHorizontal.rows, bsrGridPieces.patrolboatHorizontal.columns));
        this.bsrPatrolBoatHorizontal = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.patrolboatVertical.class, bsrGridPieces.patrolboatVertical.id, 0, 0, bsrGridPieces.patrolboatVertical.rows, bsrGridPieces.patrolboatVertical.columns, this.#createBoardPieceContents(bsrGridPieces.patrolboatVertical.name, bsrGridPieces.patrolboatVertical.rows, bsrGridPieces.patrolboatVertical.columns));
        this.bsrPatrolBoatVertical = bsrTable.getHTMLTable();
    }

    // fill original grid play pieces tables with drag and drop html content
    #createBoardPieceContents(pieceName, rowCount, columnCount){
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
    getPiecesHorizontal(){
        return { carrier : this.bsrCarrierHorizontal, battleship : this.bsrBattleshipHorizontal, destroyer : this.bsrDestroyerHorizontal, submarine : this.bsrSubmarineHorizontal, patrolBoat : this.bsrPatrolBoatHorizontal};
    }

    // return vertical grid pieces
    getPiecesVertical(){
        return { carrier : this.bsrCarrierVertical, battleship : this.bsrBattleshipVertical, destroyer : this.bsrDestroyerVertical, submarine : this.bsrSubmarineVertical, patrolBoat : this.bsrPatrolBoatVertical};
    }

}