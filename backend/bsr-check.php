
<?php

// Check all pieces that have arrived from clientside to see if they are useable

// requre the configuration file to get ship and pieces for checking
require "bsr-config.php";
require_once ("helper.php");

// check the pieces data to store properly in sql
class BsrCheckPiecesData{
    use BsrConfiguration;

    private $bsrPiecesData;
    private $ships;
    private $gridSize;
    private $piecesLocations;
    private $piecesWork;

    // constructor function
    function __construct($bsrPiecesData){
        $this -> bsrPiecesData = $bsrPiecesData;

        $this -> ships = $this -> getShipSizesAndCount();
        $this -> gridSize = $this -> getGridSizes();

        $this -> pieceLocations = array();
        $this -> piecesWork = false;
    }

    // check if the piece is the proper size or not
    private function checkIfPieceSizeMatches($pieceName = "", $pieceLocationsLength = 0){
        $shipSize -> $pieceName . "Size";
        if ($pieceLocationsLength == $this -> ships -> $shipSize){
            return true;
        }
        return false;
    }

    // check piece locations of an array [[]] and check if they are properly made and in order
    private function checkPieceLocaions($pieceLocations = [[]]){
        $lastPiece = array();
        $currentPiece = array();
        $pieceLocationsLength = count($pieceLocations);
        for($i = 0; $i < $pieceLocationsLength; $i++){

        }
    }

    // check if piece locations are individual and not overlaping
    private function checkCombinedLocationsForDuplicates($combinedLocations = []){
        $combinedLength = count($combinedLocations);
        $newLength = array_unique($combinedLocations);
        if ($combinedLocations == $newLength){
            return true;
        }
        return false;
    }

    // check all pieces from bsr pieces data
    private function checkPieces(){
        // if we have a correct count of our pieces
        $bsrPiecesLength = count($this -> bsrPiecesData);
        if ($this -> ships -> count == $bsrPiecesLength){
            for ($i = 0; $i < $bsrPiecesLength; $i++){
                $loc = array_merge($this -> piecesLocations, $this -> bsrPiecesData -> locations);
            }
            if (!checkCombinedLocationsForDuplicates($this -> pieceLocations)){

            }
        }
        return $this -> pieceLocations;
    }

    public function test(){

        //$r = array(1,2,3);
        //$s = array(1,2,3);
        //$t = array_merge($r, $s);
        //$t  = array_unique($t);
        return Helper::getManhattanDistanceViaArrays([1,0], [0,0]);

        //$h = $this -> ships;
        //$s = 'carrierSize';
        //return $this -> ships -> $s;
    }

}

?>