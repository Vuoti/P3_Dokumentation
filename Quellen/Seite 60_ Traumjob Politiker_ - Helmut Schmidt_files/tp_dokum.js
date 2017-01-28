/* ===================================================================== */
/* JavaScript-Routinen zur Dokumentbehandlung V. 1.5                     */
/* (c) Frank U. Kugelmeier, Attendorn 2004 - 2010                        */
/* Erstellungsdatum: 19.12.2008                                          */
/* unter Verwendung der Routine "Text Link Fader"                        */
/* (c) Roy Whittle (Roy@Whittle.com) www.Roy.Whittle.com bzw.            */
/* (c) www.javascript-fx.com                                             */
/* ===================================================================== */

var IstMSIE = ((navigator.appName == "Microsoft Internet Explorer") && (navigator.appVersion.indexOf("MSIE") > -1) &&
  (document.all?1:0));
var IstMSIEx = document.all?1:0;
var IstNS6 = (document.getElementById && !document.all?1:0);

if (!document.getElementById)   // Warnmeldung
{
  alert("Diese Dokumentation erfordert einen neueren Textbrowser. Falls Ihnen ein solcher nicht zur Verfügung " +
    "steht, deaktivieren Sie in Ihrem Browser bitte JavaScript, um Fehlermeldungen zu vermeiden. Rufen Sie dann " +
    "die Dokumentation erneut auf!");
  self.history.back();
}

var dokumentliste = new Array(  // Dokumentliste
  "dummy",
  "tp_start",
  "tpdoku01",
  "tplamm01",
  "tpmuen01",
  "tpschm01",
  "tpscha01",
  "tpmuel01",
  "tppink01",
  "tpkaud01",
  "tpstei01",
  "tpschf01",
  "tphoeh01",
  "tpruet01",
  "tpwolf01",
  "tpsomm01",
  "tpdint01",
  "tpfrei01",
  "tpkeym01",
  "tpwank01",
  "tplafo01",
  "tpnahl01",
  "tproth01",
  "tpruda01",
  "tpalth01",
  "tprein01",
  "tpreck01",
  "tpgros01",
  "tppapk01",
  "tploeh01",
  "tplies01",
  "tpkuhn01",
  "tpalva01",
  "tpsipp01",
  "tphier01",
  "tpkamm01",
  "tpakgu01",
  "tphein01",
  "tpbras01",
  "tpkocz01",
  "tpdaub01",
  "tpkemp01",
  "tpheid01",
  "tpcron01",
  "tpkrus01",
  "tpjung01",
  "tpkast01",
  "tpbeer01",
  "tpelli01",
  "tpruff01",
  "tpbroc01",
  "tpsage01",
  "tpkrau01",
  "tpwina01",
  "tpgier01",
  "tpvoge01",
  "tprick01",
  "tpchan01",
  "tpmoeh01",
  "tpkoeb01",
  "tpsmid01",
  "tpkirc01",
  "tpjula11",
  "tpjula12",
  "tpjula13",
  "tpjula21",
  "tpjula22",
  "tpjula23",
  "tpnach01",
  "tpinfo01",
  "tptage01",
  "tpidea01",
  "tprund01",
  "tplehrpl",
  "tpmedi00",
  "tpmedi01",
  "tpmedi02",
  "tpmedi03",
  "tpmedi04",
  "tpmedi05",
  "tpmedi06",
  "tpmedi07",
  "tpmedi08",
  "tpmedi09",
  "tpmedi10",
  "tpmedi11",
  "tpmedi12",
  "tpmedi13",
  "tpmedi14",
  "tpmedi15",
  "tpmedi16",
  "tpmedi17",
  "tpmedi18",
  "tpmedi19",
  "tpmedi20",
  "tpmedi21",
  "tpmedi22",
  "tpmedi23",
  "tpmedi24",
  "tpmedi25",
  "tpmedi26",
  "tpmedi27",
  "tpmedi28",
  "tpmedi29",
  "tpmedi30",
  "tpmedi31",
  "tpmedi32",
  "tpmedi33",
  "tpmedi34",
  "tpmedi35",
  "tpmedi36",
  "tpmedi37",
  "tpmedi38",
  "tpmedi39",
  "tpmedi40",
  "tpmedi41",
  "tpmedi42",
  "tpmedi43",
  "tpmedi44",
  "tpmedi45",
  "tpmedi46",
  "tpmedi47",
  "tpmedi48",
  "tpmedi49",
  "tpmedi50",
  "tpmedi51",
  "tpmedi52",
  "tpmedi53",
  "tpmedi54",
  "tpmedi55",
  "tpmedi56",
  "tpmedi57",
  "tpmedi58",
  "tpmedi59",
  "tpmedi60",
  "tpmedi61",
  "tpmedi62",
  "tpmedi63",
  "tpmedi64",
  "tpmedi65",
  "tpmedi66",
  "tpmedi67",
  "tpmedi68",
  "tpmedi69",
  "tpmedi70",
  "tpmedi71",
  "tpmedi72",
  "tpmedi73",
  "tpmedi74",
  "tpmedi75",
  "tpmedi76",
  "tpmedi77",
  "tpmedi78",
  "tpmedi79",
  "tpmedi80",
  "tpmedi81",
  "tpmedi82",
  "tpmedi83",
  "tpmedi84",
  "tpmedi85",
  "tpmedi86",
  "tpmedi87",
  "tpmedi88",
  "tpmedi89",
  "tpmedi90",
  "tpmedi91",
  "tpmedi92",
  "tpmedi93",
  "tpmedi94",
  "tpmedi95",
  "tpmedi96",
  "tpmedi97",
  "tpmedi98",
  "tpmedi99",
  "tpmed100",
  "tpmed101",
  "tpmed102",
  "tpmed103",
  "tpmed104",
  "tpmed105",
  "tpmed106",
  "tpmed107",
  "tp_copyr",
  "dummy");

