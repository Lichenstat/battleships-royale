// class to have various play methods to check for in the game

import { bsrGeneralInfo } from "./bsr-config.js";
import { BsrCreateGrids } from "./bsr-creategrids.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { BsrPlayParse } from "./bsr-playparse.js";
import { Helper } from "./helper.js";

export { BsrPlay };

class BsrPlay{

    #piecesData;
    #setupInfo;
    #currentPlayInfo;

    #playerGrid;
    #buttonGrid;
    #hitImg;
    #missImg;

    #playerNumber;

    #clickedParentId;
    #clickedLocation;
    
    
    #playerTurn;
    #gameover;

    constructor(piecesData = new BsrPiecesData()){
        this.#piecesData = piecesData;
        this.#setupInfo = {playerNumber : 1}
        this.#currentPlayInfo = { playerTurn : 0, pieceClicked : [], pieceHit : false, pieceName : "" , pieceLocations : [], gameover : false}
        //this.#currentPlayInfo = { playerTurn : 0, pieceClicked : [], pieceHit : false, pieceName : "" , pieceLocations : [], gameover : false}

        this.#playerGrid = BsrCreateGrids.getPlayerGrid(this.#piecesData);
        this.#buttonGrid = BsrCreateGrids.getButtonGrid();
        this.#hitImg = bsrGeneralInfo.hitImage;
        this.#missImg = bsrGeneralInfo.missImage;

        this.#playerNumber  = this.#setupInfo.playerNumber;

        this.#clickedParentId = "";
        this.#clickedLocation = this.#currentPlayInfo.pieceClicked;
        
        this.#playerTurn = false;
        this.#gameover = this.#currentPlayInfo.gameover;

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

    // get the button based on a hit or miss
    #getHitOrMissedButton(){
        if (this.#currentPlayInfo.pieceHit){
            return this.#buttonGrid.getGridButtonEnabled();
        }
        if (!this.#currentPlayInfo.pieceHit){
            return this.#buttonGrid.getGridButtonDisabled();
        }
    }

    // return the proper outcome for the given button
    getPiecesForUpdating(){
        let properButton = this.#getHitOrMissedButton();
        return {button : properButton}
    }

    // initial game setup on player join
    setInitialGameInfo(setupInfo = this.#setupInfo){
        this.#setupInfo = setupInfo;
        this.#playerNumber = this.#setupInfo.playerNumber;
    }

    // set the updated information for the current play move
    setUpdateInfo(updatedInfo = this.#currentPlayInfo){
        this.#currentPlayInfo = updatedInfo;
        this.#setPlayerTurn();
    }

    // set information about the clicked button
    setClickedButtonInfo(button){
        if(this.#playerTurn){
            if(!button.disabled){
                this.#clickedParentId = button.parentNode.id;
                this.#clickedLocation = Helper.parseElementIdForMatrixLocation(this.#clickedParentId);
                //console.log(this.#clickedParentId, this.#clickedLocation);
            }
        }
    }

    // set what turn it is for playing
    #setPlayerTurn(){
        if(this.#playerNumber == this.#currentPlayInfo.playerTurn){
            this.#playerTurn = true;
        }
        else{
            this.#playerTurn = false;
        }
    }

    testRuntime(){
        this.#setPlayerTurn();
        let m = BsrPlayParse.convertLocationPieceToRawLocation([3,2]);
        console.log(m);
    }

    overallRuntime(){

    }
}