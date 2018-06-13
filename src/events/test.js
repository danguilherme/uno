const CancelableEventEmitter = require("./cancelable-emitter");

var Foo = function(initial_no) {
  this.count = initial_no;
};

Foo.prototype = new CancelableEventEmitter();

Foo.prototype.increment = function() {
  var self = this;
  setInterval(function() {
    if (self.count % 2 === 0) self.emit("even", self.count);
    self.count++;
  }, 300);
};

var lol = new Foo(1);

lol
  .on("even", function(n) {
    console.log("Number is even! :: " + n);
  })
  .on("even", function(n) {
    console.log("2nd - Number is even! :: " + n);
    return false;
  })
  .on("even", function(n) {
    console.log("3rd - Number is even! :: " + n);
  })
  .increment();