var aktuelleseite = -1;
var impfad = -1;

for (var zaehl = 1; zaehl < dokumentliste.length - 1; zaehl++)
{
impfad = window.location.pathname.indexOf(dokumentliste[zaehl] + ".htm");     // aktuelle Seite ermitteln
if (impfad > -1)
  {
  aktuelleseite = zaehl;
  break;
  }
}

// ====================================================================================================================

// Startfunktion (Hinweisfähnchen zu Bildern auch unter Netscape; Vorbereitung von Tastenabfragen)

function Starte()
{
with (self.document)
  for (var k = 0; k < images.length; k++) images[k].title = images[k].alt;
tastendruck();
seitenzahl();
}

// ====================================================================================================================

// Weiter-/Zurückblättern per Tasten <w> und <z> bzw. <+> und <->

var key = new Array();
var vorenglisch = "tpnach01.htm";                                             // Einbettung der englischen Seite
var nachenglisch = "tptage01.htm";

function getKey(keyStroke)                                                    // Taste ermitteln
{
if (navigator.appName.indexOf("Netscape") != -1)
  {
  which = String.fromCharCode(keyStroke.which).toLowerCase();
  }
else
  if (navigator.appName.indexOf("Explorer") != -1)
    {
    which = String.fromCharCode(event.keyCode).toLowerCase();
    }
  else
    {
    which = String.fromCharCode(keyStroke.which).toLowerCase();
    }
for (var m in key) if (which == m) window.location = key[m];
}

