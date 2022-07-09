
<?php

     /* 
     Configuration to be used in php classes/objects/methods. These 
     are seperate and not dependent on the config in the bsr-config.js 
     file. You will have to change these manually here if you change the properties 
     in bsr-config.js. These changes will most likely be due to the change in the
     grid size or the count of the ships in bsr-config.js. 
     */

     trait BsrConfiguration{
          // get grid sizes
          public static function getGridSizes(){

               // set grid size information (max sizes)
               $gridSizes -> width = 9;
               $gridSizes -> height = 9;

               return $gridSizes;
          }

          // get ship sizes and counts
          public static function getShipSizesAndCount(){
               
               // set ship information
               $ships -> carrierSize = 5;
               $ships -> carrierCount = 1;

               $ships -> battleshipSize = 4;
               $ships -> battleshipCount= 2;

               $ships -> destroyerSize = 3;
               $ships -> destroyerCount = 2;
               
               $ships -> submarineSize = 3;
               $ships -> submarineCount = 2;

               $ships -> patrolboatSize = 2;
               $ships -> patrolboatCount = 3;

               // set total count of ships
               $total = $ships -> carrierCount + 
                        $ships -> battleshipCount +
                        $ships -> destroyerCount +
                        $ships -> submarineCount + 
                        $ships -> patrolboatCount;

               $ships -> count = $total;

               return $ships;
          }

     }

?>