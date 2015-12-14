var e = require('./../index.js'),
    eventum = new e({
      initial: "hello",
      events : [
        { name: 'green',  from: 'hello', to: 'login' },
        { name: 'yellow', from: 'login', to: 'auth'  },
        { name: 'red',    from: 'auth',  to: 'hello' }
      ],
      callbacks: {
        ongreen :  function(event, from, to, data) { console.log( "STATE: ", event, from, to, data ) },
        onyellow:  function(event, from, to, data) { console.log( "STATE: ", event, from, to, data ) },
        onred   :  function(event, from, to, data) { console.log( "STATE: ", event, from, to, data ) }
      }
    });

console.log( 'init: ', eventum );
console.log( 'list: ', eventum.list(), eventum.list('green') );

console.log('+------------------+');
console.log( '| current state -> ',  eventum.current() );
console.log( '| can auth?     -> ',  eventum.can('auth') );
console.log( '| can login?    -> ', eventum.can('login') );
console.log('+------------------+');

console.log('+------------------+');
console.log( '| green() -> ', eventum.green() );
console.log('+------------------+');