
<?php

    // Database methods to be used with thier respective calls,
    // is written in PDO

    require "bsr-dbinfo.php";
    require "bsr-dbitems.php";
    require "bsr-check.php";
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
            $dbInfo = self::getDatabaseInfo();
            $dbPlayersTable = self::getPlayersTableInfo();
            $currentGameCode = $gameCode;
            
            echo " Checking our game code - ";

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
            
            echo " Match code checking - ";
            
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
            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            
            echo " Updating the game ready states - ";

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
                      WHERE ".$dbGameSearch -> playerReadyColumn."=1 AND ".$dbGameSearch -> connectedReadyColumn."=1 
                              AND (".$dbGameSearch -> playerColumn."='".$gameCode."' OR ".$dbGameSearch -> connectedColumn."='".$gameCode."'";
            foreach($db -> query($query) as $row){
                $ready = $row[0];
                echo " Ready state $ready - ";
            }

            $db = null;
            return $ready;
        }

        // disconnect from a game if desired
        public static function disconnectFromGame($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();

            echo "Disconnecting player from curent game $gameCode - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // delete the game search table row using the disconnected players id
            $query = "DELETE FROM ".$dbGameSearch -> name." 
                      WHERE ".$dbGameSearch -> playerColumn."='".$gameCode."' OR ".$dbGameSearch -> connectedColumn."='".$gameCode."'";
            $db -> query($query);

            $db = null;
        }

        //---------------------------------------------------------------------
        // playing table methods

        // remove playing info for the person who quits the game
        public static function removePlayingInfo($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo " Quit game, removing game info $gameCode - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // update the game playing table info using the quitting players id
            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> playerColumn."=NULL ,".$dbGamePlay -> playerLocationsColumn."=NULL ,".$dbGamePlay -> playerUpdateColumn."=NULL ,".$dbGamePlay -> locationUpdateColumn."=NULL 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
                      //echo $query;
            $db -> query($query);

            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> connectedColumn."=NULL ,".$dbGamePlay -> connectedLocationsColumn."=NULL ,".$dbGamePlay -> connectedUpdateColumn."=NULL ,".$dbGamePlay -> locationUpdateColumn."=NULL 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
                      //echo $query;
            $db -> query($query);
        
            $db = null;
        }

        // check if the players codes have been inserted into the playing table yet
        public static function checkPlayersCodeIsPlaying($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $exists;

            echo " Check players code to see if they exist - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // check to see if the current code exists in the game table
            $query = "SELECT COUNT(*) FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            foreach($db -> query($query) as $row){
                $exists = $row[0];
            }
            
            $db = null;
            return $exists;
        }

        // assign game playing codes once one players codes are recieved
        public static function setGamePlayingCode($gameCode){
            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo " Setting play codes in playing $gameCode - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            $check = self::checkPlayersCodeIsPlaying($gameCode);
            
            // if the game code does not yet exist in playing table, 
            // pull code info out from search/sync table and put it in game playing table
            if (!$check){
                $query = "INSERT INTO ".$dbGamePlay -> name." (".$dbGamePlay -> playerColumn.", ".$dbGamePlay -> connectedColumn.") 
                          SELECT ".$dbGameSearch -> playerColumn.", ".$dbGameSearch -> connectedColumn." 
                          FROM ".$dbGameSearch -> name." 
                          WHERE ".$dbGameSearch -> playerColumn."='".$gameCode."' OR ".$dbGameSearch -> connectedColumn."='".$gameCode."'";
                $db -> query($query);
            }
            
            $db = null;
        }

        // set what player made the previous move during the game
        public static function setWhoPreviouslyMoved($gameCode= ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo " Setting as previous move - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // set the previous move as the player who just made a move
            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> previousMoveColumn."='".$gameCode."' 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);
            
            $db = null;
        }

        // set both players to update their moves
        public static function setBothPlayersToUpdate($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo " Setting both sides to update - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // set both sides to update for both players
            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> playerUpdateColumn."= 1, ".$dbGamePlay -> connectedUpdateColumn."= 1 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);
            
            $db = null;
        }

        // set the update count back to 0 to show the player has updated or not
        public static function setPlayerHasUpdated($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo " One side updated - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // set that the player has updated
            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> playerUpdateColumn."= 0 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);

            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> connectedUpdateColumn."= 0 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);
            
            $db = null;
        }

        // set game data up properly by putting bsrPiecesData with ship locations into right cells respectively
        public static function setGameData($gameCode = "", $bsrPiecesData){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo " Inserting data into proper locations - ";

            self::setGamePlayingCode($gameCode);

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            $check = new BsrCheckPiecesData($bsrPiecesData);
            $locations = $check -> getCombinedPieces();
            //echo print_r($locations);
            $bsrPiecesSerialzied = serialize($bsrPiecesData);
            $locationsSerialized = serialize($locations);

            
            // set the pieces into the playing table to reference for pieces and locations of ships
            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> playerBsrDataColumn."='".$bsrPiecesSerialzied."', ".$dbGamePlay -> playerLocationsColumn."='".$locationsSerialized."' 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);

            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> connectedBsrDataColumn."='".$bsrPiecesSerialzied."', ".$dbGamePlay -> connectedLocationsColumn."='".$locationsSerialized."' 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);
            
            $db = null;
        }

        // return necessary starting game information
        public static function getInitialGameInfo($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $check;
            echo " Returning starting information $gameCode - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // check to see if the current code exists and get its placement
            $query = "SELECT ".$dbGamePlay -> playerColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' LIMIT 1";
            echo $query;
            foreach($db -> query($query) as $row){
                $check = $row[0];
            }
            echo "game code ".$check;
            // if the code is from the first slot, return 1
            if ($gameCode == $check){
                return 1;
            }

            $query = "SELECT ".$dbGamePlay -> connectedColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."' LIMIT 1";
            echo $query;
            foreach($db -> query($query) as $row){
                $check = $row[0];
            }
            echo "game code ".$check;
            // if the code is from the second slot, return 2
            if ($gameCode == $check){
                return 2;
            }
            
            $db = null;
        }
        
        // set the last ship location used in teh table
        public static function updateShipLocationPlayed($gameCode = "", $location = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo " Set location in playing table - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            $serializedLocation = serialize($location);
            echo $serializedLocation;

            // return the game code ship locations to update them
            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> locationUpdateColumn."='".$serializedLocation."' 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);
            
            $db = null;
        }
        
        // get ship locations given a game code
        public static function getShipLocations($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $locations;

            echo " Getting ship locations $location - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // return the game code ship locations to update them for player columm
            $query = "SELECT ".$dbGamePlay -> connectedLocationsColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);
            foreach($db -> query($query) as $row){
                $locations = $row[0];
            }
            
            if (!empty($locations)){
                $locations = unserialize($locations);
                $db = null;
                return $locations;
            }

            // return the game code ship locations to update them for connected column
            $query = "SELECT ".$dbGamePlay -> playerLocationsColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);
            foreach($db -> query($query) as $row){
                $locations = $row[0];
            }

            if (!empty($locations)){
                $locations = unserialize($locations);
                $db = null;
                return $locations;
            }
            
        }

        // update ship location if necessary
        public static function updateShipLocations($gameCode = "", $locations = [[]]){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            
            echo " Updating ship location $location - ";
            
            // remove locations from enemy player and reserialize
            $updateLocations = self::getShipLocations($gameCode);
            //echo print_r($updateLocations)."<br>";
            $updateLocations = Helper::removeArraysFromMultidimentionalArray($locations, $updateLocations);
            //echo print_r($updateLocations)."<br>";
            $updateLocations = serialize($updateLocations);

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // update the pieces location table based on player code
            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> connectedLocationsColumn."='".$updateLocations."' 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);

            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> playerLocationsColumn."='".$updateLocations."' 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);
            
            $db = null;
        }

        // return information on game update
        public static function returnUpdateInformation($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo " Returning necessary update information - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // check to see if the current code exists in the game table
            $query = "";
            foreach($db -> query($query) as $row){
                $exists = $row[0];
            }
            
            $db = null;
        }

        //---------------------------------------------------------------------
        // other useful functions not directly related to a specific table
        public static function cleanupTables(){

        }     

    }

?>