requirejs.config({paths:{jquery:["https://code.jquery.com/jquery-2.1.0","lib/jquery"]}}),define(["jquery","ProgressCounter","stopwatch","utils"],function(a,b,c){function d(){"use strict";a.getJSON("/terms.json",function(a){l=a;for(var b in l)o.push(b);p=o,f()}).done(e)}function e(){m=new b(o.length),m.onChange=function(){var b=a("<div>",{text:this.numberOfTermsRead()+"|"+this.numberOfTerms});a("#topright").empty(),b.appendTo("#topright").addClass("animated pulse")},m.onChange(),n=new c,n.start()}function f(){a("#choices").empty(),a("#definiton").empty();var b=p.popRandomElement(),c=[];g(b),c.push(b);for(var d=0;3>d;d++)c.push(o.randomElement());c.shuffle();for(var e=c.length-1;e>=0;e--)k(c[e])}function g(b){var c=h(b,l[b].description),d=a("<div />",{html:c});d.appendTo("#definiton")}function h(a,b){var c=new RegExp("[a-zA-Z]*"+a+"[a-zA-Z]*","gi");return b.replace(c,"xxxx")}function i(a){a=JSON.parse(a),a.highscore?(alert("Sie sind in den Top 10!"),window.location=window.location.origin+"/highscore.html"):(alert("Sie sind nicht in den Top 10 gelandet probieren Sie es doch noch mal"),location.reload())}function j(b){var c=b.target.innerHTML,d=h(c,l[c].description);if(a("#definiton div").text()===d)f(),m.registerTerm(c);else{var e="Sie haben "+m.numberOfTermsRead()+" von "+m.numberOfTerms+" in "+n.formatedTime()+" Minuten geschafft!\n Geben Sie Ihren Namen für den Highscore ein.",g=prompt(e);g&&(a.post("http://highscore.k-nut.eu/highscore",{name:g,score:m.numberOfTermsRead(),time:n.ellapsed()}).done(i),n.clear(),m.clear())}return!1}function k(b){var c=a("<a/>",{"class":"choice",text:b,href:"#",on:{click:j}});c.appendTo("#choices")}var l,m,n,o=[],p=[];a(document).ready(d)});