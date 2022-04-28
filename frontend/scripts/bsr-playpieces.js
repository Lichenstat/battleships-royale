// Class for the set pieces that will be used in the bsr game (patrol boat, carrier, etc.)

export { BsrPlayPieces }

import { GenerateTable } from './generate-table.js';
import { bsrGridPieces, bsrGridInternals } from './bsr-config.js';

class BsrPlayPieces{
    constructor(){
        let bsrTable = new GenerateTable();
        let bsrShip
        bsrTable.setHTMLTableProperties(bsrGridPieces.carrierHorizontal.class, bsrGridPieces.carrierHorizontal.id, 0, 0, bsrGridPieces.carrierHorizontal.rows, bsrGridPieces.carrierHorizontal.columns, { 'all' : bsrGridInternals.dragAndDrop });
        this.bsrCarrierVertical = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.carrierVertical.class, bsrGridPieces.carrierVertical.id, 0, 0, bsrGridPieces.carrierVertical.rows, bsrGridPieces.carrierVertical.columns, { 'all' : bsrGridInternals.dragAndDrop });
        this.bsrCarrierHorizontal = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.battleshipHorizontal.class, bsrGridPieces.battleshipHorizontal.id, 0, 0, bsrGridPieces.battleshipHorizontal.rows, bsrGridPieces.battleshipHorizontal.columns, { 'all' : bsrGridInternals.dragAndDrop });
        this.bsrBattleshipVertical = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.battleshipVertical.class, bsrGridPieces.battleshipVertical.id, 0, 0, bsrGridPieces.battleshipVertical.rows, bsrGridPieces.battleshipVertical.columns, { 'all' : bsrGridInternals.dragAndDrop });
        this.bsrBattleshipHorizontal = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.destroyerHorizontal.class, bsrGridPieces.destroyerHorizontal.id, 0, 0, bsrGridPieces.destroyerHorizontal.rows, bsrGridPieces.destroyerHorizontal.columns, { 'all' : bsrGridInternals.dragAndDrop });
        this.bsrDestroyerVertical = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.destroyerVertical.class, bsrGridPieces.destroyerVertical.id, 0, 0, bsrGridPieces.destroyerVertical.rows, bsrGridPieces.destroyerVertical.columns, { 'all' : bsrGridInternals.dragAndDrop });
        this.bsrDestroyerHorizontal = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.submarineHorizontal.class, bsrGridPieces.submarineHorizontal.id, 0, 0, bsrGridPieces.submarineHorizontal.rows, bsrGridPieces.submarineHorizontal.columns, { 'all' : bsrGridInternals.dragAndDrop });
        this.bsrSubmarineVertical = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.submarineVertical.class, bsrGridPieces.submarineVertical.id, 0, 0, bsrGridPieces.submarineVertical.rows, bsrGridPieces.submarineVertical.columns, { 'all' : bsrGridInternals.dragAndDrop });
        this.bsrSubmarineHorizontal = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.patrolboatHorizontal.class, bsrGridPieces.patrolboatHorizontal.id, 0, 0, bsrGridPieces.patrolboatHorizontal.rows, bsrGridPieces.patrolboatHorizontal.columns, { 'all' : bsrGridInternals.dragAndDrop });
        this.bsrPatrolBoatVertical = bsrTable.getHTMLTable();
        bsrTable.setHTMLTableProperties(bsrGridPieces.patrolboatVertical.class, bsrGridPieces.patrolboatVertical.id, 0, 0, bsrGridPieces.patrolboatVertical.rows, bsrGridPieces.patrolboatVertical.columns, { 'all' : bsrGridInternals.dragAndDrop });
        this.bsrPatrolBoatHorizontal = bsrTable.getHTMLTable();
    }

    getPiecesHorizontal(){
        return { carrier : this.bsrCarrierHorizontal, battleship : this.bsrBattleshipHorizontal, destroyer : this.bsrDestroyerHorizontal, submarine : this.bsrSubmarineHorizontal, patrolBoat : this.bsrPatrolBoatHorizontal};
    }

    getPiecesVertical(){
        return { carrier : this.bsrCarrierVertical, battleship : this.bsrBattleshipVertical, destroyer : this.bsrDestroyerVertical, submarine : this.bsrSubmarineVertical, patrolBoat : this.bsrPatrolBoatVertical};
    }



}