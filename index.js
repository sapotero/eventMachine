(function () {
  var eventum = {

    Result: {
      SUCCEEDED    : 1,
      NOTRANSITION : 2,
      CANCELLED    : 3,
      PENDING      : 4 
    },

    Error: {
      INVALID : 1,
      PENDING : 2,
      IV      : 4 
    },

    ANY   : '*',
    ASYNC : 'async',
    DEBUG : false,

    //---------------------------------------------------------------------------

    init: function( config, machine ) {

      var initial      = {},
          terminal     = config.terminal  || config['final'],
          eventMachine = machine          || config.machine  || {},
          events       = config.events    || [],
          callbacks    = config.callbacks || {},
          map          = {},
          next         = {};

      if ( typeof config.initial == 'string' ) {
        initial = { state: config.initial };
      } else {
        initial = config.initial
      };


      var add = function(e) {
        var from = (e.from instanceof Array) ? e.from : (e.from ? [e.from] : [eventum.ANY]);
        map[e.event] = map[e.event] || {};
        for (var n = 0 ; n < from.length ; n++) {
          next[from[n]] = next[from[n]] || [];
          next[from[n]].push(e.event);

          map[e.event][from[n]] = e.to || from[n]; // allow no-op transition if 'to' is not specified
        };
      };

      if (initial) {
        initial.event = initial.event || 'startup';
        add({ event: initial.event, from: 'none', to: initial.state });
      };

      for(var n = 0 ; n < events.length ; n++){
        add(events[n]);
      };

      for(var event in map) {
        if (map.hasOwnProperty(event)){
          eventMachine[event] = eventum.buildEvent(event, map[event]);
        };
      };

      for(var event in callbacks) {
        if (callbacks.hasOwnProperty(event)){
          eventMachine[event] = callbacks[event];
        };
      };

      eventMachine.current = 'none';
      eventMachine.is = function(state) {
        return ( state instanceof Array ) ? ( state.indexOf(this.current) >= 0 ) : (this.current === state);
      };
      eventMachine.can = function(event) {
        return !!( !this.transition && map[event] &&( map[event].hasOwnProperty(this.current ) || map[event].hasOwnProperty( eventum.ANY ) ) );
      }
      eventMachine.cannot = function(event) {
        return !this.can(event);
      };
      eventMachine.next = function() {
        return next[this.current];
      };
      eventMachine.finished = function() {
        return this.is(terminal);
      };

      eventMachine.debug = function(debug) {
        return eventum.debug(debug);
      };

      eventMachine.error = config.error || function( event, from, to, args, error, msg, e ) {
        throw e || msg;
      };

      if (initial && !initial.defer){
        eventMachine[initial.event]();
      }

      return eventMachine;

    },


    callback: function(eventMachine, func, event, from, to, args) {
      if (func) {
        try {
          return func.apply(eventMachine, [event, from, to].concat(args));
        }
        catch(e) {
          return eventMachine.error(event, from, to, args, eventum.Error.IV, "an exception occurred in a caller-provided callback function", e);
        }
      }
    },

    anyEventBefore:  function(eventMachine, event, from, to, args) {
      if ( eventum.DEBUG ){
        console.log('anyEventBefore', event);
      };
      return eventum.callback(eventMachine, eventMachine['onbeforeevent'], event, from, to, args);
    },
    
    anyEventAfter:   function(eventMachine, event, from, to, args) {
      if ( eventum.DEBUG ){
        console.log('anyEventAfter', event);
      };
      return eventum.callback(eventMachine, eventMachine['onafterevent'] || eventMachine['onevent'], event, from, to, args);
    },
    
    stateLeaveAny:   function(eventMachine, event, from, to, args) {
      if ( eventum.DEBUG ){
        console.log('stateLeaveAny', event);
      };
      return eventum.callback(eventMachine, eventMachine['onleavestate'], event, from, to, args);
    },
    
    stateEnterAny:   function(eventMachine, event, from, to, args) {
      if ( eventum.DEBUG ){
        console.log('stateEnterAny', event);
      };
      return eventum.callback(eventMachine, eventMachine['onenterstate'] || eventMachine['onstate'], event, from, to, args);
    },
    
    changeState:     function(eventMachine, event, from, to, args) {
      if ( eventum.DEBUG ){
        console.log('changeState', event);
      };
      return eventum.callback(eventMachine, eventMachine['onchangestate'], event, from, to, args);
    },

    /* -------------------------------- */
    thisEventBefore: function(eventMachine, event, from, to, args) {
      if ( eventum.DEBUG ){
        console.log('thisEventBefore', event);
      };
      return eventum.callback(eventMachine, eventMachine['onbefore' + event], event, from, to, args); },
    
    thisEventAfter:  function(eventMachine, event, from, to, args) {
      if ( eventum.DEBUG ){
        console.log('thisEventAfter', event);
      };
      return eventum.callback(eventMachine, eventMachine['onafter'  + event] || eventMachine['on' + event], event, from, to, args); },
    
    leaveThisState:  function(eventMachine, event, from, to, args) {
      if ( eventum.DEBUG ){
        console.log('leaveThisState', event);
      };
      return eventum.callback(eventMachine, eventMachine['onleave'  + from], event, from, to, args); },
    
    enterThisState:  function(eventMachine, event, from, to, args) {
      if ( eventum.DEBUG ){
        console.log('enterThisState', event);
      };
      return eventum.callback(eventMachine, eventMachine['onenter'  + to] || eventMachine['on' + to], event, from, to, args); },

    beforeEvent: function(eventMachine, event, from, to, args) {
      if ((false === eventum.thisEventBefore(eventMachine, event, from, to, args)) ||
          (false === eventum.anyEventBefore( eventMachine, event, from, to, args)))
        return false;
    },

    afterEvent: function(eventMachine, event, from, to, args) {
      eventum.thisEventAfter( eventMachine, event, from, to, args );
      eventum.anyEventAfter(  eventMachine, event, from, to, args );
    },

    enterState: function(eventMachine, event, from, to, args) {
      eventum.enterThisState( eventMachine, event, from, to, args );
      eventum.stateEnterAny(  eventMachine, event, from, to, args );
    },
    leaveState: function(eventMachine, event, from, to, args) {
      var specific = eventum.leaveThisState(eventMachine, event, from, to, args),
          general  = eventum.stateLeaveAny( eventMachine, event, from, to, args);
      if ((false === specific) || (false === general)){
        return false;
      }
      else if ((eventum.ASYNC === specific) || (eventum.ASYNC === general)){
        return eventum.ASYNC;
      };
    },

    debug: function(debug){
      eventum.DEBUG = debug;
      return eventum.DEBUG;
    },


    buildEvent: function(event, map) {
      return function() {

        var from  = this.current;
        var to    = map[from] || map[eventum.ANY] || from;
        var args  = Array.prototype.slice.call(arguments); // turn arguments into pure array

        if (this.transition){
          return this.error(
            event, from, to, args,
            eventum.Error.PENDING,
            "event " + event + " inappropriate because previous transition did not complete"
          );
        }

        if (this.cannot(event)){
          return this.error(event, from, to, args, eventum.Error.INVALID, "event " + event + " inappropriate in current state " + this.current);
        }

        if (false === eventum.beforeEvent(this, event, from, to, args)){
          return eventum.Result.CANCELLED;
        }

        if (from === to) {
          eventum.afterEvent(this, event, from, to, args);
          return eventum.Result.NOTRANSITION;
        }

        // prepare a transition method for use EITHER lower down, or by caller if they want an async transition (indicated by an ASYNC return value from leaveState)
        var eventMachine = this;
        this.transition = function() {
          eventMachine.transition = null; // this method should only ever be called once
          eventMachine.current = to;
          eventum.enterState( eventMachine, event, from, to, args);
          eventum.changeState(eventMachine, event, from, to, args);
          eventum.afterEvent( eventMachine, event, from, to, args);
          return eventum.Result.SUCCEEDED;
        };
        this.transition.cancel = function() { // provide a way for caller to cancel async transition if desired (issue #22)
          eventMachine.transition = null;
          eventum.afterEvent(eventMachine, event, from, to, args);
        }

        var leave = eventum.leaveState(this, event, from, to, args);
        if (false === leave) {
          this.transition = null;
          return eventum.Result.CANCELLED;
        }
        else if (eventum.ASYNC === leave) {
          return eventum.Result.PENDING;
        }
        else {
          if (this.transition) // need to check in case user manually called transition() but forgot to return eventum.ASYNC
            return this.transition();
        }

      };
    }
  };


  ////////////
  // return //
  ////////////
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = eventum;
    }
    exports.eventum = eventum;
  }
  else if (typeof define === 'function' && define.amd) {
    define(function(require) { return eventum; });
  }
  else if (typeof window !== 'undefined') {
    window.eventum = eventum;
  }
  else if (typeof self !== 'undefined') {
    self.eventum = eventum;
  }

}());