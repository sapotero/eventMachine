var eventum = require('./../index.js');

var machine = eventum.init({
  initial: 'init',
  events: [
    { event: 'login',          from: 'init',  to: 'auth'   },
    { event: 'loginError',     from: 'init',  to: 'error'  },

    { event: 'authorize',      from: 'auth',  to: 'ready' },
    { event: 'authorizeError', from: 'auth',  to: 'error' },

    { event: 'makePhoto',      from: 'ready', to: 'photo' },
    { event: 'sendPhoto',      from: 'photo', to: 'ready' },

    { event: 'ping',           from: 'ready', to: 'ping' },
    { event: 'pong',           from: 'ping',  to: 'ready' },

    { event: 'photoError',     from: [ 'photo' ],        to: 'error' },
    { event: 'idleError',      from: [ 'error' ],        to: 'ready' },
    { event: 'initError',      from: [ 'init', 'auth' ], to: 'init' },

    { event: 'exit',           from: [ 'init','auth', 'check', 'ready'], to: 'init' },
  ],
  callbacks: {
    oninit:    function(event, from, to, data) {
      console.log(' ** callback -> oninit',data);
    },
    onauth: function(event, from, to, data) {
      console.log(' ** callback -> onauth', data);
    },
    oncheck:      function(event, from, to, data) {
      console.log(' ** callback -> oncheck', data);
    },
    onmakePhoto: function(event, from, to, data){
      setTimeout(function(){
        machine.next();
      }, 10);
      return eventum.ASYNC;
    },
    onerror:      function(event, from, to, data) {
      console.log(' ** callback -> oncheck', data);
    },
    onexit:      function(event, from, to, data) {
      console.log(' ** callback -> onexit', event, from, to, data);
    },
    onlogin:       function(event, from, to, data) {
      console.log(' ** callback -> onlogin', data);
    },
    onping:      function(event, from, to, data) {
      console.log(' callback -> onping');
    },
    onpong:      function(event, from, to, data) {
      console.log(' callback -> onpong');

    },
  }
});

console.log( "\ninit: ", machine,"\n");

console.log('+------ TEST -------+');
console.log( '| current state ->', machine.current );
console.log( '| can login?    ->', machine.can('login') );
console.log( '| can exit?     ->', machine.can('exit') );
console.log('+------------------+');

console.log('> +------------------+');
console.log('  | login()    ->', machine.login() );
console.log('  | can login? ->', machine.can('login') );
console.log('  | state      ->', machine.current );
console.log('  +------------------+');

// console.log("\n* +------------------+");
// console.log('* | debug: ', machine.debug(true) );
// console.log("* +------------------+\n");

console.log(' -> +------------------+');
console.log('    | authorize()    ->', machine.authorize() );
console.log('    | can makePhoto? ->', machine.can('makePhoto') );
console.log('    | state          ->', machine.current );
console.log('    +------------------+');

// console.log("\n* +------------------+");
// console.log('* | debug: ', machine.debug(false) );
// console.log("* +------------------+\n");

console.log(' --> +------------------+');
console.log('     | makePhoto()    ->', machine.makePhoto() );
console.log('     | can login?     ->', machine.can('login') );
console.log('     | state          ->', machine.current );
console.log('     +------------------+');

console.log(' --> +------------------+');
console.log('     | sendPhoto()    ->', machine.sendPhoto() );
console.log('     | can login?     ->', machine.can('login') );
console.log('     | state          ->', machine.current );
console.log('     +------------------+');

console.log('+--  +------------------+');
console.log('     | ping()    ->', machine.ping() );
console.log('     | state     ->', machine.current );
console.log('     +------------------+');
console.log('+--  +------------------+');
console.log('     | pong()    ->', machine.pong() );
console.log('     | state     ->', machine.current );
console.log('     +------------------+');

console.log(' <- +------------------+');
console.log('    | exit()    ->', machine.exit('sleep') );
console.log('    | can exit? ->', machine.can('exit') );
console.log('    | state     ->', machine.current );
console.log('    +------------------+');
