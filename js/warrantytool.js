var populate = {};
populate.allTables = function(mt,sn){
    // Get the XML file with mt & sn
    var xmlurl = 'assets/php/XMLparser.php?mt=' + mt + '&sn=' + sn;
    $.get(xmlurl, function( data ) {
        var text = data;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text,"text/xml");
        console.log(xmlDoc);
        if($(xmlDoc).find('[type=error]').length){
            console.log($(xmlDoc).find('[type=error]').text());
            $('.collapsible').hide();
            Materialize.toast('Machine type and serial number not found.', 4000)
        } else{
            // Passing the XML file to the populate functions
            populate.machineInfo(xmlDoc);
            populate.serviceInfo(xmlDoc);
            populate.warrantyUpgrade(xmlDoc);
            populate.partsInfo(xmlDoc);
            populate.aodInfo(xmlDoc);
            // showing only the tables with info
            view.showPopulated();
        }
    }).done(function(){ 
        // Removing the loading animation once the get request is done
        $('.preloader-wrapper').hide();
    }).fail(function(){

    });
    // Get JSON file with mt & sn
    var jsonurl = 'assets/php/getLenovoWar.php?mt=' + mt + '&sn=' + sn;
    $.getJSON(jsonurl,function(data){
        console.log(data.IsSucceeded);
        if(data.IsSucceeded){
            var longObj = data.Data.X86Contract.ContracsListRestructure;
            console.log(longObj);
            //passing the specific object to populate function
            populate.additionalContacts(longObj);
        }
    });
};

populate.machineInfo = function(xml){
    var type = $(xml).find('type').text();
    var model = $(xml).find('model').text();
    var serial = $(xml).find('serial').text();
    var buildDate = $(xml).find('buildDate').text();
    var text =  "<tr><td>"+ type + "</td><td>" + model + "</td><td>" + serial + "</td><td>" + buildDate + "</td></tr>";
    $('#machineinfo tbody').html(text);
};

populate.serviceInfo = function(xml){
    var startDate = $(xml).find('warstart').text();
    var endDate = $(xml).find('wed').text();
    var sdf = $(xml).find('sdf').text();
    var desc = $(xml).find('sdfDesc').text();
    var text = "<tr><td>"+startDate+"</td><td>"+endDate+"</td><td>"+sdf+"</td></tr><tr><td colspan='3'>"+desc+"</td></tr>";
    $('#warrantyinfo tbody').html(text);
};

populate.warrantyUpgrade = function(xml){
    var startDate = $(xml).find('mStartDate').text();
    var endDate = $(xml).find('mEndDate').text();
    var sdf = $(xml).find('mSDF').text();
    var desc = $(xml).find('mSDFDesc').text();
    var text = "<tr><td>"+startDate+"</td><td>"+endDate+"</td><td>"+sdf+"</td></tr><tr><td colspan='3'>"+desc+"</td></tr>";
    $('#warrantyupgrade tbody').html(text);
};

populate.additionalContacts = function(json){
    var text='';
    for(var i=0; i<json.length;i++){
        var type = json[i].ContractItem[0].ChargeType;
        var SLA = json[i].ContractItem[0].SLA;
        var startDate = json[i].ContractItem[0].Item_Start_Date;
        var endDate = json[i].ContractItem[0].Item_End_Date;
        text += "<tr><td>"+(i+1)+"</td><td>"+type+"</td><td>"+SLA+"</td><td>"+startDate+"</td><td>"+endDate+"</td></tr>";
    }
    $('#additionalContacts tbody').html(text);
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
    $('#partsinfo tbody').html(text);
};

populate.aodInfo = function(xml){
    var aodInfoList = $(xml).find('aodInfo');
    var text = '';
    for (var i=0;i<aodInfoList.length;i++) {
        var aodDesc = $(aodInfoList[i]).find('aodDescription').text();
        var aodType = $(aodInfoList[i]).find('aodType').text();
        text += "<tr><td>"+aodType+"</td><td colspan='3'>"+aodDesc+"</td></tr>";
    }
    $('#aodinfo tbody').html(text);
};

var view = {};

view.showPopulated = function(){
    tables = $('table')
    for(var i=0; i < tables.length ;i++) {
        if(tables.eq(i).find('tbody td').eq(0).text() !== ""){
            tables.eq(i).parentsUntil('ul').show();
        }   
    }
    $('.collapsible').show();
};
    
// onsubmit function
function searchWarranty() {
    // Showing the loading animation once the button is clicked
    $('.preloader-wrapper').show();
    mt = $('#machineType').val();
    sn = $('#serialNumber').val();
    // populate tables
    populate.allTables(mt,sn);
    return false;
};