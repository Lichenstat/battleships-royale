
<?php

    // Database methods to be used with thier respective calls,
    // calls are written using PDO

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
        // site info methods

        // increment the visitors count when they have visited the site
        public static function incrementVisits(){

            $dbInfo = self::getDatabaseInfo();
            $dbSiteInfo = self::getSiteInfoTable();
            
            //echo " Increment Visits - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // increment site visits
            $query = "UPDATE ".$dbSiteInfo -> name." 
                      SET ".$dbSiteInfo -> visitsColumn."=".$dbSiteInfo -> visitsColumn." + 1";
            $db -> query($query);

            $db = null;

        }

        // get the current update timeout bool value
        public static function getUpdateTimeoutBool(){

            $dbInfo = self::getDatabaseInfo();
            $dbSiteInfo = self::getSiteInfoTable();

            $bool;
            
            //echo " Get update bool - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // get bool value
            $query = "SELECT ".$dbSiteInfo -> updateTimeoutColumn." 
                      FROM ".$dbSiteInfo -> name;
            //echo $query;
            foreach($db -> query($query) as $row){
                $bool = $row[0];
            }

            $db = null;
            return $bool;

        }

        // set the update timeout bool
        public static function setUpdateTimeoutBool($bool = 0){
          
            $dbInfo = self::getDatabaseInfo();
            $dbSiteInfo = self::getSiteInfoTable();
            
            //echo " Increment Visits - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // increment site visits
            $query = "UPDATE ".$dbSiteInfo -> name." 
                      SET ".$dbSiteInfo -> updateTimeoutColumn."=".$bool;
            $db -> query($query);

            $db = null;

        }

        //---------------------------------------------------------------------
        // player table methods

        // check a game code and create one if it doesn't exist, as well as update it if it does exist
        public static function getGameCode($gameCode = ""){

            $dbInfo = self::getDatabaseInfo();
            $dbPlayersTable = self::getPlayersTableInfo();
            $currentGameCode = $gameCode;
            
            //echo " Checking our game code - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // if we don't have a game code, then make one for the player and put it in the table
            if (empty($gameCode)){

                //echo " Empty game code - ";

                $currentGameCode = Helper::getRandomString($dbPlayersTable -> gameCodeSize);
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
            
        }

        // check if the player exists in the playing table
        public static function checkIfPlayerExists($gameCode = ""){

            $dbInfo = self::getDatabaseInfo();
            $dbPlayersTable = self::getPlayersTableInfo();
            $exists;
                
            //echo " Checking if the player exits or not - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // check if the player exists as an actual playable person
            $query = "SELECT COUNT(*) 
                      FROM ".$dbPlayersTable -> name." 
                      WHERE ".$dbPlayersTable -> playerColumn."='".$gameCode."'";
            //echo $query;
            foreach($db -> query($query) as $row){
                $exists = $row[0];
            }

            if (!empty($exists)){
                $db = null;
                return true;
            }

            $db = null;
            return false;

        }

        // reset the game timeout using the game code
        public static function resetTimeout($gameCode = ""){

            if (!empty($gameCode)){

                $dbInfo = self::getDatabaseInfo();
                $dbPlayersTable = self::getPlayersTableInfo();
                
                //echo " Resetting timeout - ";

                $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

                // get the player from the table and update the timeout count back to base timeout number
                $query = "UPDATE ".$dbPlayersTable -> name." 
                          SET ".$dbPlayersTable -> timeoutColumn."=".$dbPlayersTable -> baseTimeoutCount." 
                          WHERE ".$dbPlayersTable -> playerColumn."='".$gameCode."'";
                $db -> query($query);
                $db = null;

            }

        }

        // update the game timeout of all players if desired
        public static function updateTimeout($decrementCount = 1){

                $dbInfo = self::getDatabaseInfo();
                $dbPlayersTable = self::getPlayersTableInfo();
                
                //echo " Updating timeout - ";

                $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

                // update all players timeout by subtracting a given number (timeout is set to 60, subtract whatever is needed)
                $query = "UPDATE ".$dbPlayersTable -> name." 
                          SET ".$dbPlayersTable -> timeoutColumn."=".$dbPlayersTable -> timeoutColumn." - ".$decrementCount;
                $db -> query($query);

                $db = null;

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
            
            // if our game code is not empty (the player assumably exists)
            if (!empty($gameCode)){
                
                // if there is no match code, we will find a random players game who is also looking for a game to join or add the player in as a random to join
                if (empty($matchCode)){ 
                    $playerCode = "";
    
                    echo " Empty match code - ";
                    $query = "SELECT ".$dbGameSearch -> playerColumn." 
                              FROM ".$dbGameSearch -> name." 
                              WHERE ".$dbGameSearch -> connectedColumn." IS NULL LIMIT 1";
                    echo $query;
                    foreach($db -> query($query) as $row){
                        $playerCode = $row[0];
                    }

                    // if our player code is not empty and is not the same code as our game code, join game
                    if (!empty($playerCode) && $playerCode != $gameCode){
                        echo " - Will join their game - ";
                        echo " - Player code - ".$playerCode;
                        $query = "UPDATE ".$dbGameSearch -> name." 
                                  SET ".$dbGameSearch -> connectedColumn."='".$gameCode."' 
                                  WHERE ".$dbGameSearch -> playerColumn."='".$playerCode."'";
                        echo $query;
                        $db -> query($query);
                    }
    
                    // if there is no player code to join simply add ourselves to the searching game table
                    if (empty($playerCode)){
                        echo " No player code ot join, add self to search - ";
                        $query = "INSERT INTO ".$dbGameSearch -> name." (".$dbGameSearch -> playerColumn.") 
                                  VALUES ('".$gameCode."')";
                        echo $query;
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
                        echo $query;
                        foreach($db -> query($query) as $row){
                            echo "found their match (they made one) - ".$row[0];
                            $checkPlayerCode = $row[0];
                        }
                        
                        // just checks the connected side of the table for the player as well
                        $query = "SELECT ".$dbGameSearch -> connectedColumn." 
                                  FROM ".$dbGameSearch -> name." 
                                  WHERE ".$dbGameSearch -> connectedColumn."='".$matchCode."'";
                        echo $query;
                        foreach($db -> query($query) as $row){
                            echo "found thier match (they joined one) - ".$row[0];
                            $checkConnectedCode = $row[0];
                        }

                        // check if the player attempting to connect to actually exists or not
                        $doesPlayerExist = self::checkIfPlayerExists($matchCode);
    
                        // if they are not in a match
                        if (empty($checkPlayerCode) && empty($checkConnectedCode) && $doesPlayerExist){
                            echo " We will use the match code and auto join both - ";
                            // delete them if they are looking for a game (need a clean join case)
                            $query = "DELETE FROM ".$dbGameSearch -> name." 
                                      WHERE ".$dbGameSearch -> playerColumn."='".$matchCode."'";
                            echo $query;                          
                            $db -> query($query);
    
                            // now insert both into the search table against one another
                            $query = "INSERT INTO ".$dbGameSearch -> name." (".$dbGameSearch -> playerColumn.", ".$dbGameSearch -> connectedColumn.") 
                                      VALUES ('".$matchCode."', '".$gameCode."')";
                            echo $query;
                            $db -> query($query);
                        }
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

        // check if a player is in the table that is waiting for other players to join a game
        public static function checkPlayerIsWaitingInGameQueue($gameCode = ""){

            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            $exists;

            //echo " Checking if waiting for another player - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // check if both players are ready or not
            $query = "SELECT COUNT(*) 
                      FROM ".$dbGameSearch -> name." 
                      WHERE ".$dbGameSearch -> playerColumn."='".$gameCode."' AND ".$dbGameSearch -> connectedColumn." IS NULL";
            //echo $query;
            foreach($db -> query($query) as $row){
                $exists = $row[0];
            }

            if (!empty($exists)){
                $db = null;
                return true;
            }

            $db = null;
            return false;

        }

        // check if both players are ready to play the game or not and return the value
        public static function checkGameReadyToStart($gameCode = ""){

            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            $ready;

            //echo " Checking if game is ready to start - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // check if both players are ready or not
            $query = "SELECT COUNT(*) 
                      FROM ".$dbGameSearch -> name." 
                      WHERE ".$dbGameSearch -> playerReadyColumn."=1 AND ".$dbGameSearch -> connectedReadyColumn."=1 
                              AND (".$dbGameSearch -> playerColumn."='".$gameCode."' OR ".$dbGameSearch -> connectedColumn."='".$gameCode."')";
            //echo $query;
            foreach($db -> query($query) as $row){
                $ready = $row[0];
            }

            if (!empty($ready)){
                $db = null;
                return true;
            }

            $db = null;
            return false;

        }

        // check if the player are connected to the game or not
        public static function checkIfPlayersConnected($gameCode = ""){

            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            $connected;

            //echo " Checking if players are connected - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // check if players are connected or not
            $query = "SELECT COUNT(*) 
                      FROM ".$dbGameSearch -> name." 
                      WHERE (".$dbGameSearch -> playerColumn."='".$gameCode."' OR ".$dbGameSearch -> connectedColumn."='".$gameCode."') 
                            AND (".$dbGameSearch -> playerColumn." IS NOT NULL AND ".$dbGameSearch -> connectedColumn." IS NOT NULL)";
            //echo $query;                  
            foreach($db -> query($query) as $row){
                $connected = $row[0];
            }

            if (!empty($connected)){
                $db = null;
                return true;
            }

            $db = null;
            return false;

        }

        // disconnect from a game if desired
        public static function disconnectFromGame($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();

            echo "Disconnecting players from curent game $gameCode - ";

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

            //echo " Quit game, removing game info $gameCode - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // remove temporary turn information from the table
            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> locationUpdateColumn."=NULL, ".$dbGamePlay -> locationHitColumn."=NULL, ".$dbGamePlay -> shipRemovedColumn."=NULL 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);

            // update the game playing table info using the quitting players id
            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> playerColumn."=NULL ,".$dbGamePlay -> playerLocationsColumn."=NULL ,".$dbGamePlay -> playerUpdateColumn."=NULL 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);

            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> connectedColumn."=NULL ,".$dbGamePlay -> connectedLocationsColumn."=NULL ,".$dbGamePlay -> connectedUpdateColumn."=NULL 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);

            $query = "DELETE FROM ".$dbGamePlay -> name."
                      WHERE ".$dbGamePlay -> playerColumn." IS NULL AND ".$dbGamePlay -> connectedColumn." IS NULL"; // AND ".$dbGamePlay -> previousMoveColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);
        
            $db = null;

        }

        // remove last played row by a givne game code if it exists as a previous move code
        public static function deleteRowViaPreviousMoveCodeUsingGameCode($gameCode = ""){

            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            //echo " Removing last played player code if necessary - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            $query = "DELETE FROM ".$dbGamePlay -> name."
                      WHERE ".$dbGamePlay -> previousMoveColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);
        
            $db = null;

        }

        // check if the players codes have been inserted into the playing table yet
        public static function checkPlayersCodeIsPlaying($gameCode = ""){

            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $exists;

            //echo " Check players code to see if they exist - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // check to see if the current code exists in the game table
            $query = "SELECT COUNT(*) FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
            foreach($db -> query($query) as $row){
                $exists = $row[0];
            }
            
            $db = null;
            return $exists;

        }

        // check if both players are currently playing the game
        public static function checkIfBothPlayersAreInitialized($gameCode = ""){

            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $exists;

            //echo " Checking both players to see if they exist - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // check to see if the current code exists in the game table
            $query = "SELECT COUNT(*) FROM ".$dbGamePlay -> name." 
                      WHERE (".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."') 
                             AND (".$dbGamePlay -> playerColumn." IS NOT NULL AND ".$dbGamePlay -> connectedColumn." IS NOT NULL)
                             AND (".$dbGamePlay -> playerBsrDataColumn." IS NOT NULL AND ".$dbGamePlay -> connectedBsrDataColumn." IS NOT NULL)";
            //echo $query;
            foreach($db -> query($query) as $row){
                $exists = $row[0];
            }

            if ($exists){
                $db = null;
                return true;
            }
            
            $db = null;
            return false;

        }

        // assign game playing codes once one players codes are recieved
        public static function setGamePlayingCode($gameCode){
            $dbInfo = self::getDatabaseInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            //echo " Setting play codes in playing $gameCode - ";

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

            //echo " Setting as previous move - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // set the previous move as the player who just made a move
            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> previousMoveColumn."='".$gameCode."' 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);
            
            $db = null;

        }

        // get who previously moved
        public static function getWhoPreviouslyMoved($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $previousMove;

            //echo " Getting the previous move - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // get the player who made the previous move
            $query = "SELECT ".$dbGamePlay -> previousMoveColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."' LIMIT 1";
            //echo $query;
            foreach($db -> query($query) as $row){
                $previousMove = $row[0];
            }
            
            $db = null;
            return $previousMove;
        }

        // check if player can make the move or not
        public static function checkIfPlayerCanMakeMove($gameCode= ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $check;

            echo " Setting as previous move - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // sleect the count of the player who made the last move given a game code
            $query = "SELECT COUNT(*) 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> previousMoveColumn."='".$gameCode."' LIMIT 1";
            echo $query;
            foreach($db -> query($query) as $row){
                $check = $row[0];
            }

            // if the game code where the last moved column is not the same, return true
            if (!$check){
                $db = null;
                return true;
            }

            // otherwise return false
            $db = null;
            return false;
        }

        // set both players to allow updating thier game (set to 1)
        public static function setBothPlayersToUpdate($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            //echo " Setting both sides to update - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // set both sides to update for both players
            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> playerUpdateColumn."= 1, ".$dbGamePlay -> connectedUpdateColumn."= 1 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);
            
            $db = null;
        }

        // set the update count back to 0 to show the player has updated or not
        public static function setPlayerHasUpdated($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            //echo " One side updated - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // set that the player has updated
            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> playerUpdateColumn."= 0 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);

            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> connectedUpdateColumn."= 0 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);
            
            $db = null;
        }

        // check if the player can get updated info or not
        public static function checkIfPlayerCanUpdate($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $canUpdate;

            //echo " Can our player update - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // check that the player can update
            $query = "SELECT ".$dbGamePlay -> playerUpdateColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' LIMIT 1";
            //echo $query;
            foreach($db -> query($query) as $row){
                $canUpdate = $row[0];
            }

            if ($canUpdate){
                $db = null;
                return true;
            }

            // check if connected can update
            $query = "SELECT ".$dbGamePlay -> connectedUpdateColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."' LIMIT 1";
            //echo $query;
            foreach($db -> query($query) as $row){
                $canUpdate = $row[0];
            }

            if ($canUpdate){
                $db = null;
                return true;
            }

            $db = null;
            return false;
        }

        // set game data up properly by putting bsrPiecesData with ship locations into right cells respectively
        public static function setInitialGameData($gameCode = "", $bsrPiecesData){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            //echo " Inserting data into proper locations - ";

            self::setGamePlayingCode($gameCode);

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // serialize our gotten locations
            $check = new BsrCheckPiecesData($bsrPiecesData);
            $locations = $check -> getCheckedCombinedLocations();
            $ships = $check -> getLocationsAndShips();
            //echo print_r($locations);
            $bsrPiecesSerialzied = serialize($bsrPiecesData);
            $locationsSerialized = serialize($locations);
            $shipsSerialized = serialize($ships);
            
            // set the pieces into the playing table to reference for pieces and locations of ships
            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> playerBsrDataColumn."='".$bsrPiecesSerialzied."', ".$dbGamePlay -> playerLocationsColumn."='".$locationsSerialized."', ".$dbGamePlay -> playerShipsColumn."='".$shipsSerialized."' 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);

            $query = "UPDATE ".$dbGamePlay -> name."  
                      SET ".$dbGamePlay -> connectedBsrDataColumn."='".$bsrPiecesSerialzied."', ".$dbGamePlay -> connectedLocationsColumn."='".$locationsSerialized."', ".$dbGamePlay -> connectedShipsColumn."='".$shipsSerialized."' 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);
            
            $db = null;
        }

        // return the players turn number for the game (most likely used in initialization)
        public static function getPlayersTurnNumber($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $check;

            //echo " Returning starting information $gameCode - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // check to see if the current code exists and get its placement
            $query = "SELECT ".$dbGamePlay -> playerColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' LIMIT 1";
            //echo $query;
            foreach($db -> query($query) as $row){
                $check = $row[0];
            }
            //echo "game code ".$check;

            // if the code is from the first slot, return 1
            if ($gameCode == $check){
                return 1;
            }

            $query = "SELECT ".$dbGamePlay -> connectedColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."' LIMIT 1";
            //echo $query;
            foreach($db -> query($query) as $row){
                $check = $row[0];
            }
            //cho "game code ".$check;

            // if the code is from the second slot, return 2
            if ($gameCode == $check){
                return 2;
            }
            
            $db = null;
        }
        
        // set the last ship location used in the table (works for single locations atm)
        public static function updateLocationsPlayed($gameCode = "", $locations = [[]]){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo " Setting played location in table - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            $location = $locations[0];
            $serializedLocations = serialize($location);
            echo $serializedLocations;

            // return the game code ship locations to update them
            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> locationUpdateColumn."='".$serializedLocations."' 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            echo $query;
            $db -> query($query);
            
            $db = null;
        }
        
        // get ship locations given a game code
        public static function getShipLocationsOfEnemyPlayer($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $locations;

            //echo " Getting ship locations $location - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // return the game code ship locations to update them for player columm
            $query = "SELECT ".$dbGamePlay -> connectedLocationsColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            //echo $query;
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
            //echo $query;
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

        // get ships with locations of enemy player
        public static function getShipsWithLocationsOfEnemyPlayer($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
               $dbGamePlay = self::getPlayingTableInfo();
            $locations;

            //echo " Getting ship locations $location - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // return the game code ship locations to update them for player columm
            $query = "SELECT ".$dbGamePlay -> connectedShipsColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            //echo $query;
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
            $query = "SELECT ".$dbGamePlay -> playerShipsColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
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

        // get both ship locations of same game from a game code (works for 2 players atm)
        public static function getShipLocationsOfBothPlayers($gameCode){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $locations;
            
            //echo " Getting both ship locations - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // get both ship locations from a game code
            $query = "SELECT ".$dbGamePlay -> connectedLocationsColumn.", ".$dbGamePlay -> playerLocationsColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);
            foreach($db -> query($query) as $row){
                $locations -> player = unserialize($row[0]);
                $locations -> connected = unserialize($row[1]);
            }

            $db = null;
            return $locations;
        }

        // update ship locations to set proper hits and locations left
        public static function updateShipLocationsAndHits($gameCode = "", $locations = [[]]){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $shipsRemoved = [];
            $newUpdateShips = [];
            
            //echo " Updating ship location and hit - ";
            
            // remove locations from enemy player and reserialize
            $updateLocations = self::getShipLocationsOfEnemyPlayer($gameCode);
            //echo print_r($updateLocations)."<br>";
            $updateLocations = Helper::removeArraysFromMultidimentionalArrayReturnWithBools($locations, $updateLocations);
            //echo print_r($updateLocations)."<br>";
            
            $updateShips = self::getShipsWithLocationsOfEnemyPlayer($gameCode);
            $shipsLength = count($updateShips -> ships);
            $newUpdateShips = $updateShips;

            // check and remove necessary ships with locations pieces
            for ($i = 0; $i < $shipsLength; $i++){
                
                $ship = $updateShips -> ships[$i];
                $shipLocations = $updateShips -> locations[$i];
                $locationsLength = count($locations);
                
                // check if piece has changed in size and if it has no length left (empty) remove ship from array
                for ($j = 0; $j < $locationsLength; $j++){
                    
                    $check = Helper::removeArraysFromMultidimentionalArray($locations, $shipLocations);
                    $newUpdateShips -> locations[$i] = $check;
                    $checkSize = count($check);
                    
                    // if our pieces locations are empty, unset the locations and name and set the name of the piece as a removed piece
                    if (!$checkSize){
                        
                        $shipsSank[] = $ship;
                        unset($newUpdateShips -> locations[$i]);
                        $shipsRemoved[] = ($newUpdateShips -> ships[$i]);
                        $shipsRemoved = array_values($shipsRemoved);
                        unset($newUpdateShips -> ships[$i]);

                    }

                }

                // reindex arrays
                $newUpdateShips -> locations = array_values($newUpdateShips -> locations);
                $newUpdateShips -> ships = array_values($newUpdateShips -> ships);

            }       

            // serialize our info
            $updateHits = serialize($updateLocations -> bools);
            $updateLocations = serialize($updateLocations -> array);
            $updateShips = serialize($newUpdateShips);
            $shipsRemoved = serialize($shipsRemoved);

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // update the pieces location table based on player code
            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> connectedLocationsColumn."='".$updateLocations."' ,".$dbGamePlay -> connectedShipsColumn."='".$updateShips."' 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);

            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> playerLocationsColumn."='".$updateLocations."' ,".$dbGamePlay -> playerShipsColumn."='".$updateShips."' 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);

            // set location hit with removed ships
            $query = "UPDATE ".$dbGamePlay -> name." 
                      SET ".$dbGamePlay -> locationHitColumn."='".$updateHits."' , ".$dbGamePlay -> shipRemovedColumn."='".$shipsRemoved."' 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            //echo $query;
            $db -> query($query);
            
            $db = null;
        }

        // get ship name that has been removed from either players table
        public static function getRemovedShips($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $removed;

            //echo " Getting removed (sank) ships - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // check to see if the current code exists in the game table
            $query = "SELECT ".$dbGamePlay -> shipRemovedColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            foreach($db -> query($query) as $row){
                $removed = unserialize($row[0]);
            }

            $db = null;
            return $removed;
        }

        // check if the game is over (empty ship locations for one of the players)
        public static function checkIfGameOver($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $gameOver;

            //echo " Checking if the game is over or not - ";

            $shipLocations = self::getShipLocationsOfBothPlayers($gameCode);

            // if either ship locations of player or connected are empty, the game must be over
            if (empty($shipLocations -> player) || empty($shipLocations -> connected)){
                return true;
            }

            return false;
        }

        // get the enemies bsr data (most likely will be called after a game is over)
        public static function getEnemiesBsrData($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $bsr;

            //echo " Get the enemies bsr data to return - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // return connected bsr playing as player
            $query = "SELECT ".$dbGamePlay -> connectedBsrDataColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."'";
            foreach($db -> query($query) as $row){
                $bsr = unserialize($row[0]);
            }

            if (!empty($bsr)){
                $db = null;
                return $bsr;
            }

            // return player bsr data as connected
            $query = "SELECT ".$dbGamePlay -> playerBsrDataColumn." 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            foreach($db -> query($query) as $row){
                $bsr = unserialize($row[0]);
            }

            if (!empty($bsr)){
                $db = null;
                return $bsr;
            }
            
            $db = null;
        }

        // get whos turn it is during the game (works for 2 people for now)
        public static function getCurrentTurn($gameCode = ""){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $currentTurn;

            //echo " Get whos turn it is - ";

            $previousMove = self::getWhoPreviouslyMoved($gameCode);

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // check to see whos turn it currently is 
            $query = "SELECT COUNT(*) 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> previousMoveColumn."='".$previousMove."' AND ".$dbGamePlay -> playerColumn."='".$previousMove."' LIMIT 1";
            //echo $query;
            foreach($db -> query($query) as $row){
                $currentTurn = $row[0];
            }

            // if the code is from the first slot, return 2
            if ($currentTurn){
                $db = null;
                return 2;
            }

            $query = "SELECT COUNT(*) 
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> previousMoveColumn."='".$previousMove."' AND ".$dbGamePlay -> connectedColumn."='".$previousMove."' LIMIT 1";
            //echo $query;
            foreach($db -> query($query) as $row){
                $currentTurn = $row[0];
            }

            // if the code is from the second slot, return 1
            if ($currentTurn){
                $db = null;
                return 1;
            }
            
            $db = null;
        }

        // get ship locations taht were updated
        public static function getAttackedLocationsWithHits($gameCode){
            $dbInfo = self::getDatabaseInfo();
            $dbGamePlay = self::getPlayingTableInfo();
            $locations;

            //echo " Getting attacked locations from table - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // check to see if the current code exists in the game table
            $query = "SELECT ".$dbGamePlay -> locationUpdateColumn." ,".$dbGamePlay -> locationHitColumn."
                      FROM ".$dbGamePlay -> name." 
                      WHERE ".$dbGamePlay -> playerColumn."='".$gameCode."' OR ".$dbGamePlay -> connectedColumn."='".$gameCode."'";
            foreach($db -> query($query) as $row){
                $locations -> locations = unserialize($row[0]);
                $locations -> hits = unserialize($row[1]);
            }

            $db = null;
            return $locations;
        }

        //---------------------------------------------------------------------
        // other useful functions not directly related to a specific table

        // cleanup all the database information in the tables when a player has timedout after leaving
        public static function cleanupTables(){
            
            $dbInfo = self::getDatabaseInfo();
            $dbPlayersTable = self::getPlayersTableInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            $codes;

            //echo " Cleaning up tables - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);
            
            // get all player codes that have an expired timeout (0 or less)
            $query = "SELECT ".$dbPlayersTable -> playerColumn." 
                      FROM ".$dbPlayersTable -> name." 
                      WHERE ".$dbPlayersTable -> timeoutColumn." <= 0";
            //echo $query;
            $codes = $db -> query($query);

            // for every code
            foreach($db -> query($query) as $row){

                //echo " ".$row[0];

                // delete all rows in a table using the codes with expired timeouts
                // Players table
                $query = "DELETE FROM ".$dbPlayersTable -> name." 
                          WHERE ".$dbPlayersTable -> playerColumn."='".$row[0]."'";
                //echo $query;
                $db -> query($query);

                // GameSearch Table
                $query = "DELETE FROM ".$dbGameSearch -> name." 
                          WHERE ".$dbGameSearch -> playerColumn."='".$row[0]."' OR ".$dbGameSearch -> connectedColumn."='".$row[0]."'";
                //echo $query;
                $db -> query($query);

                // Playing Table

                // remove player that left and set other player as winner (if possible)
                self::setBothPlayersToUpdate($row[0]);
                self::setWhoPreviouslyMoved($row[0]);
                self::removePlayingInfo($row[0]);  
                
            }

            //delete empty playing tables
            $query = "DELETE FROM ".$dbGamePlay -> name." 
            WHERE ".$dbGamePlay -> playerColumn." IS NULL AND ".$dbGamePlay -> connectedColumn." IS NULL";
            //echo $query;
            $db -> query($query);  

            $db = null;

        }     

        // create all the data tables and thier columns with their given data types in database game initialization
        public static function createTables(){

            $dbInfo = self::getDatabaseInfo();
            $dbSiteInfo = self::getSiteInfoTable();
            $dbPlayersTable = self::getPlayersTableInfo();
            $dbGameSearch = self::getGameSearchTableInfo();
            $dbGamePlay = self::getPlayingTableInfo();

            echo " Creating tables (if necessary) - ";

            $db = new PDO('mysql:host='.$dbInfo -> host.';dbname='.$dbInfo -> name, $dbInfo -> username, $dbInfo -> password);

            // create tables with proper data types

            // Info table

            $exists;

            $query = "CREATE TABLE IF NOT EXISTS ".$dbSiteInfo -> name." ( 
                     ".$dbSiteInfo -> visitsColumn." INT, 
                     ".$dbSiteInfo -> updateTimeoutColumn." BOOL 
                     )";
            echo $query." ";
            $db -> query($query);

            // check if info rows are set or not (greater than 0 means they exist)
            $query = "SELECT COUNT(*) FROM ".$dbSiteInfo -> name;
            echo $query." ";

            foreach($db -> query($query) as $row){
                $exists = $row[0];
            }

            // if not, put the initial information in the site info rows
            if ($exists <= 0){
                $query="INSERT INTO ".$dbSiteInfo -> name." 
                        VALUES (0, 1)";
                echo $query." ";
                $db -> query($query);
            }

            // Players table
            $query = "CREATE TABLE IF NOT EXISTS ".$dbPlayersTable -> name." ( 
                     ".$dbPlayersTable -> playerColumn." VARCHAR(50), 
                     ".$dbPlayersTable -> timeoutColumn." INT 
                     )";
            echo $query." ";
            $db -> query($query);

            // GameSearch Table
            $query = "CREATE TABLE IF NOT EXISTS ".$dbGameSearch -> name." ( 
                     ".$dbGameSearch -> playerColumn." VARCHAR(50), 
                     ".$dbGameSearch -> connectedColumn." VARCHAR(50), 
                     ".$dbGameSearch -> playerReadyColumn." TINYINT(1), 
                     ".$dbGameSearch -> connectedReadyColumn." TINYINT(1) 
                     )";
            echo $query." ";
            $db -> query($query);

            // Playing Table
            $query = "CREATE TABLE IF NOT EXISTS ".$dbGamePlay -> name." ( 
                     ".$dbGamePlay -> playerColumn." VARCHAR(50), 
                     ".$dbGamePlay -> playerBsrDataColumn." VARCHAR(2500), 
                     ".$dbGamePlay -> playerShipsColumn." VARCHAR(2000), 
                     ".$dbGamePlay -> playerLocationsColumn." VARCHAR(1000), 
                     ".$dbGamePlay -> connectedColumn." VARCHAR(50), 
                     ".$dbGamePlay -> connectedBsrDataColumn." VARCHAR(2500), 
                     ".$dbGamePlay -> connectedShipsColumn." VARCHAR(2000), 
                     ".$dbGamePlay -> connectedLocationsColumn." VARCHAR(1000), 
                     ".$dbGamePlay -> playerUpdateColumn." TINYINT(1), 
                     ".$dbGamePlay -> connectedUpdateColumn." TINYINT(1), 
                     ".$dbGamePlay -> previousMoveColumn." VARCHAR(50), 
                     ".$dbGamePlay -> locationUpdateColumn." VARCHAR(250), 
                     ".$dbGamePlay -> locationHitColumn." VARCHAR(250), 
                     ".$dbGamePlay -> shipRemovedColumn." VARCHAR(250) 
                     )";
            echo $query." ";
            $db -> query($query);

            $db = null;

        }  

    }

?>