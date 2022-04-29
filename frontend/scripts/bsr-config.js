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
    carrierHorizontal : { size : 5, class : 'bsr__playpiece bsr__playpiece--carrier-horizontal', id: 'bsr__playpiece--carrier', rows : 5, columns : 1, content : '' },
    carrierVertical : { size : 5, class : 'bsr__playpiece bsr__playpiece--carrier-vertical', id: 'bsr__playpiece--carrier', rows : 1, columns : 5, content : '' },
    battleshipHorizontal : { size : 4, class : 'bsr__playpiece bsr__playpiece--battleship-horizontal', id: 'bsr__playpiece--battleship', rows : 4, columns : 1, content : '' },
    battleshipVertical : { size : 4, class : 'bsr__playpiece bsr__playpiece--battleship-vertical', id: 'bsr__playpiece--battleship', rows : 1, columns : 4, content : '' },
    destroyerHorizontal : { size : 3, class : 'bsr__playpiece bsr__playpiece--destroyer-horizontal', id: 'bsr__playpiece--destroyer', rows : 3, columns : 1, content : '' },
    destroyerVertical : { size : 3, class : 'bsr__playpiece bsr__playpiece--destroyer-vertical', id: 'bsr__playpiece--destroyer', rows : 1, columns : 3, content : '' },
    submarineHorizontal : { size : 3, class : 'bsr__playpiece bsr__playpiece--submarine-horizontal', id: 'bsr__playpiece--submarine', rows : 3, columns : 1, content : '' },
    submarineVertical : { size : 3, class : 'bsr__playpiece bsr__playpiece--submarine-vertical', id: 'bsr__playpiece--submarine', rows : 1, columns : 3, content : '' },
    patrolboatHorizontal : { size : 2, class : 'bsr__playpiece bsr__playpiece--patrolboat-horizontal', id: 'bsr__playpiece--patrolboat', rows : 2, columns : 1, content : '' },
    patrolboatVertical : { size : 2, class : 'bsr__playpiece bsr__playpiece--patrolboat-vertical', id: 'bsr__playpiece--patrolboat', rows : 1, columns : 2, content : '' },
}

const bsrGridInternals = {
    dragAndDrop : '<div class="bsr__placementplot bsr__placementplot-disabled" id="bsr__placementplot" ondrop="dropBoardPiece(event)" ondragover="allowDropBoardPiece(event)">generic text</div>'
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