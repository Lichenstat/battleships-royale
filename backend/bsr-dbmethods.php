
<?php

    // Database methods to be used with thier respective calls,
    // is written in PDO

    require "bsr-dbinfo.php";
    require "bsr-dbitems.php";
    require_once("helper.php");

    class BsrDatabaseMethods{
        use BsrDatabaseInfo, BsrDatabaseItems;

        // simply check the database connections for any errors
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

        //---------------------------------------------------------------------
        // player table methods

        // check a game code and create one if it doesn't exist, as well as update it if it does exist
        public static function checkGameCode($gameCode = ""){
            echo " Checking our game code - ";
            $dbInfo = self::getDatabaseInfo();
            $dbPlayersTable = self::getPlayersTableInfo();
            $currentGameCode = $gameCode;

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // if we don't have a game code, then make one for the player and put it in the table
            if (empty($gameCode)){
                echo " Empty game code - ";
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
                              VALUES ('".$currentGameCode."',".$dbPlayersTable -> baseTimeoutCount.")";
                    $db -> query($query);
                }

                // close the connection and return the game code
                $db = null;
                return $currentGameCode;
            }

            // if we do have an existing game code, then just use it and update the Timeout
            self::resetTimeout($currentGameCode);
        }

        // update the game timeout using the game code
        public static function resetTimeout($gameCode = ""){
            if (!empty($gameCode)){
                echo " Resetting timeout - ";
                $dbInfo = self::getDatabaseInfo();
                $dbPlayersTable = self::getPlayersTableInfo();

                $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

                // get the player from the table and update the timeout count back to base timeout number
                $query = "UPDATE ".$dbPlayersTable -> name." 
                          SET ".$dbPlayersTable -> timeoutColumn."=".$dbPlayersTable -> baseTimeoutCount." 
                          WHERE ".$dbPlayersTable -> playerColumn."='".$gameCode."'";
                $db -> query($query);
                $db = null;
            }
        }

        //---------------------------------------------------------------------
        // game searching/syncing methods

        // join a match with a random player or a known player using a game code
        public static function joinMatch($gameCode = "", $matchCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            echo $gameCode." - ";
            echo $matchCode." - ";
            
            echo " match code checking - ";
            
            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // if there is no match code, we will find a random players game who is also looking for a game to join or add the player in as a random to join
            if (empty($matchCode)){ 
                $playerCode = "";

                echo " empty match code - ";
                $query = "SELECT ".$dbGameSearch -> playerColumn." 
                          FROM ".$dbGameSearch -> name." 
                          WHERE ".$dbGameSearch -> connectedColumn." IS NULL LIMIT 1";
                foreach($db -> query($query) as $row){
                    $playerCode = $row[0];
                }

                // if our player code is not empty and is not the same code as our game code, join game
                if (!empty($playerCode) && $playerCode != $gameCode){
                    echo " will join their game - ";
                    echo " plaeyr code - ".$playerCode;
                    $query = "UPDATE ".$dbGameSearch -> name." 
                              SET ".$dbGameSearch -> connectedColumn."='".$gameCode."' 
                              WHERE ".$dbGameSearch -> playerColumn."='".$playerCode."'";
                    $db -> query($query);
                }

                // if there is no player code to join simply add ourselves to the searching game table
                if (empty($playerCode)){
                    echo " no player code ot join, add self to search - ";
                    $query = "INSERT INTO ".$dbGameSearch -> name." (".$dbGameSearch -> playerColumn.") 
                              VALUES ('".$gameCode."')";
                    $db -> query($query);
                }
            }

            // if there is a match code then we will join that game as the connected player
            if (!empty($matchCode)){
                $checkPlayerCode;
                $checkConnectedCode;

                // if the match is not the players game (cannot join your own game)
                if ($matchCode != $gameCode){

                    // first check if the other player is not in a match
                    $query = "SELECT ".$dbGameSearch -> playerColumn." 
                              FROM ".$dbGameSearch -> name." 
                              WHERE ".$dbGameSearch -> playerColumn."='".$matchCode."' AND ".$dbGameSearch -> connectedColumn." IS NOT NULL LIMIT 1";
                    foreach($db -> query($query) as $row){
                        echo "found their match (they made one) - ".$row[0];
                        $checkPlayerCode = $row[0];
                    }
                    
                    // just checks the connected side of the table for the player as well
                    $query = "SELECT ".$dbGameSearch -> connectedColumn." 
                              FROM ".$dbGameSearch -> name." 
                              WHERE ".$dbGameSearch -> connectedColumn."='".$matchCode."'";
                    foreach($db -> query($query) as $row){
                        echo "found thier match (they joined one) - ".$row[0];
                        $checkConnectedCode = $row[0];
                    }

                    // if they are not in a match
                    if (empty($checkPlayerCode) && empty($checkConnectedCode)){
                        echo " We will use the match code and auto join both - ";
                        // delete them if they are looking for a game (need a clean join case)
                        $query = "DELETE FROM ".$dbGameSearch -> name." 
                                  WHERE ".$dbGameSearch -> playerColumn."='".$matchCode."'";
                        $db -> query($query);

                        // now insert both into the search table against one another
                        $query = "INSERT INTO ".$dbGameSearch -> name." (".$dbGameSearch -> playerColumn.", ".$dbGameSearch -> connectedColumn.") 
                                  VALUES ('".$matchCode."', '".$gameCode."')";
                        $db -> query($query);
                    }
                }
            }
            $db = null;
        }

        // update the ready state of our players
        public static function updateReadyState($gameCode = "", $readyState = 0){
            echo " Updating the game ready states - ";
            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // if our game code isnt empty
            if (!empty($gameCode)){

                // update and set the current game ready state for either the host or joined
                // if the code is the "host"
                $query = "UPDATE ".$dbGameSearch -> name." 
                          SET ".$dbGameSearch -> playerReadyColumn."=".$readyState." 
                          WHERE ".$dbGameSearch -> playerColumn."='".$gameCode."'";
                $db -> query($query);

                // if the code is the "connected"
                $query = "UPDATE ".$dbGameSearch -> name." 
                          SET ".$dbGameSearch -> connectedReadyColumn."=".$readyState." 
                          WHERE ".$dbGameSearch -> connectedColumn."='".$gameCode."'";
                $db -> query($query);
            }

            $db = null;
        }

        // check if both players are ready to play the game or not and return the value
        public static function checkGameReady($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            $ready;

            echo " Checking if game is ready - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // check if both players are ready or not
            $query = "SELECT COUNT(*) 
                      FROM ".$dbGameSearch -> name." 
                      WHERE ".$dbGameSearch -> playerReadyColumn."=1 AND ".$dbGameSearch -> connectedReadyColumn."=1";
            foreach($db -> query($query) as $row){
                $ready = $row[0];
                echo " Ready state $ready - ";
            }

            $db = null;
            return $ready;
        }

        // disconnect from a game if desired (also clean game playing table if there is a game being played)
        public static function disconnectFromGame($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo "Disconnecting player from curent game $gameCode - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // delete the game search table row using the disconnected players id
            $query = "DELETE FROM ".$dbGameSearch -> name." 
                      WHERE ".$dbGameSearch -> playerColumn."='".$gameCode."' OR ".$dbGameSearch -> connectedColumn."='".$gameCode."'";
            $db -> query($query);

            // update the game playing row using the disconnected players id
            //$query = "UPDATE ".$dbGamePlay -> name." SET ".$dbGamePlay -> playerColumn.""
            $query = "DELETE FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            $db -> query($query);

            $db = null;
        }

        //---------------------------------------------------------------------
        // playing table methods

        // assign all the proper game data after recieving it
        public static function setGameData($gameCode){
            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            
            $db = null;
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