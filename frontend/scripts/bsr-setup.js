// Methods for interacting with the players using grid pieces and grid (player interaction on clientside)

import { BsrCreateGrids } from "./bsr-creategrids.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { Helper } from "./helper.js";
import { bsrGeneralInfo, bsrPieceInteractors, bsrGridInternals } from "./bsr-config.js";

export { BsrSetup };

class BsrSetup{

    #piecesData;
    #piecesIdsAndInternals;
    #dragAndDropGrid;

    #horizontal;
    #vertical;
    #pieceRotation;

    #desiredPiecesType;

    #draggedPieceName;
    #draggedPieceIds;
    #draggedPieceInternals;
    #draggedPieceClickedLocation;
    #draggedPieceFirstLocation;
    #draggedPieceLastLocation;

    #defaultDraggedOverId;

    #gridPieceClickedId;
    #gridPieceIds;
    #gridPieceClickedLocation;
    #gridPieceLocationChecked;
    #draggedOverGridPieceId;
    #draggedOverPieceClassName;
    #draggedOverGridPiece;
    #previousDraggedOverGridPiece;
    #draggedOverDirectId;

    #possiblePlacementLocations;
    
    #canUpdatePieces;
    #isUsingPlacedPiece;
    #setPieceClassName;
    #usingPlacedPiece;
    #willPieceBeRemoved;
    #pieceWasRemoved;

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

    constructor(piecesData = new BsrPiecesData(), dragAndDropGrid = BsrCreateGrids.getDragAndDropGrid()){
        // create and assign pieces objects to be used with the grid
        this.#piecesData = piecesData;
        this.#piecesIdsAndInternals = [];
        this.#dragAndDropGrid = dragAndDropGrid;

        this.#horizontal = bsrGeneralInfo.horizontal;
        this.#vertical = bsrGeneralInfo.vertical;
        this.#pieceRotation = this.#horizontal;

        this.#desiredPiecesType = {};

        this.#draggedPieceName = '';
        this.#draggedPieceIds = [];
        this.#draggedPieceInternals = [];
        this.#draggedPieceClickedLocation = [];
        this.#draggedPieceFirstLocation = [];
        this.#draggedPieceLastLocation = [];

        this.#defaultDraggedOverId = 'bsr__table-cell-(0,0)';
        
        this.#gridPieceClickedId = '';
        this.#gridPieceIds = [];
        this.#gridPieceClickedLocation = [];
        this.#gridPieceLocationChecked = false;
        this.#draggedOverGridPieceId = '';
        this.#draggedOverPieceClassName = '';
        this.#draggedOverGridPiece = [];
        this.#previousDraggedOverGridPiece = [];
        this.#draggedOverDirectId = '';
        
        this.#possiblePlacementLocations = [];

        this.#canUpdatePieces = true;
        this.#isUsingPlacedPiece = false;
        this.#setPieceClassName = '';
        this.#usingPlacedPiece = {};
        this.#willPieceBeRemoved = false;
        this.#pieceWasRemoved = false;

        //---------------------------------------------------------------------
        // parts for event listeners
        this.#gridContainerElement = "some__html-element";
        this.#piecesContainerElement = "some__html-element";
        this.#rotatePiecesElement = "some__html-element";
        this.#removeAllPiecesElement = "some__html-element"
        this.#removePiecesElement = "some__html-element";
        this.#randomPlacementElement = "some__html-element";

        this.#canPlacePiece = false;
        this.#removedPreviousPiece = false;
        this.#tempGrid;
        this.#time = 10;
        this.#dragging = false;
        
        //console.log(this.#tableRowsOffset, this.#tableColumnsOffset);
    }

    //-------------------------------------------------------------------------
    // for getting various information during setup

    // a return to see if the current location can be used
    canUseCurrentLocation(){
        return this.#canUpdatePieces;
    }

    // get the pieces data table
    getPiecesData(){
        return this.#piecesData;
    }

    // get the drag and drop grid of the drag and drop table
    getDragAndDropGrid(){
        return this.#dragAndDropGrid;
    }

    // return currently used table
    getCurrentlyPlaceablePiece(){
        return this.#possiblePlacementLocations;
    }

