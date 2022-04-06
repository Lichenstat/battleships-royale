// MakeTable class to help with generating a table for use in html

export {GenerateTable}

class GenerateTable{
    constructor(tableclass = '', tableid = '', tableheadcolumns = 0, tablefootcolumns = 0, rows = 0, columns = 0){
        this.rows = rows;
        this.columns = columns;
        this.tableclass = tableclass;
        this.tableid = tableid;
        this.tableheadcolumns = tableheadcolumns;
        this.tablefootcolumns = tablefootcolumns;
        this.tablerow = 1;
    }

    // create table cells via a given number of columns for a row in a table
    #generateTableRow(numberofcols){
        let generatedrow = '<tr' + 
                     ' class=' + this.tableclass + '-row-' + this.tablerow +
                     ' id=' + this.tableid + '-row-' + this.tablerow + 
                     '>';
        // generate table cells ina  row via a number of columns
        for(let i = 1; i <= numberofcols; i++){
            generatedrow = generatedrow + '<td ' + 
            ' class=' + this.tableclass + '-cell-(' + this.tablerow + ',' + i + ')' +
            ' id=' + this.tableid + '-cell-(' + this.tablerow + ',' + i + ')' +
            '>' +
            '</td>';
        }
        // end table elements and return finished table row with cells
        generatedrow = generatedrow + '</tr>';
        console.log(this.tablerow);
        this.tablerow = this.tablerow + 1;
        console.log(this.tablerow);
        this.tablerow = this.tablerow;
        console.log(this.tablerow);
        return generatedrow;
    }

    //generate the table and return it
    generateTable(){
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
                            ' class=' + this.tableclass + '-head' +
                            ' id=' + this.tableid + '-head' +
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
                            ' class=' + this.tableclass + '-foot' +
                            ' id=' + this.tableid + '-foot' +
                            '>' +
                            this.#generateTableRow(this.tablefootcolumns) + 
                            '</tfoot>';
        }
        // finished generating the table, add closing element and return table
        generatedtable = generatedtable + '</table>';
        return generatedtable;
    }

    test3by3(){
        return '<table><tr><td>a</td></tr><tr><td>b</td></tr><tr><td>c</td></tr></table>';
    }

    showinfo(){
        console.log(this.tableclass, 
                    this.tableid,
                    this.tableheadcolumns,
                    this.tablefootcolumns, 
                    this.rows, 
                    this.columns);
    }

}
