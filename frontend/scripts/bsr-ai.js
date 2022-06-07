// class having basic ai object and methods for use with purely frontend

import { BsrPiecesData } from "./bsr-piecesdata.js";
import { BsrDragAndDropGrid } from "./bsr-draganddropgrid.js";
import { Helper } from "./helper.js";

export { BsrAi }

class BsrAi{

    #aiPiecesData;
    #aiChosenLocations;
    #aiLastHitLocation;
    #aiFollowUpLocation;

    #bsrGrid;
    #minRowPosition;
    #minColumnPosition;
    #maxRowPosition;
    #maxColumnPosition;

    #minTime;
    #maxTime;
    #timer;
    
    constructor(aiPiecesData = new BsrPiecesData()){

    this.#aiPiecesData = aiPiecesData;
    // fill ai data table with random placed pieces
    this.#aiPiecesData.setPiecesRandom();
    this.#aiChosenLocations = [];
    this.#aiLastHitLocation = [];
    this.#aiFollowUpLocation = [];

    this.#bsrGrid = new BsrDragAndDropGrid();
    this.#minRowPosition = this.#bsrGrid.getTableRowsOffset();
    this.#maxRowPosition = this.#minRowPosition + (this.#bsrGrid.getTableRowsCount() - 1);
    this.#minColumnPosition = this.#bsrGrid.getTableColumnsOffset();
    this.#maxColumnPosition = this.#minColumnPosition + (this.#bsrGrid.getTableColumnsCount() - 1);

    this.#minTime = 1;
    this.#maxTime = 5;
    this.#timer = Helper.getRandomInteger(this.#minTime, this.#maxTime);

    }

    // set a random timer interval between 2 integers
    #setRandomTimerInterval(){
        this.#timer = Helper.getRandomInteger(this.#minTime, this.#maxTime);
    }

    // get the return info to feed back to the player
    getDefaultReturnInfo(){
        let info = { playerTurn : 1, piecesClicked : [[]], piecesHit : [false], pieceName : "" , pieceLocations : [[]], gameover : false}
        return info;
    }

}