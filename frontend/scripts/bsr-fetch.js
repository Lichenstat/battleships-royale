// Fetch api calls for clientside/serverside communication for bsr game
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { FetchMethod } from "./fetch.js";

export { BsrFetchMethods };


class BsrFetchMethods{

    #fetchMethod;
    #playerGameCode;
    #enemyGameCode;

    constructor(){
        this.#fetchMethod = new FetchMethod();
        this.#playerGameCode = "158fbc0cea421236105a66788868d9";
        this.#enemyGameCode = "";
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
        let request = fetchMethod.createRequest("POST", "cors", "no-cache", "same-origin", arg, "follow", "same-origin", "joinPlayer", {gameCode : "5", joinCode : "5"});
        fetchMethod.fetchMethod("http://192.168.1.73:81/backend/bsr-transmit.php", request, "text")
        .then(data => {
            //let ndat = JSON.parse(data)
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

}