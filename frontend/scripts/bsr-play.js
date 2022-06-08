// class to have various play methods to check for in the game

import { bsrGeneralInfo, bsrGridInternals } from "./bsr-config.js";
import { BsrCreateGrids } from "./bsr-creategrids.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { BsrPlayParse } from "./bsr-playparse.js";
import { BsrAi } from "./bsr-ai.js";
import { BsrPlayerAiInteractions } from "./bsr-aiplayerinteractions.js";
import { Helper } from "./helper.js";

export { BsrPlay };

class BsrPlay{

    #playerPiecesData;
    #isPlayingAgainstAi;
    #aiPlayer;
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
    #hasButtonUpdated;
    
    #setTimer;

    #playerTurn;
    #gameover;

    constructor(playerPiecesData = new BsrPiecesData(), playingAgainstAi = true){
        this.#playerPiecesData = playerPiecesData;
        this.#isPlayingAgainstAi = playingAgainstAi;
        this.#aiPlayer = false;
        if(this.#isPlayingAgainstAi){
            this.#aiPlayer = new BsrAi();
        }
        this.#playSetupInfo = { playerNumber : 1 }
        //this.#currentPlayInfo = { playerTurn : 1, piecesClicked : [[]], piecesHit : [], pieceName : "" , pieceLocations : [[]], gameover : false}
        this.#currentPlayInfo = { playerTurn : 1, piecesClicked : [[]], piecesHit : [], pieceName : "" , pieceLocations : [[]], gameover : false}
        this.#hasInfoUpdated = false;

        this.#sendInitialInfo = { boardPieces : {}}
        this.#sendLocations = { piecesClicked : [[]] };
        //this.#currentPlayInfo = { playerTurn : 0, pieceClicked : [], piecesHit : false, pieceName : "" , pieceLocations : [[]], gameover : false}

        this.#playerDefaultGridCellId = "grid__cell-example-(0,0)";

        this.#playerGrid = BsrCreateGrids.getPlayerGrid(this.#playerPiecesData);
        this.#buttonGrid = BsrCreateGrids.getButtonGrid();
        this.#hitImg = bsrGeneralInfo.hitImage;
        this.#missImg = bsrGeneralInfo.missImage;
        
        this.#playerNumber  = this.#playSetupInfo.playerNumber;
        this.#playingAgainstAi = false;
        
        this.#buttonParentId = "";
        this.#buttonLocation = [this.#currentPlayInfo.piecesClicked];
        this.#hasButtonUpdated = false;
        
        this.#setTimer = 1000; // 1000 = 1 sec

        this.#playerTurn = true;
        this.#gameover = this.#currentPlayInfo.gameover;

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

    // set the current players turn (only for 2 players at the moment)
    #setCurrentTurn(){
        let turn = this.#currentPlayInfo.playerTurn;
        if(turn == 1){
            this.#currentPlayInfo.playerTurn = 2;
        }
        if(turn == 2){
            this.#currentPlayInfo.playerTurn = 1;
        }
    }

    // set information about the clicked button
    #setClickedButtonInfo(button){
        if(this.#playerTurn){
            if(!button.disabled){
                this.#buttonParentId = button.parentNode.id;
                this.#buttonLocation = [Helper.parseElementIdForMatrixLocation(this.#buttonParentId)];
                this.#hasButtonUpdated = true;
                this.#playerTurn = false;
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

    //-------------------------------------------------------------------------
    // updating pieces methods

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

    // return the cell ids if required for updating
    #getCellIds(locations = [[]]){
        let setLocationIds = [];
        let size = locations.length;
        for (let i = 0; i < size; i++){
            let cellId = Helper.parseElementIdToChangeMatrixLocation(this.#playerDefaultGridCellId, locations[i]);
            setLocationIds.push(cellId);
        }
        return setLocationIds;
    }

    // get the proper sources for the images on a hit or miss outcome
    #getImagesForUpdating(piecesHit = []){
        let imageSrc = [];
        let size = piecesHit.length;
        for (let i = 0; i < size; i++){
            if(piecesHit[i]){
                imageSrc.push(bsrGridInternals.hitImage);
            }
            if(!piecesHit[i]){
                imageSrc.push(bsrGridInternals.missImage);
            }
        }
        return imageSrc;
    }

    // return the proper outcome for the given button
    #getIdsWithImagesForUpdating(){
        let ids = this.#getCellIds(this.#currentPlayInfo.piecesClicked);
        let imagercs = this.#getImagesForUpdating(this.#currentPlayInfo.piecesHit)
        return {ids : ids, imageSrcs : imagercs}
    }

