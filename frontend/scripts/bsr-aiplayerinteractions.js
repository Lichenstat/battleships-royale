// class for checking interactions between the ai and the player

import { BsrPiecesData } from "./bsr-piecesdata.js";
import { Helper } from "./helper.js";

export { BsrPlayerAiInteractions }

class BsrPlayerAiInteractions{

    // check if the location chosen to attack has hit a location or not
    static checkIfHitOrMiss(attackedPiecesDataTable = new BsrPiecesData(), chosenLocation = [[0,0]]){
        let locationsHit = []
        let chosenLocationSize = chosenLocation.length;
        for (let i = 0; i < chosenLocationSize; i++){
            let checkIfHit = attackedPiecesDataTable.getPieceHavingDataTableOverlap(chosenLocation);
            if(checkIfHit){
                locationsHit.push(true);
            }
            if(!checkIfHit){
                locationsHit.push(false);
            }
        }
        return locationsHit
    }


}