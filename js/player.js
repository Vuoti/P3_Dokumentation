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
var Video_Bodystorming = {
    name: "bodystorming",
    name_control: "bodystorming-btn",
    isPaused: true
};
var Video_Trailer = {
    name: "trailer",
    name_control: "trailer-btn",
    isPaused: true,
    controls: true
};
var Video_Zielgruppeninterview = {
    name: "zielgruppeninterview",
    name_control: "zielgruppeninterview-btn",
    isPaused: true,
};
var Video_Animatic = {
    name: "animatic",
    name_control: "animatic-btn",
    isPaused: true,
};

//Liste mit VideoObjekten
var VideoList = Array(Video_Meki, Video_Seppi, Video_Uta, Video_Andre, Video_Bodystorming, Video_Trailer, Video_Zielgruppeninterview, Video_Animatic);
//Funktion die einem VideoObjekt verschiedene Events (Click,mOver,mOut) verteilt
function AddEvents(VideoObjekt) {
    //ClickEvent
    try {
        document.getElementById(VideoObjekt.name).addEventListener('click', function() {
            click(this, VideoObjekt);
        }, false);
    } catch (err) {
        console.log("Das eigentliche Video nicht gefunden! Hat das Video die richtige ID?" + "\nDie Errormessage: " + err);
    }
    try {
        //MouserOverEvent
        document.getElementById(VideoObjekt.name).addEventListener('mouseover', function() {
            mouseover(VideoObjekt);
        });
    } catch (err) {

        console.log("Mouse Over Fail" + err);
    }
    //MouseOutEvent
    try {
        document.getElementById(VideoObjekt.name).addEventListener('mouseout', function() {
            mouseout(VideoObjekt);
        });

    } catch (err) {

    }

}

//Alle Videos aus der Liste bekommen Events
for (var i = 0; i < VideoList.length; i++) AddEvents(VideoList[i]);

//ClickFunktion
function click(Video, VideoObjekt) {
    //Button wird aus dem DOM geholt
    domControls = document.getElementById(Video.id + "-btn");
    if (VideoObjekt.isPaused) { //Wenn pausiert
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
function mouseover(VideoObjekt) {
  console.log("Mouse In");
    if (!VideoObjekt.isPaused) {
        document.getElementById(VideoObjekt.name_control).className = "video-stop";
        if(VideoObjekt.controls){
          document.getElementById(VideoObjekt.name).setAttribute("controls", "controls");
        }
    }

}
//MouseOut Funktion
function mouseout(VideoObjekt) {
  console.log("Mouse OUT");
    if (!VideoObjekt.isPaused) {
      document.getElementById(VideoObjekt.name_control).className = "video-stop hide";
    }
    if(VideoObjekt.controls){
      document.getElementById(VideoObjekt.name).removeAttribute("controls");
    }
}