    //-------------------------------------------------------------------------
    // runtime methods

    // runtime functions/methods to take place if the player is fighting against an ai
    #vsAiRuntime(){
        if(this.#currentPlayInfo.playerTurn == this.#playerNumber){
            if(this.#hasButtonUpdated){
                console.log('player attacked');
                this.#currentPlayInfo.piecesClicked = this.#buttonLocation;
                this.#currentPlayInfo.piecesHit = BsrPlayerAiInteractions.checkIfHitOrMiss(this.#aiPlayer.getAiPiecesData(), this.#buttonLocation);
                //console.log(this.#currentPlayInfo);
                this.#setChosenPiecesOutcome();
                this.#hasInfoUpdated = true;
                this.#hasButtonUpdated = false;
                this.#setCurrentTurn();
            }
        }
        if(this.#currentPlayInfo.playerTurn != this.#playerNumber){
            console.log("ai attacked");
            let aiLocationChoice = [this.#aiPlayer.getTestChoiceLocaions()];
            this.#currentPlayInfo.piecesClicked = aiLocationChoice;
            this.#currentPlayInfo.piecesHit = BsrPlayerAiInteractions.checkIfHitOrMiss(this.#playerPiecesData, aiLocationChoice);
            //console.log(this.#currentPlayInfo);
            this.#setChosenPiecesOutcome();
            this.#hasInfoUpdated = true;
            this.#playerTurn = true;
            this.#setCurrentTurn();
        }
    }

    // player vs whoever runtime
    #playRuntime(){
        console.log('running');
        if(this.#isPlayingAgainstAi){
            this.#vsAiRuntime();
        }
        if(!this.#isPlayingAgainstAi){
            
        }
        if (!this.#currentPlayInfo.gameover || this.#setPlayerTurn){

        }
    }

    //-------------------------------------------------------------------------
    // callable anonymous functions for use with events

    // load the player grid with all the pieces in some element(s)
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
    #setButtonsDisabled = function(){
        let pieces = this.#getDisabledPushButtons();
        if(pieces){
            let allButtonsSize = Object.keys(pieces).length;
            for (let i = 0; i < allButtonsSize; i++){
                let key = Object.keys(pieces)[i];
                let allSameCellIds = document.querySelectorAll("[id='" + key + "']");
                // coded to work with 2 grids for now, just use second occurence of id
                allSameCellIds[1].innerHTML = pieces[key];
            }
        }
    }

    // set pieces after they have been checked and sent back after ai/server updates
    #setChosenPiecesOutcome = function(){
        let pieces = this.#getIdsWithImagesForUpdating();
        console.log(pieces);
        let ids = pieces.ids;
        let srcs = pieces.imageSrcs;
        let size = ids.length;
        for (let i = 0; i < size; i++){
            let allSameCellIds = document.querySelectorAll("[id='" + ids[i] + "']");
            //console.log(allSameCellIds);
            // the programming only works for 2 players at the moment, will have to change if more players
            // playing at once is desired
            if(this.#currentPlayInfo.playerTurn == 1){
                let images = allSameCellIds[1].children[0].innerHTML;
                allSameCellIds[1].innerHTML = images;
                allSameCellIds[1].children[1].src = srcs[i];
            }
            if(this.#currentPlayInfo.playerTurn == 2){
                allSameCellIds[0].children[0].children[1].src = srcs[i]
            }
        }
    }

    // set the event listeners of the grid buttons
    setEventListenersOfGridButtons = function(){
        let x = document.querySelectorAll("[id='" + bsrGridInternals.boardButtonId + "']");
        x.forEach(item => {
            item.addEventListener("click", elemItem =>{
            console.log(elemItem.target);
            this.#setClickedButtonInfo(elemItem.target);
            this.#setButtonsDisabled();
            this.#playRuntime();
            console.log(this.#playerPiecesData.getPiecesDataTable());
            console.log(this.#playerPiecesData.getPiecesLeftByLocation());
            })
        })
    }

}