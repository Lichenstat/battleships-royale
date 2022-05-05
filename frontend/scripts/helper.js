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

    // remove words in an array from given array of words
    static removeDuplicatesFromArrayUsingArray(words, duplicateCheckWords){
        duplicateCheckWords.filter(
            (wordDuplicate, indexFromDuplicate) => {
                words.filter(
                    (word, index) => {
                        if(word == wordDuplicate){
                            words.splice(index, 1);
                        }
                    }
                )
            }
        );
        return words;
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
    
    // get the end case of the attributes of html elements
    static getHtmlEndingAttributesOfElements(string){
        let changedString = this.getHtmlCleanedTagAttributes(string);
        let htmlAttributes = this.getHtmlAttributesOfElements(string);
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

    
    // clean up tag attributes if necessary
    static getHtmlCleanedTagAttributes(string){
        let partiallyCleaned = string.replace(/=\s+"|\s+="/g, '="');
        partiallyCleaned = partiallyCleaned.replace(/\s+=/g, '=');
        partiallyCleaned = partiallyCleaned.replace(/=\s+/g, '='); // shrinks equations = spaces down, visual impact, might fix later
        return partiallyCleaned;
    }

    // get internal html content between elements
    static getHtmlInternalContents(string){
        let partiallyCleaned = this.getHtmlCleanedTagAttributes(string);
        let htmlTags = this.getHtmlTagsOfElements(string);
        let htmlEndingAttributes = this.getHtmlEndingAttributesOfElements(string);
        let htmlInternalContents = [];
        let tagLen = htmlTags.length;
        // check what comes after tag #1 and before tag #2 (including these tags themselves), dont worry about last closing tag
        for (let i = 0; i < tagLen - 1; i++){
            let patternMatch = new RegExp(htmlTags[i] + '.*?' + htmlTags[i+1]);
            // match tag and pattern
            let patternExists = partiallyCleaned.match(patternMatch);
            // if the pattern exists
            if(patternExists){
                let patternFound = patternExists.toString();
                let usesNoAttributes = patternFound.match(htmlTags[i] + ' *>');
                // check if the internals can be filtered via given attributes
                if(!usesNoAttributes){
                    for(let j = 0; j < htmlEndingAttributes.length; j++){
                        // get our current attribute and replace any troublesome symbols with readable regexp syntax
                        let currentAttribute = htmlEndingAttributes[j];
                        currentAttribute = currentAttribute.replace(/\(/g, '\\(');
                        currentAttribute = currentAttribute.replace(/\)/g, '\\)');
                        // can we use our current attribute to find a pattern?
                        let patternMatch = new RegExp('.*?' + currentAttribute);
                        let patternDoesMatch = patternFound.match(patternMatch);
                        if(patternDoesMatch){
                            // if there is a match splice the attribute array by our current readable attribute to shorten loop times
                            htmlEndingAttributes.splice(j ,1);
                            // replace our found <tag to <tag pattern arrtribute portion with empty string and push
                            // to save tag internals including <tag ending to pattern match for later
                            patternFound = patternFound.replace(patternDoesMatch, '');
                            htmlInternalContents.push(patternFound);
                            // replace the found internals <tag ending with empty string and append to our current attribute pattern
                            patternFound = patternFound.replace(htmlTags[i+1], '');
                            patternDoesMatch = patternDoesMatch + patternFound;
                            // replace the original string that includes our attribute all the way up to the ending <tag of that pattern
                            partiallyCleaned = partiallyCleaned.replace(patternDoesMatch, '');
                            // we have used an attribute to get the string internals, mark that we have and break from the loop
                            break;
                        }
                    }
                }
                if(usesNoAttributes){
                    // we rewrite the regexp pattern to include an ending portion on the first tag
                    let tagPattern = new RegExp(htmlTags[i] + '>.*?' + htmlTags[i+1]);
                    // we then find a pattern and replace the first <tag portion and push it as internals to be used
                    patternFound = partiallyCleaned.match(tagPattern);
                    patternFound = patternFound.toString();
                    patternFound = patternFound.replace(htmlTags[i] + '>', '');
                    htmlInternalContents.push(patternFound);
                    // we then take the original pattern and remove it's ending <tag, and replace the original string pattern portion with an empty string
                    patternMatch = patternMatch.toString();
                    patternMatch = patternMatch.replace(htmlTags[i+1], '');
                    partiallyCleaned = partiallyCleaned.replace(patternMatch, '');
                }
            }
        }
        // return the equals to normal in the given strings
        //htmlInternalContents = this.removeDuplicatesFromArrayUsingArray(htmlInternalContents, htmlTags);
        htmlInternalContents = this.#returnHtmlEqualsToNormal(htmlInternalContents, string);
        // finally we can return all intenal contents
        return htmlInternalContents;
    }

    // return given array of strings containing '=' back to the original format it was in (made mostly for internal html strings)
    static #returnHtmlEqualsToNormal(modifiedStringArray, originalString){
        modifiedStringArray.filter(
            (str, index) => {
                let stringMatch = str.match(/=/g);
                if(stringMatch){
                    var len = stringMatch.length;
                    for(var i = 1; i <= len; i++){
                        let strSplit = str.split('=');
                        let pattern = new RegExp(strSplit[0] + '.*?=.*?' + strSplit[strSplit.length - 1])
                        let possibleStrings = originalString.match(pattern);
                        if(possibleStrings.length == 1){
                            modifiedStringArray[index] = possibleStrings.toString();
                        }
                    }
                }
            }
        );
        return modifiedStringArray;
    }

    // eliminate everything assigned in an html string of elements so parts can be copied and replaced
    static getHtmlCleanedCopy(string){
        let partiallyCleaned = 0;
        //console.log(partiallyCleaned);
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
