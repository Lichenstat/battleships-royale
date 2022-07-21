// helper class with various methods for using and getting various info about objects and elements

export { Helper }

class Helper{

    // just test helper for a console log
    static testConsoleLog(){
        console.log("test console log");
    }

    // function to match case object contents to a desired property to see if it exists
    static doesObjectContainProperty(object, propertyName){
        //console.log(object, propertyName);
        // if the object has the property
        if (object.hasOwnProperty(propertyName)){
            return true;
        }
        // otherwise check the other objects in the object (checking nested objects)
        for (let key in object){
            if (typeof object[key] === 'object'){
                return this.doesObjectContainProperty(object[key], propertyName);
            } 
        }
        return false;
    }

    // to simply print the name of an object if it is desired in certain functions
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
        let text = '';
        for(var key in object){
            text = text + key + ': ' + object[key] + '<br>';
        }
        return text;
    }

    // accumulate all object values into a single value
    static accumulateObjectValues(object = new Object()){
        if (Object.keys(object).length > 0){
            return Object.values(object).reduce((a, b) => a + b);
        }
        return 0;
    }

    // check if an object is empty or not
    static checkIfObjectIsEmpty(object = {}){
        let isObjectEmpty = Object.keys(object).length === 0;
        return isObjectEmpty;
    }

    // parse an element id for a location inside a matrix
    // (assumes between parenthesis, ex: (14,7))
    static parseElementIdForMatrixLocation(id = "default__id-(0,0)"){
        var row, col;
        let matrix = id.substring(id.indexOf('('), id.indexOf(')') + 1);
        row = Number(matrix.substring(matrix.indexOf('(') + 1, matrix.indexOf(',')));
        col = Number(matrix.substring(matrix.indexOf(',') + 1, matrix.indexOf(')')));
        return [row, col];
    }

    // parse an elements id to change it's matrix location
    static parseElementIdToChangeMatrixLocation(id = "default__id-(0,0)", location = [0,0]){
        let idBegin = id.substring(0, id.indexOf('(') + 1);
        let idEnd = id.substring(id.indexOf(')'), id.length);
        let updatedId = idBegin + location[0] + ',' + location[1] + idEnd;
        return updatedId;
    }

    // parse part of a string and replace that part with a desired string
    static parsePartOfStringToReplace(originalString, partToReplace, replaceWith){
        return originalString.replace(new RegExp(partToReplace, 'g'), replaceWith).toString();
    }

    // parse class or id to change it's modifier in BEM format for enabling or disabling 
    static setModifierOfClassOrId(classOrId){
        let change = classOrId.toString().match(/--disabled|--enabled/g);
        change = change.toString();
        if (change == '--disabled'){
            return classOrId.replace(/--disabled/g, '--enabled');
        }
        if (change == '--enabled'){
            return classOrId.replace(/--enabled/g, '--disabled');
        }
    }

    // remove words from a string via a given array of strings
    static removeWordsFromString(words, string){
        return words.reduce((result, word) => result.replaceAll(word, ''), string);
    }

    // remove all spaces from a string
    static removeAllSpacesFromString(string){
        string = string.replace(/[ ]*/g, '');
        return string;
    }

    // capitalize first letter in string
    static capitalizeFirstCharacterInString(string = ""){
        let first = string.charAt(0);
        first = first.toUpperCase();
        let rest = string.substring(1, string.length);
        let final = first + rest;
        return final;
    }

    // remove duplicates in an array using a desired remove duplicates array
    static removeDuplicatesFromArrayUsingArray(arrayToClean = [[],[]], arrayForChecking = [[],[]]){
        let keepCleaned = [];
        let checkingLength  = arrayForChecking.length;
        let cleanLength = arrayToClean.length;
        for (let i = 0; i < cleanLength; i++){
            let clean = arrayToClean[i];
            let found = false;
            for (let j = 0; j < checkingLength; j++){
                let check = arrayForChecking[j];
                let checkMatch = this.checkIfArraysAreEqual(check, clean);
                if (checkMatch){
                    found = true;
                    break;
                }
            }
            if (!found){
                keepCleaned.push(clean);
            }
        }
        return keepCleaned;
    }

    // keep duplicates in an array using a desired keep duplicates array
    static keepDuplicatesFromArrayUsingArray(arrayKeepingDuplicates = [[],[]], arrayForChecking = [[],[]]){
        let keepDuplicates = [];
        arrayForChecking.forEach(
            (itemDuplicate, indexFromDuplicate) => {
                arrayKeepingDuplicates.forEach(
                    (item, index) => {
                        if(this.checkIfArraysAreEqual(item, itemDuplicate)){
                            keepDuplicates.push(arrayKeepingDuplicates[index]);
                        }
                    }
                )
            }
        );
        return keepDuplicates;
    }

    // keep parts of an array given index locations of some kind
    static keepPartsOfArrayGivenIndexLocations(indexLocations = [], array = []){
        let keepArrayParts = [];
        let length = array.length;
        for (let i = 0; i < length; i++){
            if (indexLocations.includes(i)){
                keepArrayParts.push(array[i]);
            }
        }
        return keepArrayParts;
    }

    // check if array is in array of arrays
    static checkIfArrayIsInArrayOfArrays(array = [], arrayOfArrays = [[],[]]){
        let setOfArraysLength = arrayOfArrays.length;
        let checkArray = this.removeDuplicatesFromArrayUsingArray(arrayOfArrays, [array]);
        let checkArrayLength = checkArray.length;
        if (setOfArraysLength == checkArrayLength){
            return false;
        }
        return true;
    }

    // check if a value exists within an array
    static checkIfValueIsInArray(value, array = []){
        let arrayLength = array.length;
        for (let i = 0; i < arrayLength; i++){
            if (value == array[i]){
                return true;
            }
        }
        return false;
    }

    // check if arrays are equal by position, content, and size
    static checkIfArraysAreEqual(arrayOne, arrayTwo){
        let arrOne = arrayOne.length;
        let arrTwo = arrayTwo.length;
        if (arrOne == arrTwo){
            for (var i in arrayOne){
                if (arrayOne[i] != arrayTwo[i]){
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    // get rid of duplicates in an array and keep order
    static makeUniqueArray(array = []) {
        let a = array.concat();
        for(let i=0; i<a.length; ++i) {
            for(let j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
    
        return a;
    }

    // get diffrences of array values (make sure they are the same size)
    static getSubtractedArray(arrayOriginal = [], arraySubtractor = []){
        let diffrenceArray = [];
        let original = arrayOriginal.length;
        let subtractor = arraySubtractor.length;
        let length = Math.min(original, subtractor);
        for (let i = 0; i < length; i++){
            diffrenceArray.push(arrayOriginal[i] - arraySubtractor[i]);
        }
        return diffrenceArray;
    }

    // get addition of array values (make sure they are the same size)
    static getAddedArray(arrayOriginal = [], arrayAdder = []){
        let addedArray = [];
        let original = arrayOriginal.length;
        let adder = arrayAdder.length;
        let length = Math.min(original, adder);
        for (let i = 0; i < length; i++){
            addedArray.push(arrayOriginal[i] + arrayAdder[i]);
        }
        return addedArray;
    }

    // convert array values from positives to negatives
    static swapPositiveNegativeArrayValues(array = []){
        let length = array.length;
        for (let i = 0; i < length; i++){
            if(typeof(array[i]) === 'number'){
                array[i] = this.swapPositiveNegativeValue(array[i]);
            }
        }
        return array;
    }

    // swap integer/double sign
    static swapPositiveNegativeValue(value = 0){
        if (value == 0) return 0;
        return value * -1;
    }

    // get matrix array locations as array
    static getMatrixLocationsAsArray(minWidth = 0, maxWidth = 0, minHeight = 0, maxHeight = 0){
        let arrayLocations = [];
        for (let i = minWidth; i <= maxWidth; i++){
            for (let j = minHeight; j <= maxHeight; j++){
                arrayLocations.push([i,j]);
            }
        }
        return arrayLocations;
    }

    // get index of a match case using arrays
    static getIndexLocationOfMatchedArray(matchArray = [], arrays = [[],[]]){
        let length = arrays.length;
        for (let i = 0; i < length; i++){
            if (this.checkIfArraysAreEqual(matchArray, arrays[i])){
                return i;
            }
        }
    }

    // get index of multiple match cases using arrays
    static getIndexLocationOfMatchedArrays(matchedArray = [[],[]], arrays=[[],[]]){
        let matchedIndexes = [];
        let length = matchedArray.length
        for (let i = 0; i < length; i++){
            let matched = null;
            matched = this.getIndexLocationOfMatchedArray(matchedArray[i], arrays);
            if (matched != null){
                matchedIndexes.push(matched);
            }
        }
        return matchedIndexes;
    }

    // get index locations of match cases in a string
    static getIndexLocationsOfMatchCase(matchCase = 'amp', string = 'example'){
        let markedIndex = [];
        var result;
        let pattern = new RegExp(matchCase, 'gi');
        while((result = pattern.exec(string))){
            markedIndex.push(result.index);
        }
        return markedIndex;
    }

    // merge index locations together replacing their indexes with strings
    static getStringsInOrderViaIndexArray(indexArrOne, wordOne, indexArrTwo, wordTwo){
        let finalArray = [];
        let arrOneLoc = 0;
        let arrTwoLoc = 0;
        let combinedLength = indexArrOne.length + indexArrTwo.length;
        let loop = 0;
        while(loop < combinedLength){
            loop = loop + 1;
            let ione = indexArrOne[arrOneLoc];
            let itwo = indexArrTwo[arrTwoLoc];
            if( ione <= itwo ){
                finalArray.push(wordOne);
                arrOneLoc = arrOneLoc + 1;
            }
            else{
                finalArray.push(wordTwo);
                arrTwoLoc = arrTwoLoc + 1;
            }
        }
        return finalArray;
    }

    // get a random integer between a min and a max
    static getRandomInteger(min = 0, max = 1){
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    // manhattan distance from one matrix location to the next
    static getManhattanDistanceViaArrays(arrayLocationOne = [0,0], arrayLocationTwo = [0,0]){
        let distance = Math.abs(arrayLocationTwo[0] - arrayLocationOne[0]) + Math.abs(arrayLocationTwo[1] - arrayLocationOne[1]);
        return distance;
    }

}