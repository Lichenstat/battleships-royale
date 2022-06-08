// class for checking interactions between the ai and the player

import { BsrPiecesData } from "./bsr-piecesdata.js";
import { Helper } from "./helper.js";

export { BsrPlayerAiInteractions }

class BsrPlayerAiInteractions{

    // check if the location chosen to attack has hit a location or not
    static checkIfHitOrMiss(attackedPiecesDataTable = new BsrPiecesData(), chosenLocation = [[0,0]]){
        let locationsHit = []
        let chosenLocationLength = chosenLocation.length;
        for (let i = 0; i < chosenLocationLength; i++){
            let checkIfHit = attackedPiecesDataTable.getPieceHavingDataTableOverlap([chosenLocation[i]]);
            if(checkIfHit){
                locationsHit.push(true);
                attackedPiecesDataTable.removeLocationsFromPiecesInDataTable([chosenLocation[i]]);
                //console.log('hit');
            }
            if(!checkIfHit){
                locationsHit.push(false);
                //console.log('miss');
            }
        }
        return locationsHit
    }


}