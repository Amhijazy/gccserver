<?php

    $agent = $_POST["checkAgent"];
    $totalBreak = json_decode(file_get_contents("../json/totalBreak.json"));
    for($k = 0; $k < count($totalBreak); $k++){
        if($agent == $totalBreak[$k]->name){
            $break = $totalBreak[$k]->break/60000;
            echo $agent . " has taken a total break of " . $break . " minutes today.";
        }
    }

?>