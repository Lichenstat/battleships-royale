// abstraction class for setup.js (ease of use)

import { BsrSetup } from "./bsr-setup.js";
import { bsrPieceInteractors, bsrAudio } from "./bsr-config.js";
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

    #carrierh;
    #carrierv;
    #battleshiph;
    #battleshipv;
    #destroyerh;
    #destroyerv;
    #submarineh;
    #submarinev;
    #patrolboath;
    #patrolboatv;

    #rotateAudio;
    #randomAudio;
    #removeAudio;
    #dragStartAudio;
    #dragOverAudio;
    #dragDropAudio;

    #canPlacePiece;
    #removedPreviousPiece;
    #tempGrid;
    #time;
    #dragging;

    constructor(){

        // need new bsr setup
        this.#setup = new BsrSetup();

        // parts for event listeners
        this.#gridContainerElement;
        this.#piecesContainerElement;
        this.#rotatePiecesElement;
        this.#removeAllPiecesElement;
        this.#removePiecesElement;
        this.#randomPlacementElement;

        // pre load all required whole ship scaled pieces
        this.#carrierh = new Image();    this.#carrierh.src    = "./assets/images/board-pieces/horizontal/whole/carrierscaled.png";
        this.#carrierv = new Image();    this.#carrierv.src    = "./assets/images/board-pieces/vertical/whole/carrierscaled.png";
        this.#battleshiph = new Image(); this.#battleshiph.src = "./assets/images/board-pieces/horizontal/whole/battleshipscaled.png";
        this.#battleshipv = new Image(); this.#battleshipv.src = "./assets/images/board-pieces/vertical/whole/battleshipscaled.png";
        this.#destroyerh = new Image();  this.#destroyerh.src  = "./assets/images/board-pieces/horizontal/whole/destroyerscaled.png";
        this.#destroyerv = new Image();  this.#destroyerv.src  = "./assets/images/board-pieces/vertical/whole/destroyerscaled.png";
        this.#submarineh = new Image();  this.#submarineh.src  = "./assets/images/board-pieces/horizontal/whole/submarinescaled.png";
        this.#submarinev = new Image();  this.#submarinev.src  = "./assets/images/board-pieces/vertical/whole/submarinescaled.png";
        this.#patrolboath = new Image(); this.#patrolboath.src = "./assets/images/board-pieces/horizontal/whole/patrolboatscaled.png";
        this.#patrolboatv = new Image(); this.#patrolboatv.src = "./assets/images/board-pieces/vertical/whole/patrolboatscaled.png";

        // get all required audios for playing on event handlers
        this.#rotateAudio = new Audio(bsrAudio.rotate);
        this.#randomAudio = new Audio(bsrAudio.random);
        this.#removeAudio = new Audio(bsrAudio.remove);
        this.#dragStartAudio = new Audio(bsrAudio.dragStart);
        this.#dragOverAudio = new Audio(bsrAudio.dragOver);
        this.#dragDropAudio = new Audio(bsrAudio.dragStop);


        // properties to use in interfacing
        this.#canPlacePiece = false;
        this.#removedPreviousPiece = false;
        this.#tempGrid;
        this.#time = 100;
        this.#dragging = false;
    }

    // get the setup pieces data
    getPiecesData(){
        return this.#setup.getPiecesData();
    }

    // update the drag and drop pieces that can be put on the grid
    updateDragAndDropPieces(piecesContainerElement, combineRemoverElement, additionalContainerClasses = ""){
        // if we want to combine the pieces remover and the pieces drag and drop do so
        if (combineRemoverElement){
            let remover = bsrPieceInteractors.dragAndDropPieceRemover;
            piecesContainerElement.innerHTML = remover + this.#setup.getUpdatedDragAndDropPieces(additionalContainerClasses);
        }
        if(combineRemoverElement == undefined){
            piecesContainerElement.innerHTML = this.#setup.getUpdatedDragAndDropPieces(additionalContainerClasses);
        }
    }

    // update the drag and drop pieces with a red flash (indiciate all pieces haven't been placed)
    updateDragAndDropPiecesWhenNotAllPlaced(piecesContainerElement, combineRemoverElement){
        this.updateDragAndDropPieces(piecesContainerElement, combineRemoverElement, "bsr--blink-red");
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
            this.updateDragAndDropPieces(piecesContainerElement, true);
            this.#rotateAudio.play();
        }
    }

    // set the remove all pieces element
    setRemoveAllPiecesButton(removeAllPiecesElement, piecesContainerElement, gridContainerElement){
        removeAllPiecesElement.onclick = () => {
            this.#setup.getPiecesData().clearPiecesDataTable();
            this.updateDragAndDropPieces(piecesContainerElement, true);
            this.loadBlankGrid(gridContainerElement);
            this.#removeAudio.play();
        }
    }

    // set the piece remover
    setRemovePiecesElement(removePiecesElement){
        removePiecesElement.innerHTML = this.#setup.getPieceRemover();
    }

    // set random pieces in the given drag and drop grid using a given element as the event handler
    setRandomPiecesButton(gridContainerElement, piecesContainerElement){
        this.#randomPlacementElement.addEventListener("click", () => {
            //console.log('randomly placed pieces');
            this.#setup.setRandomPieces();
            this.loadSetGridPieces(gridContainerElement);
            this.updateDragAndDropPieces(piecesContainerElement, true);
            this.#randomAudio.play();
        })
    }

    // function to get the proper desired src string
    getImageSrc(pieceName, rotation){
        if(rotation == 'horizontal'){
            if(pieceName == 'carrier')    return this.#carrierh;
            if(pieceName == 'battleship') return this.#battleshiph;
            if(pieceName == 'destroyer')  return this.#destroyerh;
            if(pieceName == 'submarine')  return this.#submarineh;
            if(pieceName == 'patrolboat') return this.#patrolboath;
        }
        if(rotation == 'vertical'){
            if(pieceName == 'carrier')    return this.#carrierv;
            if(pieceName == 'battleship') return this.#battleshipv;
            if(pieceName == 'destroyer')  return this.#destroyerv;
            if(pieceName == 'submarine')  return this.#submarinev;
            if(pieceName == 'patrolboat') return this.#patrolboatv;
        }
    }

    // set the pieces drag image when it starts to be dragged
    setPieceDragImage(item){
            // get location of image to later show whole piece being picked up
            let imgLocation = item.target.src;
            let imgString = imgLocation.match(/[^\/]+(?=\.png)/g);
            // get string location of image to properly show image in relation to mouse cursor adjustment
            let imgAdjust = imgString.toString().match(/\(.*\)/g);
            imgAdjust = imgAdjust.toString().replace(/\(|\)/g, '');
            let imgXAdjust = imgAdjust.toString().replace(/.+,/g, '');
            let imgYAdjust = imgAdjust.toString().match(/.+(?=,)/g).toString();
            //console.log(imgXAdjust, imgYAdjust);
            // set piece location to adjust to match mouse cliciked piece location
            if(imgXAdjust == 1){
                imgXAdjust = 50;
                imgYAdjust = (imgYAdjust * 100) - 50;
            }
            if(imgYAdjust == 1){
                imgXAdjust = (imgXAdjust * 100) - 50;
                imgYAdjust = 50;
            }
            //console.log(imgXAdjust, imgYAdjust);
            // get piece name and rotation
            let imgRotation = imgLocation.toString().match(/horizontal(?=\/)|vertical(?=\/)/g).toString();
            let imgPieceName = imgString.toString().replace(/-.*/g, '').toString();
            //console.log(imgRotation, imgPieceName);
            let img = this.getImageSrc(imgPieceName, imgRotation);
            item.dataTransfer.setDragImage(img, imgXAdjust/2, imgYAdjust/2);
            item.dataTransfer.setData("text", item.target.id);
    }

    // event on the start of the drag
    dragStart(item){
        //console.log('ran dragstart from setup.js');
        this.saveDragAndDropGrid(this.#gridContainerElement);
        if ((Helper.parseElementIdForMatrixLocation(item.target.parentNode.id)).length == 2){
            this.#dragStartAudio.play();
            this.setPieceDragImage(item);
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
            if(item.target.parentNode.parentNode){
                if(item.target.parentNode.parentNode.parentNode.id != null && !setDraggedOver){
                    if(item.target.parentNode.parentNode.parentNode.id.includes('bsr__table-cell')){
                        this.#setup.setDraggedOverPieceInfo(item.target.parentNode.parentNode);
                        setDraggedOver = true;
                    }
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
            this.#dragOverAudio.play();
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
        this.#dragDropAudio.play();
        this.#setup.removePieceIfNeeded();
        this.#setup.setPieceLocationsAndCount();
        this.updateDragAndDropPieces(this.#piecesContainerElement, true);
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

        this.loadBlankGrid(this.#gridContainerElement);
        this.updateDragAndDropPieces(this.#piecesContainerElement, this.#removePiecesElement);
        this.setRotatePiecesButton(this.#rotatePiecesElement, this.#piecesContainerElement);
        this.setRemoveAllPiecesButton(this.#removeAllPiecesElement, this.#piecesContainerElement, this.#gridContainerElement);
        this.setRandomPiecesButton(this.#gridContainerElement, this.#piecesContainerElement);
        //this.setRemovePiecesElement(this.#removePiecesElement);
    }
}