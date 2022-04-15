// helper class with various methods for using and getting various info about generated
// objects from the generate-_.js files

export {GenerateHelper}

class GenerateHelper{
    constructor(objectlist = {}){
        this.objectlist = objectlist;
    }

    // function to help with printing object information to html
    static printObjectInfo(object){
        let text = ''
        for(var key in object){
            // console.log(object);
            text = text + key + ': ' + object[key] + '<br>';
        }
        return text;
    }

}