<!-- Recieving info from clientside to process then transmit back to serverside-->
<?php
// PHP code goes here
// var_dump
// print_r

echo "Got to transmit - ";

if(isset($_POST["data"])){
    echo "Got the data POST method ";
    $obj = $_POST["data"];
    echo "Data is ". print_r($obj);

}

if(isset($_POST["posts"])){
    echo "Got the data";
    echo "Data is ". $_POST["data"];

}

if(isset($_GET["data"])){
    echo "Got the data GET method ";
    echo "Data is ". $_POST["data"];

}



?> 