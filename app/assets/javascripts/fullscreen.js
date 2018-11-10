// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

function launchFullscreen(obj) {
  var fs = true;
  if (obj.requestFullscreen) {
    obj.requestFullscreen();
  } else if (obj.mozRequestFullScreen) {
    obj.mozRequestFullScreen();
  } else if (obj.webkitRequestFullscreen) {
    obj.webkitRequestFullscreen();
  } else if (obj.msRequestFullscreen) {
    obj.msRequestFullscreen();
  } else {
    console.log('Fullscreen Unavailable');
    fs = !fs;
  }

  if (fs)
    $('#fsSection').addClass('fullscreen');
    $('.fs-logo').css('display', 'block');
}

$(document).ready(function(){
  var fsSection = document.getElementById('fsSection');
  var fsBtn = document.getElementById('fsBtn');

  fsBtn.onclick = function() {
    launchFullscreen(fsSection);
  };
});

if (document.addEventListener) {
  document.addEventListener('webkitfullscreenchange', exitFSHandler, false);
  document.addEventListener('mozfullscreenchange', exitFSHandler, false);
  document.addEventListener('fullscreenchange', exitFSHandler, false);
  document.addEventListener('MSFullscreenChange', exitFSHandler, false);
}

function exitFSHandler() {
  if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
    $('#fsSection').removeClass('fullscreen');
    $('.fs-logo').css('display', 'none');
  }
}
