// abstraction class for play.js (ease of use)

import { BsrPlay } from "./bsr-play.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { BsrFetchMethods } from "./bsr-fetch.js";
import { bsrAudio, bsrGridInternals } from "./bsr-config.js";
import { Helper } from "./helper.js";

export { BsrPlayAbstraction };

class BsrPlayAbstraction{
    
    #play;

    #gridContainerElement;
    #textInfoElement;
    #playerShipInfoElement;
    #enemyShipInfoElement;
    #quitElement;

    #playerPushAudio;
    #enemyPushAudio;
    #hitAudio;
    #missAudio;
    #sunkAudio;
    #winAudio;
    #loseAudio;


    constructor(bsrPlayerPiecesData = new BsrPiecesData(), fetchMethods = new BsrFetchMethods()){

        // need new bsr play setup
        this.#play = new BsrPlay(bsrPlayerPiecesData, fetchMethods);

        // set functions to run during overall play runtime
        //this.#play.setOutsideFunctionsToRunOnInitialization(() => this.updateTextInfo(this.#textInfoElement));
        this.#play.setOutsideFunctionsToRunOnPlayRuntime(() => this.setChosenPiecesOutcome());
        this.#play.setOutsideFunctionToRunOnWin(() => this.setGameoverImages());
        this.#play.setOutsideFunctionToRunOnWin(() => this.updateTextInfo(this.#textInfoElement));

        // for updating parts in game
        this.#gridContainerElement;
        this.#textInfoElement;
        this.#playerShipInfoElement;
        this.#enemyShipInfoElement;
        this.#quitElement;

        // audio for various interactions
        this.#playerPushAudio = new Audio(bsrAudio.playerPush);
        this.#enemyPushAudio = new Audio(bsrAudio.enemyPush);
        this.#hitAudio = new Audio(bsrAudio.hit);
        this.#missAudio = new Audio(bsrAudio.miss);
        this.#sunkAudio = new Audio(bsrAudio.sunk);
        this.#winAudio = new Audio(bsrAudio.win);
        this.#loseAudio = new Audio(bsrAudio.lose);

    }

    // load the player grid with all the pieces in some element(s)
    loadPlayingGrids(elementOne, elementTwo){
        if (elementTwo){
            elementOne.innerHTML = this.#play.getPlayerGrid().getGrid();
            elementTwo.innerHTML = this.#play.getButtonsGrid().getGrid();
        }
        else{
            const gridSpacer = '<div id="bsr__gridspacer" class="bsr__gridspacer"></div>';
            elementOne.innerHTML = this.#play.getPlayerGrid().getGrid() + gridSpacer + this.#play.getButtonsGrid().getGrid();
        }
    }

