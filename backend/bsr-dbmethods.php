
<?php

    // Database methods to be used with thier respective calls,
    // is written in PDO

    require "bsr-dbinfo.php";
    require "bsr-dbitems.php";
    require_once("helper.php");

    class BsrDatabaseMethods{
        use BsrDatabaseInfo, BsrDatabaseItems;

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
            $dbPlayersTable = self::getPlayersTableInfo();
            $currentGameCode = $gameCode;
            $timeoutCount = $dbPlayersTable -> baseTimeoutCount;

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // if we don't have a game code, then make one for the player and put it in the table
            if ($gameCode == ""){
                $currentGameCode = Helper::getRandomString(30);
                $alreadyExists;

                // check if the player code already exists in the Players table
                $query = "SELECT COUNT(*) FROM ".$dbPlayersTable -> name." 
                          WHERE ".$dbPlayersTable -> playerColumn."='".$currentGameCode."'";
                foreach($db -> query($query) as $row){
                    $alreadyExists = $row[0];
                }

                // if it does not yet exist, we will add it in wiht a 5 minute timer for an attempt at refreshing
                if ($alreadyExists < 1){
                    $query = "INSERT INTO ".$dbPlayersTable -> name." (".$dbPlayersTable -> playerColumn.", ".$dbPlayersTable -> timeoutColumn.") 
                              VALUES ('".$currentGameCode."',".$timeoutCount.")";
                    $db -> query($query);
                }

                // close the connection and return the game code
                $db = null;
                return $currentGameCode;
            }

            // if we do have an existing game code, then just use it and update the Timeout
            if ($gameCode != ""){
                echo ($gameCode);
                // get the player from the table and update the timeout count back to base timeout number
                $query = "UPDATE ".$dbPlayersTable -> name." 
                          SET ".$dbPlayersTable -> timeoutColumn."=".$timeoutCount." 
                          WHERE ".$dbPlayersTable -> playerColumn."='".$gameCode."'";
                $db -> query($query);
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