// class to have various play methods to check for in the game

import { bsrGeneralInfo, bsrGridInternals } from "./bsr-config.js";
import { BsrCreateGrids } from "./bsr-creategrids.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { BsrPlayParse } from "./bsr-playparse.js";
import { BsrAi } from "./bsr-ai.js";
import { Helper } from "./helper.js";

export { BsrPlay };

class BsrPlay{

    #piecesData;
    #playSetupInfo;
    #currentPlayInfo;
    #hasInfoUpdated;
    
    #sendInitialInfo;
    #sendLocations;

    #playerDefaultGridCellId;

    #playerGrid;
    #buttonGrid;
    #hitImg;
    #missImg;

    #playerNumber;
    #playingAgainstAi;

    #buttonParentId;
    #buttonLocation;
    
    #setTimer;

    #playerTurn;
    #gameover;

    constructor(piecesData = new BsrPiecesData()){
        this.#piecesData = piecesData;
        this.#playSetupInfo = { playerNumber : 1 }
        this.#currentPlayInfo = { playerTurn : 1, piecesClicked : [[]], piecesHit : [false], pieceName : "" , pieceLocations : [[]], gameover : false}
        this.#hasInfoUpdated = false;

        this.#sendInitialInfo = { boardPieces : {}}
        this.#sendLocations = { piecesClicked : [[]] };
        //this.#currentPlayInfo = { playerTurn : 0, pieceClicked : [], piecesHit : false, pieceName : "" , pieceLocations : [[]], gameover : false}

        this.#playerDefaultGridCellId = "grid__cell-example-(0,0)";

        this.#playerGrid = BsrCreateGrids.getPlayerGrid(this.#piecesData);
        this.#buttonGrid = BsrCreateGrids.getButtonGrid();
        this.#hitImg = bsrGeneralInfo.hitImage;
        this.#missImg = bsrGeneralInfo.missImage;

        this.#playerNumber  = this.#playSetupInfo.playerNumber;
        this.#playingAgainstAi = false;

        this.#buttonParentId = "";
        this.#buttonLocation = [this.#currentPlayInfo.piecesClicked];
        
        this.#setTimer = 1000; // 1000 = 1 sec

        this.#playerTurn = true;
        this.#gameover = this.#currentPlayInfo.gameover;

        //this.testreturn1 = { playerNumber : 0, piecesClicked : [0,0], pieceName : "" , pieceLocations : [], gameover : false}
        //this.testreturn2 = { playerNumber : 1, piecesClicked : [0,0], pieceName : "" , pieceLocations : [], gameover : false}
        //this.testreturn3 = { playerNumber : 2, piecesClicked : [0,0], pieceName : "" , pieceLocations : [], gameover : false}
    }

    // return the player grid
    getPlayerGrid(){
        return this.#playerGrid;
    }

    // reutrn the buttons grid
    getButtonsGrid(){
        return this.#buttonGrid;
    }

    // get player currently playing the game
    getCurrentPlayerTurn(){
        return this.#currentPlayInfo.playerTurn;
    }

    //  call if we will want to play against ai
    setPlayingAgainstAi(){
        this.#playingAgainstAi = true;
    }

