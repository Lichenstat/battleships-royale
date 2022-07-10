
<?php

    // Recieving info from clientside to process then transmit back to serverside

    // PHP code goes here
    error_reporting(E_ALL);
    ini_set("display_errors","On");
    // var_dump
    // print_r

    require "bsr-dbmethods.php";
    //require "bsr-check.php";

    echo "Got to transmit - ";

    // call a post with a possible game code or return one if there isnt a game code yet
    if(isset($_POST["checkGameCode"])){
        echo " Got to gameoced - ";
        $code = json_decode($_POST["checkGameCode"]);
        $gameCode = $code -> gameCode;
        $code = BsrDatabaseMethods::checkGameCode($gameCode);
        echo $code;
    }

    // join a player to play a game if they exists and has given you a match code
    if(isset($_POST["joinMatch"])){
        echo " Got to join match - ";
        $code = json_decode($_POST["joinMatch"]);
        //echo var_dump($code);
        $gameCode = $code -> gameCode;
        $joinCode = $code -> joinCode;
        //echo "game cpde ".$gameCode;
        //echo "joion code ", $joinCode;
        $code = BsrDatabaseMethods::joinMatch($gameCode, $joinCode);
    }

    // update the ready state of the current player
    if(isset($_POST["updateReadyState"])){
        echo " Got to updating player state - ";
        $code = json_decode($_POST["updateReadyState"]);
        $gameCode = $code -> gameCode;
        $readyState = $code -> readyState;
        $readyState = (int)$readyState;
        $code = BsrDatabaseMethods::updateReadyState($gameCode, $readyState);
        //return $code;
    }
    
    //check if the game is ready or not
    if(isset($_POST["checkGameReady"])){
        echo "Checking if the game is ready or not - ";
        $code = json_decode($_POST["checkGameReady"]);
        $gameCode = $code -> gameCode;
        BsrDatabaseMethods::checkGameReady($gameCode);
    }

    // disconnect from game 
    if (isset($_POST["disconnectFromGame"])){
        echo "Got to disconnect from game - ";
        $code = json_decode($_POST["disconnectFromGame"]);
        $gameCode = $code -> gameCode;
        BsrDatabaseMethods::disconnectFromGame($gameCode);
    }

    // set all the neccessary pieces up to start and play the game
    if(isset($_POST["setupGame"])){
        echo " Got to setting up game - ";
        $code = json_decode($_POST["setupGame"]);
        $gameCode = $code -> gameCode;
        echo BsrDatabaseMethods::setGamePlayingCode($gameCode);
    }

    // update the current game for the player that made a move and return the updated game state if necessary
    if(isset($_POST["quitGame"])){
        echo " Quit game - ";
        $code = json_decode($_POST["quitGame"]);
        $gameCode = $code -> gameCode;
        BsrDatabaseMethods::removePlayingInfo($gameCode);
    }

    if(isset($_POST["test"])){
        echo " Testing - ";
        $n = json_decode($_POST["test"]);
        $bsr = $n -> bsrPiecesData;
        $locations = $n -> locations;
        $gameCode = $n -> gameCode;
        //echo $gameCode;
        //BsrDatabaseMethods::setGameData($gameCode, $bsr);
        $t = BsrDatabaseMethods::updateShipLocations($gameCode, $locations);
        //echo "position ".$t;
        //$t = new BsrCheckPiecesData($json);
        //$t -> test();
    }

?> 