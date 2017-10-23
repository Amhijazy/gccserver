<?php

//$slots = ["60","15"];
$slots = $_POST["slots"];
$newSlots = "[";
foreach ($slots as $slot) {
    $newSlots .= '{
        "length":"'.$slot.'",
        "taken":false
    },';
}
$newSlots = rtrim($newSlots,", ");
$newSlots .=']';
$slotsjson = json_decode($newSlots);
if($data = json_decode(file_get_contents("../json/inBreak.json"))){
    foreach ($data as $agent) {
        foreach($slotsjson as $slot){
            if($agent->length == $slot->length){
                $slot->taken = true;
                break;
            }
        }  
    }
} 
$newSlots = json_encode($slotsjson);
if($newSlotsText = fopen("../json/slots.json","w")){
    fwrite($newSlotsText,$newSlots);
    fclose($newSlotsText);
    echo "Slots edited.";
} else {
    echo "Error opening slots file.";
}



?>