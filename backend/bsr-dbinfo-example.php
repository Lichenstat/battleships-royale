
<?php

     /* 
     database info for use with db calls, this is where the db keys and login 
     information will be located for use to interact and make SQL query calls
     (table privileges that a user will need via sql for table interactions are:
     Delete, Insert, Select, Update. If making the tables at first initialization
     of the project enable Create for the user as well)
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