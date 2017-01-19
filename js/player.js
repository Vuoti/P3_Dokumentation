var vid_meki = document.getElementById('meki');
var vid_meki_controls = document.getElementById('meki-btn')
var isPaused = true;

vid_meki.addEventListener('click', function() {
  if (isPaused){
    vid_meki.play();
    vid_meki_controls.className = "video-stop";
    isPaused = false;
  }else{
    vid_meki.pause();
    vid_meki.currentTime = 0;
    vid_meki.load();
    vid_meki_controls.className = "video-play";
    isPaused = true;
  }
}, false);


vid_meki_controls.addEventListener('mouseover', function(){
  if(!isPaused){
    vid_meki_controls.className = "video-stop";
  }
});
vid_meki_controls.addEventListener('mouseout', function(){
  if(!isPaused){
    vid_meki_controls.className = "video-stop hide";
  }
});
