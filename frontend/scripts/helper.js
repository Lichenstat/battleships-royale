// helper class with various methods for using and getting various info about generated
// objects during .js runtime

export {Helper}

class Helper{
    constructor(objectlist = {}){
        this.objectlist = objectlist;
    }

    // function to help with printing object information to html
    static ObjectInfo(object){
        let text = ''
        for(var key in object){
            text = text + key + ': ' + object[key] + '<br>';
        }
        return text;
    }

    // parse an element of some kind for a location in an id 
    // (assumes between parenthesis, ex: (14,7))
    static parseElementIdForMatrixLocation(id){
        let row, col = null;
        let matrix = id.substring(id.indexOf('('), id.indexOf(')') + 1);
        row = matrix.substring(matrix.indexOf('(') + 1, matrix.indexOf(','));
        col = matrix.substring(matrix.indexOf(',') + 1, matrix.indexOf(')'));
        return [row, col];
    }
}