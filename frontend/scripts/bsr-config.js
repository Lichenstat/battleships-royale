// bsr properties to use with various other bsr files

export { bsrGridProperties, bsrGeneralInfo, bsrGridPieces, bsrGridInternals, bsrPieceInteractors }

// for the bsr tables
const bsrGridProperties = {
    class : 'bsr__table',
    classEnabled : 'bsr__table bsr__table--enabled',
    classDisabled : 'bsr__table bsr__table--disabled',
    id : 'bsr__table',
    tableHeadColumnCount : 1,
    tableFootColumnCount : 0,
    rows : 11,
    columns : 11,
    rowsNameAndIndexSize : 2,
    columnsIndexSize : 1,
    content : {'(1,1)' : 'name',
               '(2,1)' : ' ', '(2,2)' : '1', '(2,3)' : '2', '(2,4)' : '3', '(2,5)' : '4', '(2,6)' : '5', '(2,7)' : '6', '(2,8)' : '7', '(2,9)' : '8', '(2,10)' : '9', '(2,11)' : '10',
               '(3,1)' : 'A', '(4,1)' : 'B', '(5,1)' : 'C', '(6,1)' : 'D', '(7,1)' : 'E', '(8,1)' : 'F', '(9,1)' : 'G', '(10,1)' : 'H', '(11,1)' : 'I', '(12,1)' : 'J'} 
}

// general info for bsr stuff
const bsrGeneralInfo = {
    horizontal : 'horizontal',
    vertical : 'vertical'
}

// for information on play pieces
const bsrGridPieces = {
    carrierHorizontal : { count : 1, size : 5, name : 'carrier', class : 'bsr__table bsr__table--enabled bsr__table--carrier-horizontal', id: 'bsr__table--carrier', rows : 1, columns : 5, content : '' },
    carrierVertical : { count : 1, size : 5, name : 'carrier', class : 'bsr__table bsr__table--enabled bsr__table--carrier-vertical', id: 'bsr__table--carrier', rows : 5, columns : 1, content : '' },
    battleshipHorizontal : { count : 2, size : 4, name : 'battleship', class : 'bsr__table bsr__table--enabled bsr__table--battleship-horizontal', id: 'bsr__table--battleship', rows : 1, columns : 4, content : '' },
    battleshipVertical : { count : 2, size : 4, name : 'battleship', class : 'bsr__table bsr__table--enabled bsr__table--battleship-vertical', id: 'bsr__table--battleship', rows : 4, columns : 1, content : '' },
    destroyerHorizontal : { count : 2, size : 3, name : 'destroyer', class : 'bsr__table bsr__table--enabled bsr__table--destroyer-horizontal', id: 'bsr__table--destroyer', rows : 1, columns : 3, content : '' },
    destroyerVertical : { count : 2, size : 3, name : 'destroyer', class : 'bsr__table bsr__table--enabled bsr__table--destroyer-vertical', id: 'bsr__table--destroyer', rows : 3, columns : 1, content : '' },
    submarineHorizontal : { count : 2, size : 3, name : 'submarine', class : 'bsr__table bsr__table--enabled bsr__table--submarine-horizontal', id: 'bsr__table--submarine', rows : 1, columns : 3, content : '' },
    submarineVertical : { count : 2, size : 3, name : 'submarine', class : 'bsr__table bsr__table--enabled bsr__table--submarine-vertical', id: 'bsr__table--submarine', rows : 3, columns : 1, content : '' },
    patrolboatHorizontal : { count : 3, size : 2, name : 'patrolboat', class : 'bsr__table bsr__table--enabled bsr__table--patrolboat-horizontal', id: 'bsr__table--patrolboat', rows : 1, columns : 2, content : '' },
    patrolboatVertical : { count : 3, size : 2, name : 'patrolboat', class : 'bsr__table bsr__table--enabled bsr__table--patrolboat-vertical', id: 'bsr__table--patrolboat', rows : 2, columns : 1, content : '' },
}

// for the various grid internals
const bsrGridInternals = {
    // drag and drop pieces
    dragAndDropId : "bsr__placementplot",
    dragAndDropClassName : "bsr__placementplot",
    dragAndDrop : '<div class="bsr__placementplot bsr__placementplot--" id="bsr__placementplot" ondrop="dropBoardPiece(event)" ondragover="allowDropBoardPiece(event)"></div>',
    dragAndDropItemId : "bsr__boardpiece",
    dragAndDropItemClassName : "bsr__boardpiece",
    dragAndDropItemAttributeDraggable : ' draggable="true"',
    dragAndDropItemAttributeOndragstart : ' ondragstart="dragBoardPiece\\(event\\)"',
    dragAndDropItem : '<div class="bsr__boardpiece bsr__boardpiece--" id="bsr__boardpiece--" draggable="true" ondragstart="dragBoardPiece(event)"><img class="bsr__pieceimage" id="bsr__pieceimage" src=""></div>',
    dragAndDropItemImageId : "bsr__pieceimage",
    dragAndDropItemImage : '<img class="bsr__pieceimage" id="bsr__pieceimage" src="">',

    // board button pieces
    boardButtonId : "bsr__boardbutton",
    boardButtonClassName : "bsr__boardbutton",
    boardButtonEnabled : '<button class="bsr__boardbutton bsr__boardbutton--enabled" id="bsr__boardbutton" type="button"></button>',
    boardButtonDisabled : '<button class="bsr__boardbutton bsr__boardbutton--disabled" id="bsr__boardbutton" type="button" disabled><img class="bsr__pieceimage" id="bsr__pieceimage" src=""><img class="bsr__outcomeimage" id="bsr__outcomeimage" src=""></button>',

    // player pieces
    playerPieceId : 'bsr__playerplot',
    playerPieceClassName : 'bsr__playerplot',
    playerPieceEmpty : '<div class="bsr__playerplot bsr__playerplot--" id="bsr__playerplot"><img class="bsr__pieceimage" id="bsr__pieceimage" src=""><img class="bsr__outcomeimage" id="bsr__outcomeimage" src=""></div>',
    playerPieceOutcomeImageId: "bsr__outcomeimage",
    playerPieceBlankOutcomeImage : '<img class="bsr__outcomeimage" id="bsr__outcomeimage" src="">',

    // src for certain images
    missImage : "./frontend/assets/board-pieces/outcome/miss.png",
    hitImage : "./frontend/assets/board-pieces/outcome/hit.png",
}

// for interacting with various grid pieces
const bsrPieceInteractors = {
    dragAndDropPieceRemoverId : "bsr__pieceremover",
    dragAndDropPieceRemover : '<div class="bsr__pieceremover" id="bsr__pieceremover" ondrop="dropBoardPiece(event)" ondragover="allowDropBoardPiece(event)"></div>',

    piecesContainerId : "bsr__piecescontainer",
    piecesContainer : '<div class="bsr__piecescontainer" id="bsr__piecescontainer"></div>'
}
