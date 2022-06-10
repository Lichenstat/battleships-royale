// class having basic ai object and methods for use with purely frontend

import { BsrPiecesData } from "./bsr-piecesdata.js";
import { BsrGrid } from "./bsr-grid.js";
import { Helper } from "./helper.js";

export { BsrAi }

class BsrAi{

    #aiPiecesData;
    #aiPlayerNumber;
    #aiUnhitLocations;
    #aiHitLocations;
    #aiPossibleAttackLocations;
    #aiLastAttackedLocations;

    #enemyInformationInitialized;
    #enemyBoats;
    #enemyBoatsCount;

    #aiStartingLocationHit;
    #aiSuccessfulAttackLocation;
    #aiLastSuccessfulAttackLocation;
    #aiPrioritizeAttackLocations;
    #aiPriorityAttackLocation;
    #aiTiredOfCheckingSame;

    #bsrGrid;
    #bsrGridMinAndMax;
    #minRowPosition;
    #minColumnPosition;
    #maxRowPosition;
    #maxColumnPosition;

    #testChoice;

    #minTime;
    #maxTime;
    #timer;
    
    constructor(aiPiecesData = new BsrPiecesData()){

    this.#aiPiecesData = aiPiecesData;
    // fill ai data table with random placed pieces
    this.#aiPiecesData.fillDataTableRandomly();
    this.#aiPlayerNumber = 2;

    this.#enemyInformationInitialized = false;
    this.#enemyBoats = {};
    this.#enemyBoatsCount = 0;

    this.#aiUnhitLocations = [];
    this.#aiHitLocations = [];
    this.#aiPossibleAttackLocations = [];
    this.#aiLastAttackedLocations = [];

    this.#aiStartingLocationHit = [];
    this.#aiSuccessfulAttackLocation = []
    this.#aiLastSuccessfulAttackLocation = [];
    this.#aiPrioritizeAttackLocations = [];
    this.#aiPriorityAttackLocation = [];
    this.#aiTiredOfCheckingSame = 0;

    this.#bsrGrid = new BsrGrid();
    this.#bsrGridMinAndMax = this.#bsrGrid.getGridMinAndMaxPositions();

    this.#aiUnhitLocations = Helper.getMatrixLocationsAsArray(this.#bsrGridMinAndMax.minRowPosition, this.#bsrGridMinAndMax.maxRowPosition, this.#bsrGridMinAndMax.minColumnPosition, this.#bsrGridMinAndMax.maxColumnPosition);

    this.#testChoice = [this.#bsrGridMinAndMax.minRowPosition, this.#bsrGridMinAndMax.minColumnPosition - 1];
    
    this.#minTime = 1;
    this.#maxTime = 3;
    this.#timer = Helper.getRandomInteger(this.#minTime, this.#maxTime);

    }

    // set a random timer interval between 2 integers
    #setRandomTimerInterval(){
        this.#timer = Helper.getRandomInteger(this.#minTime, this.#maxTime);
    }

    // get ai pieces data
    getAiPiecesData(){
        return this.#aiPiecesData;
    }

    // test choice of an ai (will go through all grid locations, left to right,
    // then down one, repeat till full grid has been gone through
    //#testChoiceLocaions(){
    //    if(this.#testChoice[1] == this.#bsrGridMinAndMax.maxColumnPosition){
    //        this.#testChoice[1] = this.#bsrGridMinAndMax.minColumnPosition;
    //        this.#testChoice[0] = this.#testChoice[0] + 1;
    //    }
    //    else{
    //        this.#testChoice[1] = this.#testChoice[1] + 1;
    //    }
    //}
