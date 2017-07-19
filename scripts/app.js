(function() {
  'use strict';
  var precision = 50;
  var active = true;
  var mode = {
    DEFAULT: 0,
    FISCHER: 1,
    FISCHER_AFTER: 2,
    BRONSTEIN: 3,
    DELAY: 4
  };

  function Timer($item, options) {
    this.seconds = moment.duration(options.seconds * 1000);
    this.$item = $item;
    this.interval = null;
    this.options = options;
    this.started = this.seconds;
    this.startedTS = null;
    this.paused = false;
    //this.click = new Audio('sound/click.wav');

    this.show();
  }

  Timer.prototype = {
    start: function () {
      //this.click.play();

      this.started = this.seconds.as('milliseconds');
      this.startedTS = moment();

      if (!this.paused && this.options.mode === mode.FISCHER) {
        this.seconds.add(this.options.increment * 1000);
      }

      var THIS = this;

      this.interval = window.setInterval(function() {
        if (!THIS.paused) {
          var diff = moment.duration(moment().diff(THIS.startedTS));

          THIS.seconds = moment.duration(THIS.started - diff.as('milliseconds'));
        }

        THIS.show();
        THIS.paused = false;

        if (THIS.seconds <= 0) {
          THIS.stop();
          active = false;
        }
      }, precision);
    },
    stop: function(pause) {
      window.clearInterval(this.interval);

      if (!pause && !this.paused) {
        if (this.options.mode === mode.FISCHER_AFTER) {
          this.seconds.add(this.options.increment * 1000);
        } else if (this.options.mode === mode.BRONSTEIN) {
          if (this.started - this.seconds.as('milliseconds') <= this.options.increment * 1000) {
            this.seconds = moment.duration(this.started);
          } else {
            this.seconds.add(this.options.increment * 1000);
          }
        }
      }

      this.paused = !!pause;

      this.show();
    },
    show: function() {
      var ms = this.seconds.as('milliseconds');
      if (ms < 0) {
        ms = 0;
      }

      this.$item.innerHTML = moment.utc(
        this.getutc(ms)
      ).format(
        this.getformat(ms)
      );

      if (this.seconds <= 0) {
        this.$item.classList.remove('active');
        this.$item.classList.add('timedout');
      }
    },
    reset: function() {
      window.clearInterval(this.interval);
      this.paused = false;
      this.interval = null;
      this.seconds = moment.duration(this.options.seconds * 1000);
      this.started = this.seconds;
      this.show();
    },
    getutc: function(ms) {
      return ms < 60000 ? ms : ms + 999;
    },
    getformat: function(ms) {
      return ms < 60000 ? 'ss.S' : (ms < 3599000 ? 'mm:ss' : 'h:mm:ss');
    }
  };

  var $clock1 = document.getElementById('clock1');
  var $clock2 = document.getElementById('clock2');
  var $pause = document.getElementById('pause');
  var $reset = document.getElementById('reset');

  var timer1 = new Timer($clock1, {
    seconds: 3610,
    mode: mode.DEFAULT,
    increment: 0
  });
  var timer2 = new Timer($clock2, {
    seconds: 5,
    mode: mode.DEFAULT,
    increment: 0
  });

  $clock1.addEventListener('click', function() {
    if (active) app.clk(1);
  });
  $clock1.addEventListener('touchstart', function() {
    if (active) app.clk(1);
  });
  $clock2.addEventListener('click', function() {
    if (active) app.clk(2);
  });
  $clock2.addEventListener('touchstart', function() {
    if (active) app.clk(2);
  });
  $pause.addEventListener('click', function() {
    if (active) app.pause();
  });
  $pause.addEventListener('touchstart', function() {
    if (active) app.pause();
  });
  $reset.addEventListener('click', function() {
    if(confirm('Wirklich die Uhr zurücksetzen?')) {
      app.reset();
    }
  });

  var app = {
    clk: function (id) {
      if (id === 1) {
        if ($clock2.classList.contains('active')) {
          return;
        }
        // switch active clock
        $clock1.classList.remove('active');
        $clock2.classList.add('active');

        // switch countdown
        timer1.stop();
        timer2.start();
      } else {
        if ($clock1.classList.contains('active')) {
          return;
        }
        // switch active clock
        $clock2.classList.remove('active');
        $clock1.classList.add('active');

        // switch countdown
        timer2.stop();
        timer1.start();
      }
    },
    pause: function () {
      timer1.stop(true);
      timer2.stop(true);
      $clock1.classList.remove('active');
      $clock2.classList.remove('active');
    },
    reset: function () {
      active = true;
      timer1.reset();
      timer2.reset();
      $clock1.classList.remove('active');
      $clock2.classList.remove('active');
      $clock1.classList.remove('timedout');
      $clock2.classList.remove('timedout');
    }
  };

  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
  }
})();
