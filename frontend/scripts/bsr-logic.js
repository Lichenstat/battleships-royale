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
        this.piecesDataTable = [/*{
            "id": 0,
            "piece": {
              "name": "carrier",
              "locations": [
                [
                  3,
                  6
                ],
                [
                  4,
                  3
                ],
                [
                  5,
                  3
                ],
                [
                  6,
                  3
                ],
                [
                  7,
                  3
                ]
              ]
            }
          }*/];// Array(this.tableRowsCount).fill().map(() => Array(this.tableColumnsCount).fill(0));
        // create and assign pieces objects to be used with the grid
        this.pieces = [
            { 'name' : bsrGridPieces.carrierHorizontal.name,    'count' : bsrGridPieces.carrierHorizontal.count,    'size' : bsrGridPieces.carrierHorizontal.size,    'placed' : bsrGridPieces.carrierHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.carrierHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.carrierVertical.name]},
            { 'name' : bsrGridPieces.battleshipHorizontal.name, 'count' : bsrGridPieces.battleshipHorizontal.count, 'size' : bsrGridPieces.battleshipHorizontal.size, 'placed' : bsrGridPieces.battleshipHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.battleshipHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.battleshipVertical.name]},
            { 'name' : bsrGridPieces.destroyerHorizontal.name,  'count' : bsrGridPieces.destroyerHorizontal.count,  'size' : bsrGridPieces.destroyerHorizontal.size,  'placed' : bsrGridPieces.destroyerHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.destroyerHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.destroyerVertical.name]},
            { 'name' : bsrGridPieces.submarineHorizontal.name,  'count' : bsrGridPieces.submarineHorizontal.count,  'size' : bsrGridPieces.submarineHorizontal.size,  'placed' : bsrGridPieces.submarineHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.submarineHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.submarineVertical.name]},
            { 'name' : bsrGridPieces.patrolboatHorizontal.name, 'count' : bsrGridPieces.patrolboatHorizontal.count, 'size' : bsrGridPieces.patrolboatHorizontal.size, 'placed' : bsrGridPieces.patrolboatHorizontal.count, [this.horizontal] : this.horizontalPlayPieces[bsrGridPieces.patrolboatHorizontal.name], [this.vertical] : this.verticalPlayPieces[bsrGridPieces.patrolboatVertical.name]}
        ];
        this.pieceCounter = 1;
        console.log(this.tableRowsOffset, this.tableColumnsOffset);
    }

    // set rotation of pieces during grid setup
    changeBoardPieceRotation(rotation){
        if(rotation == 1 || rotation == this.vertical ? this.pieceRotation = this.vertical : this.pieceRotation = this.horizontal);
    }

    // check if the current piece will overlap with any currently set pieces in the data table
    #checkPieceForDataTableOverlap(pieceLocations){
        console.log(this.piecesDataTable);
        console.log(pieceLocations);
        let pieceDataLength = this.piecesDataTable.length;
        for (var i = 0; i < pieceDataLength; i++){
            let pieceDataLocation = this.piecesDataTable[i].piece.locations;
            pieceDataLocation.forEach(dataLocation =>{
                pieceLocations.forEach(desiredLocation => {
                    if(Helper.checkIfArraysAreEqual(dataLocation, desiredLocation)){
                        console.log('bad piece');
                        return true;
                    }
                })
            })
        }
        return false;
    }

    // set pieces to the data table 
    setPiecesInDataTable(dataInfo = { 'name' : null, 'draggedPortionIndex' : null , 'localPortionIndex' : null }){
        let draggedPieceFirstLocation;
        let draggedPieceLastLocation;
        let piece = {'name' : dataInfo.name};
        let pieceLocations = [];
        // get the size of the piece for looping
        let desiredPiece;
        this.pieces.filter(
            piece => {
                if(dataInfo.name == piece.name){
                    desiredPiece = piece;
                }
            }
        );
        //checking if given piece can be placed in horizontally
        if (this.pieceRotation == this.horizontal){
            // find starting positions
            draggedPieceFirstLocation = dataInfo.localPortionIndex[1] - dataInfo.draggedPortionIndex[1] + 1;
            draggedPieceLastLocation = dataInfo.localPortionIndex[1] + (desiredPiece.size - dataInfo.draggedPortionIndex[1]);
            // console.log('piece first location', draggedPieceFirstLocation,'piece last location', draggedPieceLastLocation);
            if (draggedPieceFirstLocation < this.tableColumnsOffset || draggedPieceLastLocation > this.tableColumnsCount + bsrGridProperties.columnsIndexSize){
                return false;
            }
            let size = desiredPiece.size + draggedPieceFirstLocation;
            for(let i = draggedPieceFirstLocation; i < size; i++){
                pieceLocations.push([dataInfo.localPortionIndex[0], i]);
            }
        }
        //checking if given piece can be placed in vertically
        if (this.pieceRotation == this.vertical){
            // find starting positions
            draggedPieceFirstLocation = dataInfo.localPortionIndex[0] - dataInfo.draggedPortionIndex[0] + 1;
            draggedPieceLastLocation = dataInfo.localPortionIndex[0] + (desiredPiece.size - dataInfo.draggedPortionIndex[0]);
            //console.log('piece first location', draggedPieceFirstLocation,'piece last location', draggedPieceLastLocation);
            if (draggedPieceFirstLocation < this.tableRowsOffset || draggedPieceLastLocation > this.tableRowsCount + bsrGridProperties.rowsNameAndIndexSize){
                return false;
            }
            let size = desiredPiece.size + draggedPieceFirstLocation;
            for(let i = draggedPieceFirstLocation; i < size; i++){
                pieceLocations.push([i, dataInfo.localPortionIndex[1]]);
                //console.log(i, dataInfo.localPortionIndex[1])
            }
        }
        //console.log(pieceLocations);
        if(this.#checkPieceForDataTableOverlap(pieceLocations)){
            return false;
        }
        piece.locations = pieceLocations;

        this.piecesDataTable.push({'id' : this.pieceCounter, piece});
        this.pieceCounter = this.pieceCounter + 1;
    }





}