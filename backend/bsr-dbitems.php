
<?php

    /* 
    database items for use with db calls, this is where the databse
    table and column names are set for use in creating queries
    */

    trait BsrDatabaseItems{

        // general database item info


        // database players table info
        public static function getPlayersTableInfo(){

            $db -> name = "Players";

            $db -> playerColumn = "PlayerCode";
            $db -> timeoutColumn = "Timeout";
            $db -> baseTimeoutCount = 3;
            $db -> gameCodeSize = 20;

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

            $db -> playerColumn = "PlayerCode";
            $db -> playerUpdateColumn = "PlayerUpdate";
            $db -> playerBsrDataColumn = "PlayerBsrData";
            $db -> playerLocationsColumn = "PlayerShipLocations";
            $db -> playerShipsColumn = "PlayerShipsWithLocations";

            $db -> connectedColumn = "ConnectedCode";
            $db -> connectedUpdateColumn = "ConnectedUpdate";
            $db -> connectedBsrDataColumn = "ConnectedBsrData";
            $db -> connectedLocationsColumn = "ConnectedShipLocations";
            $db -> connectedShipsColumn = "ConnectedShipsWithLocations";

            $db -> locationUpdateColumn = "LocationUpdate";
            $db -> locationHitColumn = "LocationHit";
            $db -> shipRemovedColumn = "ShipsRemoved";
            $db -> previousMoveColumn = "PreviousMoveCode";

            return $db;
        }

    }

?>