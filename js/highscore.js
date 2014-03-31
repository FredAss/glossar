/*jslint browser: true*/
/*global $, jQuery, console*/


requirejs.config({
  paths: {
    "jquery": [
      "https://code.jquery.com/jquery-2.1.0",
      // If the CDN fails, load from this local module instead
      "lib/jquery"
    ]
  }
});

require(["jquery", "timeutils"], function($, timeutils){
console.log(timeutils);
  var scores = [];
  var $table = $("tbody");
  $.getJSON("http://highscore.k-nut.eu/highscore", function(data){
    $.each(data, function(key, value){
      var place = parseInt(key, 10) + 1;
      var row = $("<tr />");
      row.append($('<td>').text(place))
         .append($('<td>').text(value.score))
         .append($('<td>').text(timeutils.convertMillisecondsToFormatedTime(value.time)))
         .append($('<td>').text(value.name));

      row.appendTo($table);
    });
  });
});


