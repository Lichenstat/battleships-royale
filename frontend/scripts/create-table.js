// CreateTable class to help with creating a table for use in html
// Can create and return a html table object

export { CreateTable } 

class CreateTable{
    constructor(className = 'generic__table', id = 'generic__table', tableHeadColumnCount = 0, tableFootColumnCount = 0, rows = 0, columns = 0, cellContents = {'all' : ''}){
        this.className = className;
        this.id = id;
        this.tableHeadColumnCount = tableHeadColumnCount;
        this.tableFootColumnCount = tableFootColumnCount;
        this.rows = rows;
        this.columns = columns;
        this.cellContents = cellContents;
        this.tableRow = 1;
        this.currentTable = this.#createHTMLTable();
    }

    // if there has been cell contents given during the creation process of the table
    // to fill the cell with, data goes by object such as {'(2,3)' : value, '(5,7)' : value}
    #setCellContents(location){
        let locationName = '('+ location[0] + ',' + location[1] + ')';
        if(this.cellContents){
            if(this.cellContents[locationName]){
                return this.cellContents[locationName];
            }
            if(this.cellContents['all']){
                return this.cellContents['all'];
            }
        }
        return '';
    }

    // create table cells via a given number of columns for a row in a table
    #createTableRow(numberOfCols){
        let finalizedRow = '<tr' + 
                     ' class=\"' + this.className + '-row' + '\"' + 
                     ' id=\"' + this.id + '-row-' + this.tableRow + '\"' + 
                     '>';
        // generate table cells ina  row via a number of columns
        for(let i = 1; i <= numberOfCols; i++){
            finalizedRow = finalizedRow + '<td ' + 
            ' class=\"' + this.className + '-cell' + '\"' +
            ' id=\"' + this.id + '-cell-(' + this.tableRow + ',' + i + ')' + '\"' +
            '>' +
            this.#setCellContents([this.tableRow, i]) +
            '</td>';
        }
        // end table elements and return finished table row with cells
        finalizedRow = finalizedRow + '</tr>';
        this.tableRow = this.tableRow + 1;
        return finalizedRow;
    }

    // create the table and return it
    #createHTMLTable(){
        // create beginning of the table
        let finalizedTable = 
        '<table' + 
        ' class=\"' + this.className + '\"' + 
        ' id=\"' + this.id + '\"' + 
        '>';
        // create table header (if it exists) an append to table
        if(!this.tableHeadColumnCount == 0){
            finalizedTable = finalizedTable + 
                            '<thead' + 
                            ' class=\"' + this.className + '-head' + '\"' +
                            ' id=\"' + this.id + '-head' + '\"' +
                            '>' +
                            this.#createTableRow(this.tableHeadColumnCount) + 
                            '</thead>';
        }
        // create and appending table body
        finalizedTable = finalizedTable + 
                        '<tbody>';
        for(let i = 1; i <= this.rows; i++){
            finalizedTable = finalizedTable + this.#createTableRow(this.columns);
        }
        finalizedTable = finalizedTable + 
                        '</tbody>';
        // create table footer (if it exists) and append to table
        if(!this.tableFootColumnCount == 0){
            finalizedTable = finalizedTable + 
                            '<tfoot' + 
                            ' class=\"' + this.className + '-foot' + '\"' +
                            ' id=\"' + this.id + '-foot' + '\"' +
                            '>' +
                            this.#createTableRow(this.tableFootColumnCount) + 
                            '</tfoot>';
        }
        // finished creating the table, add closing element and return table
        finalizedTable = finalizedTable + '</table>';
        this.tableRow = 1;
        return finalizedTable;
    }

    // set the html table properties when desiring to make a table
    setHTMLTableProperties(className, id, tableHeadColumnCount, tableFootColumnCount, rows, columns, cellContents){
        this.className = className;
        this.id = id;
        this.tableHeadColumnCount = tableHeadColumnCount;
        this.tableFootColumnCount = tableFootColumnCount;
        this.rows = rows;
        this.columns = columns;
        this.cellContents = cellContents;
        this.currentTable = this.#createHTMLTable();
    }

    // get the currently made html table to return
    getHTMLTable(){
        return this.currentTable;
    }

}