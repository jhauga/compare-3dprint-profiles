<?php
 // Slic3r
 // Call to extract property value pair from Slic3r gcode files.
 
 $uri = $_SERVER["REQUEST_URI"];
 if (strrpos($uri, "?") > -1) {
  $query = substr($uri, strrpos($uri, "?")+1);
  $query = urldecode($query);
  
  // Guess OS and and call accordingly.
  $guess_operating_system = exec("ip -V");
  $guess_operating_system_mac = exec("sw_vers");
  if ($guess_operating_system == "" && $guess_operating_system_mac == "") {      
   // Windows
   $path_sep = "/\//";
   $query = preg_replace($path_sep, "\\", $query);
   echo `grep  "; .* = " "$query" | sed "s/^;/--;--/"`;
  } else {
   // unix like commands - mac or linux
   echo `grep  "; .* = " "$query" | sed "s/^;/--;--/"`;
  }
  
 }

?>