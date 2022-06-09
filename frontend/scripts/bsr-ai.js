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
    #aiAttackDirection;
    #aiAttackSucessful;

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

    this.#aiUnhitLocations = [];
    this.#aiHitLocations = [];
    this.#aiPossibleAttackLocations = [];
    this.#aiLastAttackedLocations = [];
    this.#aiAttackDirection = '';

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
    #testChoiceLocaions(){
        if(this.#testChoice[1] == this.#bsrGridMinAndMax.maxColumnPosition){
            this.#testChoice[1] = this.#bsrGridMinAndMax.minColumnPosition;
            this.#testChoice[0] = this.#testChoice[0] + 1;
        }
        else{
            this.#testChoice[1] = this.#testChoice[1] + 1;
        }
    }

    // testing choice location return
    getTestChoiceLocaions(){
        this.#testChoiceLocaions();
        return this.#testChoice;   
    }

    // get the return info to feed back to the player
    getDefaultReturnInfo(){
        let info = { playerTurn : 1, piecesClicked : [[]], piecesHit : [false], pieceName : "" , pieceLocations : [[]], gameover : false}
        return info;
    }

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
        let possibleLocations = [];
        let locationsLength = locations.length;
        // check if the possible location has not been used yet (we will use unused locations)
        for (let i = 0; i < locationsLength; i++){
            if (Helper.checkIfArrayIsInArrayOfArrays(locations[i], this.#aiUnhitLocations)){
                possibleLocations.push(locations[i]);
            }
        }
        // remove old possible hits that are the same and concat them back onto the end if needed
        let removedPossibleHits = Helper.removeDuplicatesFromArrayUsingArray(this.#aiPossibleAttackLocations, possibleLocations);
        this.#aiPossibleAttackLocations = removedPossibleHits.concat(possibleLocations);
        console.log('setting possible locations', this.#aiPossibleAttackLocations);
    }

    // do ai checking of parts and choose a best location of attack
    getNextAttackPosition(){
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
            let attackLocation = this.#aiPossibleAttackLocations[randomPossibleAttackLocation];
            this.#aiPossibleAttackLocations.splice(randomPossibleAttackLocation, 1);
            console.log('removed used possible location', attackLocation, this.#aiPossibleAttackLocations);
            this.#aiLastAttackedLocations = [attackLocation];
            return attackLocation;
        }
    }

    // check if a given attack was successful or not
    checkIfAttackWasSuccessful(attackSuccessful = [false, true]){
        console.log(attackSuccessful);
        let attackSuccessfulLength = attackSuccessful.length;
        // check every attacks success
        for (let i = 0; i < attackSuccessfulLength; i++){
            // if our attack was successful
            if(attackSuccessful[i]){
                // set the next possible attack locations
                let nextPossibleAttackLocations = this.#bsrGrid.getPlayableLocationsAroundLocation(this.#aiLastAttackedLocations[i]);
                nextPossibleAttackLocations = Object.values(nextPossibleAttackLocations);
                this.#setPossibleAttackLocations(nextPossibleAttackLocations);
            }
        }
    }

}