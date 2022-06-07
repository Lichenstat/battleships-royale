// class having basic ai object and methods for use with purely frontend

import { BsrPiecesData } from "./bsr-piecesdata.js";
import { BsrDragAndDropGrid } from "./bsr-draganddropgrid.js";
import { Helper } from "./helper.js";

export { BsrAi }

class BsrAi{

    #aiPiecesData;
    #aiPlayerNumber;
    #aiChosenLocations;
    #aiLastHitLocation;
    #aiFollowUpLocation;

    #bsrGrid;
    #minRowPosition;
    #minColumnPosition;
    #maxRowPosition;
    #maxColumnPosition;

    #testChoice;

    #minTime;
    #maxTime;
    #timer;
    
    constructor(aiPiecesData = new BsrPiecesData()){

    this.#aiPiecesData = aiPiecesData;
    // fill ai data table with random placed pieces
    this.#aiPiecesData.setPiecesRandom();
    this.#aiPlayerNumber = 2;

    this.#aiChosenLocations = [];
    this.#aiLastHitLocation = [];
    this.#aiFollowUpLocation = [];

    this.#bsrGrid = new BsrDragAndDropGrid();
    this.#minRowPosition = this.#bsrGrid.getTableRowsOffset();
    this.#maxRowPosition = this.#minRowPosition + (this.#bsrGrid.getTableRowsCount() - 1);
    this.#minColumnPosition = this.#bsrGrid.getTableColumnsOffset();
    this.#maxColumnPosition = this.#minColumnPosition + (this.#bsrGrid.getTableColumnsCount() - 1);

    this.#testChoice = [this.#minRowPosition, this.#minColumnPosition - 1];
    
    this.#minTime = 1;
    this.#maxTime = 3;
    this.#timer = Helper.getRandomInteger(this.#minTime, this.#maxTime);

    }

    // set a random timer interval between 2 integers
    #setRandomTimerInterval(){
        this.#timer = Helper.getRandomInteger(this.#minTime, this.#maxTime);
    }

    // get ai pieces data
    getAiPiecesData(){
        return this.#aiPiecesData;
    }

    // test choice of an ai (will go through all grid locations, left to right,
    // then down one, repeat till full grid has been gone through
    #testChoiceLocaions(){
        if(this.#testChoice[1] == this.#maxColumnPosition){
            this.#testChoice[1] = this.#minColumnPosition;
            this.#testChoice[0] = this.#testChoice[0] + 1;
        }
        else{
            this.#testChoice[1] = this.#testChoice[1] + 1;
        }
    }

    getTestChoiceLocaions(){
        this.#testChoiceLocaions();
        return this.#testChoice;    
    }

    // get the return info to feed back to the player
    getDefaultReturnInfo(){
        let info = { playerTurn : 1, piecesClicked : [[]], piecesHit : [false], pieceName : "" , pieceLocations : [[]], gameover : false}
        return info;
    }

}