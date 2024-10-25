<?php
 // directory_list
 // List all folders in parse directory.
 
 // Gues OS and and call accordingly.
 $guess_operating_system = exec("ip -V");
 if ($guess_operating_system == "") {
  // using windows    
  echo `dir /A:D /B ..\parse`;
 } else {
  // using linux
  echo  `ls -l ../parse | grep "^d" | sed -E "s/^.*([0-9]+) (.*)$/\\2/"`;
 }
  
?>