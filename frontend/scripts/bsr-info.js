// bsr properties to use with various other bsr files

export { bsrTableProperties, bsrPlotProperties }

// for the bsr tables
const bsrTableProperties = {
    class : 'bsr__table',
    classEnabled : 'bsr__table--enabled',
    classDisabled : 'bsr__table--disabled',
    id : 'bsr__table',
    tableHeadColumnCount : 0,
    tableFootColumnCount : 0,
    tableRows : 10,
    tableColumns : 10
}

// for the bsr plots/squares
const bsrPlotProperties = {
    class : 'bsr__plot',
    classEnabled : 'bsr__plot--enabled',
    classDisabled : 'bsr__plot--disabled',
    id : 'bsr__plot',
    type : 'button',
    enabled : true,
    disabled : false,
    internalText : ''
}
