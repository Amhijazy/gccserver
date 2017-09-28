
$(document).ready(function() {
    populatelinks('assets/json/quicklinks.json');
});

function populatelinks(url){
    $.getJSON(url, function (data) {
        var text = "";
        data.forEach(function(link) {
            text += '<a href="'+ link.url +'" target="_blank" class=" col m3"><button class="btn-large wave-effect blue darken-1">'+ link.name +'</button></a>';
        }, this);
        $("#links").html(text);
    });
}

function filterlinks() {
  var filter, link, btn, i, linkCount;
  filter = $("#filterLinks").val().toUpperCase();
  linkCount = $("#links").children().length;
  link = $("#links").find("a");

  for (i = 0; i < linkCount; i++) {
    btn = link[i].children[0];
    if (btn) {
      if (btn.innerHTML.toUpperCase().indexOf(filter) > -1) {
        link[i].hidden = false;
      } else {
        link[i].hidden = true;
      }
    } 
  }
}