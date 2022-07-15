// Fetch abstraction calls for interacting during bsr runtime
import { BsrFetchMethods } from "./bsr-fetch.js";
import { Helper } from "./helper.js";

export { BsrFetchAbstraction };


class BsrFetchAbstraction{

    #fetch;

    #updateInterval;
    #fetchInfoStringDefault;

    #gameStatusElement;
    #gameCodeContainerElement;
    #gameCodeSearchElement;
    #gameReadyElement;

    #gameCodeInput;

    #runtimeFunctions;

    constructor(gameCode = ""){

        this.#fetch = new BsrFetchMethods(gameCode);

        // generic default values
        this.#updateInterval = 1000;
        this.#fetchInfoStringDefault = "No Server Connection - Playing Against AI";

        // elements that are used for interating with the player if we can get a game code
        this.#gameStatusElement;
        this.#gameCodeContainerElement;
        this.#gameCodeSearchElement;
        this.#gameReadyElement;

        // game code input when server proeprly connects
        this.#gameCodeInput = '<div id="bsr__gamecodesearch" class="bsr__gamecodesearch"> <button id="bsr__gamecodebutton" class="bsr__gamecodebutton bsr--text bsr--rounded-left">Join Random Game</button> <input id="bsr__gamecodeinput" class="bsr__gamecodeinput bsr--text bsr--rounded-right" type="text" placeholder="Game Code Here"> </div>';

        // functions to be ran during th eupdate interval
        this.#runtimeFunctions = [];

        // run functions on game update interval
        setInterval(() => {
            this.#runOnGameUpdate();
            //console.log(this.#runtimeFunctions);
        }, this.#updateInterval);


    }

    // get the current fetch method from the abstraction
    getFetch(){
        return this.#fetch;
    }

    // clear the runtime functions whenever necessary (most likely for reseting state/information)
    clearRuntimeFunctions(){
        this.#runtimeFunctions = [];
    }

    // push function to array to run on game update
    #setRuntimeFunction(func = function () { }) {
        this.#runtimeFunctions.push(func);
    }

    // run runtime functions set within runtimeFunctions array
    #runOnGameUpdate() {
        this.#runtimeFunctions.forEach(
            func => {
                func();
            }
        )
    }

    // set the game status element
    setGameStatusElement(gameStatusElement){
        this.#gameStatusElement = gameStatusElement;
        this.#setRuntimeFunction(() => this.updateFetchInfo(gameStatusElement));
    }

    // set the code container element
    setCodeContainerElement(codeContainerElement){
        this.#gameCodeContainerElement = codeContainerElement;
        this.#setRuntimeFunction(() => this.updatePlayerCode(codeContainerElement));
    }

    // set the code search element
    setCodeSearchElement(codeSearchElement){
        this.#gameCodeSearchElement = codeSearchElement;
        this.#setRuntimeFunction(() => this.updateCodeSearchElement(codeSearchElement));
    }

    // set the game ready element
    setGameReadyElement(gameReadyElement){
        this.#gameReadyElement = gameReadyElement;
    }

    // update the game info about fetch connections
    updateFetchInfo(gameStatusElement){
        // get our game code
        let gameCode = this.#fetch.getGameCode()

        // if we have a game code
        if (gameCode.length > 0){
            let info = "Connected To Server";
            info = info + " - ";
            let isConnected = this.#fetch.getConnectedState();
            // and we are connected to a game
            if (isConnected){
                info = info + "Playing Against Player";
            }
            // and we are not connected to a game
            if (!isConnected){
                info = info + "Playing Against AI";
            }
            // set stats info
            gameStatusElement.innerText = info;
        }

        // if we have no game code, there is no server connection, thus we will play with the AI
        if (gameCode.length <= 0){
            gameStatusElement.innerHtml = this.#fetchInfoStringDefault;
        }
    }

    // try to update our player code until we have one
    updatePlayerCode(codeContainerElement){
        let gameCode = this.#fetch.getGameCode();

        if (gameCode.length > 0){
            codeContainerElement.innerText = "Game Code: " + gameCode;
        }

    }

    // when we get a player code, allow person to join or find a game
    updateCodeSearchElement(codeSearchElement){
        let gameCode = this.#fetch.getGameCode();

        if (gameCode.length > 0){

            if (codeSearchElement.innerHTML == ""){
                codeSearchElement.innerHTML = this.#gameCodeInput;
            }

            if (codeSearchElement.children[0].children[1].value){
               codeSearchElement.children[0].children[0].innerText = "Join Game";
            }

            if (!codeSearchElement.children[0].children[1].value){
                codeSearchElement.children[0].children[0].innerText = "Join Random Game";
            }

        }

    }

    // attempt to join another players game
    attemptToJoinGame(playerCode = ""){

    }

    // quick way to initialize the elements that will be used in fetch abstraction
    initializeFetch(gameStatusElement, gameCodeContainerElement, gameCodeSearchElement, gameReadyElement){
        this.setGameStatusElement(gameStatusElement);
        this.setCodeContainerElement(gameCodeContainerElement);
        this.setCodeSearchElement(gameCodeSearchElement);
        this.setGameReadyElement(gameReadyElement);

    }

    // test some stuff
    test(){

    }

}