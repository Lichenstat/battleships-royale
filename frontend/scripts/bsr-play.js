// class to have various play methods to check for in the game

import { BsrCreateGrids } from "./bsr-creategrids.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { BsrPlayParse } from "./bsr-playparse.js";
import { BsrAi } from "./bsr-ai.js";
import { BsrFetchMethods } from "./bsr-fetch.js";
import { BsrPlayerAiInteractions } from "./bsr-aiplayerinteractions.js";
import { bsrGeneralInfo, bsrGridInternals, bsrPieceInteractors } from "./bsr-config.js";
import { Helper } from "./helper.js";

export { BsrPlay };

class BsrPlay {

    #playerPiecesData;
    #fetchMethods;
    #isPlayingAgainstAi;
    #aiPlayer;

    #playSetupInfo;
    #currentPlayInfo;

    #lastPlayerPiecesCount;
    #lastEnemyPiecesCount;

    #hasInfoUpdated;

    #playerDefaultGridCellId;

    #playerGrid;
    #buttonGrid;

    #buttonParentId;
    #buttonLocation;
    #hasButtonUpdated;

    #intervalTimer;

    #finishedLastTurn;
    #playerCanUseButtons;
    #gameOverHasHappened;

    #initialized;
    #runInitializationFunctions;
    #runtimeFunctions;
    #runOnWinFunctions;

    #intervalRuntime;

