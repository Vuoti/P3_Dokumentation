//PLAYER.js - LAST EDITED 20.01.17----------------------------------------------
//------------------------------------------------------------------------------

//Die Video Objekte:
//Name soll ID entsprechen und ControlName der ButtonID
var Video_Meki = {
	name: "meki",
	name_control: "meki-btn",
	isPaused: true
};
var Video_Seppi = {
	name: "seppi",
	name_control: "seppi-btn",
	isPaused: true
};
var Video_Uta = {
	name: "uta",
	name_control: "uta-btn",
	isPaused: true
};
var Video_Andre = {
	name: "andre",
	name_control: "andre-btn",
	isPaused: true
};

//Liste mit VideoObjekten
var VideoList = Array(Video_Meki, Video_Seppi, Video_Uta, Video_Andre);
//Funktion die einem VideoObjekt verschiedene Events (Click,mOver,mOut) verteilt
function AddEvents(VideoObjekt) {
	//ClickEvent
	document.getElementById(VideoObjekt.name).addEventListener('click', function() {
		click(this, VideoObjekt);
	}, false);
	//MouserOverEvent
	document.getElementById(VideoObjekt.name_control).addEventListener('mouseover', function() {
		mouseover(this, VideoObjekt);
	});
	//MouseOutEvent
	document.getElementById(VideoObjekt.name_control).addEventListener('mouseout', function() {
		mouseout(this, VideoObjekt);
	});
}

//Alle Videos aus der Liste bekommen Events
for (var i = 0; i < VideoList.length; i++) AddEvents(VideoList[i]);

//ClickFunktion
function click(Video, VideoObjekt) {
  //Button wird aus dem DOM geholt
	domControls = document.getElementById(Video.id + "-btn");
	if (VideoObjekt.isPaused) {  //Wenn pausiert
    //Video abspielen
		Video.play();
		domControls.className = "video-stop";
		VideoObjekt.isPaused = false;
	} else { //Bereits gestartet
    //Video pausieren
		Video.pause();
		Video.currentTime = 0;
		Video.load();
		domControls.className = "video-play";
		VideoObjekt.isPaused = true;
	}
}
//MouseOver Funktion
function mouseover(VideoControl, VideoObjekt) {
	if (!VideoObjekt.isPaused) {
		VideoControl.className = "video-stop";
	}
}
//MouseOut Funktion
function mouseout(VideoControl, VideoObjekt) {
	if (!VideoObjekt.isPaused) {
		VideoControl.className = "video-stop hide";
	}
}
