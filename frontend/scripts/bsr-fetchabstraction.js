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

    constructor(gameCode = ""){

        this.#fetch = new BsrFetchMethods(gameCode);


        this.#updateInterval = 1000;
        this.#fetchInfoStringDefault = "No Server Connection - Playing Against AI";

        // elements that are used for interating with the player if we can get a game code
        this.#gameStatusElement;
        this.#gameCodeContainerElement;
        this.#gameCodeSearchElement;
        this.#gameReadyElement;

    }

    // set the game status element
    setGameStatusElement(gameStatusElement){
        this.#gameStatusElement = gameStatusElement;
        setInterval(() => {
            this.updateFetchInfo(gameStatusElement);
        }, this.#updateInterval);
    }

    // set the code container element
    setCodeContainerElement(codeContainerElement){
        this.#gameCodeContainerElement = codeContainerElement;
        codeContainerElement.innerText = "Game Code: ";
        this.updatePlayerCode(codeContainerElement);
    }

    // set the code search element
    setCodeSearchElement(codeSearchElement){
        this.#gameCodeSearchElement = codeSearchElement;

        codeSearchElement.innerText = "Button and Input";
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
    updatePlayerCode(gameCodeContainerElement){
        let gameCode = this.#fetch.getGameCode();
        if (gameCode.length <= 0){
            setTimeout(() => {
                this.updatePlayerCode(gameCodeContainerElement);
            }, 1000)
        }
        if (gameCode.length > 0){
            gameCodeContainerElement.innerText = "Game Code: " + gameCode;
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