    // initial game setup on player join
    #setInitialGameInfo(setupInfo = this.#playSetupInfo){
        this.#playSetupInfo = setupInfo;
        this.#playerNumber = this.#playSetupInfo.playerNumber;
    }

    // set the updated information for the current play move
    #setUpdateInfo(updatedInfo = this.#currentPlayInfo){
        this.#currentPlayInfo = updatedInfo;
        this.#setPlayerTurn();
    }

    // set default info about the players grid cell in play
    setDefaultPlayerGridCell(cell){
        this.#playerDefaultGridCellId = cell.id;
    }

    // set information about the clicked button
    setClickedButtonInfo(button){
        if(this.#playerTurn){
            if(!button.disabled){
                this.#buttonParentId = button.parentNode.id;
                this.#buttonLocation = [Helper.parseElementIdForMatrixLocation(this.#buttonParentId)];
                this.#setIfPlayerUsedTurn();
                //console.log(this.#clickedParentId, this.#clickedLocation);
            }
        }
    }

    // set if the player has used their turn
    #setIfPlayerUsedTurn(){
        this.#playerTurn = false;
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

    //-------------------------------------------------------------------------
    // updating methods

    // get the buttons on an update
    getPlayingPiecesOnUpdate(){
        return this.#getPiecesUpdated();
    }

    #getPiecesUpdated(){
        if(this.#hasInfoUpdated){
            if(this.#playerTurn){

            }
            if(!this.#playerTurn){
                return this.#getButtonsForUpdating();
            }
        }
    }

    //-------------------------------------------------------------------------
    // button methods

    // get buttons enable or disabled on initial button click
    #getDisabledPushButtons(){
        let buttons = {}
        let locationSize = this.#buttonLocation.length;
        for (var i = 0; i < locationSize; i++){
            let id = Helper.parseElementIdToChangeMatrixLocation(this.#buttonParentId, this.#buttonLocation[i]);
            buttons[id] = this.#buttonGrid.getGridButtonDisabled();
        }
        return buttons;
    }

    // return the proper outcome for the given button
    #getButtonsForUpdating(locations = [[]]){
        let ids = this.#getCellIds(locations);
        let properButtons = this.#getHitOrMissedButtons();
        return {ids : ids, images : properButtons}
    }

    #getHitOrMissedButtons(){
        let buttons = []
        let size = this.#currentPlayInfo.piecesHit.length;
        for(let i = 0; i < size; i++){
            let hitOrMiss = this.#currentPlayInfo.piecesHit[i];
            buttons.push(this.#getHitOrMissedButton(hitOrMiss));
        }
        return buttons;
    }

    // get the button based on a hit or miss
    #getHitOrMissedButton(hitOrMiss = false){
        if(hitOrMiss != null){
            if (hitOrMiss){
                return this.#buttonGrid.getGridButtonHit();
            }
            if (!hitOrMiss){
                return this.#buttonGrid.getGridButtonMissed();
            }
        }
    }

    //-------------------------------------------------------------------------
    // player methods

    //// get player info on update
    //getPlayerOnUpdate(){
    //    return this.#getPlayerForUpdating();
    //}

    //// return the proper outcome for the given player
    //#getButtonsForUpdating(locations = [[]]){
    //    let ids = this.#getCellIds(locations);
    //    let images = this.#getImageOutcomes();
    //    return {ids : ids, images : images}
    //}

    #getImageOutcomes(){
        let images = [];
        let size = this.#currentPlayInfo.piecesHit.length;

    }

    //// get the button based on a hit or miss
    //#getHitOrMissedButton(hitOrMiss = false){
    //    if(hitOrMiss != null){
    //        if (hitOrMiss){
    //            return this.#buttonGrid.getGridButtonHit();
    //        }
    //        if (!hitOrMiss){
    //            return this.#buttonGrid.getGridButtonMissed();
    //        }
    //    }
    //}

    //-------------------------------------------------------------------------
    // callable anonymous functions for use with event listeners outside of play

    // load the player grid with all the pieces
    loadPlayingGrids = function(elementOne, elementTwo){
        if (elementTwo){
            elementOne.innerHTML = this.getPlayerGrid().getGrid();
            elementTwo.innerHTML = this.getButtonsGrid().getGrid();
        }
        else{
            elementOne.innerHTML = this.getPlayerGrid().getGrid() + this.getButtonsGrid().getGrid();
        }
    }

    // set the clicked button as disabled
    setButtonDisabled = function(){
        let pieces = this.#getDisabledPushButtons();
        if(pieces){
            let allSameCellIds = document.querySelectorAll("[id='" + Object.keys(pieces) + "']");
            // coded to work with 2 grids for now, jsut use second occurence of id
            allSameCellIds[1].innerHTML = pieces[Object.keys(pieces)[0]];
        }
    }

    setEventListenersOfGridButtons = function(){
        let x = document.querySelectorAll("[id='" + bsrGridInternals.boardButtonId + "']");
        x.forEach(item => {
            item.addEventListener("click", elemItem =>{
            console.log(elemItem.target);
            this.setClickedButtonInfo(elemItem.target);
            this.setButtonDisabled();
            })
        })
    }


    // return the cell id if required for updating
    #getCellIds(locations = [[]]){
        return this.#piecesData.getPiecesWithIdsAndInternals(this.#playerDefaultGridCellId, locations)
    }

    runFunctionTill(thisFunction = function(){}, cycleTime = 1000, ){

    }

    testRuntime1 = (someFunction = function(){}) => {
        setTimeout(
            () => {
                if(!this.#playerTurn){
                    this.testRuntime1(someFunction);
                    console.log("not ur turn yet");
                    this.x = this.x + 1;
                    if (this.x > 5){
                        this.#playerTurn = true;
                    }
                }
                else{
                    console.log(someFunction());
                    console.log('ur turn now');
                    return "winnder";
                }
            }, this.#setTimer);
    }

    overallRuntime(){

    }
}