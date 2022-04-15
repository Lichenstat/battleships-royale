// GenerateTable class to help with generating a table for use in html
// Can generate and return a html table object

export {GenerateTable} 

class GenerateTable{
    constructor(tableclass = 'generic-table', tableid = 'generic-table', tableheadcolumns = 0, tablefootcolumns = 0, rows = 0, columns = 0){
        this.tableclass = tableclass;
        this.tableid = tableid;
        this.tableheadcolumns = tableheadcolumns;
        this.tablefootcolumns = tablefootcolumns;
        this.rows = rows;
        this.columns = columns;
        this.tablerow = 1;
        this.currenttable = this.#generateHTMLTable();
    }

    // create table cells via a given number of columns for a row in a table
    #generateTableRow(numberofcols){
        let generatedrow = '<tr' + 
                     ' class=' + this.tableclass + '__row' + 
                     ' id=' + this.tableid + '__row-' + this.tablerow + 
                     '>';
        // generate table cells ina  row via a number of columns
        for(let i = 1; i <= numberofcols; i++){
            generatedrow = generatedrow + '<td ' + 
            ' class=' + this.tableclass + '__cell' +
            ' id=' + this.tableid + '__cell-(' + this.tablerow + ',' + i + ')' +
            '>' +
            '</td>';
        }
        // end table elements and return finished table row with cells
        generatedrow = generatedrow + '</tr>';
        this.tablerow = this.tablerow + 1;
        return generatedrow;
    }

    // generate the table and return it
    #generateHTMLTable(){
        // generating beginning of the table
        let generatedtable = 
        '<table' + 
        ' class=' + this.tableclass + 
        ' id=' + this.tableid + 
        '>';
        // generate table header (if it exists) an append to table
        if(!this.tableheadcolumns == 0){
            generatedtable = generatedtable + 
                            '<thead' + 
                            ' class=' + this.tableclass + '__head' +
                            ' id=' + this.tableid + '__head' +
                            '>' +
                            this.#generateTableRow(this.tableheadcolumns) + 
                            '</thead>';
        }
        // generating and appending table body
        generatedtable = generatedtable + 
                        '<tbody>';
        for(let i = 1; i <= this.rows; i++){
            generatedtable = generatedtable + this.#generateTableRow(this.columns);
        }
        generatedtable = generatedtable + 
                        '</tbody>';
        // generate table footer (if it exists) and append to table
        if(!this.tablefootcolumns == 0){
            generatedtable = generatedtable + 
                            '<tfoot' + 
                            ' class=' + this.tableclass + '__foot' +
                            ' id=' + this.tableid + '__foot' +
                            '>' +
                            this.#generateTableRow(this.tablefootcolumns) + 
                            '</tfoot>';
        }
        // finished generating the table, add closing element and return table
        generatedtable = generatedtable + '</table>';
        this.tablerow = 1;
        return generatedtable;
    }

    // set the html table properties when desiring to make a table
    setHTMLTableProperties(tableclass, tableid, tableheadcolumnnumber, tablefootcolumnnumber, rows, columns){
        this.tableclass = tableclass;
        this.tableid = tableid;
        this.tableheadcolumns = tableheadcolumnnumber;
        this.tablefootcolumns = tablefootcolumnnumber;
        this.rows = rows;
        this.columns = columns;
        this.currenttable = this.#generateHTMLTable();
    }

    // get the currently made html table to return
    getHTMLTable(){
        return this.currenttable;
    }
}