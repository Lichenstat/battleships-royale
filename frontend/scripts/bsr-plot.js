// Object class for creating/updating/interacting with bsr plots (squares) on a grid

import { CreateButton } from "./create-button.js";
import { Helper } from "./helper.js";
import { bsrPlotProperties, bsrGridInternals } from "./bsr-config.js";

export { BsrPlot }

class BsrPlot extends CreateButton{

    #enablePlotSquare;
    #disabledPlotSquare;

    constructor(){
        super();
        this.setHTMLButtonProperties(bsrPlotProperties.classEnabled, bsrPlotProperties.id, bsrPlotProperties.type, bsrPlotProperties.enabled, bsrPlotProperties.internalText);
        this.#enabledPlotSquare = this.getHTMLButton();
        this.setHTMLButtonProperties(bsrPlotProperties.classDisabled, bsrPlotProperties.id, bsrPlotProperties.type, bsrPlotProperties.disabled, bsrPlotProperties.internalText);
        this.#disabledPlotSquare = this.getHTMLButton();
    }

    // get a enabled useable square plot to click
    getEnabledSquare(){
        return this.#enabledPlotSquare;
    }
    
    // get a disabled unusable square plot
    getDisabledSquare(){
        return this.#disabledPlotSquare;
    }

    // get the plot square's location in a table with a matrix location
    getSquareLocation(elementId){
        return Helper.parseElementIdForMatrixLocation(elementId);
    }

}