<?php
	
	$mt = $_GET['mt'];
	$sn = $_GET['sn'];

	$url = 'https://support.lenovo.com/services/us/en/SystemXWarrantyLookup/QueryWarrantyStatus';
	$data = array('SerialNumber' => $sn, 'MachineType' => $mt, 'WarrantyCode' => '0');

	// use key 'http' even if you send the request to https://...
	$options = array(
	    'http' => array(
	        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
	        'method'  => 'POST',
	        'content' => http_build_query($data)
	    )
	);
	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);

	echo $result;
?>