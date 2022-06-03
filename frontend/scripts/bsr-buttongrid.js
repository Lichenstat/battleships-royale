// Class for creating and interacting with button grids

import { BsrGrid } from "./bsr-grid.js";
import { bsrGridInternals } from "./bsr-config.js";
import { Helper } from "./helper.js";

export { BsrButtonGrid }

class BsrButtonGrid extends BsrGrid{

    constructor(grid){
        super(grid);

    }

    // change the outcome src string of the element
    #changeOutcomeSrc(elementString, desiredSrc){
        let changingString = bsrGridInternals.playerPieceBlankOutcomeImage;
        let changedString = Helper.parsePartOfStringToReplace(changingString, 'src=""', 'src="' + desiredSrc + '"');
        let finalizedString = Helper.parsePartOfStringToReplace(elementString, changingString, changedString);
        return finalizedString;
    }

    // return the button of the board as enabled
    getGridButtonEnabled(){
        return this.#changeOutcomeSrc(bsrGridInternals.boardButtonDisabled, bsrGridInternals.hitImage);
    }

    // return the button of the board as disabled
    getGridButtonDisabled(){
        return this.#changeOutcomeSrc(bsrGridInternals.boardButtonDisabled, bsrGridInternals.missImage);
    }

}