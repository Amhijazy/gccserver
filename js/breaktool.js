$(document).ready(function() {

    //jQuery plugin initialization
    /****************************/
    $('.modal').modal();
    $('input.autocomplete').autocomplete({
        data: lvl1AgentNames,
        limit: 5,
    });
    $('select').material_select();

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
    "Nabil": null,
    "Saeed": null,
    "Nabil": null,
    "Nakata": null
};



/**************************************************************/
// Population functions

var pop = {};

pop.slotsUrl = "assets/json/slots.json";
pop.inBreakUrl = "assets/json/inBreak.json";

pop.breakSlots = function(){
    $.getJSON(this.slotsUrl,function(slots){
        console.log(slots);
        var text = '';
        for(var i = 0; i <= slots.length - 1; i++){
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
        console.log(agents);
        var text = '';
        for(var i = 0; i <= agents.length - 1; i++){
            var exceedStyle = '';
            var difference = new Date($.now()-agents[i].stamp)/1000;
            console.log(difference);
            var MM = Math.floor(difference/60);
            var timeInBreak = MM;
            if( timeInBreak > parseInt(agents[i].length)){
                exceedStyle = 'class = "red-text"';
            }
            text+= '<tr '+ exceedStyle +'><td>'+ agents[i].agent +'</td><td>'+ timeInBreak + '/' + agents[i].length + '</td><td>Aux</td><td><i class="material-icons remove-break">do_not_disturb</i></td></tr> ';
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
    }, 15000);

}

/**************************************************************/

var action = {};

action.addBreakUrl = "assets\php\addbreak.php";
action.removeBreakUrl = "assets\php\removebreak.php";

action.takeBreak = function(time){
    var stamp = $.now();
    //console.log('{"agent" : "'+ $(time+' input.agentName').value() +'","length" : "'+ time +'","stamp" : '+ stamp +'}');
    
    $.post(
        this.addBreakUrl,
        {
            data : '{"agent" : "'+ $(time+' input.agentName').value() +'","length" : "'+ time +'","stamp" : '+ stamp +'}'
        }
    );
    
    return false;
}

action.removeBreak = function(e){
    
    console.log($(e.target).parents('tr').find(':first-child').html());
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

arken = function(time){
    console.log($('.remove-break'));
    console.log($('#30 input').val());
    console.log($.now());
    console.log('{"agent" : "'+ $('#'+time+' input').val() +'","length" : "'+ time +'","stamp" : '+ $.now() +'}');
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