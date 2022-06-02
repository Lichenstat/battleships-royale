// class to have various play methods to check for in the game

import { BsrCreateGrids } from "./bsr-creategrids.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { Helper } from "./helper.js";

export { BsrPlay };

class BsrPlay{

    #piecesData;
    #playerGrid;
    #buttonGrid;

    #playerNumber;
    #playerTurn;
    #playerDisabled;

    constructor(piecesData = new BsrPiecesData(), playerNumber = 0){
        this.#piecesData = piecesData;
        this.#playerGrid = BsrCreateGrids.getPlayerGrid(this.#piecesData);
        this.#buttonGrid = BsrCreateGrids.getButtonGrid();

        this.#playerNumber  = playerNumber;
        this.#playerTurn = false;
        this.#playerDisabled = true;

        this.testreturn1 = { playerNumber : 0, pieceClicked : [0,0], pieceName : "" , pieceLocations : [], gameover : false}
        this.testreturn2 = { playerNumber : 1, pieceClicked : [0,0], pieceName : "" , pieceLocations : [], gameover : false}
        this.testreturn3 = { playerNumber : 2, pieceClicked : [0,0], pieceName : "" , pieceLocations : [], gameover : false}
    }

    // return the player grid
    getPlayerGrid(){
        return this.#playerGrid;
    }

    // reutrn the buttons grid
    getButtonsGrid(){
        return this.#buttonGrid;
    }

    // set what turn it is for the player
    setPlayerTurn(turn){

    }

    // check if the player has hit an enemy piece or not
    checkIfHit(){

    }

    isGameOver(){

    }
}