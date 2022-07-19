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
    #quitGameElement;

    #gameReadyElementPrevious;

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
        this.#quitGameElement;

        // game ready element previous state
        this.#gameReadyElementPrevious;

        // game code input when server proeprly connects
        this.#gameCodeInput = '<div id="bsr__gamecodesearch" class="bsr__gamecodesearch"> <button id="bsr__gamecodebutton" class="bsr__gamecodebutton bsr--text bsr--rounded-left">Join Random Game</button> <input id="bsr__gamecodeinput" class="bsr__gamecodeinput bsr--text bsr--rounded-right" type="text" placeholder="Enter Game Code Here"> </div>';

        // game ready button avalable on server connection successful


        // functions to be ran during the update interval
        this.#runtimeFunctions = [];

        // run functions on game update interval
        setInterval(() => {
            this.#fetch.checkConnectedState()
            this.#runOnGameUpdate();
            //console.log(this.#runtimeFunctions);
        }, this.#updateInterval);

    }

    // clear the runtime functions whenever necessary (most likely for reseting state/information)
    clearRuntimeFunctions(){
        this.#runtimeFunctions = [];
    }

    // get the current fetch method from the abstraction
    getFetch(){
        return this.#fetch;
    }

    // get the connected state of the fetch
    getConnectedState(){
        return this.#fetch.getConnectedState();
    }

    // get ready state of fetch
    getReadyState(){
        return this.#fetch.getReadyState();
    }

    // get if the players are ready to play or not so we can start
    getStartState(){
        return this.#fetch.getStartState();
    }

    // set the ready state of our game
    setReadyState(bool = false){
        this.#fetch.setReadyState(bool);
    }

    // disconnect from game
    disconnectFromGame(){
        this.#fetch.disconnectFromGame();
        this.#fetch.setReadyState(false);
    }

    // push function to array to run on game update
    #setRuntimeFunction(func = function () { }){
        this.#runtimeFunctions.push(func);
    }

    // run runtime functions set within runtimeFunctions array
    #runOnGameUpdate(){
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
        this.#setRuntimeFunction(() => this.updatePlayerCodeElement(codeContainerElement));
    }

    // set the code search element
    setCodeSearchElement(codeSearchElement){
        this.#gameCodeSearchElement = codeSearchElement;
        this.#setRuntimeFunction(() => this.updateCodeSearchElement(codeSearchElement));
    }

    // set the game ready element
    setGameReadyElement(gameReadyElement){
        this.#gameReadyElementPrevious = gameReadyElement;
        this.#gameReadyElement = gameReadyElement;
    }

    // set the quitting element of the game being played
    setQuitGameElement(quitGameElement){
        
        this.#quitGameElement = quitGameElement.children[0];
        let quitGame = quitGameElement.children[0];

        quitGame.addEventListener("click", elemItem => {
            let isConnected = this.#fetch.getConnectedState();

            if (isConnected){
                this.#fetch.quitCurrentGame();
            }

        })
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
    updatePlayerCodeElement(codeContainerElement){
        let gameCode = this.#fetch.getGameCode();

        if (gameCode.length > 0 && codeContainerElement.innerText == ""){
            codeContainerElement.innerText = "Game Code: " + gameCode;
        }

    }

    // when we get a player code, allow person to join or find a game
    updateCodeSearchElement(codeSearchElement){

        let gameCode = this.#fetch.getGameCode();

        // if the game code exists
        if (gameCode.length > 0){

            // if our innerHtml is blank, put our game code input into it
            if (codeSearchElement.innerHTML == ""){
                codeSearchElement.innerHTML = this.#gameCodeInput;
                this.#setEventListenerOfJoinOrDisconnect();
            }

            // if our code search element is not empty (we can then modify it)
            if (codeSearchElement.innerHTML != ""){

                let connectedState = this.#fetch.getConnectedState();
                //console.log(connectedState);
                // if we are connected to a game
                if (connectedState){
                    codeSearchElement.children[0].children[0].innerText = "Disconnect";
                }

                // if we are not connected to the game
                if (!connectedState){

                    let waitingState = this.#fetch.getWaitingStateOfLobby();
                    //console.log(waitingState);
                    // if we are waiting for another player to join the game
                    if (waitingState){
                        codeSearchElement.children[0].children[0].innerText = "Waiting For Other";
                    }

                    // if we are not waiting for another player to join the game
                    if (!waitingState){

                        // if the user has inputted some text, update button to show join game
                        if (codeSearchElement.children[0].children[1].value){
                            codeSearchElement.children[0].children[0].innerText = "Join Game";
                         }
             
                         // if there is no game code sent to join, we will tell the user to join a random game
                         if (!codeSearchElement.children[0].children[1].value){
                             codeSearchElement.children[0].children[0].innerText = "Find Random Game";
                         }  

                    }
                  
                }

            }

        }

    }

    // attempt to join another players game
    attemptToJoinOrDisconnectFromGame(playerCode = ""){

        // if we are connected to a player, simply allow us to disconnect from the player
        if (this.#fetch.getConnectedState()){
            this.#fetch.disconnectFromGame();
            this.#fetch.setReadyState(false);
        }

        // otherwise try and find a game to play in
        else {
            if (!this.#fetch.getWaitingStateOfLobby()){
                let playerCodeCleaned = Helper.removeAllSpacesFromString(playerCode);
                //console.log(playerCodeCleaned);
                this.#fetch.searchForPlayer(playerCodeCleaned);
                this.#fetch.setReadyState(false);

            }
        }
    }

    // set the event listener of the 
    #setEventListenerOfJoinOrDisconnect(){
        
        let connectionButton = document.getElementById("bsr__gamecodebutton");
        connectionButton.addEventListener("click", elemItem => {

            let input = document.getElementById("bsr__gamecodesearch").children[1];
            this.attemptToJoinOrDisconnectFromGame(input.value);

        })
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

        this.#fetch.test();

    }

}