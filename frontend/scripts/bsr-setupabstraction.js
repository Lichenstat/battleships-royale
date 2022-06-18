// abstraction class for setup.js (ease of use)

import { BsrSetup } from "./bsr-setup.js";
import { bsrPieceInteractors } from "./bsr-config.js";
import { Helper } from "./helper.js";

export { BsrSetupAbstraction };

class BsrSetupAbstraction{

    #setup;

    #gridContainerElement;
    #piecesContainerElement;
    #rotatePiecesElement;
    #removeAllPiecesElement;
    #removePiecesElement;
    #randomPlacementElement;

    #canPlacePiece;
    #removedPreviousPiece;
    #tempGrid;
    #time;
    #dragging;

    constructor(){

        // need new bsr setup
        this.#setup = new BsrSetup();

        // parts for event listeners
        this.#gridContainerElement = "some__html-element";
        this.#piecesContainerElement = "some__html-element";
        this.#rotatePiecesElement = "some__html-element";
        this.#removeAllPiecesElement = "some__html-element"
        this.#removePiecesElement = "some__html-element";
        this.#randomPlacementElement = "some__html-element";

        // properties to use in interfacing
        this.#canPlacePiece = false;
        this.#removedPreviousPiece = false;
        this.#tempGrid;
        this.#time = 50;
        this.#dragging = false;
    }

    // get the setup pieces data
    getPiecesData(){
        return this.#setup.getPiecesData();
    }

