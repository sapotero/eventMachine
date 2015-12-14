"use strict";
var eventum = eventum || {};

eventum = function(){
  return {
    init: function(){
      console.log( 'init' );
    },
    test: function(){
      console.log( 'test' );
    }
  }
};

module.exports = eventum;
