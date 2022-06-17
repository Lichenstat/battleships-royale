// class to have various play methods to check for in the game

import { BsrCreateGrids } from "./bsr-creategrids.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
//import { BsrPlayParse } from "./bsr-playparse.js";
import { BsrAi } from "./bsr-ai.js";
import { BsrPlayerAiInteractions } from "./bsr-aiplayerinteractions.js";
import { bsrGeneralInfo, bsrGridInternals, bsrPieceInteractors } from "./bsr-config.js";
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

    #outsideFuncs;

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

        this.#playerDefaultGridCellId = "bsr__table-cell-(0,0)";

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

        //------------------------------------------------

        // assign functions from the outside to run on updates
        this.#outsideFuncs = [];

    }

    // get player pieces data
    getPlayerPiecesData(){
        return this.#playerPiecesData
    }

    // get ai pieces data
    getAiPiecesData(){
        return this.#aiPlayer.getAiPiecesData();
    }

    // get ai pieces original data
    getOriginalAiPiecesData(){
        return this.#aiPlayer.getAiPiecesDataUntouched();
    }

    // return the player grid
    getPlayerGrid(){
        return this.#playerGrid;
    }

    // reutrn the buttons grid
    getButtonsGrid(){
        return this.#buttonGrid;
    }

    // get the current play info
    getCurrentPlayInfo(){
        return this.#currentPlayInfo;
    }

    // get player currently playing the game
    getCurrentPlayerTurn(){
        return this.#currentPlayInfo.playerTurn;
    }

    // get the current player number (if it is the players number it is his turn)
    getPlayerNumber(){
        return this.#playerNumber;
    }

    // check if it is our players turn or not
    checkIfPlayerTurn(){
        return this.#playerTurn;
    }

    // check if we are playing agianst ai or not
    checkIfPlayingAgainstAi(){
        return this.#isPlayingAgainstAi;
    }

    //// call if we will want to play against ai
    //setPlayingAgainstAi(){
    //    this.#playingAgainstAi = true;
    //}

    // get the updated pieces info
    getUpdatedPiecesInfo(bsrPiecesData = new BsrPiecesData()){
        let gamePieces = ''
        let container = bsrPieceInteractors.piecesContainer;
        let beginning = container.substring(0, container.indexOf('>') + 1);
        let ending = container.substring(container.lastIndexOf('<'), container.length);
        let shipPieces = bsrPiecesData.getPlacementPieces(bsrGeneralInfo.horizontal);
        let shipCount = bsrPiecesData.getPiecesLeftThatHaveLocations();
        console.log(shipCount);
        for (const [key, item] of Object.entries(shipPieces)){
            let currentBeginning = Helper.parsePartOfStringToReplace(
            beginning, 
            'class="' + bsrPieceInteractors.piecesContainerId + '"', 
            'class="' + bsrPieceInteractors.piecesContainerId + " " + bsrPieceInteractors.piecesContainerId + "--" + key + '"'
            );
            let uppercaseKey = key.charAt(0).toUpperCase() + key.substring(1, key.length);
            if (uppercaseKey == 'Patrolboat'){
                uppercaseKey = 'Patrol Boat';
            }
            let count = 0;
            if (shipCount != undefined){
                count = shipCount[key];
            }  
            gamePieces = gamePieces + (currentBeginning + uppercaseKey + ': ' + count + item + ending);
        }
        return gamePieces;
    }

    // initial game setup on player join
    #setInitialGameInfo(setupInfo = this.#playSetupInfo){
        this.#playSetupInfo = setupInfo;
        this.#playerNumber = this.#playSetupInfo.playerNumber;
    }

    // set the updated information for the current play move
    #setUpdateInfo(updatedInfo = this.#currentPlayInfo){
        this.#currentPlayInfo = updatedInfo;
        this.#setPlayerTurnByCurrentPlayInfo();
    }

    //// set default info about the players grid cell in play
    //setDefaultPlayerGridCell(cell){
    //    this.#playerDefaultGridCellId = cell.id;
    //}

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
    setClickedButtonInfo(button){
        if(this.#playerTurn){
            if(!button.disabled){
                this.#buttonParentId = button.parentNode.id;
                this.#buttonLocation = [Helper.parseElementIdForMatrixLocation(this.#buttonParentId)];
                this.#hasButtonUpdated = true;
            }
        }
    }

    // check if there is a winner as of yet
    #checkIfWinner(){
        if(this.#currentPlayInfo.gameover){
            console.log('we got a winner!!!! - ', this.#currentPlayInfo.playerTurn);
        }
    }

    // set an outside function in the outside functions array to run on game update
    setOutsideFunctionToRunOnUpdate(func = function(){}){
        this.#outsideFuncs.push(func);
    }

    // run array of functions on player update
    #runOnGameUpdate(){
        this.#outsideFuncs.forEach(
            func => {
                console.log(func);
                func();
            }
        )
    }

    // run functions on a player win
    runOnWin = (func = function(){}) => {
        if (this.#currentPlayInfo.gameover){
            func();
        }
    }

    // set what turn it is for playing
    #setPlayerTurnByCurrentPlayInfo(){
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
    getDisabledPushButtons(){
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
    #getOutcomeImagesForUpdating(piecesHit = []){
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
    getOutcomeIdsWithImagesForUpdating(){
        let ids = this.#getCellIds(this.#currentPlayInfo.piecesClicked);
        let imagesrc = this.#getOutcomeImagesForUpdating(this.#currentPlayInfo.piecesHit)
        return {ids : ids, imageSrcs : imagesrc}
    }

    // return ship images from a bsr data table over the given buttons after a game over
    getGameoverShipIdsWithImages(bsrPiecesData = new BsrPiecesData()){
        let ids = this.#getCellIds(bsrPiecesData.getAllPiecesLocationsLeft());
        let imagesrc = bsrPiecesData.getAllPiecesImagesLeft();
        return {ids : ids, imageSrcs : imagesrc}
    }

    //-------------------------------------------------------------------------
    // runtime methods

    // check if the player vs ai game is over
    #checkPlayerVsAiGameover(){
        this.#currentPlayInfo = BsrPlayerAiInteractions.setGameover(this.#playerPiecesData, this.#aiPlayer.getAiPiecesData(), this.#currentPlayInfo);
        this.#checkIfWinner();
    }

    // functions to run on ai "thinking" wait time
    #aiThinkingWaitTimeFunctions = () => {
        //this.#setChosenPiecesOutcome();
        this.#runOnGameUpdate();
        this.#hasInfoUpdated = true;
        this.#playerTurn = true;
        this.#setCurrentTurn();
    }
    
    // runtime functions/methods to take place if the player is fighting against an ai
    #vsAiRuntime(){
        if(this.#currentPlayInfo.playerTurn == this.#playerNumber && !this.#currentPlayInfo.gameover){
            if(this.#hasButtonUpdated){
                console.log('player attacked');
                this.#currentPlayInfo.piecesClicked = this.#buttonLocation;
                this.#currentPlayInfo.piecesHit = BsrPlayerAiInteractions.checkIfHitOrMiss(this.#aiPlayer.getAiPiecesData(), this.#buttonLocation);
                //console.log(this.#currentPlayInfo);
                //this.#setChosenPiecesOutcome();
                this.#runOnGameUpdate();
                this.#hasInfoUpdated = true;
                this.#hasButtonUpdated = false;
                this.#playerTurn = false;
                this.#setCurrentTurn();
            }
        }
        this.#checkPlayerVsAiGameover();
        if(this.#currentPlayInfo.playerTurn != this.#playerNumber && !this.#currentPlayInfo.gameover){
            console.log("ai attacked");
            let aiLocationChoice = [this.#aiPlayer.getNextAttackLocation()];
            this.#currentPlayInfo.piecesClicked = aiLocationChoice;
            this.#currentPlayInfo.piecesHit = BsrPlayerAiInteractions.checkIfHitOrMiss(this.#playerPiecesData, aiLocationChoice);
            //console.log(this.#playerPiecesData.getPiecesLeftByLocation());
            this.#aiPlayer.checkIfAttackWasSuccessful(this.#currentPlayInfo.piecesHit, this.#playerPiecesData.getPiecesLeftThatHaveLocations());
            //console.log(this.#currentPlayInfo);
            this.#aiPlayer.thinkingWaitTime(this.#aiThinkingWaitTimeFunctions);
        }
        this.#checkPlayerVsAiGameover();
    }

    // player vs whoever runtime
    playRuntime(){
        console.log('running');
        if(!this.#currentPlayInfo.gameover){
            if(this.#isPlayingAgainstAi){
                if(this.#playerTurn){
                    this.#vsAiRuntime();
                }
            }
            if(!this.#isPlayingAgainstAi){
                
            }
            if (!this.#currentPlayInfo.gameover){
    
            }
        }
    }

    //-------------------------------------------------------------------------

}