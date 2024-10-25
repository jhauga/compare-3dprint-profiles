<?php
 // filecount
 // List all files with .ff extension.
 
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
 // Gues OS and and call accordingly.
 $guess_operating_system = exec("ip -V");
 if ($guess_operating_system == "") {
  // using windows 
  if ($use_query == 0) { 
   echo `dir /A:A /B ..\parse | findstr ".fff .gcode .ini"`;
  } else {   
   echo `dir /A:A /B "..\parse\\$query\\" | findstr ".fff .gcode .ini"`;
  }    
 } else {
  // using linux
  if ($use_query == 0) { 
   echo  `ls ../parse\/*.fff ../parse\/*.gcode ../parse\/*.gcode | sed "s|../parse/||g"`;
  } else {   
   echo `ls "../parse/$query" | grep "\.fff\|\.gcode\|\.ini"`;
  }   
 }
  
?>