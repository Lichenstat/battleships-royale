// class to have various play methods to check for in the game

import { BsrCreateGrids } from "./bsr-creategrids.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { BsrPlayParse } from "./bsr-playparse.js";
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

    #lastPlayerPiecesCount;
    #lastEnemyPiecesCount;

    #playerDefaultGridCellId;

    #playerGrid;
    #buttonGrid;
    //#hitImg;
    //#missImg;

    #playerNumber;
    //#playingAgainstAi;

    #buttonParentId;
    #buttonLocation;
    #hasButtonUpdated;
    
    //#setTimer;

    #playerTurn;
    //#gameover;

    #runtimeFunctions;
    #runOnWinFunctions;

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

        this.#lastPlayerPiecesCount = this.#playerPiecesData.getPiecesLeftThatHaveLocations();
        this.#lastEnemyPiecesCount = this.#aiPlayer.getAiPiecesData().getPiecesLeftThatHaveLocations();

        this.#playerDefaultGridCellId = "bsr__table-cell-(0,0)";

        this.#playerGrid = BsrCreateGrids.getPlayerGrid(this.#playerPiecesData);
        this.#buttonGrid = BsrCreateGrids.getButtonGrid();
        //this.#hitImg = bsrGeneralInfo.hitImage;
        //this.#missImg = bsrGeneralInfo.missImage;
        
        this.#playerNumber  = this.#playSetupInfo.playerNumber;
        //this.#playingAgainstAi = false;
        
        this.#buttonParentId = "";
        this.#buttonLocation = [this.#currentPlayInfo.piecesClicked];
        this.#hasButtonUpdated = false;
        
        //this.#setTimer = 1000; // 1000 = 1 sec

        this.#playerTurn = true;
        //this.#gameover = this.#currentPlayInfo.gameover;

        //------------------------------------------------

        // assign functions from the outside to run on updates
        this.#runtimeFunctions = [];
        this.#runOnWinFunctions = [];

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
        if (this.#currentPlayInfo.playerTurn == this.#playerNumber){
            return true;
        }
        return false;
    }

    // check if we are playing agianst ai or not
    checkIfPlayingAgainstAi(){
        return this.#isPlayingAgainstAi;
    }

    //// call if we will want to play against ai
    //setPlayingAgainstAi(){
    //    this.#playingAgainstAi = true;
    //}

    // get the updated ship pieces info
    getUpdatedPiecesInfo(bsrPiecesCount = {}){
        let gamePieces = ''
        let container = bsrPieceInteractors.piecesContainer;
        let beginning = container.substring(0, container.indexOf('>') + 1);
        let ending = container.substring(container.lastIndexOf('<'), container.length);
        let shipPieces = this.#playerPiecesData.getPlacementPieces(bsrGeneralInfo.horizontal);
        let shipCount = bsrPiecesCount;
        for (const [key, item] of Object.entries(shipPieces)){
            // if a piece was set as a changing piece, make sure the container blinks to show that
            let change = " ";
            if (key == this.#currentPlayInfo.pieceName){
                change = " bsr--blink-red ";
            }
            let currentBeginning = Helper.parsePartOfStringToReplace(
            beginning, 
            'class="' + bsrPieceInteractors.piecesContainerId + '"', 
            'class="' + bsrPieceInteractors.piecesContainerId + change + bsrPieceInteractors.piecesContainerId + "--" + key + '"'
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

    //// check if there is a winner as of yet
    //#checkIfWinner(){
    //    if(this.#currentPlayInfo.gameover){
    //        
    //    }
    //}

    // set an outside function in the outside functions array to run on game update
    setOutsideFunctionsToRunOnPlayRuntime(func = function(){}){
        this.#runtimeFunctions.push(func);
    }

    // set an outside function in the outside functions array to run on game win
    setOutsideFunctionToRunOnWin(func = function(){}){
        this.#runOnWinFunctions.push(func);
    }

    // run array of functions on player update
    #runOnGameUpdate(){
        this.#runtimeFunctions.forEach(
            func => {
                console.log(func);
                func();
            }
        )
    }

    // run functions on a player win
    #runOnWin = (func = function(){}) => {
        if (this.#currentPlayInfo.gameover){
            this.#runOnWinFunctions.forEach(
                func => {
                    func();
                }
            );
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

    // get current play info as text string (works for 1 hit location as of right now)
    getCurrentPlayInfoString(){
        let clicked  = BsrPlayParse.convertIndexLocationToBattleshipIndexLocation(this.#currentPlayInfo.piecesClicked[0]);
        // hit or miss
        let hitMiss= '';
        if (this.#currentPlayInfo.piecesHit[0]){
            hitMiss = 'Hit!'
        }
        if (!this.#currentPlayInfo.piecesHit[0]){
            hitMiss = 'Miss...'
        }
        if (Helper.checkIfArraysAreEqual(this.#currentPlayInfo.piecesClicked[0], [])){
            hitMiss = '--------'
        }
        // has piece sunk
        let pieceSunk = "";
        if (this.#currentPlayInfo.pieceName){
            pieceSunk = Helper.parsePartOfStringToReplace(this.#currentPlayInfo.pieceName, "patrolboat", "Patrol Boat");
            pieceSunk = Helper.capitalizeFirstCharacterInString(pieceSunk);
            pieceSunk = "Sank " + pieceSunk + "!"
        }
        // whos turn is it
        let turn = this.#currentPlayInfo.playerTurn;
        let turnString = '';
        if (this.#playerTurn) {turnString = "- Your Turn -";}
        if (!this.#playerTurn) {turnString = "- Enemy Turn -";}
        // is it gameover and who won
        if (this.#currentPlayInfo.gameover){
            let outcome = '';
            if (turn == this.#playerNumber){outcome = "You Won!";} //console.log('for the win')}
            if (turn != this.#playerNumber){outcome = "You Lost...";} //console.log('for the loss');}
            //console.log('turn on gameover: ', this.#currentPlayInfo.playerTurn);
            //console.log('we will now have game over <----------');
            return "- Game Over -<br>" + outcome;
        }
        return clicked + "<br>" + hitMiss + "<br>" + pieceSunk + "<br>" + turnString;
    }

    //-------------------------------------------------------------------------
    // runtime methods

    // check if the player vs ai game is over
    #checkPlayerVsAiGameover(){
        this.#currentPlayInfo = BsrPlayerAiInteractions.setGameoverIfNeeded(this.#playerPiecesData, this.#aiPlayer.getAiPiecesData(), this.#currentPlayInfo);
        this.#runOnWin();
    }

    // functions to run on ai "thinking" wait time
    #aiThinkingWaitTimeFunctions = () => {
        //this.#setChosenPiecesOutcome();
        this.#hasInfoUpdated = true;
        this.#playerTurn = true;
        this.#runOnGameUpdate();
        this.#checkPlayerVsAiGameover();
        this.#currentPlayInfo = BsrPlayerAiInteractions.setCurrentTurn(this.#currentPlayInfo);
    }
    
    // runtime functions/methods to take place if the player is fighting against an ai
    #vsAiRuntime(){
        if(this.#currentPlayInfo.playerTurn == this.#playerNumber && !this.#currentPlayInfo.gameover){
            if(this.#hasButtonUpdated){
                console.log('player attacked');
                this.#currentPlayInfo.piecesClicked = this.#buttonLocation;
                this.#currentPlayInfo = BsrPlayerAiInteractions.checkIfHitOrMiss(this.#aiPlayer.getAiPiecesData(), this.#currentPlayInfo);
                let newPiecesCount = this.#aiPlayer.getAiPiecesData().getPiecesLeftThatHaveLocations();
                this.#currentPlayInfo = BsrPlayerAiInteractions.getChangeInPiecesCount(newPiecesCount, this.#lastEnemyPiecesCount, this.#currentPlayInfo);
                this.#lastEnemyPiecesCount = newPiecesCount
                //console.log(this.#currentPlayInfo);
                //this.#setChosenPiecesOutcome();
                this.#hasInfoUpdated = true;
                this.#hasButtonUpdated = false;
                this.#playerTurn = false;
                this.#runOnGameUpdate();
                this.#checkPlayerVsAiGameover();
                this.#currentPlayInfo = BsrPlayerAiInteractions.setCurrentTurn(this.#currentPlayInfo);
            }
        }
        if(this.#currentPlayInfo.playerTurn != this.#playerNumber && !this.#currentPlayInfo.gameover){
            console.log("ai attacked");
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