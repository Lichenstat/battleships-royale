
<?php

    // Recieving info from clientside to process then transmit back to serverside

    // PHP code goes here
    error_reporting(E_ALL);
    ini_set("display_errors","On");
    // var_dump
    // print_r

    require "bsr-dbmethods.php";
    require "bsr-check.php";

    echo "Got to transmit - ";

    if(isset($_POST["data"])){
        echo "Got the data POST method ";
        $obj = json_decode($_POST["data"]);
        echo "Data is ". $obj->answer;

    }

    if(isset($_POST["posts"])){
        echo "Got the data";
        echo "Data is ". $_POST["data"];

    }

    if(isset($_GET["data"])){
        echo "Got the data GET method ";
        echo "Data is ". $_POST["data"];

    }

    if(isset($_GET["test"])){
        echo "Using test - ";
        $chk = new BsrCheckPiecesData(1);
        echo $chk -> test();
    }

    // call a post with a possible game code or return one if there isnt a game code yet
    if(isset($_POST["checkGameCode"])){
        echo "got to gameoced - ";
        $code = json_decode($_POST["checkGameCode"]);
        $code = BsrDatabaseMethods::checkGameCode($code -> gameCode);
        echo $code;
    }

    // join a player to play a game if he exists and has given you a match code
    if(isset($_POST["joinPlayer"])){
        echo "got to join match - ";
        $code = json_decode($_POST["joinPlayer"]);
        //echo var_dump($code);
        $gameCode = $code -> gameCode;
        $joinCode = $code -> joinCode;
        //echo "game cpde ".$gameCode;
        //echo "joion code ", $joinCode;
        $code = BsrDatabaseMethods::joinMatch($gameCode, $joinCode);
    }

    // update the ready state of the current player
    if(isset($_POST["updateReadyState"])){
        echo "got to updating player state - ";
    }

    // set all the neccessary pieces up to start and play the game
    if(isset($_POST["setupGame"])){
        echo "got to setting up game - ";
    }

    // update the current game for the player that made a move and return the updated game state if necessary
    if(isset($_POST["gameTurn"])){
        echo " playing a game turn - ";
    }

?> 