var StopWatch =  function(){
  var self = this;
  var startTime;
  var timeFromtLastRun = JSON.parse(localStorage.getItem(window.location.pathname  + "timer.ellapsed")) | 0;

  this.start = function(){
    startTime = Date.now();
    setInterval(self.t, 1000);
  };

  this.ellapsed = function(){
    var delta = Date.now() - startTime;
    var ellapsed = delta + timeFromtLastRun;
    return ellapsed;
  };

  this.seconds = function(){
    return this.ellapsed() / 1000;
  };

  this.formatedTime = function(){
    return timeutils.convertMillisecondsToFormatedTime(this.ellapsed());
  };

  this.execute = function(){
    /* should be implemented by user */
  };

  this.t = function(){
    self.execute();
    localStorage.setItem(window.location.pathname  + "timer.ellapsed", self.ellapsed());
  };

  this.clear = function  () {
    localStorage.removeItem(window.location.pathname  + "timer.ellapsed");
    timeFromtLastRun = 0;
    startTime = Date.now();
  };

};
