// Fetch api calls for clientside/serverside communication for bsr game
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { FetchMethod } from "./fetch.js";

export { BsrFetchMethods };


class BsrFetchMethods{

    #fetchMethod;
    #playerGameCode;
    #enemyGameCode;

    #readyState;

    constructor(){
        this.#fetchMethod = new FetchMethod();
        this.#playerGameCode = "2";
        this.#enemyGameCode = "";

        this.#readyState = 1;
    }

    // retrieve a player code for sharing a game
    retrieveGameCode(){
        let fetchMethod = new FetchMethod();
        let arg = {'Content-Type': 'application/x-www-form-urlencoded'};
        let request = fetchMethod.createRequest("POST", "cors", "no-cache", "same-origin", arg, "follow", "same-origin", "checkGameCode", {gameCode : this.#playerGameCode});
        fetchMethod.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //let ndat = JSON.parse(data)
            console.log(data);
            //this.#playerGameCode = ndat;
        })
        .catch(error => console.log(`fetch error: ${error}`));
    }
    
    // search for a given player and 
    searchForPlayer(){
        let fetchMethod = new FetchMethod();
        let arg = {'Content-Type': 'application/x-www-form-urlencoded'};
        let request = fetchMethod.createRequest("POST", "cors", "no-cache", "same-origin", arg, "follow", "same-origin", "joinMatch", {gameCode : "5", joinCode : "5"});
        fetchMethod.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //let ndat = JSON.parse(data)
            console.log(data);
            //this.#playerGameCode = ndat;
        })
        .catch(error => console.log(`fetch error: ${error}`));
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
        let bodyItems = {gameCode : "15", bsrPiecesData : [{id : 0,  name : "destroyer", locations : [[1,1],[1,2],[1,3]]},{id : 1, name : "submarine", locations : [[2,1],[2,2],[2,3]]}]};
        //let bodyItems = {gameCode : "15", locations : [[1,3]]};
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