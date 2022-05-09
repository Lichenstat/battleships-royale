// bsr properties to use with various other bsr files

export { bsrGridProperties, bsrPlotProperties, bsrGridPieces, bsrGridInternals }

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
    content : {'(1,1)' : 'name',
               '(2,1)' : ' ', '(2,2)' : 'A', '(2,3)' : 'B', '(2,4)' : 'C', '(2,5)' : 'D', '(2,6)' : 'E', '(2,7)' : 'F', '(2,8)' : 'G', '(2,9)' : 'H', '(2,10)' : 'I', '(2,11)' : 'J',
               '(3,1)' : '1', '(4,1)' : '2', '(5,1)' : '3', '(6,1)' : '4', '(7,1)' : '5', '(8,1)' : '6', '(9,1)' : '7', '(10,1)' : '8', '(11,1)' : '9', '(12,1)' : '10'} 
}

// for the bsr plots/squares
const bsrPlotProperties = {
    class : 'bsr__plot',
    classEnabled : 'bsr__plot bsr__plot--enabled',
    classDisabled : 'bsr__plot bsr__plot--disabled',
    id : 'bsr__plot',
    type : 'button',
    enabled : true,
    disabled : false,
    internalText : ''
}

// information on play pieces
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

const bsrGridInternals = {
    dragAndDrop : '<div class="bsr__placementplot bsr__placementplot-disabled" id="bsr__placementplot" ondrop="dropBoardPiece(event)" ondragover="allowDropBoardPiece(event)">Generic Text</div>',
    dragAndDropItem : '<div class="bsr__boardpiece bsr__boardpiece--enabled" id="bsr__boardpiece" draggable="true" ondragstart="dragBoardPiece(event)">Drag Text</div>'
}

// for the bsr menu
/*
const bsrMenuProperties = {
    classMenu : 'bsr__menu',
    classEnabledMenu : 'bsr__menu--enabled',
    classDisabledMenu : 'bsr__menu--disabled',
    idMenu : 'bsr__menu',

    classInput : 'bsr__input',
    classEnabledInput : 'bsr__input--enabled',
    classDisabledInput : 'bsr__input--disabled',
    idInput : 'bsr__input',

    classCheckbox : 'bsr__checkbox',
    classCheckboxEnabled : 'bsr__checkbox--enabled',
    classCheckboxDisabled : 'bsr__checkbox--disabled',
    idCheckbox : 'bsr__checkbox',

    classPlayerTable : 'bsr__playertable',
    idPlayerTable : 'bsr__playertable',

    minNumberPlayers : '2',
    maxNumberPlayers : '9'
}
*/