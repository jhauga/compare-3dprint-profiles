<?php
 // Simplify3D
 // Call to extract property value pairs from Simplify3D gcode files.
 
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
   echo `grep "^; .*$" "$query" | sed -e ":a;N;$!ba;s/\\n/--new-line--/g" -e "s/--new-line--;/--new-line----;--/g" -e "s/--new-line----;-- layer.*//g" -e "s/--new-line--/\\n/g" |  sed "s/,/--,--/" | sed -e 1,3d -e \$d `;       
  } else {
  // unix like commands - mac or linux
   echo `grep "^; .*$" "$query" | sed -e ':a;N;$!ba;s/\\n/--new-line--/g' -e "s/--new-line--;/--new-line----;--/g" -e "s/--new-line----;-- layer.*//g" -e "s/--new-line--/\\n/g" | sed "s/,/--,--/" | sed -e 1,3d -e '\$d'`;
  }
  
 }

?>