    // set the event handler for grid buttons being pushed disabling them
    #setButtonsPushDisabled(){
        let pieces = this.#play.getDisabledPushButtons();
        //console.log(pieces);
        if(pieces && this.#play.checkIfPlayerTurn()){
            let allButtonsSize = Object.keys(pieces).length;
            for (let i = 0; i < allButtonsSize; i++){
                let key = Object.keys(pieces)[i];
                let allSameCellIds = document.querySelectorAll("[id='" + key + "']");
                // coded to work with 2 grids for now, just use second occurence of id
                allSameCellIds[1].innerHTML = pieces[key];
            }
        }
    }

    // check if a given grid clicked piece can exist or not from the current clicked piece updated
    // (checks if returned clicked grid piece is NaN), used for multiplayer purposes
    #checkIfPieceCanBePlayed(){

        let currentPlayInfo = this.#play.getCurrentPlayInfo();
        let isNanPiece = Number.isNaN(currentPlayInfo.piecesClicked[0][0]);
        
        if (isNanPiece){
            return false;
        }

        return true;

    }

    // update certain things on a chosen pieces outcome
    #chosenPieceOutcomeUpdates(){

        let currentPlayInfo = this.#play.getCurrentPlayInfo();

        // update our text info
        if (this.#textInfoElement){
            this.updateTextInfo(this.#textInfoElement);
        }

        if (this.#checkIfPieceCanBePlayed()){

            let playingAgainstAi = this.#play.checkIfPlayingAgainstAi();

            if (playingAgainstAi){

                // update the proper ship information if it exists
                if (this.#playerShipInfoElement && !this.#play.checkIfPlayerTurn()){
                    this.updatePlayerInfo(this.#playerShipInfoElement, this.#play.getPlayerPiecesCount());
                    this.#playerPushAudio.play();
                }
                if (this.#enemyShipInfoElement && this.#play.checkIfPlayerTurn()){
                    this.updatePlayerInfo(this.#enemyShipInfoElement, this.#play.getEnemyPiecesCount());
                    this.#enemyPushAudio.play();
                }

            }

            if (!playingAgainstAi){

                // update the proper ship information if it exists
                if (this.#playerShipInfoElement && this.#play.checkIfPlayerTurn()){
                    this.updatePlayerInfo(this.#playerShipInfoElement, this.#play.getPlayerPiecesCount());
                    this.#playerPushAudio.play();
                }
                if (this.#enemyShipInfoElement && !this.#play.checkIfPlayerTurn()){
                    this.updatePlayerInfo(this.#enemyShipInfoElement, this.#play.getEnemyPiecesCount());
                    this.#enemyPushAudio.play();
                }

            }

    
            // check if we hit or missed a piece to play proper audio
            let checkHit = Helper.checkIfValueIsInArray(true, currentPlayInfo.piecesHit);
            if (checkHit){
                this.#hitAudio.play();
            }
            if (!checkHit){
                this.#missAudio.play();
            }
    
            // check if we have suken 1 or more ships
            if (currentPlayInfo.pieceName){
                this.#sunkAudio.play();
            }

        }

    }

    // set pieces after they have been checked and sent back after ai/server updates
    setChosenPiecesOutcome(){

        //console.log('ran pieces outcome');
        this.#chosenPieceOutcomeUpdates();

        if (this.#checkIfPieceCanBePlayed()){

            let pieces = this.#play.getOutcomeIdsWithImagesForUpdating();
            let currentPlayInfo = this.#play.getCurrentPlayInfo();
            let currentTurn = currentPlayInfo.playerTurn;
            let playerTurn = this.#play.getPlayerNumber();
            let playingAgainstAi = this.#play.checkIfPlayingAgainstAi();
            //console.log(pieces);
            let ids = pieces.ids;
            let srcs = pieces.imageSrcs;
            let length = ids.length;
            for (let i = 0; i < length; i++){

                let allSameCellIds = document.querySelectorAll("[id='" + ids[i] + "']");
                //console.log(allSameCellIds);

                // the programming only works for 2 players at the moment, will have to change if more players
                // playing at once is desired

                // if we are playing against the ai
                if (playingAgainstAi){

                    // other players grid
                    if(currentTurn == playerTurn){

                        let images = allSameCellIds[1].children[0].innerHTML;
                        allSameCellIds[1].innerHTML = images;
                        allSameCellIds[1].children[1].classList.add("bsr--appear-quick");
                        allSameCellIds[1].children[1].src = srcs[i];
    
                    }
    
                    // client player grid
                    if(currentTurn != playerTurn){
    
                        allSameCellIds[0].children[0].children[1].classList.add("bsr--appear-quick");
                        allSameCellIds[0].children[0].children[1].src = srcs[i]
    
                    }

                }

                // if we are playing against another player
                if (!playingAgainstAi){

                    // other players grid
                    if(currentTurn == playerTurn){

                        allSameCellIds[0].children[0].children[1].classList.add("bsr--appear-quick");
                        allSameCellIds[0].children[0].children[1].src = srcs[i];
    
                    }
    
                    // client player grid
                    if(currentTurn != playerTurn){

                        let images = allSameCellIds[1].children[0].innerHTML;
                        allSameCellIds[1].innerHTML = images;
                        allSameCellIds[1].children[1].classList.add("bsr--appear-quick");
                        allSameCellIds[1].children[1].src = srcs[i];
    
                    }

                }

            }

        }

    }

    // update certain things on gameover
    #gameoverUpdates(){
        let currentPlayInfo = this.#play.getCurrentPlayInfo();
        // check if it is gameover and play right audio for such (at the moment this works with 2 players)
        if (currentPlayInfo.gameover){
            if (currentPlayInfo.playerTurn != this.#play.getPlayerNumber()){
                this.#loseAudio.play();
            }
            if (currentPlayInfo.playerTurn == this.#play.getPlayerNumber()){
                this.#winAudio.play();
            }
        }
    }

    // set button grids ship images after the game is over
    setGameoverImages(){
        this.#gameoverUpdates();
        let pieces = this.#play.getGameoverShipIdsWithImages();
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
                allSameCellIds[1].innerHTML = this.#play.getButtonsGrid().getGridButtonDisabled();
                let images = allSameCellIds[1].children[0].innerHTML;
                allSameCellIds[1].innerHTML = images;
            }
            // if our child node is an image (meaning we can put the ship image in the src), use the ship image
            if (allSameCellIds[1].children[0].nodeName == 'IMG'){
                allSameCellIds[1].children[0].src = srcs[i];
            }
        }
    }

    // update text info
    updateTextInfo(infoElement){
        infoElement.innerHTML = this.#play.getCurrentPlayInfoString();
    }

    // update player info
    updatePlayerInfo(shipInfoElement, bsrPiecesCount = {}){
        shipInfoElement.innerHTML = this.#play.getUpdatedPiecesInfo(bsrPiecesCount);
    }

    // set the updated player info by element pieces
    setUpdatePlayerInfo(textInfoElement, playerShipsInfoElement, enemyShipsInfoElement){
        this.#textInfoElement = textInfoElement;
        this.#playerShipInfoElement = playerShipsInfoElement;
        this.#enemyShipInfoElement = enemyShipsInfoElement;
        this.updateTextInfo(textInfoElement);
        this.updatePlayerInfo(playerShipsInfoElement, this.#play.getPlayerPiecesCount());
        this.updatePlayerInfo(enemyShipsInfoElement, this.#play.getEnemyPiecesCount());
    }

    // set the event listeners of the grid buttons
    setEventListenersOfGridButtons(){
        let x = document.querySelectorAll("[id='" + bsrGridInternals.boardButtonId + "']");
        x.forEach(item => {
            item.addEventListener("click", elemItem =>{
            //console.log(elemItem.target);
            if (!this.#play.getCurrentPlayInfo().gameover){
                this.#play.setClickedButtonInfo(elemItem.target);
                this.#setButtonsPushDisabled();
                this.#play.playRuntime();
            }
            //console.log(this.#playerPiecesData.getPiecesDataTable());
            //console.log('player pieces left', this.#play.getPlayerPiecesData().getPiecesLeftThatHaveLocations());
            })
        })
    }

    // set the quitting element to stop play from updating over and over
    setQuitElement(quitElement){
        this.#quitElement = quitElement.children[0];
        quitElement.addEventListener("click", () => {
            this.#play.clearRuntimeInterval();
        })
    }

    // quick way to setup all the various game elements
    initializePlay(gridContainerElement, textInfoElement, playerShipInfoElement, enemyShipInfoElement, quitElement){
        
        this.loadPlayingGrids(gridContainerElement);
        this.setEventListenersOfGridButtons();
        this.setUpdatePlayerInfo(textInfoElement, playerShipInfoElement, enemyShipInfoElement);
        this.setQuitElement(quitElement);

    }

  }
