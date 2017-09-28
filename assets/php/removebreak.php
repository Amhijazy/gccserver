<?php
    $removeAgent = $_POST["agent"];
    //$_POST["agent"];
    if($data = json_decode(file_get_contents("../json/inBreak.json"))){
        for($i = 0; $i <= count($data)-1; $i++){
            if($data[$i]->agent == $removeAgent){
                array_splice($data,$i,1);
            }
        }
        $inBreak = fopen("../json/inBreak.json","w");
        fwrite($inBreak,json_encode($data));
        var_dump($data);
        fclose($inBreak);	
    }
    else{
        die("file could not be opened");
    }
?>