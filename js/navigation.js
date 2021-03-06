var isLateralNavAnimating = false,
    button = document.querySelector('.cd-nav-trigger'),
    body = document.querySelector('body'),
    trans = document.querySelector('.csstransitions'),
    activeDiv = document.querySelector('#active_menu');

function delayToggle(elem) {
    elem.classList.toggle('active');
}

function whichTransitionEvent() {
    var t, el = document.createElement("fakeelement");

    var transitions = {
        "transition": "transitionend",
        "OTransition": "oTransitionEnd",
        "MozTransition": "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}
var transitionEvent = whichTransitionEvent();

body.addEventListener(transitionEvent, function() {
    isLateralNavAnimating = false;
}, false);
button.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!isLateralNavAnimating) {
        if (this.parentNode.trans !== null) {
            isLateralNavAnimating = true;
          // cover button  to prevent multi click
            delayToggle(activeDiv);
        }
        body.classList.toggle('navigation-is-open');
      //hide active class
        setTimeout(function() {
            delayToggle(activeDiv);
        }, 700);
    }
}, true);

var NavElements = Array('nav-startseite', 'nav-vision', 'nav-recherche', 'nav-steps', 'nav-zielgruppe', 'nav-addOn', 'nav-system', 'nav-management', 'nav-trailer', 'nav-ausblick', 'nav-danke', 'nav-quellen');

function AddHoverEvents(input){
  var nav = document.getElementById(input);
  nav.addEventListener('mouseover', function(){
    nav.className += ' hover-'+input;
  })
  nav.addEventListener('mouseout', function(){
    nav.className = 'list';
  })
}

for (var i = 0; i < NavElements.length; i++) AddHoverEvents(NavElements[i]);
