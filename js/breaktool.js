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
    
    $(document).on('click','.remove-break',function(e){     //remove break click event
        action.removeBreak(e);
    });

    $('#admin').on('submit','form',function(e){             //admin credential sumit
        e.preventDefault();
        action.adminLogin();
    });

    $('#editSlotNum').on('submit','form',function(e){       //submitting number of slots by admin
        e.preventDefault();
        var num = $('#numOfSlots').val();
        action.addSlots(num);
    });

    $('#editSlotLen').on('submit','form',function(e){       //submitting slots lengths by admin to back end
        e.preventDefault();
        action.editSlots();
    });


    $('#60').on('submit','form',function(e){                //taking a 60 min break, submitting to back end
        e.preventDefault();
        action.takeBreak('60');
    });

    $('#30').on('submit','form',function(e){                //taking a 30 min break, submitting to back end
        e.preventDefault();
        action.takeBreak('30');
    });

    $('#15').on('submit','form',function(e){                //taking a 15 min break, submitting to back end
        e.preventDefault();
        action.takeBreak('15');
    });

    $('#check').on('submit','form',function(e){             //check agent total break
        e.preventDefault();
        action.checkBreak();
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
    "Rania": null,
    "Samer": null,
    "Kilany": null,
    "Anas": null,
    "Jerome": null,
    "Michael": null,
    "Naqib": null,
    "Raafat": null,
    "Behairy": null,
    "Osman": null,
    "Tarek": null,
    "Fawal": null
};

/*
{
    "Hijazy": 0,
    "Wahba": 0,
    "Aziz": 0,
    "Ramy": 0,
    "Saeed": 0,
    "Nakata": 0
}
*/



/**************************************************************/
// Population functions

var pop = {};

pop.slotsUrl = "assets/json/slots.json";
pop.inBreakUrl = "assets/json/inBreak.json";
pop.lvl1AuxUrl = "assets/json/lvl1Aux.json";
pop.lvl2AuxUrl = "assets/json/lvl2Aux.json";
pop.lvl1Aux = [];

/////////////////////////////////////

pop.breakSlots = function(){
    $.getJSON(this.slotsUrl,function(slots){
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

/////////////////////////////////////

pop.onBreak = function(){
    $.getJSON(this.inBreakUrl,function(agents){
        var text = '';
        $.getJSON(pop.lvl1AuxUrl,function(aux){
            pop.lvl1Aux = aux;
        }).fail(function(){
            console.log("failed");
        });
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
            var auxState = "Aux";
            var status = "status";
            for(var k = 0; k < pop.lvl1Aux.length; k++){
                if(pop.lvl1Aux[k].name.toUpperCase().search(agents[i].agent.toUpperCase())>=0){
                    status = pop.lvl1Aux[k].status;
                    auxState = pop.lvl1Aux[k].auxstate;
                    break;
                }
            }
            text+= '<tr '+ exceedStyle +'><td>'+ agents[i].agent +'</td><td>'+ timeInBreak + '/' + breakLength + '</td><td>'+ status +'</td><td>' + auxState + '</td><td><i class="material-icons remove-break">do_not_disturb</i></td></tr> ';
        }
        $('table > tbody').html(text);
    });
    
}

///////////////////////////////////// applying interval to population functions

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
action.adminUser = "admin";
action.adminPass = "admin";

///////////////////////////////////// agent take a break

action.takeBreak = function(time){
    //console.log($('tbody').children().find(':first-child').html());
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
            Materialize.toast(data, 4000);
        });
    }
    $('#'+time).modal('close');
    return false;
}

///////////////////////////////////// remove agent break

action.removeBreak = function(e){

    var agent = $(e.target).parents('tr').find(':first-child').html();
    $.post(
        "assets/php/removebreak.php",
        {
            "agent" : agent
        }
    ).done(function(){
        Materialize.toast("Break removed successfully.", 4000);
    });
}

///////////////////////////////////// admin enter credentials

action.adminLogin = function(){
    if($('#username').val() == this.adminUser && $('#password').val() == this.adminPass){
        $('#editSlotNum').modal('open');
    }else{
        Materialize.toast('Incorrect admin credentials.', 4000)
    }
    $('#admin').modal('close');
    return false;
}

///////////////////////////////////// admin enter number of slots

action.addSlots = function(num){
    for(var i=0; i<num ; i++){
        $('#slotSelectors').append('<select class="col s3"><option value="15">15</option><option value="30">30</option><option value="60">60</option></select>');
    }
    $('#editSlotNum').modal('close');
    $('#editSlotLen').modal('open');
}

///////////////////////////////////// admin submit slot lengths to the back end

action.editSlots = function(){
    var slots=[];
    $('#slotSelectors').children('select').each(function(i,child){
        slots.push(child.value);
    });
    //console.log(slots);
    $.post(
        "assets/php/editslots.php",
        {
            slots : slots,
            maxSlots : slots.length
        }
    ).done(function(data){
        Materialize.toast(data, 4000)
    });
    
    $('#slotSelectors').empty();
    $('#editSlotLen').modal('close');
}

///////////////////////////////////// agent check total break taken today
///////////////////////////////////// totalbreak.json file is reset everyday by the server

action.checkBreak = function(){
    var agent = $('#check input').val();
    $.post(
        "assets/php/checkbreak.php",
        {
            checkAgent : agent
        }
    ).done(function(data){
        Materialize.toast(data, 4000)
    });
    $('#check').modal('close');
}

