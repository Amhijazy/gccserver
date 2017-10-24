<?php

//$slots = ["15","15"];
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
$slotCount = count($slotsjson); // slot cound set by admin
if($data = json_decode(file_get_contents("../json/inBreak.json"))){
    $inBreakCount = count($data); // number of agents on break
    if($inBreakCount < $slotCount){
        foreach ($data as $agent) {
            foreach($slotsjson as $slot){
                if($agent->length == $slot->length){
                    if(!$slot->taken){
                        $slot->taken = true;
                        break;
                    }
                }
            }  
        }
    } else {
        foreach($slotsjson as $slot){
            $slot->taken = true;
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