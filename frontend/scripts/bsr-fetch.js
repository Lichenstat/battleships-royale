// Fetch calls for clientside/serverside communication for bsr game
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { FetchMethod } from "./fetch.js";
import { Helper } from "./helper.js";

export { BsrFetchMethods };


class BsrFetchMethods{

    #fetch;
    #playerGameCode;

    #genericArgumentsForRequest;
    #checkGameCodeRequest;
    #checkGameCodeCycleTime;

    #waitingOnOtherState;
    #connectedState;
    #readyState;
    #startState;

    constructor(gameCode = ""){

        // create our fetch request
        this.#fetch = new FetchMethod();

        // our players game code (will be set when initialized and connection to the server is made)
        this.#playerGameCode = gameCode;

        // generic arguments for making a request
        this.#genericArgumentsForRequest = {'Content-Type': 'application/x-www-form-urlencoded'};
        
        // check game code proeprties
        this.#checkGameCodeCycleTime = 60000; // or 1 minute (60000)

        // assign our game code and keep updating its timeout
        this.#checkGameCode();
        setInterval(() => {
            this.#checkGameCode();
        }, this.#checkGameCodeCycleTime);

        // waiting on other player to join the game
        this.#waitingOnOtherState = false;

        // checks if two players are connected or not
        this.#connectedState = false;

        // readystate to send to the server for when the player is ready to play
        this.#readyState = false;

        // game is ready to start
        this.#startState = false;

    }

    // return the players game code to use in some manner
    getGameCode(){
        return this.#playerGameCode;
    }

    // get the connected state
    getConnectedState(){
        return this.#connectedState;
    }

    // get game ready state
    getReadyState(){
        return this.#readyState;
    }

    // get the game start state
    getStartState(){
        return this.#startState;
    }

    // get if the player is waiting on another player to join or not
    getWaitingStateOfLobby(){
        return this.#waitingOnOtherState;
    }

    // set the ready state of the players game
    setReadyState(bool = false){
        this.#readyState = bool;
        this.updateReadyState();
    }
    
    //-------------------------------------------------------------------------
    // methods to consistently run during runtime of web page

    // get our game code if necessary and update the timeout of our game code
    #checkGameCode(){
        let bodyContent = {gameCode : this.#playerGameCode};
        let bodyName = "checkGameCode";
        let request = this.#fetch.createRequest("POST", "cors", "no-cache", "same-origin", this.#genericArgumentsForRequest, "follow", "same-origin", bodyName, bodyContent);
        this.#fetch.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "json")
        .then(data => {
            //console.log(data);
            if (!Helper.checkIfObjectIsEmpty(data)){
                this.#playerGameCode = data.gameCode;
            }
        })
        .catch(error => {}/* => console.log(`fetch error: ${error}`)*/);
    }
    
    //-------------------------------------------------------------------------
    // methods mostly used for setup during the game

    // search for a given player and join their game if possible
    searchForPlayer(joinCode = ""){
        let bodyContent = {gameCode : this.#playerGameCode, joinCode : joinCode};
        let bodyName = "joinMatch";
        let request = this.#fetch.createRequest("POST", "cors", "no-cache", "same-origin", this.#genericArgumentsForRequest, "follow", "same-origin", bodyName, bodyContent);
        this.#fetch.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //console.log(data);
        })
        .catch(error => console.log(`fetch error: ${error}`));
    }

    // update the current players ready state serverside
    updateReadyState(){
        let bodyContent = {gameCode : this.#playerGameCode, readyState : this.#readyState};
        let bodyName = "updateReadyState";
        let request = this.#fetch.createRequest("POST", "cors", "no-cache", "same-origin", this.#genericArgumentsForRequest, "follow", "same-origin", bodyName, bodyContent);
        this.#fetch.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //console.log(data);
        })
        .catch(error => console.log(`fetch error: ${error}`));
    }

    // check if the players are connected and are ready to play
    checkConnectedState(){
        let bodyContent = {gameCode : this.#playerGameCode};
        let bodyName = "checkGameReady";
        let request = this.#fetch.createRequest("POST", "cors", "no-cache", "same-origin", this.#genericArgumentsForRequest, "follow", "same-origin", bodyName, bodyContent);
        this.#fetch.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "json")
        .then(data => {
            //console.log(data);
            this.#connectedState = data.connectedState;
            this.#waitingOnOtherState = data.waitingOnOtherState;
            this.#startState = data.startState;
        })
        .catch(error => console.log(`fetch error: ${error}`));
    }

    // disconnect from the current joined game
    disconnectFromGame(){
        let bodyContent = {gameCode : this.#playerGameCode};
        let bodyName = "disconnectFromGame";
        let request = this.#fetch.createRequest("POST", "cors", "no-cache", "same-origin", this.#genericArgumentsForRequest, "follow", "same-origin", bodyName, bodyContent);
        this.#fetch.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //console.log(data);
        })
        .catch(error => console.log(`fetch error: ${error}`));
    }

    //---------------------------------------------------------------------------
    // methods that are used to initialize the game and interact with eachother

    setupInitialGame(){
        let fetchMethod = new FetchMethod();
        let arg = {'Content-Type': 'application/x-www-form-urlencoded'};
        let request = fetchMethod.createRequest("POST", "cors", "no-cache", "same-origin", arg, "follow", "same-origin", "setupGame", {gameCode : "12"});
        fetchMethod.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //let ndat = JSON.parse(data)
            console.log(data);
            //this.#playerGameCode = ndat;
        })
        .catch(error => console.log(`fetch error: ${error}`));
    }

    quitGame(){
        let fetchMethod = new FetchMethod();
        let arg = {'Content-Type': 'application/x-www-form-urlencoded'};
        let request = fetchMethod.createRequest("POST", "cors", "no-cache", "same-origin", arg, "follow", "same-origin", "quitGame", {gameCode : "13"});
        fetchMethod.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //let ndat = JSON.parse(data);
            console.log(data);
            //this.#playerGameCode = ndat;
        })
        .catch(error => console.log(`fetch error: ${error}`));
    }

    // send player game info to the server to use during game processing
    sendGameInfo(bsrPiecesData = new BsrPiecesData()){
        
    }

    // send clicked piece to the server and retrieve updated game information
    playTurn(chosenLocation = []){

    }

    test(){
        let bodyItems = {gameCode : "10936a9e088684b74881", bsrPiecesData : [{id : 0,  name : "destroyer", locations : [[1,1],[1,2],[1,3]]},{id : 1, name : "submarine", locations : [[2,1],[2,2],[2,3]]}]};
        //let bodyItems = {gameCode : "14", locations : [[1,3]]};
        let fetchMethod = new FetchMethod();
        let arg = {'Content-Type': 'application/x-www-form-urlencoded'};
        let request = fetchMethod.createRequest("POST", "cors", "no-cache", "same-origin", arg, "follow", "same-origin", "test", bodyItems);
        fetchMethod.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //let ndat = JSON.parse(data)
            console.log(data);
            //this.#playerGameCode = ndat;
        })
        .catch(error => console.log(`fetch error: ${error}`));
    }

}