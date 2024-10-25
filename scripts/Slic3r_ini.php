<?php
 $uri = $_SERVER["REQUEST_URI"];
 if (strrpos($uri, "?") > -1) {
  $query = substr($uri, strrpos($uri, "?")+1);
  $query = urldecode($query);
  if (exec("ip -V") == "") {
   // Windows
   $path_sep = "/\//";
   $query = preg_replace($path_sep, "\\", $query);
   echo `grep  "^.* = " "$query" | sed -E "s/^(.)/--;-- \\1/"`;
  } else {
   echo `grep  "^.* = " "$query" | sed -E "s/^(.)/--;-- \\1/"`;
  }
 }

?>