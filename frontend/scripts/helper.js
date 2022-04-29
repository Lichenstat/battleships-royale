// helper class with various methods for using and getting various info about objects and elements

export { Helper }

class Helper{

    // function to match case object contents to a desired property to see if it exists
    static doesObjectContainProperty(object, propertyName){
        //console.log(object, propertyName);
        // if the object has the property
        if (object.hasOwnProperty(propertyName)){
            return true;
        }
        // otherwise check the other objects in the object (checking nested objects)
        for (var key in object){
            if (typeof object[key] === 'object'){
                return this.doesObjectContainProperty(object[key], propertyName);
            } 
        }
        return false;
    }

    // to simply set the name of an object if it is desired
    static #doesWantNameOfObject(bool, objectName){
        if (bool){
            return (objectName + ' <- ');
        }
        return '';
    }

    // function to retrieve a property or given properties from a given object using keys (can find nested properties)
    static getObjectPropertyByName(object, propertyName, showWhereDerivedFrom = false, parentName = object.constructor.name){
        let objectArray = [];
        let objectLastPosition = Object.keys(object).length - 1;
        for (var key in object){
            // check other objects in the object (checking for nested objects)
            if (typeof object[key] === 'object'){
                return objectArray.concat(this.getObjectPropertyByName(object[key], propertyName, showWhereDerivedFrom, this.#doesWantNameOfObject(showWhereDerivedFrom, parentName) + key));
            }
            // check if the object property does exist and return it if it does
            if (key === propertyName){
                let overallName = this.#doesWantNameOfObject(showWhereDerivedFrom, parentName) + [propertyName];
                objectArray.push({[overallName] : object[key]});
            }
            // if cycling through the object has found the last position, return the matching objects
            if (object[objectLastPosition] === object[key]){
                return objectArray;
            }
        }
        return objectArray;
    }

    // function to help with printing object information to html
    static getObjectInfo(object){
        let text = ''
        for(var key in object){
            text = text + key + ': ' + object[key] + '<br>';
        }
        return text;
    }

    // parse an element id for a location inside a matrix
    // (assumes between parenthesis, ex: (14,7))
    static parseElementIdForMatrixLocation(id){
        let row, col = null;
        let matrix = id.substring(id.indexOf('('), id.indexOf(')') + 1);
        row = matrix.substring(matrix.indexOf('(') + 1, matrix.indexOf(','));
        col = matrix.substring(matrix.indexOf(',') + 1, matrix.indexOf(')'));
        return [row, col];
    }

    // parse class or id to change it's modifier in BEM format for enabling or disabling 
    static setModifierOfClassOrId(classOrId){
        let change = classOrId.substring(classOrId.lastIndexOf('--') + 2);
        if (change == 'disabled'){
            return classOrId.substring(classOrId.indexOf(0), classOrId.lastIndexOf('--') + 2) + 'enabled';
        }
        if (change == 'enabled'){
            return classOrId.substring(classOrId.indexOf(0), classOrId.lastIndexOf('--') + 2) + 'disabled';
        }
    }

    // remove words from a given array of strings inside of a string
    static removeWordsFromString(words, string){
        return words.reduce((result, word) => result.replaceAll(word, ''), string);
    }

    // eliminate content in a string that is quoted (bob "ate" pie -> bob pie)
    // must use even number of quotes
    static getEliminatedQuotedContentInString(string){
        let quoteCheck = string.match(/\"/g).length;
        if (quoteCheck % 2){
            throw new Error("uneven number of quotes used in string, cannot be parsed properly");
        }
        return string.replace(/\"[^"]+\"/g, ''); 
    }

    // eliminate everything between <...> signs in a string (for use with html js strings)
    static getStrippedHtml(string){
        // remove anything that isn't <, >, or /
        let strippedHtml = string.replace(/[^<>\/]/g, '');
        // remove all desired cases (<> and </>)
        let unwantedHtml = strippedHtml.replace(/<>/g, '  ');
        unwantedHtml = unwantedHtml.replace(/<\/>/g, '   ');
        // create finalized string using unwatned html as a check
        let finalizedHtmlReduction = '';
        let len = strippedHtml.length;
        for (let i = 0; i < len; i++){
            if (unwantedHtml[i] == " "){
                finalizedHtmlReduction = finalizedHtmlReduction + strippedHtml[i];
            }
        }
        return finalizedHtmlReduction;
    }

    // set the internal contents of a certain html string made in javascript using it's id
    // assumes a js html string exists in such a format of <div class.. id=..><e></e><f></f></div>
    // (note: does bug currently when used with placed url's containing </, as string needs to find ending element)
    static setHtmlStringInternalContent(htmlString, id, contentToInsert){
        console.log('working');
        let checkInternalElements = 0;
        console.log(this.getEliminatedQuotedContentInString(htmlString));
        console.log(this.getStrippedHtml(htmlString));
        let htmlElement = htmlString.substring(0, htmlString.indexOf(id));
        htmlElement = htmlElement.substring(htmlElement.lastIndexOf('<') + 1, htmlElement.indexOf(' '));
        console.log(htmlElement);

    }

    static testConsoleLog(){
        console.log("test console log");
    }
    
}