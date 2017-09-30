$(document).ready(function() {

    //jQuery plugin initialization
    /****************************/
    $('.modal').modal();
    $('input.autocomplete').autocomplete({
        data: lvl1AgentNames,
        limit: 5,
    });
    $('select').material_select();
    $.ajaxSetup({ cache: false });

    //Trigger events
    /**************/
    
    $(document).on('click','.remove-break',function(e){
        action.removeBreak(e);
    });

    //Populate page
    /*************/
    pop.all();
    
  });

/**************************************************************/
// Agent names

var lvl1AgentNames = {
    "Hijazy": null,
    "Wahba": null,
    "Aziz": null,
    "Ramy": null,
    "Saeed": null,
    "Nakata": null
};



/**************************************************************/
// Population functions

var pop = {};

pop.slotsUrl = "assets/json/slots.json";
pop.inBreakUrl = "assets/json/inBreak.json";

pop.breakSlots = function(){
    $.getJSON(this.slotsUrl,function(slots){
        //console.log(slots);
        var text = '';
        for(var i = 0; i < slots.length ; i++){
            var taken = "";
            if(slots[i].taken){
                taken = "disabled";
            }
            text+= '<button data-target="'+ slots[i].length + '" class="btn btn-large blue darken-1 modal-trigger '+ taken +'">'+ slots[i].length +'</button> ';
        }
        $('#slots').html(text);
    });
}

pop.onBreak = function(){
    $.getJSON(this.inBreakUrl,function(agents){
        var text = '';
        for(var i = 0; i <= agents.length - 1; i++){
            var exceedStyle = '';
            var difference = new Date($.now()-agents[i].stamp)/1000;
            var MM = Math.floor(difference/60);
            var hours = Math.floor(MM/60).toString();
            var minutes = "";
            if(MM%60 < 10){
                minutes = "0" + (MM%60).toString();
            } else {
                minutes = (MM%60).toString();
            }
            var timeInBreak = hours + ':' + minutes;
            var breakLength = "";
            if(agents[i].length == "60"){
                breakLength = "1:00";
            } else {
                breakLength = "0:" + agents[i].length;
            }
            if( MM > parseInt(agents[i].length)){
                exceedStyle = 'class = "red-text"';
            }
            text+= '<tr '+ exceedStyle +'><td>'+ agents[i].agent +'</td><td>'+ timeInBreak + '/' + breakLength + '</td><td>Aux</td><td><i class="material-icons remove-break">do_not_disturb</i></td></tr> ';
        }
        $('table > tbody').html(text);
    });
}

pop.all = function(){
    this.onBreak();
    this.breakSlots();
    setInterval(function() {
        pop.breakSlots();
        pop.onBreak();
    }, 10000);

}

/**************************************************************/

var action = {};

action.addBreakUrl = "assets\php\addbreak.php";
action.removeBreakUrl = "assets\php\removebreak.php";

action.takeBreak = function(time){
    /*
    console.log($('.remove-break'));
    console.log($('#30 input').val());
    console.log($.now());
    console.log('{"agent" : "'+ $('#'+time+' input').val() +'","length" : "'+ time +'","stamp" : '+ $.now() +'}');
    */
    console.log($('tbody').children().find(':first-child').html());
    
    $.post(
        "assets/php/addbreak.php",
        {
            data : '{"agent" : "'+ $('#'+time+' input').val() +'","length" : "'+ time +'","stamp" : '+ $.now() +'}'
        }
    ).done(function(){
        Materialize.toast('Break added successfully.', 4000)
    });
    $('#'+time).modal('close');
    return false;
}

action.removeBreak = function(e){

    var agent = $(e.target).parents('tr').find(':first-child').html();
    $.post(
        "assets/php/removebreak.php",
        {
            "agent" : agent
        }
    ).done(function(){
        Materialize.toast('Break removed successfully.', 4000)
    });
}

action.editSlots = function(){

}

arken = function(time){
    /*
    console.log($('.remove-break'));
    console.log($('#30 input').val());
    console.log($.now());
    console.log('{"agent" : "'+ $('#'+time+' input').val() +'","length" : "'+ time +'","stamp" : '+ $.now() +'}');
    */
    console.log($('tbody').children().find(':first-child').html());
    var agent = $('#'+time+' input').val();
    var agentOnBreak = false;
    var agentsOnBreak = $("tbody tr");
    for(var i=0; i<agentsOnBreak.length;i++){
        if(agent == $(agentsOnBreak[i]).find(':first-child').html()){
            agentOnBreak = true;
        }
    }
    if(!lvl1AgentNames.hasOwnProperty(agent)){
        Materialize.toast('Invalid agent name.', 4000)
    } else if(agentOnBreak){
        Materialize.toast('Agent already on break.', 4000)
    } else {
        $.post(
            "assets/php/addbreak.php",
            {
                data : '{"agent" : "'+ agent +'","length" : "'+ time +'","stamp" : '+ $.now() +'}'
            }
        ).done(function(data){
            Materialize.toast(data, 4000)
        });
    }
    $('#'+time).modal('close');
    return false;
}