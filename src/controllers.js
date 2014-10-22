"use strict";

var kometControllers = angular.module("kometControllers", [])
.factory("stopwatch", ["$timeout", function($timeout){
var self = this;
  var stopwatch = null;
  self.seconds = 99;
  self.stopwatchName = "notSet";
  var getTime = function(){
    return self.seconds;
  };

  var setUp = function(stopwatchName){
    self.stopwatchName = stopwatchName; 
    self.seconds = JSON.parse(localStorage.getItem(stopwatchName + ".timer.ellapsed")) | 0;
  };

  var start = function () {
    stopwatch = $timeout(function() {
      self.seconds++;
      localStorage.setItem(self.stopwatchName  + ".timer.ellapsed", self.seconds);
      start();
    }, 1000);
  };

  return {getTime: getTime, seconds:self.seconds, start:start, setUp: setUp};
}
]);


kometControllers.controller("HighscoreCtrl", ["$scope", "$http", 
  function($scope, $http){
    $scope.highscores = {};
    $http.get("http://highscore.k-nut.eu/highscore")
      .then(function(res){
        $scope.highscores = res.data;
      });
      $scope.calculateMean = function (score){
        score = score.score; // TODO naming
        return Math.round((score.time / 1000) / score.score * 10) / 10;
      };
      $scope.getMonthAndYear = function(date){
        moment.lang("de");
        return moment(date).format("MMMM YYYY");
      };
      $scope.parseDate = function(date){
        return Date.parse(date);
      };
  }
]);

kometControllers.controller("GameCtrl" , ["$scope", "$http", "$location", "$timeout", "stopwatch", function($scope, $http, $location, $timeout, stopwatch){
  $scope.choices = [];
  $scope.activeTerm = {};
  $scope.unusedTerms = {};
  $scope.progressCounter = {};
  $scope.timer = stopwatch;

  $http.get("/data/terms-en.json")
  .then(function(res){
    $scope.terms = res.data;
    $scope.unusedTerms = res.data;
    $scope.progressCounter = new ProgressCounter(res.data.length);
    $scope.timer.setUp("game");
    $scope.timer.start();
    //$interval(function(){$scope.timer++;}, 1000);
  }).then(pickTerm)

  function pickTerm(){
    var choices = [];
    $scope.activeTerm = $scope.unusedTerms.popRandomElement()
    choices.push($scope.activeTerm);
    while(choices.length < 4){
      var randomTerm = $scope.terms.randomElement()
      if (choices.indexOf(randomTerm) === -1){
        choices.push(randomTerm);
      }
    }
    $scope.choices = choices.shuffle();
  }

  $scope.checkAnswer = function(button, $event){
    var term = button.choice;
    if (term == $scope.activeTerm){
      $scope.progressCounter.registerTerm(term);
      $scope.unusedTerms.remove(term);
      $($event.target).removeClass("btn-info").addClass("btn-success");
      $timeout(pickTerm, 250);
    }
    else{
      $($event.target).removeClass("btn-info").addClass("btn-danger");
      $scope.progressCounter.clear();
      $http.post("http://highscore.k-nut.eu/highscore/check", {
          score: $scope.progressCounter.numberOfTermsRead(),
          time: $scope.timer.getTime()
        }).then(checkIfScoreIsHighEnough);
      bootbox.alert("FAIL");
    }
  };

  function checkIfScoreIsHighEnough(response){
  console.log(response);
  };

}]);

kometControllers.controller("DashboardController" , ["$scope", "$http", "$location", "stopwatch", function($scope, $http, $location, stopwatch){
  $scope.searchTerm = "";
  $scope.terms = [{"term": "dummy"}];
  $scope.selectedTerm = {};
  $scope.progressCounter = {};
  $scope.timer = stopwatch;

  $scope.isActive = function(path) {
    return $location.path().substr(0, path.length) == path
  }

  $http.get("/data/terms-en.json")
  .then(function(res){
    $scope.terms = res.data;
    $scope.selectedTerm = res.data[0];
    $scope.progressCounter = new ProgressCounter(res.data.length);
    $scope.timer.setUp("glossary");
    $scope.timer.start();
  }).then(loadTermFromHash);

  $scope.filter = function(term){
    return term.term.toLowerCase().contains($scope.searchTerm.toLowerCase());
  };

  $scope.setSelectedItem = function(term){
    setSelectedTerm(term.term);
  };

  $scope.resetProgress = function(){
    $scope.progressCounter.clear();
  };

  function setSelectedTerm(term){
    $scope.progressCounter.registerTerm(term.term);
    $scope.selectedTerm = term;
    $location.search("term", term.term);
  }


  $scope.prevTerm = function(){
    var indexOfSelectedTerm = getIndexOfSelectedTerm();
    setSelectedTerm($scope.terms[indexOfSelectedTerm - 1]);
  };

  $scope.nextTerm = function(){
    var indexOfSelectedTerm = getIndexOfSelectedTerm();
    setSelectedTerm($scope.terms[indexOfSelectedTerm + 1]);
  };

  $scope.selectedTermIsFirstTerm = function(){
    return $scope.terms[0].term === $scope.selectedTerm.term;
  };

  $scope.selectedTermIsLastTerm = function(){
    return _.last($scope.terms).term === $scope.selectedTerm.term;
  };


  function getIndexOfSelectedTerm(){
    return _.findIndex($scope.terms, function(term){
      return $scope.selectedTerm.term === term.term;
    });
  }

  function loadTermFromHash(){
    if($location.hash()){
      $scope.selectedTerm = _.find($scope.terms, function(term){
        return term.term === $location.hash();
      });
    }
  }
}]);
