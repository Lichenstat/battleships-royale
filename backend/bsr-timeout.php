
<?php

// Check if we can update all the players timeouts

require_once("bsr-dbmethods.php");
//ini_set("display_errors","On");
// check the pieces data to store properly in sql
class BsrTimeout{

    // seconds that will take for the next update to run on, 
    // as well as the decrement value for the timeout update
    private static $timeoutSeconds = 5;

    // update the player timeouts for all players when running the game
    public static function updateTimeouts(){

        //echo " ~ Attempting to update timeouts - ~ ";

        $canWeUpdate = BsrDatabaseMethods::getUpdateTimeoutBool();

        // if we can update our timeouts, do so, then wait for timeout seconds to pass to do so again if need be
        if ($canWeUpdate){

            //echo " ~ Updating timeouts -  ~ ";
            BsrDatabaseMethods::setUpdateTimeoutBool(0);
            BsrDatabaseMethods::updateTimeout(self::$timeoutSeconds);
            BsrDatabaseMethods::cleanupTables();
            sleep(self::$timeoutSeconds);
            BsrDatabaseMethods::setUpdateTimeoutBool(1);

        }

    }

}

?>