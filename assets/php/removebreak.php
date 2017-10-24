<?php
    //$removeAgent = "Wahba";
    $removeAgent = $_POST["agent"];
    $totalBreak = json_decode(file_get_contents("../json/totalBreak.json"));
    if($data = json_decode(file_get_contents("../json/inBreak.json"))){
        for($i = 0; $i < count($data); $i++){
            if($data[$i]->agent == $removeAgent){
                $length = $data[$i]->length; // remove agent break length
                $timeInBreak = time()*1000 - $data[$i]->stamp;
                for($k = 0; $k < count($totalBreak); $k++){
                    if($totalBreak[$k]->name == $data[$i]->agent){
                        $totalBreak[$k]->break += $timeInBreak;
                    }
                }
                array_splice($data,$i,1);
            }
        }
        $inBreakCount = count($data); // number of agents remaining on break
        //var_dump($totalBreak);
        if($totalBreakFile = fopen("../json/totalBreak.json","w")){
            fwrite($totalBreakFile,json_encode($totalBreak));
            fclose($totalBreakFile);	
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
        $maxSlots = count($slots); // maximum allowed slots
        if($inBreakCount < $maxSlots){ 
            for($i = 0; $i < count($slots); $i++){
                //echo $length . " vs " . $slots[$i]->length . "<br>";
                if($slots[$i]->length == $length && $slots[$i]->taken == true){
                    $slots[$i]->taken = false;
                    break;
                } elseif($slots[$i]->length == "15" && $slots[$i]->taken == true) {
                    $slots[$i]->taken = false;
                    break;
                } elseif($slots[$i]->length == "30" && $slots[$i]->taken == true) {
                    $slots[$i]->taken = false;
                    break;
                } elseif($slots[$i]->length == "60" && $slots[$i]->taken == true) {
                    $slots[$i]->taken = false;
                    break;
                }
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