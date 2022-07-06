
<?php

    // Database methods to be used with thier respective calls,
    // is written in PDO

    require "bsr-dbinfo.php";
    require_once("helper.php");

    class BsrDatabaseMethods{
        use BsrDatabaseInfo;

        public static function checkDatatbaseConnection(){
            $dbInfo = self::getDatabaseInfo();
            try{
                //'mysqli:host=localhost;dbname=BattleshipsRoyale', 'battleshipsroyale', 'PaS5word./'
                $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            }
            catch(PDOException $e){
                echo $e -> getMessage()."<br>";
                die();
            }
        }

        // check a game code and create one if it doesn't exist, as well as update it if it does exist
        public static function checkGameCode($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbTablesAndColumns = self::getDatabaseTablesAndColumns();
            $currentGameCode = $gameCode;

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // if we don't have a game code, then make one for the player and put it in the table
            if ($gameCode == ""){
                $currentGameCode = Helper::test();
                $query = 'INSERT INTO '.$dbInfo -> name.".".$dbTablesAndColumns -> playerTable." PlayerCode 
                VALUES '$currentGameCode'";
                $db -> query($query);
                $db = null;
                return $currentGameCode;
            }

            // if we do have a game code, then just use it and update the Timeout
            if ($gameCode != ""){

                $db = null;
            }
        }

        //test
        public function test(){
            $dbInfo = self::getDatabaseInfo();
            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            //$sql = 'SELECT * FROM'.$dbInfo -> name.".".$dbInfo -> playerTable
            $db = null;
        }

    }

?>