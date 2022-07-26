
<?php

    /* 
    database items for use with db calls, this is where the databse
    table and column names are set for use in creating queries
    */

    trait BsrDatabaseItems{

        // general database information table info
        public static function getSiteInfoTable(){

            $db -> name = "SiteInfo";

            $db -> visitsColumn = "VisitorsCount";
            $db -> updateTimeoutColumn = "UpdateTimeout";

            return $db;

        }


        // database players table info
        public static function getPlayersTableInfo(){

            $db -> name = "Players";

            $db -> playerColumn = "PlayerCode";
            $db -> timeoutColumn = "Timeout";
            $db -> baseTimeoutCount = 30;
            $db -> gameCodeSize = 10;

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
            $db -> playerBsrDataColumn = "PlayerBsrData";
            $db -> playerShipsColumn = "PlayerShipsWithLocations";
            $db -> playerLocationsColumn = "PlayerShipLocations";
            
            $db -> connectedColumn = "ConnectedCode";
            $db -> connectedBsrDataColumn = "ConnectedBsrData";
            $db -> connectedShipsColumn = "ConnectedShipsWithLocations";
            $db -> connectedLocationsColumn = "ConnectedShipLocations";

            $db -> playerUpdateColumn = "PlayerUpdate";
            $db -> connectedUpdateColumn = "ConnectedUpdate";

            $db -> previousMoveColumn = "PreviousMoveCode";
            $db -> locationUpdateColumn = "LocationUpdate";
            $db -> locationHitColumn = "LocationHit";
            $db -> shipRemovedColumn = "ShipsRemoved";

            return $db;

        }

    }

?>