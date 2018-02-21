// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require rails-ujs
//= require activestorage
//= require materialize
//= require_tree .

$(document).ready(function(){
  $('.button-collapse').sideNav({
    menuWidth: 200, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true, // Choose whether you can drag to open on touch screens
    onOpen: function(e) {
      $('div.container').css({'padding-left': '200px', 'width': '85%'})
      $('div#sidenav-overlay').remove()
    },
    onClose: function(e) {
      $('div.container').css({'padding-left': '0px', 'width': '70%'})
    }
  });
  $('select').material_select();
});
