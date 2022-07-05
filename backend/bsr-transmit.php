
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

    if(isset($_GET["getGameCode"])){
        echo "test gamecode 10101010";
    }

?> 