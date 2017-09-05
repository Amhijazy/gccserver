<?php
	
	$mt = $_GET['mt'];
	$sn = $_GET['sn'];

	$url = 'https://csp.lenovo.com/ibapp/POIRequest.jsp?xml=%3CwiInputForm%20source=%22ibase%22%3E%3Cid%3EIBMANZ%3C/id%3E%3Cpw%3EIBASE4ANZ%3C/pw%3E%3Clanguage%3EEN%3C/language%3E%3Ctype%3E' . $mt . '%3C/type%3E%3Cserial%3E' . $sn . '%3C/serial%3E%3CwiOptions%3E%3Cmachine/%3E%3Cservice/%3E%3Cupma/%3E%3Caod/%3E%3Cparts/%3E%3C/wiOptions%3E%3C/wiInputForm%3E';

	$xml = file_get_contents($url);

	echo $xml;
?>