    // put all the placeable pieces together
    #combinedPieces(){
        let container = bsrPieceInteractors.piecesContainer;
        let beginning = container.substring(0, container.indexOf('>') + 1);
        let ending = container.substring(container.lastIndexOf('<'), container.length);
        // we will add the remover here to the play pieces as of now (ease of use)
        let remover = bsrPieceInteractors.dragAndDropPieceRemover;
        let pieces = this.#setup.getUpdatedRotatedPieces();
        let piecesLeft = this.#setup.getNumberOfPlaceablePiecesLeft();
        let combined = '';
        //console.log(pieces);
        for (const [key, item] of Object.entries(pieces)){
            let currentBeginning = Helper.parsePartOfStringToReplace(
                beginning, 
                'class="' + bsrPieceInteractors.piecesContainerId + '"', 
                'class="' + bsrPieceInteractors.piecesContainerId + " " + bsrPieceInteractors.piecesContainerId + "--" + key + '"'
                );
                let uppercaseKey = key.charAt(0).toUpperCase() + key.substring(1, key.length);
                if (uppercaseKey == 'Patrolboat') uppercaseKey = 'Patrol Boat';
            combined = combined + (currentBeginning + uppercaseKey + ': ' + piecesLeft[key] + item + ending);
        }
        return remover + combined;
    }

    // update the drag and drop pieces that can be put on the grid
    updateDragAndDropPieces(piecesContainerElement){
        piecesContainerElement.innerHTML = this.#combinedPieces();
    }

    // load a blank drag and drop grid using some givne element and it's id
    loadBlankGrid(gridContainerElement){
        gridContainerElement.innerHTML = this.#setup.getDragAndDropGrid().getGrid();
    }

    // save the grid of the current drag and drop table
    saveDragAndDropGrid(gridContainerElement){
        this.#setup.getDragAndDropGrid().saveGrid(gridContainerElement.innerHTML);
    }

    // reload the drag and drop grid
    reloadDragAndDropGrid(gridContainerElement){
        gridContainerElement.innerHTML = this.#setup.getDragAndDropGrid().loadGrid();
    }

    // load a blank grid and place all the set pieces from the pieces data table
    loadSetGridPieces(gridContainerElement){
        this.loadBlankGrid(gridContainerElement);
            let piecesAndPlacement = this.#setup.getPiecesIdsAndInternals();
            //console.log(piecesAndPlacement);
            let piecesAndPlacementLength = piecesAndPlacement.length;
            for (let i = 0; i < piecesAndPlacementLength; i++){
                let piece = piecesAndPlacement[i];
                let pieceLength = piece[0].length;
                for (let j = 0; j < pieceLength; j++){
                    document.getElementById(piece[0][j]).children[0].innerHTML = piece[1][j];
                }
            }
    }

    // remove the last piece/highlighting on the board under some sort of circumstance
    removePreviousPiece(){
        let previousPlacement = this.#setup.getPlacedPieceIds();
        //console.log('previous placement',previousPlacement);
        if(previousPlacement){
            let previousPlacementLength = previousPlacement.length;
            for (let i = 0; i < previousPlacementLength; i++){
                document.getElementById(previousPlacement[i]).innerHTML = this.#setup.getDragAndDropGrid().getDragAndDropCleanInternal();
            }
        }
    }

    // update the plots being dragged over with highlighting using the grid ids generated
    loadHighlighting(){
        let currentPlacement = this.#setup.getDraggedPieceIdsAndInternals();
        let currentClassName = this.#setup.getDraggedOverPieceClassName();
        //console.log('currentPlacement', currentPlacement);
        let placementLength = currentPlacement[0].length;
        for (let i = 0; i < placementLength; i++){
            if(document.getElementById(currentPlacement[0][i]) != null){
                if(document.getElementById(currentPlacement[0][i]).children[0] != undefined)
                    document.getElementById(currentPlacement[0][i]).children[0].className = currentClassName;
            }
        }
    }

    // rotate the placeable pieces
    setRotatePiecesButton(rotateButtonElement, piecesContainerElement){
        rotateButtonElement.onclick = () => {
            //console.log('rotationg pieces');
            this.#setup.changeBoardPieceRotation();
            this.updateDragAndDropPieces(piecesContainerElement);
        }
    }

    // set the remove all pieces element
    setRemoveAllPiecesButton(removeAllPiecesElement, piecesContainerElement, gridContainerElement){
        removeAllPiecesElement.onclick = () => {
            this.#setup.getPiecesData().clearPiecesDataTable();
            this.updateDragAndDropPieces(piecesContainerElement);
            this.loadBlankGrid(gridContainerElement);
        }
    }

    // set the piece remover
    setRemovePiecesElement(removePiecesElement){
        removePiecesElement.innerHTML = this.getPieceRemover();
    }

    // set random pieces in the given drag and drop grid using a given element as the event handler
    setRandomPiecesButton(gridContainerElement, piecesContainerElement){
        this.#randomPlacementElement.addEventListener("click", () => {
            //console.log('randomly placed pieces');
            this.#setup.setRandomPieces();
            this.loadSetGridPieces(gridContainerElement);
            this.updateDragAndDropPieces(piecesContainerElement);
        })
    }

    // event on the start of the drag
    dragStart(item){
        //console.log('ran dragstart from setup.js');
        this.saveDragAndDropGrid(this.#gridContainerElement);
        if ((Helper.parseElementIdForMatrixLocation(item.target.parentNode.id)).length == 2){
            this.#setup.setClickedPieceInfo(item.target.parentNode);
        }
    }

    // event function to take place on dragging over container pieces
    dragOver(item){
        //console.log('ran dragover from setup.js');
        this.#dragging = true;
        let setDraggedOver = false;
        //console.log(item.target.parentNode.parentNode.parentNode)
        if(item.target.parentNode){
            //console.log(item.target.parentNode);
            if(item.target.parentNode.parentNode.parentNode.id != null && !setDraggedOver){
                if(item.target.parentNode.parentNode.parentNode.id.includes('bsr__table-cell')){
                    this.#setup.setDraggedOverPieceInfo(item.target.parentNode.parentNode);
                    setDraggedOver = true;
                }
            }
            if(!setDraggedOver){
                this.#setup.setDraggedOverPieceInfo(item.target);
            }
            this.#setup.checkAndSetPieceLocations();
            this.#canPlacePiece = this.#setup.canUseCurrentLocation();
            //console.log('can place piece', canPlacePiece)
            // if we havent removed previous pieces on pickup of a board piece on the grid
            if (!this.#removedPreviousPiece){
                this.removePreviousPiece();
                // set a temporary grid with the chosen piece removed to show for display
                this.#tempGrid = this.#gridContainerElement.innerHTML;
                this.#removedPreviousPiece = true;
            }
            // to update the last pieces we plan on placing on the grid
            if (this.#removedPreviousPiece){
                this.loadHighlighting();
            }
        }
    }

    // if the piece leaves any droppable position, we will have to reload the grid with the temporary grid
    dragLeave(item){
        //console.log('ran dragleave from setup.js');
        this.#dragging = false;
        this.#removedPreviousPiece = false;
        //console.log(setup.getDraggedPieceLocation());
        //console.log(canPlacePiece);
        if (!this.#canPlacePiece || !Helper.checkIfArraysAreEqual(this.#setup.getDraggedPieceLocation(), [0,0])){
                this.#gridContainerElement.innerHTML = this.#tempGrid;
                // set a small timer to check if we have stopped dragging the piece or not
                setTimeout(() => {
                    if (!this.#dragging){
                        this.reloadDragAndDropGrid(this.#gridContainerElement);
                    }
                }, this.#time)
        }
    }

    // on the drop of the piece
    dragDrop(item){
        //console.log('ran drop from setup.js');
        this.#setup.removePieceIfNeeded();
        this.#setup.setPieceLocationsAndCount();
        this.updateDragAndDropPieces(this.#piecesContainerElement);
        if(!this.#canPlacePiece){
            //console.log('using old table');
            this.reloadDragAndDropGrid(this.#gridContainerElement);
        }
        if(this.#canPlacePiece || this.#setup.checkIfPieceWasRemoved()){
            this.loadSetGridPieces(this.#gridContainerElement);
        }
        this.#dragging = true;
        this.#removedPreviousPiece = false;
    }

    // quick way to setup all the various game elements
    initializeSetup(gridContainerElement, piecesContainerElement, rotatePiecesElement, removeAllPiecesElement, removePiecesElement, randomPlacementElement){
        this.#gridContainerElement = gridContainerElement;
        this.#piecesContainerElement = piecesContainerElement;
        this.#rotatePiecesElement = rotatePiecesElement;
        this.#removeAllPiecesElement = removeAllPiecesElement;
        this.#removePiecesElement = removePiecesElement;
        this.#randomPlacementElement = randomPlacementElement;
        //console.log(this.#gridContainerElement);
        //console.log(this.#piecesContainerElement);
        //console.log(this.#rotatePiecesElement);
        //console.log(this.#removePiecesElement);
        //console.log(this.#randomPlacementElement);

        this.updateDragAndDropPieces(this.#piecesContainerElement);
        this.loadBlankGrid(this.#gridContainerElement);
        this.setRotatePiecesButton(this.#rotatePiecesElement, this.#piecesContainerElement);
        this.setRemoveAllPiecesButton(this.#removeAllPiecesElement, this.#piecesContainerElement, this.#gridContainerElement);
        this.setRandomPiecesButton(this.#gridContainerElement, this.#piecesContainerElement);
        //this.setRemovePiecesElement(this.#removePiecesElement);
    }
}