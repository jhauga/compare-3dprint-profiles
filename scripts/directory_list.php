<?php
 // directory_list
 // List all folders in parse directory.
 
 // Gues OS and and call accordingly.
 $guess_operating_system = exec("ip -V");
 $guess_operating_system_mac = exec("sw_vers");
 if ($guess_operating_system == "" && $guess_operating_system_mac == "") {      
  // using windows    
  echo `dir /A:D /B ..\parse`;   
 } else {
  // unix like commands - mac or linux
  echo  `ls -l ../parse | grep "^d" | sed -E "s/^.*([0-9]+) (.*)$/\\2/"`;
 }
  
?>