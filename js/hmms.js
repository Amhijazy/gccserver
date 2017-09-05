$(document).ready(function() {
    populatefiles('assets/php/hmms.php');
});

function populatefiles(url){
    $.getJSON(url, function (data) {
        var text = "";
        data.forEach(function(filename) {
            text += '<tr><td><a href="assets/hmms/'+ filename + '" target="_blank">'+ filename +'</a></td></tr>'
        }, this);
        $("#hmms").html(text);
    });
}

function filterfiles() {
  var filter, fileCount, files, file;
  filter = $("#filterfiles").val().toUpperCase();
  console.log(filter);
  fileCount = $("#hmms").children().length;
  console.log(fileCount);
  files = $("#hmms").find("tr");

  for (i = 0; i < fileCount; i++) {
    file = files[i].children[0];
    if (file) {
      if (file.innerHTML.toUpperCase().indexOf(filter) > -1) {
        files[i].hidden = false;
      } else {
        files[i].hidden = true;
      }
    } 
  }
}