    // return the already placed piece id's
    getPlacedPieceIds(){
        return this.#gridPieceIds;
    }

    // return the dragged piece location
    getDraggedPieceLocation(){
        return this.#draggedOverGridPiece;
    }
    
    // return the dragged piece ids and internals
    getDraggedPieceIdsAndInternals(){
        return [this.#draggedPieceIds, this.#draggedPieceInternals];
    }

    // get the placed pieces ids and internals
    getPiecesIdsAndInternals(){
        return this.#piecesIdsAndInternals;
    }

    // get the updated class name of the dragged over piece
    getDraggedOverPieceClassName(){
        return this.#setPieceClassName;
    }

    //get number of play pieces left
    getNumberOfPlaceablePiecesLeft(){
        return this.#piecesData.getPlaceablePiecesLeft();
    }

    // return the remover div for removing pieces from the board
    getPieceRemover(){
        return bsrPieceInteractors.dragAndDropPieceRemover;
    }

    // return locally clicked grid piece location
    getLocalClickedPiece(){
        return this.#gridPieceClickedLocation;
    }

    // get the updated placeable board pieces waiting to be placed
    getUpdatedRotatedPieces(){
        return this.#piecesData.getPlacementPieces(this.#pieceRotation);
    }

    // return if the piece was removed or not
    checkIfPieceWasRemoved(){
        return this.#pieceWasRemoved;
    }

    //-------------------------------------------------------------------------
    // setup basic information

    // set rotation of pieces during grid setup
    #changeBoardPieceRotation(){
        if(this.#pieceRotation == this.#vertical ? this.#pieceRotation = this.#horizontal : this.#pieceRotation = this.#vertical);
        this.#canUpdatePieces = true;
    }

    //// set default dragged over id as a backup id
    //setDefaultDraggedOverId(defaultId = "example__id-(0,0)"){
    //    this.#defaultDraggedOverId = defaultId;
    //}

    // set clicked piece content
    setClickedPieceInfo(piece){
        let pieceDraggedId = piece.id;
        this.#draggedPieceClickedLocation = Helper.parseElementIdForMatrixLocation(pieceDraggedId);
        let name = pieceDraggedId.match(/--.*-/g);
        name = name.toString().replace(/--|-/g, '');
        this.#draggedPieceName = name.toString();
        console.log("clicked piece", this.#draggedPieceClickedLocation, this.#draggedPieceName);
        
        let pieceLocalId = piece.parentNode.parentNode.id;
        this.#gridPieceClickedId = pieceLocalId;
        this.#gridPieceClickedLocation = Helper.parseElementIdForMatrixLocation(pieceLocalId);
        this.#gridPieceLocationChecked = false;
        this.#gridPieceIds = [];
        console.log("local click piece", this.#gridPieceClickedLocation);
    }

    // get content that piece was dragged over
    setDraggedOverPieceInfo(piece){
        let pieceDirectId = piece.id;
        this.#draggedOverDirectId = pieceDirectId;
        
        let pieceDirectClassName = piece.className;
        this.#draggedOverPieceClassName = pieceDirectClassName;
        //console.log(this.#draggedOverPieceClassName);
        
        let pieceCellId = piece.parentNode.id;
        this.#draggedOverGridPieceId = pieceCellId;
        this.#draggedOverGridPiece = Helper.parseElementIdForMatrixLocation(pieceCellId);
        //console.log('dragged over', this.#draggedOverGridPieceId, this.#draggedOverGridPiece);
    }

    //-------------------------------------------------------------------------
    // checking and setting of pieces

    // simply check if a piece was already placed on the board (we will have to update the pieces new location then)---
    #checkIfPieceWasAlreadyPlaced(){
        this.#isUsingPlacedPiece = false;
        this.#draggedPieceIds = [];
        this.#usingPlacedPiece = this.#piecesData.getPieceHavingDataTableOverlap([this.#gridPieceClickedLocation]);
        if(this.#usingPlacedPiece){
            this.#isUsingPlacedPiece = true;
            this.#canUpdatePieces = true;
        }
    }

    // will check and set the rotation and locations of the chosen piece (will keep already placed piece rotations)
    #checkAndSetRotationAndLocationsOfChosenPiece(){
        let oldRotation = this.#pieceRotation;
        if(this.#isUsingPlacedPiece){
            this.#pieceRotation = this.#usingPlacedPiece.rotation;
            //this.#updatePossiblePieces();
        }
        this.#setDraggedPieceFirstAndLastLocations();
        this.#checkIfPieceFitsOnGrid();
        this.#setPossiblePlacementLocations();
        this.#pieceRotation = oldRotation;
        //this.#updatePossiblePieces();
    }

    // set the dragged pieces first and last locations
    #setDraggedPieceFirstAndLastLocations(){
        let draggedPieceFirstLocationMatch;
        let draggedPieceLastLocationMatch;
        if (this.#pieceRotation == this.#horizontal){
            // find starting positions
            // horizontal between 2 and 11, vertical between 3 and 12, meaning lowest value can be [3,2] and highest can be [12, 11]
            // corresponds to the actual table locations
            draggedPieceFirstLocationMatch = this.#draggedOverGridPiece[1] - this.#draggedPieceClickedLocation[1] + 1;
            draggedPieceLastLocationMatch = this.#draggedOverGridPiece[1] + (this.#desiredPiecesType.size - Number(this.#draggedPieceClickedLocation[1]));
            this.#draggedPieceFirstLocation = [this.#draggedOverGridPiece[0], draggedPieceFirstLocationMatch];
            this.#draggedPieceLastLocation = [this.#draggedOverGridPiece[0], draggedPieceLastLocationMatch];
            //console.log(this.#draggedPieceFirstLocation, this.#draggedPieceLastLocation);
        }
        if (this.#pieceRotation == this.#vertical){
            // find starting positions
            draggedPieceFirstLocationMatch = this.#draggedOverGridPiece[0] - this.#draggedPieceClickedLocation[0] + 1;
            draggedPieceLastLocationMatch = this.#draggedOverGridPiece[0] + (this.#desiredPiecesType.size - this.#draggedPieceClickedLocation[0]);
            this.#draggedPieceFirstLocation = [draggedPieceFirstLocationMatch, this.#draggedOverGridPiece[1]];
            this.#draggedPieceLastLocation = [draggedPieceLastLocationMatch, this.#draggedOverGridPiece[1]];
            //console.log(this.#draggedPieceFirstLocation, this.#draggedPieceLastLocation);
        }
    }

