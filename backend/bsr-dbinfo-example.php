
<?php

     /* 
     database info for use with db calls, this is where the db keys and login 
     information will be located for use to interact and make SQL query calls
     */

     trait BsrDatabaseInfo{

          // return the various database information
          public static function getDatabaseInfo(){
               
               $db -> host = "Host Name (localhost?)";
               $db -> name = "DatabaseName";
               $db -> username = "Username";
               $db -> password = "Some-password";

               return $db;
          }
          
     }

?>