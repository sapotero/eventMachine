"use strict";
var eventum = eventum || {};

eventum = function(config){
  var EventumCurrentState = '',
      EventumCurrentEvent = '',
      EventumConfig = {},
      EventumEvents = [],
      EventumCallbacks;
  
  this.findEvent = function(){
    console.log('findEvent: ...', EventumCurrentState);

    for (var a = 0; a < EventumConfig.events.length; a++) {
      var event = EventumConfig.events[a]
      console.log('*name', event);

      if (event.from === EventumCurrentState){
        EventumCurrentEvent = event.name;
        console.log( '  -> CurrentEvent', EventumCurrentEvent, EventumCurrentState );
        break;
      };
    };
    // EventumCallbacks['on'+state].call( this, EventumCurrentEvent, EventumConfig[state].from, EventumConfig[state].to, {data: 123} )
  };

  this.next = function(){
    // console.log('next: ', EventumCurrentState, EventumCurrentEvent)
    for (var i = 0; i < EventumEvents.length; i++) {
      var event = EventumEvents[i];

      if (event.name === EventumCurrentEvent && event.from === EventumCurrentState) {
        // EventumCurrentState = event.to;
        // EventumCurrentEvent = event.name;
        var _next = event.to;

        for (var z = 0; z < EventumEvents.length; z++) {
          var event = EventumEvents[z];
          if (event.from === _next) {
            console.log(' | to ->>', event);
            break;
          }
        }

        // console.log(' ++ next', );
        break;
        // this.findEvent();
      };
    };
  };

  this.init = function(initial){
    
    // проверяем конфиг
    if ( typeof(initial) !== 'object' && !initial.hasOwnProperty('initialState') && !initial.hasOwnProperty('events') && typeof(initial.events) !== 'array' ) {
      console.warn('wrong config');
      return false;
    };
    EventumConfig = initial;

    for (var i = 0; i < EventumConfig.events.length; i++) {
      var _query = EventumConfig.events[i];

      EventumEvents.push({
        name: _query.name,
        from: _query.from,
        to  : _query.to
      });
      
      this[_query.name] = function(){ this.next() };
    };

    // проверяем начальное состояние
    // if ( !EventumConfig.hasOwnProperty( config.initial ) ) {
    //   console.warn('wrong initial state');
    //   return false;
    // };
    EventumCurrentState = EventumConfig.initial;
    this.findEvent();


    // проверяем колбеки
      // TODO
      // onbeforeEVENT - fired before the event
      // onleaveSTATE  - fired when leaving the old state
      // onenterSTATE  - fired when entering the new state
      // onafterEVENT  - fired after the event
      // onEVENT       - convenience shorthand for onafterEVENT
      // onSTATE       - convenience shorthand for onenterSTATE
      // callbacks: {
      //   onpanic:  function(event, from, to, data) { alert('panic! ' + msg);               },
      //   onclear:  function(event, from, to, data) { alert('thanks to ' + msg);            },
      //   ongreen:  function(event, from, to, data)      { document.body.className = 'green';    },
      //   onyellow: function(event, from, to, data)      { document.body.className = 'yellow';   },
      //   onred:    function(event, from, to, data)      { document.body.className = 'red';      },
      // }
    if ( typeof( EventumConfig.callbacks ) !== 'object' ) {
      console.warn('callbacks are not object');
      return false;
    };
    EventumCallbacks = EventumConfig.callbacks;
    
    // next();

    // console.log( '***init', EventumConfig );
  };
  this.current = function(){

    return EventumCurrentEvent;
  };
  this.list = function(name){
    if ( !EventumConfig.hasOwnProperty(name) ) {
      return false
    };
    return EventumConfig[name].to
  };
  this.can = function(name){
    // if ( !EventumConfig.events.hasOwnProperty(name) ) {
    //   return false
    // };

    for (var i = 0; i < EventumConfig.events.length; i++) {
      var event = EventumConfig.events[i];
      return event.to === name ? true : false;
    };
  };

  this.init(config);

};

module.exports = eventum;