//
    //// testing choice location return
    //getTestChoiceLocaions(){
    //    this.#testChoiceLocaions();
    //    return this.#testChoice;   
    //}

    // get the return info to feed back to the player
    //getDefaultReturnInfo(){
    //    let info = { playerTurn : 1, piecesClicked : [[]], piecesHit : [false], pieceName : "" , pieceLocations : [[]], gameover : false}
    //    return info;
    //}

    // get a location that has not yet been hit
    #getUnhitLocation(){
        let unhitLocationsLength = this.#aiUnhitLocations.length;
        let randomIndex = Helper.getRandomInteger(0, unhitLocationsLength - 1);
        let location = this.#aiUnhitLocations[randomIndex];
        //console.log(location);
        this.#aiUnhitLocations.splice(randomIndex, 1);
        //console.log(this.#aiUnhitLocations);
        return location;
    }

    // set possible attack positions
    #setPossibleAttackLocations(locations = [[]]){
        //console.log('setting new possible locations', locations)
        let possibleLocations = [];
        let locationsLength = locations.length;
        // check if the possible location has not been used yet (we will use unused locations)
        for (let i = 0; i < locationsLength; i++){
            if (Helper.checkIfArrayIsInArrayOfArrays(locations[i], this.#aiUnhitLocations)){
                possibleLocations.push(locations[i]);
            }
        }
        // remove old possible hits that are the same and concat them back onto the end if needed
        //console.log('new possible locations', possibleLocations);
        //console.log('possible locations before filter', this.#aiPossibleAttackLocations);
        let removedPossibleHits = Helper.removeDuplicatesFromArrayUsingArray(possibleLocations, this.#aiPossibleAttackLocations);
        this.#aiPossibleAttackLocations = this.#aiPossibleAttackLocations.concat(removedPossibleHits);
        this.#aiUnhitLocations = Helper.removeDuplicatesFromArrayUsingArray(this.#aiUnhitLocations, this.#aiPossibleAttackLocations);
        console.log(this.#aiUnhitLocations);
        //this.#aiPrioritizeAttackLocations = Helper.keepDuplicatesFromArrayUsingArray(this.#aiPrioritizeAttackLocations, this.#aiPossibleAttackLocations);
        console.log('possible locations made', this.#aiPossibleAttackLocations);
    }

    // do ai checking of parts and choose a best location of attack
    getNextAttackPosition(){
        console.log(Helper.removeDuplicatesFromArrayUsingArray([[1,2], [1,3]], [[1,3], [1,4]]));
        let aiPossibleAttackLocationsLength = this.#aiPossibleAttackLocations.length;
        // if there is no possible attack locations pick a random location and attack with that
        if (!aiPossibleAttackLocationsLength){
            let attackLocation = this.#getUnhitLocation();
            this.#aiLastAttackedLocations = [attackLocation];
            return attackLocation;
        }
        let randomPossibleAttackLocation = Helper.getRandomInteger(0, aiPossibleAttackLocationsLength - 1);
        // if there are possible attack locations choose a random location from the set and attack with that location
        if (aiPossibleAttackLocationsLength){
            //console.log('possible attack locations', this.#aiPossibleAttackLocations);
            // if there has been a priority chosen piece
            if (this.#aiPriorityAttackLocation.length){
                //console.log('using priority attack', this.#aiPriorityAttackLocation);
                let priortiyAttackLocationIndex = Helper.getIndexLocationOfMatchedArray(this.#aiPriorityAttackLocation, this.#aiPossibleAttackLocations);
                console.log(priortiyAttackLocationIndex);
                this.#aiPossibleAttackLocations.splice(priortiyAttackLocationIndex, 1);
                this.#aiLastAttackedLocations = [this.#aiPriorityAttackLocation];
                return this.#aiPriorityAttackLocation;
            }
            // if we do not have a priority chosen piece but have pieces close to a hit location
            if (!this.#aiPriorityAttackLocation.length){
                // if we have prioritized attack locations
                //if (this.#aiPrioritizeAttackLocations.length){
                //    console.log('using prioritized attack location');
                //    console.log('prioritize attack locations', this.#aiPrioritizeAttackLocations);
                //    let randomPrioritizedAttackLocation = Helper.getRandomInteger(0, this.#aiPrioritizeAttackLocations - 1);
                //    let attackLocation = this.#aiPrioritizeAttackLocations[randomPrioritizedAttackLocation];
                //    this.#aiPrioritizeAttackLocations.splice(attackLocation, 1);
                //    this.#aiPossibleAttackLocations.splice(attackLocation, 1);
                //    this.#aiLastAttackedLocations = [attackLocation];
                //    return attackLocation;
                //}
                // if we have possible attack locations
                let attackLocation = this.#aiPossibleAttackLocations[randomPossibleAttackLocation];
                console.log('possible hit locations', this.#aiPossibleAttackLocations);
                this.#aiPossibleAttackLocations.splice(randomPossibleAttackLocation, 1);
                console.log('removed used possible location', attackLocation);
                this.#aiLastAttackedLocations = [attackLocation];
                return attackLocation;
            }
        }
    }

    // set enemy starting information
    #initializeEnemyShipInformation(currentEnemyBoats = {}){
        if(!this.#enemyInformationInitialized){
            this.#enemyBoats = currentEnemyBoats;
            this.#enemyBoatsCount = Helper.accumulateObjectValues(currentEnemyBoats);
            this.#enemyInformationInitialized = true;
        }
    }

    // check if an enemy boat sank to set info
    #setEnemyShipInfo(currentEnemyBoats = {}){
        let newBoatCount = Helper.accumulateObjectValues(currentEnemyBoats);
        if (this.#enemyBoatsCount > newBoatCount){
            this.#setCleanPriorityInfo();
            this.#enemyBoats = currentEnemyBoats;
            this.#enemyBoatsCount = Helper.accumulateObjectValues(currentEnemyBoats);
            console.log('boat sank, reset priority info');
        }
    }

    // clear location and priority info
    #setCleanPriorityInfo(){
        this.#aiStartingLocationHit = [];
        this.#aiPrioritizeAttackLocations = [];
        this.#aiPriorityAttackLocation = [];
        this.#aiLastSuccessfulAttackLocation = [];
        this.#aiSuccessfulAttackLocation = [];
    }

    // set the starting hit location if it a first piece to be hit
    #setStartingLocationHit(location = []){
        if (!this.#aiStartingLocationHit.length){
            this.#aiStartingLocationHit = location;
            console.log(this.#aiStartingLocationHit);
        }
    }

    // find a direction to attack in and set that as a priority direction
    #setNextPossibleAttackLocationInDirection(){
        console.log
        let manhattanDistanceBetweenPieces = Helper.getManhattanDistanceViaArrays(this.#aiLastSuccessfulAttackLocation, this.#aiSuccessfulAttackLocation);
        if (manhattanDistanceBetweenPieces == 1){
            let direction = Helper.getSubtractedArray(this.#aiSuccessfulAttackLocation, this.#aiLastSuccessfulAttackLocation);
            // up
            if (Helper.checkIfArraysAreEqual(direction, [-1, 0])){
                console.log('going up')
            }
            // down
            if (Helper.checkIfArraysAreEqual(direction, [1, 0])){
                console.log('going down')
            }
            // left
            if (Helper.checkIfArraysAreEqual(direction, [0, -1])){
                console.log('going left')
            }
            // right
            if (Helper.checkIfArraysAreEqual(direction, [0, 1])){
                console.log('going right')
            }
            console.log(direction);
            this.#aiPriorityAttackLocation = Helper.getAddedArray(this.#aiSuccessfulAttackLocation, direction);
            console.log(this.#aiPriorityAttackLocation);
            console.log(this.#aiPossibleAttackLocations);
            let isInPossibleLocations = Helper.checkIfArrayIsInArrayOfArrays(this.#aiPriorityAttackLocation, this.#aiPossibleAttackLocations);
            if (!isInPossibleLocations){
                this.#setOppositeDirectionToAttakIn();
            }
        }
    }

    // set opposite direction to attack in
    #setOppositeDirectionToAttakIn(){
        console.log('swapping direction');
        let direction = Helper.getSubtractedArray(this.#aiSuccessfulAttackLocation, this.#aiLastSuccessfulAttackLocation);
        console.log(direction);
        let newDirection = Helper.swapPositiveNegativeArrayValues(direction);
        // up
        if (Helper.checkIfArraysAreEqual(newDirection, [-1, 0])){
            console.log('going up')
        }
        // down
        if (Helper.checkIfArraysAreEqual(newDirection, [1, 0])){
            console.log('going down')
        }
        // left
        if (Helper.checkIfArraysAreEqual(newDirection, [0, -1])){
            console.log('going left')
        }
        // right
        if (Helper.checkIfArraysAreEqual(newDirection, [0, 1])){
            console.log('going right')
        }
        this.#aiPriorityAttackLocation = Helper.getAddedArray(this.#aiStartingLocationHit, newDirection);
        this.#aiSuccessfulAttackLocation = this.#aiStartingLocationHit;
        this.#aiLastSuccessfulAttackLocation = Helper.getSubtractedArray(this.#aiStartingLocationHit, direction);
        console.log(this.#aiPriorityAttackLocation, this.#aiSuccessfulAttackLocation, this.#aiLastSuccessfulAttackLocation);
        console.log('new location', this.#aiPriorityAttackLocation);
        console.log('all possible locations', this.#aiPossibleAttackLocations)
        let isInPossibleLocations = Helper.checkIfArrayIsInArrayOfArrays(this.#aiPriorityAttackLocation, this.#aiPossibleAttackLocations);
        if (!isInPossibleLocations){
            console.log('no possible locations, remove priority');
            this.#setCleanPriorityInfo();
        }
    }

    // check if a given attack was successful or not
    checkIfAttackWasSuccessful(attackSuccessful = [false, true], currentEnemyBoats = {}){
        this.#initializeEnemyShipInformation(currentEnemyBoats);
        console.log(attackSuccessful);
        let attackSuccessfulLength = attackSuccessful.length;
        // check every attacks success
        for (let i = 0; i < attackSuccessfulLength; i++){
            // if our attack was successful
            if(attackSuccessful[i]){


                this.#aiLastSuccessfulAttackLocation = this.#aiSuccessfulAttackLocation;
                this.#aiSuccessfulAttackLocation = this.#aiLastAttackedLocations[i];
                console.log('last successful attacked location', this.#aiLastSuccessfulAttackLocation, " this successful attack location", this.#aiSuccessfulAttackLocation);
                
                this.#setStartingLocationHit(this.#aiLastAttackedLocations[i]);
                this.#setEnemyShipInfo(currentEnemyBoats);

                // set the next possible attack locations
                let nextPossibleAttackLocations = this.#bsrGrid.getPlayableLocationsAroundLocation(this.#aiLastAttackedLocations[i]);
                console.log('next possible attack locations unmodified', nextPossibleAttackLocations);
                nextPossibleAttackLocations = Object.values(nextPossibleAttackLocations);
                console.log('next possible attack locations', nextPossibleAttackLocations);
                //this.#aiPrioritizeAttackLocations = Object.values(this.#bsrGrid.getPlayableLocationsAroundLocation(this.#aiSuccessfulAttackLocation));
                //console.log(this.#aiPrioritizeAttackLocations);
                this.#setPossibleAttackLocations(nextPossibleAttackLocations);
                this.#setNextPossibleAttackLocationInDirection();
            }
            if(!attackSuccessful[i]){
                if(this.#aiLastSuccessfulAttackLocation.length){
                    this.#setOppositeDirectionToAttakIn();
                }
            }
        }
        this.#setEnemyShipInfo(currentEnemyBoats);
    }




}