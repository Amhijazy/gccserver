var populate = {};
populate.allTables = function(mt,sn){
    // Get the XML file with mt & sn
    var url = 'assets/php/XMLparser.php?mt=' + mt + '&sn=' + sn;
    $.get(url, function( data ) {
        var text = data;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text,"text/xml");
        console.log(xmlDoc);
        // Passing the XML file to the populate functions
        populate.machineInfo(xmlDoc);
        populate.serviceInfo(xmlDoc);
        populate.warrantyUpgrade(xmlDoc);
        populate.partsInfo(xmlDoc);
        populate.aodInfo(xmlDoc);
    }).done(function(){
        $('.preloader-wrapper').hide();
    });
};
populate.machineInfo = function(xml){
    var type = $(xml).find('type').text();
    var model = $(xml).find('model').text();
    var serial = $(xml).find('serial').text();
    var buildDate = $(xml).find('buildDate').text();
    var text =  "<tr><td>"+ type + "</td><td>" + model + "</td><td>" + serial + "</td><td>" + buildDate + "</td></tr>";
    $('#machineinfo > tbody').html('');
    $('#machineinfo > tbody').html(text);
    $('#machineinfo').show();
};
populate.serviceInfo = function(xml){
    var startDate = $(xml).find('warstart').text();
    var endDate = $(xml).find('wed').text();
    var sdf = $(xml).find('sdf').text();
    var desc = $(xml).find('sdfDesc').text();
    var text = "<tr><td>"+startDate+"</td><td>"+endDate+"</td><td>"+sdf+"</td></tr><tr><td colspan='3'>"+desc+"</td></tr>";
    $('#warrantyinfo > tbody').html('');
    $('#warrantyinfo > tbody').html(text);
    $('#warrantyinfo').show();
    
};
populate.warrantyUpgrade = function(xml){
    var startDate = $(xml).find('mStartDate').text();
    var endDate = $(xml).find('mEndDate').text();
    var sdf = $(xml).find('mSDF').text();
    var desc = $(xml).find('mSDFDesc').text();
    var text = "<tr><td>"+startDate+"</td><td>"+endDate+"</td><td>"+sdf+"</td></tr><tr><td colspan='3'>"+desc+"</td></tr>";
    $('#warrantyupgrade > tbody').html('');
    $('#warrantyupgrade > tbody').html(text);
    $('#warrantyupgrade').show();
};
populate.partsInfo = function(xml){
    var partInfoList = $(xml).find('partInfo');
    var text = '';
    for (var i=0;i<partInfoList.length;i++) {
        var partNum = $(partInfoList[i]).find('partNumber').text();
        var fruNum = $(partInfoList[i]).find('fruPart').text();
        var fruDesc = $(partInfoList[i]).find('fruDesc').text();
        text += "<tr><td>"+partNum+"</td><td>"+fruNum+"</td><td colspan='2'>"+fruDesc+"</td></tr>";
    }
    $('#partsinfo > tbody').html('');
    $('#partsinfo > tbody').html(text);
    $('#partsinfo').show();
};
populate.aodInfo = function(xml){
    var aodInfoList = $(xml).find('aodInfo');
    var text = '';
    for (var i=0;i<aodInfoList.length;i++) {
        var aodDesc = $(aodInfoList[i]).find('aodDescription').text();
        var aodType = $(aodInfoList[i]).find('aodType').text();
        text += "<tr><td>"+aodType+"</td><td colspan='3'>"+aodDesc+"</td></tr>";
    }
    $('#aodinfo > tbody').html('');
    $('#aodinfo > tbody').html(text);
    $('#aodinfo').show();
};
    

// onsubmit function
function searchWarranty() {
    $('.preloader-wrapper').show();
    mt = $('#machineType').val();
    sn = $('#serialNumber').val();
    // populate tables
    populate.allTables(mt,sn);
    return false;
};