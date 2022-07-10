
<?php

// helper class with static methods to be used with various functions/methods

    class Helper{

        public static function test(){
            return "testing helper";
        }

        // get the difference of the arrays elements (first one subtracted by the second one)
        // at the moment it only checks for the length of the smallest array
        public static function differenceOfArrayElements($arrayOne = [], $arrayTwo = []){
            $differenceArray = array();
            $arrayOneSize = count($arrayOne);
            $arrayTwoSize = count($arrayTwo);
            $arrayLength = min($arrayOneSize, $arrayTwoSize);
            for ($i = 0; $i < $arrayLength; $i++){
                $newValue = $arrayOne[$i] - $arrayTwo[$i];
                $differenceArray[] = $newValue;
            }
            return $differenceArray;
        }

        // get manhattan distance between two arrays (specificly with a length of two)
        public static function getManhattanDistanceViaArrays($arrayLocationOne = [0,0], $arrayLocationTwo = [0,0]){
            $distance = abs($arrayLocationTwo[0] - $arrayLocationOne[0]) + abs($arrayLocationTwo[1] - $arrayLocationOne[1]);
            return $distance;
        }

        // get a randomly generated string
        public static function getRandomString($length = 10){
            return substr(str_shuffle(MD5(microtime())), 0, $length);
        }

        // remove desired array from multi-dimentional array (DOES NOT DELETE ALL DUPLICATES, JUST 1 ARRAY OF SAME TYPE)
        public static function removeArraysFromMultidimentionalArray($arraysToRemove = [[]], $array = [[]]){
            $newArray = $array;
            $removalArrayLength = count($arraysToRemove);
            for ($i = 0; $i < $removalArrayLength; $i++){
                if(($key = array_search($arraysToRemove[$i], $newArray)) !== false){
                    unset($newArray[$key]);
                }
            }
            return $newArray;
        }

    }

?>