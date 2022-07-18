
<?php

    // Recieving info from clientside to process then transmit back to serverside

    // PHP code goes here
    //error_reporting(E_ALL);
    //ini_set("display_errors","On");
    // var_dump
    // print_r

    require "bsr-dbmethods.php";
    //require_once("bsr-check.php");

    //echo "Got to transmit - ";

    // retrieve a post with a game code or return one if there isnt a game code yet
    if (isset($_POST["checkGameCode"])){
        //echo " Checking gamecode - ";

        $decode = json_decode($_POST["checkGameCode"]);
        $gameCode = $decode -> gameCode;

        // if we have no game code, make one, update the timeout attached to it, and return it
        if (empty($gameCode)){

            $gameCode -> gameCode = BsrDatabaseMethods::getGameCode($gameCode);
            BsrDatabaseMethods::resetTimeout($gameCode -> gameCode);
            $encode = json_encode($gameCode);
            echo $encode;

        }

        // otherwise simply just update the timeout for the code that does exist
        else{

            BsrDatabaseMethods::resetTimeout($gameCode);

        }
        
    }

    // join a player to play a game if they exists and has given you a match code
    if(isset($_POST["joinMatch"])){
        echo " Got to join match - ";

        $code = json_decode($_POST["joinMatch"]);
        //echo var_dump($code);

        $gameCode = $code -> gameCode;
        $joinCode = $code -> joinCode;

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

    }
    
    //check if the game is ready or not
    if(isset($_POST["checkGameReady"])){
        //echo "Checking if the game is ready or not - ";

        $code = json_decode($_POST["checkGameReady"]);
        $gameCode = $code -> gameCode;

        $gameStates;
        $gameStates -> connectedState = BsrDatabaseMethods::checkIfPlayersConnected($gameCode);
        $gameStates -> waitingOnOtherState = BsrDatabaseMethods::checkPlayerIsWaitingInGameQueue($gameCode);
        $gameStates -> startState = BsrDatabaseMethods::checkGameReadyToStart($gameCode);

        $gameStates = json_encode($gameStates);
        echo $gameStates;
        
    }



    // disconnect from game 
    if (isset($_POST["disconnectFromGame"])){
        echo "Got to disconnect from game - ";

        $code = json_decode($_POST["disconnectFromGame"]);
        $gameCode = $code -> gameCode;

        BsrDatabaseMethods::disconnectFromGame($gameCode);

    }

    // set all the neccessary pieces up to start and play the game
    if(isset($_POST["initializeGame"])){
        //echo " Got to initializing the game up game - ";

        $code = json_decode($_POST["initializeGame"]);
        $gameCode = $code -> gameCode;
        $bsrPiecesData = $code -> bsrPiecesData;

        //echo print_r($bsrPiecesData);

        // set all of our initial data for the game
        BsrDatabaseMethods::setGamePlayingCode($gameCode);
        BsrDatabaseMethods::setInitialGameData($gameCode, $bsrPiecesData);
        BsrDatabaseMethods::setPlayerHasUpdated($gameCode);
        BsrDatabaseMethods::setWhoPreviouslyMoved($gameCode);
        
        // check if both players have initialized
        $canUpdate = BsrDatabaseMethods::checkIfBothPlayersAreInitialized($gameCode);

        // and if they have set both players to be able to update to get first move
        if ($canUpdate){
            BsrDatabaseMethods::setBothPlayersToUpdate($gameCode);
        }

        // return the players turn number (they will be able to move that turn)
        $number -> playerNumber = BsrDatabaseMethods::getPlayersTurnNumber($gameCode);
        $number = json_encode($number);
        echo $number;

    }

    // check for a game update of some kind and return game information (if the player is allowed to update that is)
    if(isset($_POST["checkForUpdate"])){
        echo " Got to checking for an update - ";

        $code = json_decode($_POST["checkForUpdate"]);
        $gameCode = $code -> gameCode;

    }

    // set all the neccessary pieces up to start and play the game
    if(isset($_POST["playerMove"])){
        echo " Got to using a players move - ";

        $code = json_decode($_POST["playerMove"]);
        $gameCode = $code -> gameCode;

    }

    // update the current game for the player that made a move and return the updated game state if necessary
    if(isset($_POST["quitGame"])){
        echo " Player quitting game - ";

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
        //BsrDatabaseMethods::setInitialGameData($gameCode, $bsr);
        //BsrDatabaseMethods::joinMatch($gameCode);
        //BsrDatabaseMethods::disconnectFromGame($gameCode);
        //$t = BsrDatabaseMethods::updateShipLocationsPlayed($gameCode, $locations);
        //$t = BsrDatabaseMethods::updateShipLocationsAndHits($gameCode, $locations);
        //$t = BsrDatabaseMethods::getShipLocationsOfEnemyPlayer($gameCode);
        //$t = BsrDatabaseMethods::getShipLocationsOfBothPlayers($gameCode);
        //$t = BsrDatabaseMethods::getAttackedLocationsWithHits($gameCode);
        //$t = BsrDatabaseMethods::getCurrentTurn($gameCode);
        //$t = BsrDatabaseMethods::getEnemiesBsrData($gameCode);
        //$t = BsrDatabaseMethods::getWhoPreviouslyMoved($gameCode);
        //$t = BsrDatabaseMethods::getRemovedShips($gameCode);
        //$t = BsrDatabaseMethods::checkGameReadyToStart($gameCode);
        $t = BsrDatabaseMethods::checkIfBothPlayersAreInitialized($gameCode);
        //$t = BsrDatabaseMethods::checkIfGameOver($gameCode);
        //$t = BsrDatabaseMethods::checkIfPlayerExists($gameCode);
        //$t = BsrDatabaseMethods::checkIfPlayersConnected($gameCode);
        //$t = BsrDatabaseMethods::checkIfPlayerCanUpdate($gameCode);
        //$t = BsrDatabaseMethods::checkIfPlayerCanMakeMove($gameCode);
        //$t = BsrDatabaseMethods::checkPlayerIsWaitingInGameQueue($gameCode);
        echo print_r($t);
        
    }

?> 