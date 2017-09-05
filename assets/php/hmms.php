<?php
$dir = "../hmms";
$a = scandir($dir);
$files = array_values(array_diff($a, array('.', '..')));
$hmmsjson = json_encode($files);
echo $hmmsjson;
?>