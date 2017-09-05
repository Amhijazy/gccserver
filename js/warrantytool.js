function getWarranty(mt, sn){
    var mt = mt;
    var sn = sn;
    var url = 'assets/php/XMLparser.php?mt=' + mt + '&sn=' + sn;

    $.get(url, function( data ) {
        var text = data;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text,"text/xml");

        //Parsing Machine Info
        var out = "";
        out = out + "<tr>";

        var machine = xmlDoc.getElementsByTagName('type');
        if(machine[0]){
            out += "<td><b>Type:</b> " + machine[0].childNodes[0].nodeValue + "</td>";
        }else{
            out += "<td></td>"
        }
        
        machine = xmlDoc.getElementsByTagName('model');
        if(machine[0]){
            out += "<td><b>Model:</b> " + machine[0].childNodes[0].nodeValue + "</td>";
        }else{
            out += "<td></td>"
        }

        machine = xmlDoc.getElementsByTagName('serial');
        if(machine[0]){
            out += "<td><b>Serial:</b> " + machine[0].childNodes[0].nodeValue + "</td>";
        }else{
            out += "<td></td>"
        }
        
        machine = xmlDoc.getElementsByTagName('buildDate');
        if(machine[0]){
            out += "<td><b>Build Date:</b> " + machine[0].childNodes[0].nodeValue + "</td>";
        }else{
            out += "<td></td>"
        }
        
        out = out + "</tr>";
        document.getElementById("machineInfo").innerHTML = out;

        //Parsing Warranty Info
        out = "";
        out = out + "<tr><td><b>Start Date</b></td><td><b>End Date</b></td><td><b>SDF</b></td></tr>";

        var warranty = xmlDoc.getElementsByTagName('warstart');
        if (warranty[0]){
            out += "<tr><td>" + warranty[0].childNodes[0].nodeValue + "</td>";
        }else{
            out += "<tr><td></td>"
        }
        
        warranty = xmlDoc.getElementsByTagName('wed');
        if (warranty[0]){
            out += "<td>" + warranty[0].childNodes[0].nodeValue + "</td>";
        }else{
            out += "<td></td>"
        }
        
        warranty = xmlDoc.getElementsByTagName('sdf');
        if (warranty[0]){
            out += "<td>" + warranty[0].childNodes[0].nodeValue + "</td></tr>";
        }else{
            out += "<td></td></tr>"
        }
        
        warranty = xmlDoc.getElementsByTagName('sdfDesc');
        if (warranty[0]){
            out += "<tr><td colspan='3'>" + warranty[0].childNodes[0].nodeValue + "</td></tr>";
        }else{
            out += "<tr><td colspan='3'></td></tr>"
        }
        
        document.getElementById("warrantyInfo").innerHTML = out;

        //Parsing Upma Info
        out = "";
        out = out + "<tr><td><b>Start Date</b></td><td><b>End Date</b></td><td><b>SDF</b></td></tr>";

        var upma = xmlDoc.getElementsByTagName('mStartDate');
        if(upma[0]){
            out += "<tr><td>" + upma[0].childNodes[0].nodeValue + "</td>";
        }else{
            out += "<tr><td></td>"
        }
        
        upma = xmlDoc.getElementsByTagName('mEndDate');
        if(upma[0]){
            out += "<td>" + upma[0].childNodes[0].nodeValue + "</td>";
        }else{
            out += "<td></td>"
        }
        
        upma = xmlDoc.getElementsByTagName('mSDF');
        if(upma[0]){
            out += "<td>" + upma[0].childNodes[0].nodeValue + "</td></tr>";
        }else{
            out += "<td></td></tr>"
        }
        
        upma = xmlDoc.getElementsByTagName('mSDFDesc');
        if(upma[0]){
            out += "<tr><td colspan='3'>" + upma[0].childNodes[0].nodeValue + "</td></tr>";
        }else{
            out += "<tr><td colspan='3'></td></tr>"
        }

        document.getElementById("upmaInfo").innerHTML = out;

        //Parsing Parts Info
        out = "";
        out = out + "<tr><td><b>Part Number</b></td><td><b>FRU Number</b></td><td><b>FRU Description</b></td><td><b>Serial Number</b></td></tr>";
        var part = xmlDoc.getElementsByTagName('partInfo');
        
        for (var i = 0; i < part.length; i++) {
            out += "<tr><td>";

            if(part[i].childNodes[0].childNodes[0]){
                out += part[i].childNodes[0].childNodes[0].nodeValue + "</td><td>";
            }else{
                out += "</td><td>";
            }

            if (part[i].childNodes[1].childNodes[0]) {
                out += part[i].childNodes[1].childNodes[0].nodeValue + "</td><td>";
            } else {
                out += "</td><td>";
            }

            if(part[i].childNodes[2].childNodes[0]){
                out += part[i].childNodes[2].childNodes[0].nodeValue + "</td><td>";
            }else{
                out += "</td><td>";
            }

            if(part[i].childNodes[4].childNodes[0]){
                out += part[i].childNodes[4].childNodes[0].nodeValue + "</td></tr>";
            }else{
                out += "</td></tr>";
            }
        }

        document.getElementById("partInfo").innerHTML = out;

        //Parsing AOD Info
        var aod = xmlDoc.getElementsByTagName('aodInfo');
        out = "";

        for (var i = 0; i < aod.length; i++) {
            out += "<tr><td>";

            if(aod[i].childNodes[1].childNodes[0]){
                out += aod[i].childNodes[1].childNodes[0].nodeValue + "</td><td>";
            }else{
                out += "</td><td>";
            }

            if(aod[i].childNodes[0].childNodes[0]){
                out += aod[i].childNodes[0].childNodes[0].nodeValue + "</td></tr>";
            }else{
                out += "</td></tr>";
            }
        }

        document.getElementById("aodInfo").innerHTML = out;

        $('i').hide();
        $('#machineInfoTable').show();
        $('#warrantyInfoTable').show();
        $('#upmaInfoTable').show();
        $('#partInfoTable').show();
        $('#aodInfoTable').show();

        if (xmlDoc.getElementsByTagName('xmlMessage')[1]) {
            $('.well').html(xmlDoc.getElementsByTagName('xmlMessage')[1].childNodes[0].nodeValue);
            $('.well').show();
            $('#machineInfoTable').hide();
            $('#warrantyInfoTable').hide();
            $('#upmaInfoTable').hide();
            $('#partInfoTable').hide();
            $('#aodInfoTable').hide();
        }
    });
}

function searchWarranty(){
    $('.well').hide();
    $('i').show();
    var mt = $('#mt').val();
    var sn = $('#sn').val();
    getWarranty(mt, sn);
}

$('i').hide();
$('.well').hide();
$('#machineInfoTable').hide();
$('#warrantyInfoTable').hide();
$('#upmaInfoTable').hide();
$('#partInfoTable').hide();
$('#aodInfoTable').hide();

function getQueryVariable(variable){
   var query = self.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

if (getQueryVariable('mt') && getQueryVariable('sn')){
    $('#mt').val(getQueryVariable('mt'));
    $('#sn').val(getQueryVariable('sn'));
    $('i').show();
    getWarranty(getQueryVariable('mt'), getQueryVariable('sn'));
}
