// class having basic ai object and methods for use with purely frontend

import { BsrPiecesData } from "./bsr-piecesdata.js";
import { Helper } from "./helper.js";

export { BsrAi }

class BsrAi{
    
    constructor(){

    }
    getDefaultReturnInfo(){
        let info = { playerTurn : 1, piecesClicked : [[]], piecesHit : [false], pieceName : "" , pieceLocations : [[]], gameover : false}
        return info;
    }

}