function tastendruck()                                                        // Tastatureingaben prüfen
{
if (parent.frames[1]) parent.frames[1].focus();
if (aktuelleseite == 1) key['ü'] = "#index";                                  // Zurück zur Übersicht
else key['ü'] = "tp_start.htm#index";
if (aktuelleseite > 0)
  {
  if (aktuelleseite > 1)                                                      // Weiter-/Zurückblättern
    {
    key['z'] = dokumentliste[aktuelleseite - 1] + ".htm";
    key['-'] = dokumentliste[aktuelleseite - 1] + ".htm";
    }
  if (aktuelleseite < dokumentliste.length - 2)
    {
    key['w'] = dokumentliste[aktuelleseite + 1] + ".htm";
    key['+'] = dokumentliste[aktuelleseite + 1] + ".htm";
    }
  }
if (aktuelleseite == -1)
  {
  impfad = window.location.pathname.indexOf("tpinfo11.htm");                  // Sonderfall: englische Seite
  if (impfad > -1)
    {
    key['z'] = vorenglisch;
    key['-'] = vorenglisch;
    key['b'] = vorenglisch;
    key['w'] = nachenglisch;
    key['+'] = nachenglisch;
    key['f'] = nachenglisch;
    key['i'] = "tp_start.htm#index";
    }
  }
document.onkeypress = getKey;
}

// ===================================================================================================================

var titelwechsel = false;  // Opera-bedingte Variable

function seitenzahl()                                                         // Seitenzahl in Titelleiste ergänzen
{
if (parent.frames[1]) parent.frames[1].focus();
if ((impfad > -1) && (titelwechsel == false))
  {
  var titeltext = "Seite " + aktuelleseite + ": " + self.document.title;
  self.document.title = titeltext;
  titelwechsel = true;  // notwendig für Opera-Browser
  }
}

// ===================================================================================================================

/*******************************************************************
* File    : JSFX_LinkFader.js  © JavaScript-FX.com
* Created : 2002/09/05
* Author  : Roy Whittle  (Roy@Whittle.com) www.Roy.Whittle.com
* Purpose : To create a more dynamic a:hover using fading
* History
* Date        Version     Description
* 2002-09-05  1.0         First version
***********************************************************************/

/*** Create some global variables ***/
if (!window.JSFX) JSFX=new Object();

var LinkFadeInStep = 20;
var LinkFadeOutStep = 5;
var LinkEndColor = "DFDFDF";

var LinkStartColor = "DFDFDF";
var LinkFadeRunning = false;

document.onmouseover = theOnOver;
document.onmouseout  = theOnOut;

if(document.captureEvents) document.captureEvents(Event.MOUSEOVER | Event.MOUSEOUT);

/*****************************************************************
******************************************************************
* You may use this code for free on any web page provided that
* these comment lines and the following credit remain in the code.
* "Text Link Fader" © from www.javascript-fx.com
******************************************************************
*
* Function    : getColor
*
* Parameters  : start - the start color (in the form "RRGGBB" e.g. "FF00AC")
*               end - the end color (in the form "RRGGBB" e.g. "FF00AC")
*               percent - the percent (0-100) of the fade between start & end
*
* returns     : color in the form "#RRGGBB" e.g. "#FA13CE"
*
* Description : This is a utility function. Given a start and end color and
*               a percentage fade it returns a color in between the 2 colors
*
* Author      : www.JavaScript-FX.com
*
*****************************************************************/

function hex2dec(hex)
{
return(parseInt(hex,16));
}

function dec2hex(dec)
{
return (dec < 16 ? "0" : "") + dec.toString(16);
}

function getColor(start, end, percent)
{
var r1=hex2dec(start.slice(0,2));
var g1=hex2dec(start.slice(2,4));
var b1=hex2dec(start.slice(4,6));

var r2=hex2dec(end.slice(0,2));
var g2=hex2dec(end.slice(2,4));
var b2=hex2dec(end.slice(4,6));

var pc=percent/100;

var r=Math.floor(r1+(pc*(r2-r1)) + .5);
var g=Math.floor(g1+(pc*(g2-g1)) + .5);
var b=Math.floor(b1+(pc*(b2-b1)) + .5);

return("#" + dec2hex(r) + dec2hex(g) + dec2hex(b));
}

/************************************************/

