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

    // eliminate everything assigned in an html string of elements so parts can be copied and replaced
    static getHtmlCleanedCopy(string){
        let partiallyCleaned = 0;
        console.log(partiallyCleaned);
        return partiallyCleaned;
    }

    // eliminate everything between <...> signs in a string (for use with html js strings)
    // return example would be <><><></></>
    static getHtmlStripped(string){
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

    // get the tags in an html element
    static getHtmlTagsOfElements(string){
        let partiallyCleaned = string.match(/<{1}\/{0,1}\w+/g);
        return partiallyCleaned;
    }
    
    // get the end case of the internals of html elements
    static getHtmlEndingAttributesOfElements(string){
        let changedString = this.getHtmlCleanedTagAttributes(string);
        let htmlAttributes = this.getHtmlAttributesOfElements(string);
        //console.log(htmlAttributes);
        let htmlEndingAttributes = []
        htmlAttributes.filter(
            attribute =>
            {
                attribute = attribute.replace(/\(/g, '\\(');
                attribute = attribute.replace(/\)/g, '\\)');
                attribute = new RegExp(attribute + ' *>');
                let attributeEnd = changedString.match(attribute);
                if(attributeEnd){
                    htmlEndingAttributes.push(attributeEnd.toString());
                }
            }
        );
        return htmlEndingAttributes;
    }

    // get the values of the attributes in the html tags
    static getHtmlAttributesOfElements(string){
        let partiallyCleaned = this.getHtmlCleanedTagAttributes(string);
        partiallyCleaned = partiallyCleaned.match(/\w+=\"[^"]+\"|[^0-9\s\W]+=\d+|disabled(?=(\s*>))|enabled(?=(\s*>))/g);
        return partiallyCleaned;
    }

    // get internal html content between elements
    static getHtmlInternalContents(string){
        let partiallyCleaned = this.getHtmlCleanedTagAttributes(string);
        let htmlTags = this.getHtmlTagsOfElements(string);
        //htmlTags = htmlTags.filter(
        //    tag => tag.replace(/<\/\w*/g, '')
        //);
        //console.log(htmlTags);
        let htmlEndingAttributes = this.getHtmlEndingAttributesOfElements(string);
        //console.log(Array.from(new Set(htmlEndingAttributes)));
        let htmlInternalContents = [];
        let tagLen = htmlTags.length;
        // check if anything comes after tag
        for (let i = 0; i < tagLen - 1; i++){
            let patternMatch = new RegExp(htmlTags[i] + '.*?' + htmlTags[i+1]);
            // match tag and pattern
            let patternExists = partiallyCleaned.match(patternMatch);
            // if the pattern exists
            if(patternExists){
                // turn the gotten pattern into a string then push gotten contents to array and remove gotten string from original string, keeping last tag part of original string
                let pec = patternExists;
                console.log(patternExists);
                patternExists = patternExists.toString();
                for(let j = 0; j < htmlEndingAttributes.length; j++){
                    let currentAttribute = htmlEndingAttributes[j];
                    currentAttribute = currentAttribute.replace(/\(/g, '\\(');
                    currentAttribute = currentAttribute.replace(/\)/g, '\\)');
                    let patternMatch = new RegExp('.*?' + currentAttribute);
                    let patternDoesMatch = patternExists.match(patternMatch);
                    if(patternDoesMatch){
                        //console.log(patternDoesMatch);
                        htmlEndingAttributes.splice(j ,1);
                        patternExists = patternExists.replace(patternDoesMatch, '');
                        htmlInternalContents.push(patternExists);
                        console.log(patternExists);
                        //partiallyCleaned = partiallyCleaned.replace(patternDoesMatch, '');
                        break;
                    }
                }
            
                //htmlEndingAttributes.filter(
                //    (attribute, index) => 
                //    {
                //        attribute = attribute.replace(/\(/g, '\\(');
                //        attribute = attribute.replace(/\)/g, '\\)');
                //        let attributePattern = new RegExp('.*' + attribute);
                //        //if(patternExists.match(attributePattern)){
                //        //    htmlEndingAttributes = htmlEndingAttributes.splice(index, 1);
                //        //}
                //        patternExists = patternExists.replace(attributePattern, '');
                //    }
                //);
            }
        }

        return htmlInternalContents;
    }

    // clean up tag attributes if necessary
    static getHtmlCleanedTagAttributes(string){
        let partiallyCleaned = string.replace(/=\s+"|\s+="/g, '="');
        partiallyCleaned = partiallyCleaned.replace(/\s+=/g, '=');
        partiallyCleaned = partiallyCleaned.replace(/=\s+/g, '='); // shrinks equations = spaces down, visual impact, might fix later
        return partiallyCleaned;
    }

    // set the internal contents of a certain html string made in javascript using it's id
    // assumes a js html string exists in such a format of <div class.. id=..><e></e><f></f></div>
    // (note: does bug currently when used with placed url's containing </, as string needs to find ending element)
    static setHtmlStringInternalContent(htmlString, id, contentToInsert){
        console.log('working');
        let pieces = this.getStrippedHtml(htmlString);
        let startElement = pieces.match(/<>/g).length;
        let startSymbol = htmlString.match(/</g);
        let endElement = pieces.match(/<\/>/g).length;
        let endSymbol = htmlString.match(/<\//g);
        let htmlElementType = htmlString.substring(0, htmlString.indexOf(id));
        htmlElementType = htmlElementType.substring(htmlElementType.lastIndexOf('<') + 1, htmlElementType.indexOf(' '));
        console.log(this.getTagsOfHtmlElement(htmlString));
        
        console.log(startElement, startSymbol, endElement, endSymbol);
    }

    static testConsoleLog(){
        console.log("test console log");
    }

}