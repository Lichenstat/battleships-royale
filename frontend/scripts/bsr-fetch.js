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

    #connectedState;
    #readyState;
    #gameStartState;

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

        // checks if the players are connected or not
        this.#connectedState = 0;

        // readystate to send to the server for when the player is ready to play
        this.#readyState = 0;

        // game is ready to start
        this.#gameStartState = false;

    }

    // set the game start state
    setGameStartState(){
        if (!this.#gameStartState){
            this.#gameStartState = true;
        }
        else{
            this.#gameStartState = false;
        }
    }

    // get the game start state
    getGameStartState(){
        return this.#gameStartState;
    }

    // return the players game code to use in some manner
    getGameCode(){
        return this.#playerGameCode;
    }

    // get the connected state
    getConnectedState(){
        return this.#connectedState;
    }

    // get our game code if necessary and update the timeout of our game code
    #checkGameCode(){
        //console.log("checking game code");
        let checkGameCodeRequest = this.#fetch.createRequest("POST", "cors", "no-cache", "same-origin", this.#genericArgumentsForRequest, "follow", "same-origin", "checkGameCode", {gameCode : this.#playerGameCode});
        this.#fetch.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", checkGameCodeRequest, "json")
        .then(data => {
            //console.log(data);
            if (!Helper.checkIfObjectIsEmpty(data)){
                this.#playerGameCode = data.gameCode;
            }
        })
        .catch(error => {}/* => console.log(`fetch error: ${error}`)*/);
    }

    //--------------------------------------------------------------------------------
    
    // search for a given player and 
    searchForPlayer(){

    }

    updateReadyState(){
        let fetchMethod = new FetchMethod();
        let arg = {'Content-Type': 'application/x-www-form-urlencoded'};
        let request = fetchMethod.createRequest("POST", "cors", "no-cache", "same-origin", arg, "follow", "same-origin", "updateReadyState", {gameCode : "5", readyState: this.#readyState});
        fetchMethod.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //let ndat = JSON.parse(data)
            console.log(data);
            //this.#playerGameCode = ndat;
        })
        .catch(error => console.log(`fetch error: ${error}`));
    }

    disconnectFromGame(){
        let fetchMethod = new FetchMethod();
        let arg = {'Content-Type': 'application/x-www-form-urlencoded'};
        let request = fetchMethod.createRequest("POST", "cors", "no-cache", "same-origin", arg, "follow", "same-origin", "disconnectFromGame", {gameCode : "7"});
        fetchMethod.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //let ndat = JSON.parse(data)
            console.log(data);
            //this.#playerGameCode = ndat;
        })
        .catch(error => console.log(`fetch error: ${error}`));
    }

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
        let bodyItems = {gameCode : "21", bsrPiecesData : [{id : 0,  name : "destroyer", locations : [[1,1],[1,2],[1,3]]},{id : 1, name : "submarine", locations : [[2,1],[2,2],[2,3]]}]};
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