    // check if a piece fits on the drag and drop grid or not
    #checkIfPieceFitsOnGrid(){
        if(this.#usingPlacedPiece){
            this.#canUpdatePieces = this.#dragAndDropGrid.checkIfPieceLocationsAreInGridBoundries(this.#draggedPieceFirstLocation, this.#draggedPieceLastLocation, this.#usingPlacedPiece.rotation);
        }
        else{
            this.#canUpdatePieces = this.#dragAndDropGrid.checkIfPieceLocationsAreInGridBoundries(this.#draggedPieceFirstLocation, this.#draggedPieceLastLocation, this.#pieceRotation);
        }
    }

    // set the placement locations of the piece in correspondence to the grid
    #setPossiblePlacementLocations(){
        let pieceLocations = this.#piecesData.getPiecePossibleLocations(this.#desiredPiecesType.name, this.#draggedPieceFirstLocation, this.#pieceRotation);
        this.#possiblePlacementLocations = pieceLocations;
    }

    // check to see if a piece will overlap a placed piece or not
    #checkIfPieceWillOverlapPlacedPiece(){
        // check if there is an overlap in possible placements
        let overlap = this.#piecesData.getPieceHavingDataTableOverlap(this.#possiblePlacementLocations);
        if(overlap){
            if(this.#usingPlacedPiece){
                let isSamePiece = Helper.checkIfArraysAreEqual(overlap.locations, this.#usingPlacedPiece.locations);
                // if the overlap is coming from the same placed piece that we are dragging
                if(isSamePiece){
                    // check and see if the overlap would go out of bounds or would be accidentally overlapping another seperate piece
                    this.#checkIfPieceFitsOnGrid();
                    let overallPossibleOverlapLocations = this.#possiblePlacementLocations.concat(this.#usingPlacedPiece.locations);
                    //console.log('checking placement locations', overallPossibleOverlapLocations);
                    let overlappingPieces = this.#piecesData.getAllPiecesHavingDataTableOverlap(overallPossibleOverlapLocations);
                    //console.log('overlap', overlappingPieces);
                    (overlappingPieces.length < 2 && this.#canUpdatePieces ? this.#canUpdatePieces = true : this.#canUpdatePieces = false);
                }
                else{
                    this.#canUpdatePieces = false;
                }
            }
            if(!this.#usingPlacedPiece){
                this.#canUpdatePieces = false;
                }
        }
    }

    // check if the piece will be removed or not (once thrown into a remover div)
    #checkIfPieceWillBeRemoved(){
        this.#willPieceBeRemoved = false;
        if(this.#draggedOverDirectId == bsrPieceInteractors.dragAndDropPieceRemoverId && this.#isUsingPlacedPiece){
            //console.log('will be removed');
            this.#willPieceBeRemoved = true;
        }
    }

    // sets if the class name that is returned with the piece should be enabled or disabled depending on if the piece can be placed or not
    #setPieceClassEnabledOrDisabled(){
        if (this.#draggedOverPieceClassName.includes(bsrGridInternals.dragAndDropClassName)){
            this.#setPieceClassName = this.#draggedOverPieceClassName + 'disabled';
            if (this.#canUpdatePieces){
                // if we are using an already placed piece
                if(this.#isUsingPlacedPiece){
                    this.#setPieceClassName = Helper.parsePartOfStringToReplace(this.#draggedOverPieceClassName, '--', '--enabled');
                }
                // if we are using a piece that has not been placed and there are still possible pieces that can be placed
                if(!this.#isUsingPlacedPiece && this.#piecesData.getPlaceablePiecesLeft()[this.#draggedPieceName] > 0){
                    this.#setPieceClassName = Helper.parsePartOfStringToReplace(this.#draggedOverPieceClassName, '--', '--enabled');
                }
            }
        }
        else{
            this.#setPieceClassName = this.#draggedOverPieceClassName;
        }
    }

    // check if the piece can be put into the table by filling a temporary locations array of the current piece
    // and set the pieces to be able to be updated or not (this is the primary runtime function)
    checkAndSetPieceLocations(){
        this.#checkIfPieceWillBeRemoved();
        // make sure we aren't calculating the same dragged over piece again and again
        if (!Helper.checkIfArraysAreEqual(this.#previousDraggedOverGridPiece, this.#draggedOverGridPiece)){
            this.#canUpdatePieces = true;
            this.#previousDraggedOverGridPiece = this.#draggedOverGridPiece;
            // get the desired piece type for checking and setting
            this.#desiredPiecesType = this.#piecesData.getPlayPieceTypeByName(this.#draggedPieceName);
            this.#draggedPieceInternals = this.#piecesData.getPieceInternals(this.#draggedPieceName, this.#pieceRotation);
            this.#checkIfPieceWasAlreadyPlaced();
            this.#checkAndSetRotationAndLocationsOfChosenPiece();
            // set our grid piece ids for various purposes
            this.#draggedPieceIds = this.#piecesData.getCreateIdsOfTableLocations(this.#draggedOverGridPieceId, this.#possiblePlacementLocations);
            if (!this.#gridPieceLocationChecked && this.#isUsingPlacedPiece){
                this.#gridPieceIds = this.#piecesData.getCreateIdsOfTableLocations(this.#gridPieceClickedId, this.#usingPlacedPiece.locations);
            }
            this.#checkIfPieceWillOverlapPlacedPiece();
            this.#setPieceClassEnabledOrDisabled();
            this.#gridPieceLocationChecked = true;
        }
    }

    // remove an undesired piece from the pieces data table---
    removePieceIfNeeded(){
        this.#pieceWasRemoved = false;
        if(this.#willPieceBeRemoved && !Helper.checkIfArraysAreEqual(this.#gridPieceClickedLocation, [0,0])){
            //console.log(this.#usingPlacedPiece);
            this.#piecesData.removePieceInDataTable(this.#usingPlacedPiece.id);
            this.#pieceWasRemoved = true;
        }
    }

    // reset an already placed pieces location---
    #relocatePlacedPiece(){
        this.#piecesData.relocatePlacedPieceInDataTable(this.#usingPlacedPiece.id, this.#possiblePlacementLocations);
    }

    // set the newly placed piece into the piece data table
    #setNewlyPlacedPiece(){
        this.#piecesData.setNewlyPlacedPiece(this.#draggedPieceName, this.#pieceRotation, this.#possiblePlacementLocations);
    }

    // some functions require an attribute id location to use, if there isn't an initial one you can put another one here
    #getAttributeLocationIdToUse(){
        let useAttributeId = this.#draggedOverGridPieceId;
        if (!useAttributeId.includes('bsr__table-cell-')){
            return useAttributeId = this.#gridPieceClickedId;
        }
        return useAttributeId;
    }

    // if the piece can be set in the table, then do so
    setPieceLocationsAndCount(){
        if(this.#canUpdatePieces && this.#draggedPieceName){
            if(this.#usingPlacedPiece){
                this.#relocatePlacedPiece();
            }
            if(!this.#usingPlacedPiece){
                this.#setNewlyPlacedPiece();
            }
        }
        this.#piecesIdsAndInternals = this.#piecesData.getPiecesWithIdsAndInternals(this.#getAttributeLocationIdToUse());
        //console.log(this.#piecesData.getPiecesDataTable());
    }

    // set pieces randomly into the pieces data table
    #setRandomPieces(){
        this.#piecesData.fillDataTableRandomly();
        this.#draggedOverGridPieceId = this.#defaultDraggedOverId;
        this.setPieceLocationsAndCount();
        console.log(this.#piecesData.getPiecesDataTable());
    }

    //-------------------------------------------------------------------------
    // callable anonymous functions for use with event listeners outside of setup

    // put all the placeable pieces together
    #combinedPieces = function(){
        let container = bsrPieceInteractors.piecesContainer;
        let beginning = container.substring(0, container.indexOf('>') + 1);
        let ending = container.substring(container.lastIndexOf('<'), container.length);
        // we will add the remover here to the play pieces as of now (ease of use)
        let remover = bsrPieceInteractors.dragAndDropPieceRemover;
        let pieces = this.getUpdatedRotatedPieces();
        let piecesLeft = this.getNumberOfPlaceablePiecesLeft();
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
    gridUpdateDragAndDropPieces = function(piecesContainerElement){
        piecesContainerElement.innerHTML = this.#combinedPieces();
    }

    // load a blank drag and drop grid using some givne element and it's id
    loadBlankGrid = function(gridContainerElement){
        gridContainerElement.innerHTML = this.getDragAndDropGrid().getGrid();
    }

    // save the grid of the current drag and drop table
    saveDragAndDropGrid = function(gridContainerElement){
        this.#dragAndDropGrid.saveGrid(gridContainerElement.innerHTML);
    }

    // reload the drag and drop grid
    reloadDragAndDropGrid = function(gridContainerElement){
        gridContainerElement.innerHTML = this.#dragAndDropGrid.loadGrid();
    }

    // load a blank grid and place all the set pieces from the pieces data table
    loadSetGridPieces = function(gridContainerElement){
        this.loadBlankGrid(gridContainerElement);
            let piecesAndPlacement = this.getPiecesIdsAndInternals();
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
        let previousPlacement = this.getPlacedPieceIds();
        //console.log('previous placement',previousPlacement);
        if(previousPlacement){
            let previousPlacementLength = previousPlacement.length;
            for (let i = 0; i < previousPlacementLength; i++){
                document.getElementById(previousPlacement[i]).innerHTML = this.#dragAndDropGrid.getDragAndDropCleanInternal();
            }
        }
    }

    // update the plots being dragged over with highlighting using the grid ids generated
    loadHighlighting = function(){
        let currentPlacement = this.getDraggedPieceIdsAndInternals();
        let currentClassName = this.getDraggedOverPieceClassName();
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
    setRotatePiecesButton = function(rotateButtonElement, piecesContainerElement){
        rotateButtonElement.onclick = () => {
            //console.log('rotationg pieces');
            this.#changeBoardPieceRotation();
            this.gridUpdateDragAndDropPieces(piecesContainerElement);
        }
    }

    // set the remove all pieces element
    setRemoveAllPiecesButton = function(removeAllPiecesElement, piecesContainerElement, gridContainerElement){
        removeAllPiecesElement.onclick = () => {
            this.#piecesData.clearPiecesDataTable();
            this.gridUpdateDragAndDropPieces(piecesContainerElement);
            this.loadBlankGrid(gridContainerElement);
        }
    }

    // set the piece remover
    setRemovePiecesElement = function(removePiecesElement){
        removePiecesElement.innerHTML = this.getPieceRemover();
    }

    // set random pieces in the given drag and drop grid using a given element as the event handler
    setRandomPiecesButton = function(gridContainerElement, piecesContainerElement){
        this.#randomPlacementElement.addEventListener("click", () => {
            //console.log('randomly placed pieces');
            this.#setRandomPieces();
            this.loadSetGridPieces(gridContainerElement);
            this.gridUpdateDragAndDropPieces(piecesContainerElement);
        })
    }

    // event on the start of the drag
    bsrDragStart = function(item){
        //console.log('ran dragstart from setup.js');
        this.saveDragAndDropGrid(this.#gridContainerElement);
        if ((Helper.parseElementIdForMatrixLocation(item.target.parentNode.id)).length == 2){
            this.setClickedPieceInfo(item.target.parentNode);
        }
    }

    // event function to take place on dragging over container pieces
    bsrDragOver = function(item){
        //console.log('ran dragover from setup.js');
        this.#dragging = true;
        let setDraggedOver = false;
        //console.log(item.target.parentNode.parentNode.parentNode)
        if(item.target.parentNode){
            //console.log(item.target.parentNode);
            if(item.target.parentNode.parentNode.parentNode.id != null && !setDraggedOver){
                if(item.target.parentNode.parentNode.parentNode.id.includes('bsr__table-cell')){
                    this.setDraggedOverPieceInfo(item.target.parentNode.parentNode);
                    setDraggedOver = true;
                }
            }
            if(!setDraggedOver){
                this.setDraggedOverPieceInfo(item.target);
            }
            this.checkAndSetPieceLocations();
            this.#canPlacePiece = this.canUseCurrentLocation();
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
    bsrDragLeave = function(item){
        //console.log('ran dragleave from setup.js');
        this.#dragging = false;
        this.#removedPreviousPiece = false;
        //console.log(setup.getDraggedPieceLocation());
        //console.log(canPlacePiece);
        if (!this.#canPlacePiece || !Helper.checkIfArraysAreEqual(this.getDraggedPieceLocation(), [0,0])){
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
    bsrDragDrop = function(item){
        //console.log('ran drop from setup.js');
        this.removePieceIfNeeded();
        this.setPieceLocationsAndCount();
        this.gridUpdateDragAndDropPieces(this.#piecesContainerElement);
        if(!this.#canPlacePiece){
            //console.log('using old table');
            this.reloadDragAndDropGrid(this.#gridContainerElement);
        }
        if(this.#canPlacePiece || this.checkIfPieceWasRemoved()){
            this.loadSetGridPieces(this.#gridContainerElement);
        }
        this.#dragging = true;
        this.#removedPreviousPiece = false;
    }

    // some things initially placed to set up the various game objects
    bsrInitializeSetup(gridContainerElement, piecesContainerElement, rotatePiecesElement, removeAllPiecesElement, removePiecesElement, randomPlacementElement){
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

        this.gridUpdateDragAndDropPieces(this.#piecesContainerElement);
        this.loadBlankGrid(this.#gridContainerElement);
        this.setRotatePiecesButton(this.#rotatePiecesElement, this.#piecesContainerElement);
        this.setRemoveAllPiecesButton(this.#removeAllPiecesElement, this.#piecesContainerElement, this.#gridContainerElement);
        this.setRandomPiecesButton(this.#gridContainerElement, this.#piecesContainerElement);
        //this.setRemovePiecesElement(this.#removePiecesElement);
    }

}