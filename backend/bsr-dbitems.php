
<?php

    /* 
    database items for use with db calls, this is where the databse
    table and column names are set
    */

    trait BsrDatabaseItems{

        // general database item info


        // database players table info
        public static function getPlayersTableInfo(){

            $db -> name = "Players";
            $db -> playerColumn = "PlayerCode";
            $db -> timeoutColumn = "Timeout";
            $db -> baseTimeoutCount = 5;

            return $db;
        }

        // database gamesearch info
        public static function getGameSearchTableInfo(){
            
            $db -> name = "GameSearch";
            $db -> playerColumn = "PlayerCode";
            $db -> playerReadyColumn = "PlayerReady";
            $db -> connectedColumn = "ConnectedCode";
            $db -> connectedReadyColumn = "ConnectedReady";

            return $db;
        }

        // database playing info
        public static function getPlayingTableInfo(){

            $db -> name = "Playing";
            $db -> playerOneColumn = "PlayerCode";
            $db -> playerBsrDataColumn = "PlayerBsrData";
            $db -> playerLocationsColumn = "PlayerShipLocations";
            $db -> connectedColumn = "ConnectedCode";
            $db -> connectedBsrDataColumn = "ConnectedBsrData";
            $db -> connectedLocationsColumn = "ConnectedShipLocations";

            return $db;
        }

    }

?>