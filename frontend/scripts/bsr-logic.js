// Methods for interacting with the players (player interaction on clientside)

export { BsrLogic };

import { BsrPlayPieces } from "./bsr-playpieces.js";
import { BsrGrid } from "./bsr-grid.js";
import { Helper } from "./helper.js";
import { bsrGridProperties, bsrGridPieces } from "./bsr-config.js";

class BsrLogic{
    constructor(logicTableRows = bsrGridProperties.rows - 1, logicTableColumns = bsrGridProperties.columns - 1, pieceRotation = 'horizontal'){
        this.bsrPlayPieces = new BsrPlayPieces();
        this.horizontalPlayPieces = this.bsrPlayPieces.getPiecesHorizontal();
        this.verticalPlayPieces = this.bsrPlayPieces.getPiecesVertical();
        this.logicTableColumns = logicTableColumns;
        this.logicTableRows = logicTableRows;
        this.pieceRotation = pieceRotation;
        this.horizontal = 'horizontal';
        this.vertical = 'vertical';
        this.logicDataMatrix = Array(this.logicTableRows).fill().map(() => Array(this.logicTableColumns).fill(null));
        // create and assign pieces objects to be used with the grid
        this.cruiserPieces = { 'size' : bsrGridPieces.carrierHorizontal.size, 'placed' : bsrGridPieces.carrierHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.carrierHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.carrierVertical.name]}
        this.battleshipPieces = { 'size' : bsrGridPieces.battleshipHorizontal.size, 'placed' : bsrGridPieces.battleshipHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.battleshipHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.battleshipVertical.name]}
        this.destroyerPieces = { 'size' : bsrGridPieces.destroyerHorizontal.size, 'placed' : bsrGridPieces.destroyerHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.destroyerHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.destroyerVertical.name]}
        this.submarine = { 'size' : bsrGridPieces.submarineHorizontal.size, 'placed' : bsrGridPieces.submarineHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.submarineVertical.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.submarineVertical.name]}
        this.patrolboat = { 'size' : bsrGridPieces.patrolboatHorizontal.size, 'placed' : bsrGridPieces.patrolboatHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.patrolboatHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.patrolboatVertical.name]}
        console.log(this.logicDataMatrix);
    }

    // set rotation of pieces during grid setup
    changeBoardPieceRotation(rotation){
        if(rotation == 1 || rotation == this.vertical ? this.pieceRotation = this.vertical : this.pieceRotation = this.horizontal);
    }

    // set and update data parts in the bsr data matrix
    #setPiecesInDataMatrix(dataInfo){

    }

}