// class for checking interactions between the ai and the player (replaces the serevr functionality in this instance)

import { BsrPiecesData } from "./bsr-piecesdata.js";
import { Helper } from "./helper.js";

export { BsrPlayerAiInteractions }

class BsrPlayerAiInteractions{

    // check if the location chosen to attack has hit a location or not
    static checkIfHitOrMiss(attackedPiecesData = new BsrPiecesData(), currentPlayInfo = {}){
        let locationsHit = []
        let chosenLocationLength = currentPlayInfo.piecesClicked.length;
        for (let i = 0; i < chosenLocationLength; i++){
            let checkIfHit = attackedPiecesData.getPieceHavingDataTableOverlap([currentPlayInfo.piecesClicked[i]]);
            if(checkIfHit){
                locationsHit.push(true);
                attackedPiecesData.removeLocationsWithInternalsFromPiecesInDataTable([currentPlayInfo.piecesClicked[i]]);
                //console.log('hit');
            }
            if(!checkIfHit){
                locationsHit.push(false);
                //console.log('miss');
            }
        }
        currentPlayInfo.piecesHit = locationsHit;
        return currentPlayInfo;
    }

    // check if pieces counts have changed since a certain play
    static getChangeInPiecesCount(piecesCountOriginal = {}, piecesCountPrevious = {}, currentPlayInfo = {}){
        for (const [key, item] of Object.entries(piecesCountOriginal)){
            if (piecesCountOriginal[key] != piecesCountPrevious[key]){
                //console.log('piece changed', key);
                currentPlayInfo.pieceName = key;
                return currentPlayInfo;
            }
        }
        currentPlayInfo.pieceName = "";
        return currentPlayInfo;
    }

    // set the current turn using the current play info (works for 2 players at the moment)
    static setCurrentTurn(currentPlayInfo = {}){
        let turn = currentPlayInfo.playerTurn;
        let changed = false;
        if(turn == 1 && !changed){
            currentPlayInfo.playerTurn = 2;
            changed = true;
        }
        if(turn != 1 && !changed){
            currentPlayInfo.playerTurn = 1;
            changed = true;
        }
        return currentPlayInfo;
    }

    // check if there has been a winner during the match yet or not
    static setGameoverIfNeeded(playerPiecesData = new BsrPiecesData(), aiPiecesData = new BsrPiecesData(), currentPlayInfo = {}){
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