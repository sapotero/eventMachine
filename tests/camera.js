var eventum = require('./../index.js');

var machine = eventum.init({
  initial: 'init',
  events: [
    { event: 'init',      from: 'init',  to: 'check' },
    { event: 'tryAuth',   from: 'check', to: 'auth'  },
 
    { event: 'auth',      from: 'auth',  to: 'ready' },
    { event: 'authError', from: ['auth', 'error'],  to: 'init' },
    // { event: 'authError', from: 'error', to: 'init' },

    { event: 'photo',      from: 'ready',     to: 'makePhoto' },
    { event: 'photo',      from: 'makePhoto', to: 'ready'     },
    { event: 'photoError', from: 'makePhoto', to: 'mainError' },

    { event: 'ping',      from: 'ready', to: 'ping'      },
    { event: 'pong',      from: 'ping',  to: 'ready'     },
    { event: 'pingError', from: 'ping',  to: 'mainError' },

    { event: 'mainError', from: 'mainError',  to: 'ready' },

    { event: 'exit', from: [ 'init','auth', 'check', 'ready'], to: 'init' },
  ],
  callbacks: {
    oninit      : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    },
    ontryAuth   : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    },
    onmainError : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    },
    onauthError : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    },
    onphotoError : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    },
    onpingError : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    },
    onping      : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    },
    onpong      : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    },
    onphoto     : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    },
    onexit      : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    },
    onauth      : function(event, from, to, data) {
      console.log('* ', event, from, to, typeof(data) === 'undefined' ? '' : data );
    }

  }
});

console.log( '+------ TEST -------+');
console.log( '| init()        ->', machine.init() );
console.log( '| can tryAuth?  ->', machine.can('tryAuth') );
console.log( '| can tryAuths? ->', machine.can('tryAuths') );
console.log( '+------------------+');
console.log( '| tryAuth()     ->', machine.tryAuth() );
console.log( '+------------------+');
console.log( '| authError()   ->', machine.authError() );
console.log( '+------------------+');
console.log( '| init()        ->', machine.init() );
console.log( '| tryAuth()     ->', machine.tryAuth() );
console.log( '| auth()        ->', machine.auth() );
console.log( '| photo()       ->', machine.photo() );
console.log( '| photo()       ->', machine.photo() );
console.log( '+------------------+');
console.log( '| photo()       ->', machine.photo() );
console.log( '| photoError()  ->', machine.photoError() );
console.log( '+------------------+');
console.log( '| current       ->', machine.current );
console.log( '| mainError()   ->', machine.mainError() );
console.log( '| current       ->', machine.current );
console.log( '+------------------+');
console.log( '| current       ->', machine.current );
console.log( '| exit()        ->', machine.exit() );