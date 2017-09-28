<?php
    $newAgent = json_decode($_POST["data"]);
    var_dump($_POST);
    $data = json_decode(file_get_contents("../json/inBreak.json"));
    $inBreak = fopen("../json/inBreak.json","w");
    array_push($data,$newAgent);
    fwrite($inBreak,json_encode($data));
    var_dump($data);
    fclose($inBreak);	
    
?>