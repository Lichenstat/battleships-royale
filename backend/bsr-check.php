
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

        $this -> piecesLocations = array();
        $this -> piecesWork = false;

        $this -> checkPieces();
    }

    // check if the piece is the proper size or not
    private function checkIfPieceSizeMatches($pieceName = "", $pieceLocationsLength = 0){
        $shipSize -> $pieceName . "Size";
        if ($pieceLocationsLength == $this -> ships -> $shipSize){
            return true;
        }
        return false;
    }

    // check piece locations if they are in proper order and not spread out
    private function checkPieceLocaions($pieceLocations = [[]]){
        /*
        // original plan was to check every piece as a follow up piece
        $firstPiece = $pieceLocations[0];
        $secondPiece = $pieceLocations[1];
        $direction = "";
        $difference = Helper::differenceOfArrayElements($firstPiece, $secondPiece);
        if ($difference[0] == 1 || $difference[0] == -1)[
            $direction = "vertical";
        ]
        if ($difference[1] == 1 || $difference[1] == -1){
            $direction = "horizontal";
        }
        */

        // new plan is to check if piece is right by the other piece only 1 block away
        // using a manhattan distance
        $pieceLocationsLength = count($pieceLocations);
        for($i = 0; $i < $pieceLocationsLength - 1; $i++){
            $distance = Helper::getManhattanDistanceViaArrays($pieceLocations[$i], $pieceLocations[$i + 1]);
            if ($distance != 1){
                 return false;
            }
        }
        return true;
    }

    // check if piece locations are individual and not overlaping
    // (defunct at the moment, possibly make way to check for multi-dimentional arrays later
    /*)
    private function checkCombinedLocationsForDuplicates($combinedLocations = []){
        echo var_dump(array_unique($combinedLocations));
        $combinedLength = count($combinedLocations);
        $newLength = count(array_unique($combinedLocations));
        if ($combinedLocations == $newLength){
            return false;
        }
        return true;
    }
    */

    // check all pieces from bsr pieces data
    private function checkPieces(){
        // if we have a correct count of our pieces
        $bsrPiecesLength = count($this -> bsrPiecesData);
        //if ($this -> ships -> count == $bsrPiecesLength){
            for ($i = 0; $i < $bsrPiecesLength; $i++){
                $bsrPiece = $this -> bsrPiecesData[$i];
                $bsrPieceLocations = $bsrPiece -> locations;
                // if the current piece location has proerply set up pieces
                if ($this -> checkPieceLocaions($bsrPieceLocations)){
                    $this -> piecesLocations = array_merge($this -> piecesLocations, $bsrPieceLocations);
                }
            }
            /*
            if ($this -> checkCombinedLocationsForDuplicates($this -> piecesLocations)){
                echo "found duplciated";
                $this -> piecesLocations = [];
            }
            */
        //}
    }

    public function getCombinedPieces(){
        return $this -> piecesLocations;
    }

    public function test(){

        //$r = array(1,2,3);
        //$s = array(1,2,3);
        //$t = array_merge($r, $s);
        //$t  = array_unique($t);
        $n = $this -> getCombinedPieces();
        //echo "our pieces ".var_dump($n);
        //echo "Are the arrays now interconnected ? ";
        //echo var_dump($this -> piecesLocations);

        //$h = $this -> ships;
        //$s = 'carrierSize';
        //return $this -> ships -> $s;
    }

}

?>