    constructor(playerPiecesData = new BsrPiecesData(), fetchMethods = new BsrFetchMethods()) {

        this.#playerPiecesData = playerPiecesData;
        this.#fetchMethods = fetchMethods;
        this.#isPlayingAgainstAi = false;
        this.#aiPlayer = false;

        // the player number set for the game (thier number is their turn)
        this.#playSetupInfo = { playerNumber: 0 }

        // current play info to be updated as game progresses to get various info about the game
        this.#currentPlayInfo = { playerTurn: 1, piecesClicked: [[]], piecesHit: [], pieceName: "", gameover: false, bsrPiecesData: {} }

        // set player last pieces count
        this.#lastPlayerPiecesCount = this.#playerPiecesData.getPiecesLeftThatHaveLocations();

        // if we are playing against another player
        if (this.#fetchMethods.getConnectedState()) {

            // for now use original player to get a modifiable pieces count for multiplayer use
            this.#lastEnemyPiecesCount = this.#playerPiecesData.getPiecesLeftThatHaveLocations();
            this.#fetchMethods.setReadyState(false);
            this.#fetchMethods.setupInitialGame(this.#playerPiecesData, this.#playSetupInfo);
            this.#playerCanUseButtons = false;

        }

        // otherwise we are playing against the ai
        else {

            this.#isPlayingAgainstAi = true;
            this.#aiPlayer = new BsrAi();
            this.#lastEnemyPiecesCount = this.#aiPlayer.getAiPiecesData().getPiecesLeftThatHaveLocations();
            this.#playSetupInfo = { playerNumber: 1 }
            this.#currentPlayInfo = { playerTurn: 1, piecesClicked: [[]], piecesHit: [], pieceName: "", gameover: false, bsrPiecesData: {} }
            this.#currentPlayInfo.bsrPiecesData = this.getOriginalAiPiecesData();
            this.#playerCanUseButtons = true;
            
        }

        this.#hasInfoUpdated = {updated : false};

        this.#playerDefaultGridCellId = "bsr__table-cell-(0,0)";

        this.#playerGrid = BsrCreateGrids.getPlayerGrid(this.#playerPiecesData);
        this.#buttonGrid = BsrCreateGrids.getButtonGrid();

        this.#buttonParentId = "";
        this.#buttonLocation = [this.#currentPlayInfo.piecesClicked];
        this.#hasButtonUpdated = false;

        this.#intervalTimer = 1000; // 1000 = 1 sec

        this.#finishedLastTurn = true;
        this.#gameOverHasHappened = false;

        //------------------------------------------------

        // assign functions from the outside to run on updates
        this.#initialized = false;
        this.#runInitializationFunctions = [];
        this.#runtimeFunctions = [];
        this.#runOnWinFunctions = [];

        //-------------------------------------------------

        // interval to do game checking for updates from server during play runtime
        // (if we are playing aginst another player that is)
        if (!this.#isPlayingAgainstAi){
            this.#intervalRuntime = setInterval(() => {
                //console.log("checking for game update");
                this.#fetchMethods.checkUpdateInformation(this.#currentPlayInfo, this.#hasInfoUpdated);
                this.playRuntime();
                //console.log(this.#currentPlayInfo);
            }, this.#intervalTimer);
        }

    }

    // clear the runtime interval of play
    clearRuntimeInterval(){
        clearInterval(this.#intervalRuntime);
    }

    // get player pieces data
    getPlayerPiecesData() {
        return this.#playerPiecesData
    }

    // get the player pieces count
    getPlayerPiecesCount() {
        return this.#lastPlayerPiecesCount;
    }

    // get ai pieces data
    getAiPiecesData() {
        return this.#aiPlayer.getAiPiecesData();
    }

    // get the enemy pieces count
    getEnemyPiecesCount() {
        return this.#lastEnemyPiecesCount;
    }

    // get ai pieces original data
    getOriginalAiPiecesData() {
        return this.#aiPlayer.getAiPiecesDataUntouched();
    }

    // get the current gameover ship bsrPiecesData with its id's and images
    getGameoverShipIdsWithImages() {
        return this.#getGameoverShipIdsWithImages(this.#currentPlayInfo.bsrPiecesData);
    }

    // return the player grid
    getPlayerGrid() {
        return this.#playerGrid;
    }

    // reutrn the buttons grid
    getButtonsGrid() {
        return this.#buttonGrid;
    }

    // get the current play info
    getCurrentPlayInfo() {
        return this.#currentPlayInfo;
    }

    // get player currently playing the game
    getCurrentPlayerTurn() {
        return this.#currentPlayInfo.playerTurn;
    }

    // get the current player number (if it is the players number it is his turn)
    getPlayerNumber() {
        return this.#playSetupInfo.playerNumber;
    }

    // check if it is our players turn or not
    checkIfPlayerTurn() {
        if (this.#currentPlayInfo.playerTurn == this.#playSetupInfo.playerNumber) {
            return true;
        }
        return false;
    }

    // check if a wole turn has finished or not
    checkIfFinishedLastTurn(){
        return this.#finishedLastTurn;
    }

    // check if we are playing agianst ai or not
    checkIfPlayingAgainstAi() {
        return this.#isPlayingAgainstAi;
    }

    // get the updated ship pieces info
    getUpdatedPiecesInfo(bsrPiecesCount = {}) {
        let gamePieces = ''
        let container = bsrPieceInteractors.piecesContainer;
        let beginning = container.substring(0, container.indexOf('>') + 1);
        let ending = container.substring(container.lastIndexOf('<'), container.length);
        let shipPieces = this.#playerPiecesData.getPlacementPieces(bsrGeneralInfo.horizontal);
        let shipCount = bsrPiecesCount;
        for (const [key, item] of Object.entries(shipPieces)) {
            // if a piece was set as a changing piece, make sure the container blinks to show that
            let change = " ";
            if (key == this.#currentPlayInfo.pieceName) {
                change = " bsr--blink-red ";
            }
            let currentBeginning = Helper.parsePartOfStringToReplace(
                beginning,
                'class="' + bsrPieceInteractors.piecesContainerId + '"',
                'class="' + bsrPieceInteractors.piecesContainerId + change + bsrPieceInteractors.piecesContainerId + "--" + key + '"'
            );
            let uppercaseKey = key.charAt(0).toUpperCase() + key.substring(1, key.length);
            if (uppercaseKey == 'Patrolboat') {
                uppercaseKey = 'Patrol Boat';
            }
            let count = 0;
            if (shipCount != undefined) {
                count = shipCount[key];
            }
            gamePieces = gamePieces + (currentBeginning + uppercaseKey + ': ' + count + item + ending);
        }
        return gamePieces;
    }

    // set information about the clicked button
    setClickedButtonInfo(button) {

        // if its the players turn
        let ourTurn = this.checkIfPlayerTurn();
        if (ourTurn && this.#finishedLastTurn && this.#playerCanUseButtons) {

            // and our button is not disabled
            if (!button.disabled) {

                // set button clicked information
                this.#buttonParentId = button.parentNode.id;
                this.#buttonLocation = [Helper.parseElementIdForMatrixLocation(this.#buttonParentId)];
                this.#hasButtonUpdated = true;

                // if we are not playing against ai, we are playing aginst player
                if (!this.#isPlayingAgainstAi){
                    this.#fetchMethods.playerMove(this.#buttonLocation);
                    this.#playerCanUseButtons = false;
                }

            }

        }

    }

    // set outside functions to run on initialization
    setOutsideFunctionsToRunOnInitialization(func = function () { }) {
        this.#runInitializationFunctions.push(func);
    }

    // set an outside function in the outside functions array to run on game update
    setOutsideFunctionsToRunOnPlayRuntime(func = function () { }) {
        this.#runtimeFunctions.push(func);
    }

    // set an outside function in the outside functions array to run on game win
    setOutsideFunctionToRunOnWin(func = function () { }) {
        this.#runOnWinFunctions.push(func);
    }

    // run functions on initialization
    #runInitialization() {
        if (!this.#initialized) {
            this.#runInitializationFunctions.forEach(
                func => {
                    func();
                }
            )
            this.#initialized = true;
        }
    }

    // run array of functions on player update
    #runOnGameUpdate() {
        this.#runtimeFunctions.forEach(
            func => {
                func();
            }
        )
    }

    // run functions on a player win
    #runOnWin = (func = function () { }) => {
        if (this.#currentPlayInfo.gameover) {
            this.#runOnWinFunctions.forEach(
                func => {
                    func();
                }
            );
            this.#gameOverHasHappened = true;
        }
    }

    //-------------------------------------------------------------------------
    // updating pieces methods

    // change player/enemy ship count using a stated ship
    #decrementPiecesCount(bsrPiecesCount = {}) {
        // for now the length is only one, in case we decide to change the ships
        // returned piecesName to an array of sunken ships it will work for that in later implementations
        let shipsArray = [this.#currentPlayInfo.pieceName];
        let removeShipLength = shipsArray.length;
        //console.log(this.#currentPlayInfo.pieceName);
        for (let i = 0; i < removeShipLength; i++) {
            if (bsrPiecesCount[shipsArray[i]]) {
                bsrPiecesCount[shipsArray[i]] = bsrPiecesCount[shipsArray[i]] - 1;
            }
        }
        //console.log(bsrPiecesCount);
        //return bsrPiecesCount;
    }

    // get buttons enable or disabled on initial button click
    getDisabledPushButtons() {
        let buttons = {}
        let locationSize = this.#buttonLocation.length;
        for (var i = 0; i < locationSize; i++) {
            let id = Helper.parseElementIdToChangeMatrixLocation(this.#buttonParentId, this.#buttonLocation[i]);
            //console.log(this.#buttonParentId, this.#buttonLocation[i]);
            buttons[id] = this.#buttonGrid.getGridButtonDisabled();
        }
        return buttons;
    }

    // return the cell ids if required for updating
    #getCellIds(locations = [[]]) {
        let setLocationIds = [];
        let size = locations.length;
        for (let i = 0; i < size; i++) {
            let cellId = Helper.parseElementIdToChangeMatrixLocation(this.#playerDefaultGridCellId, locations[i]);
            setLocationIds.push(cellId);
        }
        return setLocationIds;
    }

    // get the proper sources for the images on a hit or miss outcome
    #getOutcomeImagesForUpdating(piecesHit = []) {
        let imageSrc = [];
        let size = piecesHit.length;
        for (let i = 0; i < size; i++) {
            if (piecesHit[i]) {
                imageSrc.push(bsrGridInternals.hitImage);
            }
            if (!piecesHit[i]) {
                imageSrc.push(bsrGridInternals.missImage);
            }
        }
        return imageSrc;
    }

    // return the proper outcome for the given button
    getOutcomeIdsWithImagesForUpdating() {
        let ids = this.#getCellIds(this.#currentPlayInfo.piecesClicked);
        let imagesrc = this.#getOutcomeImagesForUpdating(this.#currentPlayInfo.piecesHit);
        return { ids: ids, imageSrcs: imagesrc }
    }

    // return ship images from a bsr data table over the given buttons after a game over
    #getGameoverShipIdsWithImages(bsrPiecesData = new BsrPiecesData()) {
        let ids = this.#getCellIds(bsrPiecesData.getAllPiecesLocationsLeft());
        let imagesrc = bsrPiecesData.getAllPiecesImagesLeft();
        return { ids: ids, imageSrcs: imagesrc }
    }

    // get current play info as text string (works for 1 hit location as of right now)
    getCurrentPlayInfoString() {

        let clicked = BsrPlayParse.convertIndexLocationToBattleshipIndexLocation(this.#currentPlayInfo.piecesClicked[0]);
        
        // hit or miss
        let hitMiss = '';
        if (this.#currentPlayInfo.piecesHit[0]) {
            hitMiss = 'Hit!';
        }
        if (!this.#currentPlayInfo.piecesHit[0]) {
            hitMiss = 'Miss...';
        }
        if (Helper.checkIfArraysAreEqual(this.#currentPlayInfo.piecesClicked[0], [])) {
            hitMiss = '--------';
        }

        // has piece sunk
        let pieceSunk = "";
        if (this.#currentPlayInfo.pieceName) {
            pieceSunk = Helper.parsePartOfStringToReplace(this.#currentPlayInfo.pieceName, "patrolboat", "Patrol Boat");
            pieceSunk = Helper.capitalizeFirstCharacterInString(pieceSunk);
            pieceSunk = "Sank " + pieceSunk + "!"
        }

        // whos turn is it
        let turn = this.checkIfPlayerTurn();
        let turnString = '';

        if (turn) {
            turnString = "- Your Turn -";
        }
        if (!turn) {
            turnString = "- Enemy Turn -";
        }   

        // if we don't have a turn as of yet (most likely waiting for multiplayer server connection)
        if (this.#playSetupInfo.playerNumber == 0) {
            turnString = "- Waiting For Connection -";
        }

        // is it gameover and who won
        if (this.#currentPlayInfo.gameover) {
            let outcome = '';
            if (!turn) {
                outcome = "You Win!";
            }
            if (turn) {
                outcome = "You Lose...";
            }
            //console.log('turn on gameover: ', this.#currentPlayInfo.playerTurn);
            return "- Game Over -<br>" + outcome;
        }

        return clicked + "<br>" + hitMiss + "<br>" + pieceSunk + "<br>" + turnString;
    }

    //-------------------------------------------------------------------------
    // runtime methods

    // check if the player vs ai game is over
    #checkPlayerVsAiGameover() {
        this.#currentPlayInfo = BsrPlayerAiInteractions.setGameoverIfNeeded(this.#playerPiecesData, this.#aiPlayer.getAiPiecesData(), this.#currentPlayInfo);
        this.#runOnWin();
    }

    // functions to run on ai "thinking" wait time
    #aiThinkingWaitTimeFunctions = () => {
        this.#runOnGameUpdate();
        this.#checkPlayerVsAiGameover();
        this.#finishedLastTurn = true;
    }

    // runtime functions/methods to take place if the player is fighting against an ai
    #vsAiRuntime() {

        // if its the players turn
        if (this.#currentPlayInfo.playerTurn == this.#playSetupInfo.playerNumber && !this.#currentPlayInfo.gameover) {
            
            if (this.#hasButtonUpdated) {
                
                this.#finishedLastTurn = false;
                this.#currentPlayInfo = BsrPlayerAiInteractions.setCurrentTurn(this.#currentPlayInfo);
                console.log(this.#currentPlayInfo);
                //console.log('player attacked');
                this.#currentPlayInfo.piecesClicked = this.#buttonLocation;
                this.#currentPlayInfo = BsrPlayerAiInteractions.checkIfHitOrMiss(this.#aiPlayer.getAiPiecesData(), this.#currentPlayInfo);
                let newPiecesCount = this.#aiPlayer.getAiPiecesData().getPiecesLeftThatHaveLocations();
                this.#currentPlayInfo = BsrPlayerAiInteractions.getChangeInPiecesCount(newPiecesCount, this.#lastEnemyPiecesCount, this.#currentPlayInfo);
                this.#lastEnemyPiecesCount = newPiecesCount
                //console.log(this.#currentPlayInfo);
                //this.#setChosenPiecesOutcome();
                this.#hasButtonUpdated = false;
                this.#runOnGameUpdate();
                this.#checkPlayerVsAiGameover();
            
            }

        }

        // if its the ai's turn
        if (this.#currentPlayInfo.playerTurn != this.#playSetupInfo.playerNumber && !this.#currentPlayInfo.gameover) {
            
            this.#currentPlayInfo = BsrPlayerAiInteractions.setCurrentTurn(this.#currentPlayInfo);
            //console.log("ai attacked");
            console.log(this.#currentPlayInfo);
            let aiLocationChoice = [this.#aiPlayer.getNextAttackLocation()];
            this.#currentPlayInfo.piecesClicked = aiLocationChoice;
            this.#currentPlayInfo = BsrPlayerAiInteractions.checkIfHitOrMiss(this.#playerPiecesData, this.#currentPlayInfo);
            let newPiecesCount = this.#playerPiecesData.getPiecesLeftThatHaveLocations();
            this.#currentPlayInfo = BsrPlayerAiInteractions.getChangeInPiecesCount(newPiecesCount, this.#lastPlayerPiecesCount, this.#currentPlayInfo);
            this.#lastPlayerPiecesCount = newPiecesCount;
            //console.log(this.#playerPiecesData.getPiecesLeftByLocation());
            this.#aiPlayer.checkIfAttackWasSuccessful(this.#currentPlayInfo.piecesHit, this.#playerPiecesData.getPiecesLeftThatHaveLocations());
            //console.log(this.#currentPlayInfo);
            this.#aiPlayer.thinkingWaitTime(this.#aiThinkingWaitTimeFunctions);

        }

    }

    // runtime functions/methods to take place if the player is fighting against an ai
    #vsPlayerRuntime() {

        // if its the players turn
        if (this.#currentPlayInfo.playerTurn == this.#playSetupInfo.playerNumber) {
            
            //console.log("we are running our turn");
            this.#decrementPiecesCount(this.#lastPlayerPiecesCount);
            this.#finishedLastTurn = true;
            this.#playerCanUseButtons = true;
            this.#runOnGameUpdate();
            
        }

        // if its the opponents turn
        if (this.#currentPlayInfo.playerTurn != this.#playSetupInfo.playerNumber) {
            
            //console.log("they are running thier turn");
            this.#decrementPiecesCount(this.#lastEnemyPiecesCount);
            this.#hasButtonUpdated = false;
            this.#finishedLastTurn = false;
            this.#runOnGameUpdate();

        }

        this.#runOnWin();

    }

    // player vs whoever runtime
    playRuntime() {
        //console.log('running');
        this.#runInitialization();
            
            // if we are playing aginst the ai, use the ai runtime
            if (this.#isPlayingAgainstAi) {
                this.#vsAiRuntime();

            }
            
            // if we are playing against the player, use the player runtime
            if (!this.#isPlayingAgainstAi) {
                
                if (this.#hasInfoUpdated.updated && !this.#gameOverHasHappened){
                    
                    //console.log(this.#playSetupInfo);
                    //console.log(this.#currentPlayInfo);
                    this.#hasInfoUpdated.updated = false;
                    this.#vsPlayerRuntime();
                    
                }
                
            }

        //}

    }

    //-------------------------------------------------------------------------

}