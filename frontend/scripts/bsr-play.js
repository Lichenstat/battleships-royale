// class to have various play methods to check for in the game

import { bsrGeneralInfo, bsrGridInternals, bsrPieceInteractors } from "./bsr-config.js";
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

    #playerShipInfoElement;
    #enemyShipInfoElement;

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

        //------------------------------------------------
        // for updating parts in game
        this.#playerShipInfoElement = "";
        this.#enemyShipInfoElement = "";

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

    // call if we will want to play against ai
    setPlayingAgainstAi(){
        this.#playingAgainstAi = true;
    }

    // get the updated pieces info
    getUpdatedPieces(bsrPiecesData = new BsrPiecesData()){
        let gamePieces = ''
        let container = bsrPieceInteractors.piecesContainer;
        let beginning = container.substring(0, container.indexOf('>') + 1);
        let ending = container.substring(container.lastIndexOf('<'), container.length);
        let shipPieces = bsrPiecesData.getPlacementPieces(bsrGeneralInfo.horizontal);
        let shipCount = bsrPiecesData.getPiecesLeftThatHaveLocations();
        for (const [key, item] of Object.entries(shipPieces)){
            let currentBeginning = Helper.parsePartOfStringToReplace(
            beginning, 
            'class="' + bsrPieceInteractors.piecesContainerId + '"', 
            'class="' + bsrPieceInteractors.piecesContainerId + " " + bsrPieceInteractors.piecesContainerId + "--" + key + '"'
            );
            let uppercaseKey = key.charAt(0).toUpperCase() + key.substring(1, key.length);
            if (uppercaseKey == 'Patrolboat') uppercaseKey = 'Patrol Boat';
            gamePieces = gamePieces + (currentBeginning + uppercaseKey + ': ' + shipCount[key] + item + ending);
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
            }
        }
    }

    // check if there is a winner as of yet
    #checkIfWinner(){
        if(this.#currentPlayInfo.gameover){
            console.log('we got a winner!!!!');
            this.#setGameoverImages();
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
    #getOutcomeIdsWithImagesForUpdating(){
        let ids = this.#getCellIds(this.#currentPlayInfo.piecesClicked);
        let imagesrc = this.#getOutcomeImagesForUpdating(this.#currentPlayInfo.piecesHit)
        return {ids : ids, imageSrcs : imagesrc}
    }

    // return ship images from a bsr data table over the given buttons after a game over
    #getGameoverShipImages(bsrPiecesData = new BsrPiecesData()){
        let ids = this.#getCellIds(bsrPiecesData.getAllPiecesLocationsLeft());
        let imagesrc = bsrPiecesData.getAllPiecesImagesLeft();
        return {ids : ids, imageSrcs : imagesrc}
    }

    //-------------------------------------------------------------------------
    // runtime methods

    #checkPlayerVsAiGameover = () => {
        this.#currentPlayInfo = BsrPlayerAiInteractions.setGameover(this.#playerPiecesData, this.#aiPlayer.getAiPiecesData(), this.#currentPlayInfo);
        this.#checkIfWinner();
    }

    // functions to run on ai "thinking" wait time
    #aiThinkingWaitTimeFunctions = () => {
        this.#setChosenPiecesOutcome();
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
                this.#setChosenPiecesOutcome();
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
    #playRuntime(){
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
    // callable anonymous functions for use with events

    // load the player grid with all the pieces in some element(s)
    loadPlayingGrids = function(elementOne, elementTwo){
        if (elementTwo){
            elementOne.innerHTML = this.getPlayerGrid().getGrid();
            elementTwo.innerHTML = this.getButtonsGrid().getGrid();
        }
        else{
            let gridSpacer = '<div id="bsr__gridspacer" class="bsr__gridspacer"></div>';
            elementOne.innerHTML = this.getPlayerGrid().getGrid() + gridSpacer + this.getButtonsGrid().getGrid();
        }
    }

    // set the clicked button as disabled
    #setButtonsDisabled = function(){
        let pieces = this.#getDisabledPushButtons();
        if(pieces && this.#playerTurn){
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
        // update the proper ship information if it exists
        if (this.#playerShipInfoElement){
            this.#updatedPlayerInfo(this.#playerShipInfoElement, this.#playerPiecesData);
        }
        if (this.#enemyShipInfoElement){
            this.#updatedPlayerInfo(this.#enemyShipInfoElement, this.#aiPlayer.getAiPiecesData());
        }
        let pieces = this.#getOutcomeIdsWithImagesForUpdating();
        // console.log(pieces);
        let ids = pieces.ids;
        let srcs = pieces.imageSrcs;
        let length = ids.length;
        for (let i = 0; i < length; i++){
            let allSameCellIds = document.querySelectorAll("[id='" + ids[i] + "']");
            //console.log(allSameCellIds);
            // the programming only works for 2 players at the moment, will have to change if more players
            // playing at once is desired
            // other players grid
            if(this.#currentPlayInfo.playerTurn == this.#playerNumber){
                let images = allSameCellIds[1].children[0].innerHTML;
                allSameCellIds[1].innerHTML = images;
                allSameCellIds[1].children[1].src = srcs[i];
            }
            // client player grid
            if(this.#currentPlayInfo.playerTurn != this.#playerNumber){
                allSameCellIds[0].children[0].children[1].src = srcs[i]
            }
        }
    }

    // set pieces ship images after the game is over
    #setGameoverImages = () =>{
        let pieces = {}
        if (this.#isPlayingAgainstAi){
            pieces = this.#getGameoverShipImages(this.#aiPlayer.getAiPiecesDataUntouched());
        }
        //console.log(pieces);
        let ids = pieces.ids;
        let srcs = pieces.imageSrcs;
        let length = ids.length;
        for (let i = 0; i < length; i++){
            let allSameCellIds = document.querySelectorAll("[id='" + ids[i] + "']");
            //console.log(allSameCellIds);
            // if the button is not disabled (does not have proper image elements for setting up pieces), 
            // create disabled button and put images into cell
            if (allSameCellIds[1].children[0].nodeName == 'BUTTON'){
                allSameCellIds[1].innerHTML = this.#buttonGrid.getGridButtonDisabled();
                let images = allSameCellIds[1].children[0].innerHTML;
                allSameCellIds[1].innerHTML = images;
            }
            // if our child node is an image (meaning we can put the ship image in the src), use the ship image
            if (allSameCellIds[1].children[0].nodeName == 'IMG'){
                allSameCellIds[1].children[0].src = srcs[i];
            }
        }
    }

    // update player info
    #updatedPlayerInfo = (infoElement, bsrPiecesData) => {
        infoElement.innerHTML = this.getUpdatedPieces(bsrPiecesData);
    }

    // set the updated player info by element pieces
    setUpdatedPlayerInfo(playerShipsInfoElement, enemyShipsInfoElement){
        this.#playerShipInfoElement = playerShipsInfoElement;
        this.#enemyShipInfoElement = enemyShipsInfoElement;
        this.#updatedPlayerInfo(playerShipsInfoElement, this.#playerPiecesData);
        this.#updatedPlayerInfo(enemyShipsInfoElement, this.#aiPlayer.getAiPiecesData());
    }

    // set the event listeners of the grid buttons
    setEventListenersOfGridButtons = function(){
        let x = document.querySelectorAll("[id='" + bsrGridInternals.boardButtonId + "']");
        x.forEach(item => {
            item.addEventListener("click", elemItem =>{
            //console.log(elemItem.target);
            this.#setClickedButtonInfo(elemItem.target);
            this.#setButtonsDisabled();
            this.#playRuntime();
            //console.log(this.#playerPiecesData.getPiecesDataTable());
            console.log('player pieces left', this.#playerPiecesData.getPiecesLeftThatHaveLocations());
            })
        })
    }


}