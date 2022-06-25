// abstraction class for play.js (ease of use)

import { BsrPlay } from "./bsr-play.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { bsrGridInternals } from "./bsr-config.js";

export { BsrPlayAbstraction };

class BsrPlayAbstraction{
    
    #play;

    #gridContainerElement;
    #textInfoElement;
    #playerShipInfoElement;
    #enemyShipInfoElement;

    constructor(bsrPlayerPiecesData = new BsrPiecesData(), isPlayingAgainstAi = true){

        // need new bsr play setup
        this.#play = new BsrPlay(bsrPlayerPiecesData, isPlayingAgainstAi);

        // for updating parts in game
        this.#gridContainerElement;
        this.#textInfoElement;
        this.#playerShipInfoElement;
        this.#enemyShipInfoElement;
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

    // set pieces after they have been checked and sent back after ai/server updates
    setChosenPiecesOutcome(){
        //console.log('ran pieces outcome');
        if (this.#textInfoElement){
            this.updateTextInfo(this.#textInfoElement);
        }
        // update the proper ship information if it exists
        if (this.#playerShipInfoElement && !this.#play.checkIfPlayerTurn()){
            this.updatePlayerInfo(this.#playerShipInfoElement, this.#play.getPlayerPiecesData());
        }
        if (this.#enemyShipInfoElement && this.#play.checkIfPlayerTurn()){
            this.updatePlayerInfo(this.#enemyShipInfoElement, this.#play.getAiPiecesData());
        }
        let pieces = this.#play.getOutcomeIdsWithImagesForUpdating();
        let currentTurn = this.#play.getCurrentPlayInfo().playerTurn;
        let playerTurn = this.#play.getPlayerNumber();
        //console.log(pieces);
        let ids = pieces.ids;
        let srcs = pieces.imageSrcs;
        let length = ids.length;
        for (let i = 0; i < length; i++){
            let allSameCellIds = document.querySelectorAll("[id='" + ids[i] + "']");
            //console.log(allSameCellIds);
            // the programming only works for 2 players at the moment, will have to change if more players
            // playing at once is desired
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
    }

    // set button grids ship images after the game is over
    setGameoverImages(){
        let pieces = {}
        if (this.#play.checkIfPlayingAgainstAi()){
            pieces = this.#play.getGameoverShipIdsWithImages(this.#play.getOriginalAiPiecesData());
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
    updatePlayerInfo(shipInfoElement, bsrPiecesData){
        shipInfoElement.innerHTML = this.#play.getUpdatedPiecesInfo(bsrPiecesData.getPiecesLeftThatHaveLocations());
    }

    // set the updated player info by element pieces
    setUpdatePlayerInfo(textInfoElement, playerShipsInfoElement, enemyShipsInfoElement){
        this.#textInfoElement = textInfoElement;
        this.#playerShipInfoElement = playerShipsInfoElement;
        this.#enemyShipInfoElement = enemyShipsInfoElement;
        this.updateTextInfo(textInfoElement);
        this.updatePlayerInfo(playerShipsInfoElement, this.#play.getPlayerPiecesData());
        this.updatePlayerInfo(enemyShipsInfoElement, this.#play.getAiPiecesData());
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

    // quick way to setup all the various game elements
    initializePlay(gridContainerElement, textInfoElement, playerShipInfoElement, enemyShipInfoElement){
        this.loadPlayingGrids(gridContainerElement);
        this.setEventListenersOfGridButtons();
        this.setUpdatePlayerInfo(textInfoElement, playerShipInfoElement, enemyShipInfoElement);

        // set functions to run during overall play runtime
        //this.#play.setOutsideFunctionsToRunOnInitialization(() => this.updateTextInfo(this.#textInfoElement));
        this.#play.setOutsideFunctionsToRunOnPlayRuntime(() => this.setChosenPiecesOutcome());
        this.#play.setOutsideFunctionToRunOnWin(() => this.setGameoverImages());
        this.#play.setOutsideFunctionToRunOnWin(() => this.updateTextInfo(this.#textInfoElement));
    }

  }
