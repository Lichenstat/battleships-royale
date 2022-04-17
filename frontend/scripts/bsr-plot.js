// Object class for creating/updating/interacting with bsr plots (squares) on a grid

import { GenerateButton } from "./generate-button";
import { Helper } from "./helper";
import { bsrPlotProperties } from "./bsr-info";

export { BsrPlot }

class BsrPlot{
    constructor(){
        this.gameButton = new GenerateButton();
        this.gameButton.setHTMLButtonProperties(bsrPlotProperties.classEnabled, bsrPlotProperties.id, bsrPlotProperties.type, bsrPlotProperties.enabled, bsrPlotProperties.internalText);
        this.enabledPlotSquare = this.gamebutton.getHTMLButton();
        this.gameButton.setHTMLButtonProperties(bsrPlotProperties.classDisabled, bsrPlotProperties.id, bsrPlotProperties.type, bsrPlotProperties.disabled, bsrPlotProperties.internalText);
        this.disabledPlotSquare = this.gamebutton.getHTMLButton();
    }

    // get a enabled useable square plot to click
    getEnabledSquare(){
        return this.enabledPlotSquare;
    }
    
    // get a disabled unusable square plot
    getDisabledSquare(){
        return this.disabledPlotSquare;
    }

    // get the plot square's location in a table with a matrix location
    getSquareLocation(elementId){
        return Helper.parseElementIdForMatrixLocation(elementId);
    }
    
}