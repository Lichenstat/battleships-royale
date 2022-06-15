// class for checking interactions between the ai and the player

import { BsrPiecesData } from "./bsr-piecesdata.js";
import { Helper } from "./helper.js";

export { BsrPlayerAiInteractions }

class BsrPlayerAiInteractions{

    // check if the location chosen to attack has hit a location or not
    static checkIfHitOrMiss(attackedPiecesData = new BsrPiecesData(), chosenLocation = [[0,0]]){
        let locationsHit = []
        let chosenLocationLength = chosenLocation.length;
        for (let i = 0; i < chosenLocationLength; i++){
            let checkIfHit = attackedPiecesData.getPieceHavingDataTableOverlap([chosenLocation[i]]);
            if(checkIfHit){
                locationsHit.push(true);
                attackedPiecesData.removeLocationsWithInternalsFromPiecesInDataTable([chosenLocation[i]]);
                //console.log('hit');
            }
            if(!checkIfHit){
                locationsHit.push(false);
                //console.log('miss');
            }
        }
        return locationsHit
    }

    // check if there has been a winner during the match yet or not
    static setGameover(playerPiecesData = new BsrPiecesData(), aiPiecesData = new BsrPiecesData, currentPlayInfo = {}){
        if(!Helper.accumulateObjectValues(playerPiecesData.getPiecesLeftThatHaveLocations())){
            //console.log('player should lose')
            currentPlayInfo.gameover = true;
        }
        if(!Helper.accumulateObjectValues(aiPiecesData.getPiecesLeftThatHaveLocations())){
            //console.log('ai should lose')
            currentPlayInfo.gameover = true;
        }
        return currentPlayInfo;
    }

}