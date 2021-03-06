// Methods for interacting with the players grid setup using grid pieces and grid (player interaction on clientside)

import { BsrCreateGrids } from "./bsr-creategrids.js";
import { BsrPiecesData } from "./bsr-piecesdata.js";
import { bsrGeneralInfo, bsrPieceInteractors, bsrGridInternals } from "./bsr-config.js";
import { Helper } from "./helper.js";

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

    // put all the placeable pieces together
    getUpdatedDragAndDropPieces(addClassEffectToNonEmptyPieces = ""){
        let container = bsrPieceInteractors.piecesContainer;
        let beginning = container.substring(0, container.indexOf('>') + 1);
        let ending = container.substring(container.lastIndexOf('<'), container.length);
        let pieces = this.getUpdatedRotatedPieces();
        let piecesLeft = this.#piecesData.getNumberOfPlaceablePiecesLeft();
        let combined = '';
        //console.log(pieces);
        for (const [key, item] of Object.entries(pieces)){
            let addEffect = "";
            if (piecesLeft[key]){
                addEffect = addClassEffectToNonEmptyPieces;
            }
            let currentBeginning = Helper.parsePartOfStringToReplace(
                beginning, 
                'class="' + bsrPieceInteractors.piecesContainerId + '"', 
                'class="' + bsrPieceInteractors.piecesContainerId + " " + addEffect + " " + bsrPieceInteractors.piecesContainerId + "--" + key + '"'
                );
                let uppercaseKey = Helper.capitalizeFirstCharacterInString(key);
                if (uppercaseKey == 'Patrolboat'){
                    uppercaseKey = 'Patrol Boat';
                }
            combined = combined + (currentBeginning + uppercaseKey + ': ' + piecesLeft[key] + item + ending);
        }
        return combined;
    }

    //-------------------------------------------------------------------------
    // setup basic information to use

    // set rotation of pieces during grid setup
    changeBoardPieceRotation(){
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
        //console.log("clicked piece", this.#draggedPieceClickedLocation, this.#draggedPieceName);
        
        let pieceLocalId = piece.parentNode.parentNode.id;
        this.#gridPieceClickedId = pieceLocalId;
        this.#gridPieceClickedLocation = Helper.parseElementIdForMatrixLocation(pieceLocalId);
        this.#gridPieceLocationChecked = false;
        this.#gridPieceIds = [];
        //console.log("local click piece", this.#gridPieceClickedLocation);
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
    // checking and setting of pieces and parts

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

    // set pieces ids and internas whenever we desire on some sort of setup pieces data update
    #setPieceIdsAndInternals(){
        this.#piecesIdsAndInternals = this.#piecesData.getPiecesWithIdsAndInternals(this.#getAttributeLocationIdToUse());
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
        this.#setPieceIdsAndInternals();
        //console.log(this.#piecesData.getPiecesDataTable());
    }

    // set pieces randomly into the pieces data table
    setRandomPieces(){
        this.#piecesData.fillDataTableRandomly();
        this.#draggedOverGridPieceId = this.#defaultDraggedOverId;
        this.#setPieceIdsAndInternals();
        //console.log(this.#piecesData.getPiecesDataTable());
    }

    //-------------------------------------------------------------------------

}