<?php
 // file_count
 // List all files from parse and from folders in parse directory.
 
 $uri = $_SERVER["REQUEST_URI"];
 $use_query = 0;
 if (strrpos($uri, "?") == "") {
  $query = "";
  $use_query = 0; 
 } else {
  $query = substr($uri, strrpos($uri, "?")+1);
  $query = urldecode($query);       
  $use_query = 1; 
 }
 // Guess OS and and call accordingly.
 $guess_operating_system = exec("ip -V");
 $guess_operating_system_mac = exec("sw_vers");
 if ($guess_operating_system == "" && $guess_operating_system_mac == "") {      
  // using windows 
  if ($use_query == 0) { 
   echo `dir /A:A /B ..\parse | findstr ".fff .gcode .ini"`;
  } else {   
   echo `dir /A:A /B "..\parse\\$query\\" | findstr ".fff .gcode .ini"`;
  }    
 } else {
  // unix like commands - mac or linux
  if ($use_query == 0) { 
   echo  `ls ../parse/*.* | sed "s|../parse/||g"`;
  } else {   
   echo `ls "../parse/$query" | grep "\.fff\|\.gcode\|\.ini"`;
  }   
 }
  
?>