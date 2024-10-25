<?php
 $uri = $_SERVER["REQUEST_URI"];
 if (strrpos($uri, "?") > -1) {
  $query = substr($uri, strrpos($uri, "?")+1);
  $query = urldecode($query);
  if (exec("ip -V") == "") {
   // Windows
   $path_sep = "/\//";
   $query = preg_replace($path_sep, "\\", $query);
   echo `grep "^; .*$" "$query" | sed -e ":a;N;$!ba;s/\\n/--new-line--/g" -e "s/--new-line--;/--new-line----;--/g" -e "s/--new-line----;-- layer.*//g" -e "s/--new-line--/\\n/g" |  sed "s/,/--,--/" | sed -e 1,3d -e \$d `;       
  } else {
  // linux
   echo `grep "^; .*$" "$query" | sed -e ':a;N;$!ba;s/\\n/--new-line--/g' -e "s/--new-line--;/--new-line----;--/g" -e "s/--new-line----;-- layer.*//g" -e "s/--new-line--/\\n/g" | sed "s/,/--,--/" | sed -e 1,3d -e '\$d'`;
  }
 }

?>