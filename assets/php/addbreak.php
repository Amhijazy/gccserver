<?php
    

    //$newAgent = json_decode('{"agent":"Saeed","length":"60","stamp":1506700672288}');
    $newAgent = json_decode($_POST["data"]);
    $data = json_decode(file_get_contents("../json/inBreak.json"));
    $slots = json_decode(file_get_contents("../json/slots.json"));
    $slotTook = false;
    $succsess = true;
    for($i = 0; $i < count($slots); $i++){
        if($slots[$i]->length == $newAgent->length && $slots[$i]->taken == false){
            $slots[$i]->taken = true;
            $slotTook = true;
            break;
        }
    }
    if($slotTook){
        if($inBreak = fopen("../json/inBreak.json","w")){
            array_push($data,$newAgent);
            fwrite($inBreak,json_encode($data));
            fclose($inBreak);
        } else {
            $succsess = false;
        }
        if($newSlots = fopen("../json/slots.json","w")){
            fwrite($newSlots,json_encode($slots));
            fclose($newSlots);
        } else {
            $succsess = false;
        }
        if ($succsess){
            echo "Break added successfully.";
        } else {
            echo "System problem";
        }
    } else {
        echo "Too slow. Someone took the slot.";
    }
?>