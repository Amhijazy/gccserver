<?php
    //$removeAgent = "Wahba";
    $removeAgent = $_POST["agent"];
    if($data = json_decode(file_get_contents("../json/inBreak.json"))){
        //var_dump($data);
        for($i = 0; $i < count($data); $i++){
            if($data[$i]->agent == $removeAgent){
                $length = $data[$i]->length;
                array_splice($data,$i,1);
            }
        }
        if($inBreak = fopen("../json/inBreak.json","w")){
            fwrite($inBreak,json_encode($data));
            fclose($inBreak);	
        } else {
            die("Data not written to file.");
        }  
    } else{
        die("Could not open inbreak file.");
    }
    if($slots = json_decode(file_get_contents("../json/slots.json"))){
        for($i = 0; $i < count($slots); $i++){
            echo $length . " vs " . $slots[$i]->length . "<br>";
            if($slots[$i]->length == $length && $slots[$i]->taken == true){
                $slots[$i]->taken = false;
                break;
            } else {
                echo "no match";
            }
        }
        if($newSlots = fopen("../json/slots.json","w")){
            fwrite($newSlots,json_encode($slots));
            fclose($newSlots);
        } else {
            die("Could not open slots file");
        }
    } else {
        die("Slots file could not be opened");
    }

?>