JSFX.getCurrentElementColor = function(el)
{
var result = LinkStartColor;

if (el.currentStyle) result = (el.currentStyle.color);
else
  if (document.defaultView) result = (document.defaultView.getComputedStyle(el,'').getPropertyValue('color'));
  else if (el.style.color) result = el.style.color;       //Opera
if (result.charAt(0) == "#") result = result.slice(1, 8); //color is of type #rrggbb
else
  if (result.charAt(0) == "r")                            //color is of type rgb(r, g, b)
    {
    var v1 = result.slice(result.indexOf("(")+1, result.indexOf(")"));
    var v2 = v1.split(",");
    result = (dec2hex(parseInt(v2[0])) + dec2hex(parseInt(v2[1])) + dec2hex(parseInt(v2[2])));
    }
return result;
}

JSFX.findTagIE = function(el)
{
while (el && el.tagName != 'A') el = el.parentElement;
return(el);
}

JSFX.findTagNS = function(el)
{
while (el && el.nodeName != 'A') el = el.parentNode;
return(el);
}

function theOnOver(e)
{
// var lnk;                              // F. K.
var lnk = "";
if (window.event) lnk = JSFX.findTagIE(event.srcElement);
// else lnk = JSFX.findTagNS(e.target);  // F. K.
if (lnk) JSFX.linkFadeUp(lnk);
}

JSFX.linkFadeUp = function(lnk)
{
if (lnk.state == null)
  {
  lnk.state = "OFF";
  lnk.index = 0;
  lnk.startColor = JSFX.getCurrentElementColor(lnk);
  lnk.endColor = LinkEndColor;
  }
if (lnk.state == "OFF")
  {
  lnk.state = "FADE_UP";
  JSFX.startLinkFader();
  }
else
  if (lnk.state == "FADE_UP_DOWN" || lnk.state == "FADE_DOWN")
    {
    lnk.state = "FADE_UP";
    }
}

function theOnOut(e)
{
// var lnk;                              // F. K.
var lnk = "";
if (window.event) lnk = JSFX.findTagIE(event.srcElement);
// else lnk = JSFX.findTagNS(e.target);  // F. K.
if (lnk) JSFX.linkFadeDown(lnk);
}

JSFX.linkFadeDown = function(lnk)
{
if (lnk.state == "ON")
  {
  lnk.state = "FADE_DOWN";
  JSFX.startLinkFader();
  }
else
  if (lnk.state == "FADE_UP")
    {
    lnk.state="FADE_UP_DOWN";
    }
}

JSFX.startLinkFader = function()
{
if (!LinkFadeRunning) JSFX.LinkFadeAnimation();
}

/*******************************************************************
*
* Function    : LinkFadeAnimation
*
* Description : This function is based on the Animate function
*                        of animate.js (animated rollovers).
*                        Each fade object has a state. This function
*                        modifies each object and changes its state.
*****************************************************************/

JSFX.LinkFadeAnimation = function()
{
LinkFadeRunning = false;
for(i=0; i<document.links.length; i++)
  {
  var lnk = document.links[i];
  if (lnk.state)
    {
    if (lnk.state == "FADE_UP")
      {
      lnk.index+=LinkFadeInStep;
      if (lnk.index > 100) lnk.index = 100;
      lnk.style.color = getColor(lnk.startColor, lnk.endColor, lnk.index);
      if (lnk.index == 100) lnk.state = "ON";
      else LinkFadeRunning = true;
      }
    else
      if (lnk.state == "FADE_UP_DOWN")
        {
        lnk.index+=LinkFadeOutStep;
        if (lnk.index>100) lnk.index = 100;
        lnk.style.color = getColor(lnk.startColor, lnk.endColor, lnk.index);
        if (lnk.index == 100) lnk.state = "FADE_DOWN";
        LinkFadeRunning = true;
        }
      else
        if (lnk.state == "FADE_DOWN")
          {
          lnk.index-=LinkFadeOutStep;
          if (lnk.index<0) lnk.index = 0;
          lnk.style.color = getColor(lnk.startColor, lnk.endColor, lnk.index);
          if (lnk.index == 0) lnk.state = "OFF";
          else LinkFadeRunning = true;
          }
    }
  }
/*** Check to see if we need to animate any more frames. ***/
if (LinkFadeRunning) setTimeout("JSFX.LinkFadeAnimation()", 40);
}

// ===================================================================================================================