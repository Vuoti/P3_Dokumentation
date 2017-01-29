/**
 * Copyright (c) 2008 Michael Grundkoetter, MIT Style License.
 * Depends from Mootools Framework v1.11 (mootools.net) by Valerio Proietti
 * 
 * Creates drop shadows for rectangle-like elements on the underground. (works at least in FF, Opera, IE7 and Safari)
 * You have to use it like this:
 * 
 * new DynamicDropShadows('*.dropShadow', 'dropShadowBackground');
 * 
 * This will create drop shadows for all elements with css class "dropShadow". You have to call it after the dom tree has been created completely.
 * You might to call it like this: (see parameter explanation below)
 * 
 * window.addEvent('domready', function() {new DynamicDropShadows('*.dropShadow', 'dropShadowBackground'); });
 * 
 * Known issues: - allSideShadow seems to work properly in FF only; IE does not display divs containing text correctly
 * 				 - dimensions of shadow throwing elements must be set via css, otherwise the shadow is wrong or missing
 * 				 - currently dragged item should be on top of the rest
 * 
 */

var DynamicDropShadows = new Class({
	/**
	 * @param String targetElements is an css style selector. It defines on which elements the shadow will be applied (like *.myClass)
	 * @param String shadowStyleClass is the css class name which will be applied on the shadow (see rules in css comments)
	 * @param Integer xOffset the shadow is moved that many px from left (optional; default is 10)
	 * @param Integer yOffset the shadow is moved that many px from top (optional; default is 10)
	 * @param Float shadowOpacity Initial shadow opacity (optional; standard is 0.8; 0 < x <= 1)
	 * @param Boolean softShadow sets whether the shadow shall fade out until the opacity reaches 0 (optional; default is true)
	 * @param Float cycleFallOff sets the amount of opacity of which the initial will be decreased each cycle (optional; default is 0.5; 0 < x < shadowOpacity)
	 * @param Boolean allSideShadow sets whether the shadow shall be thrown in all 4 directions (optional; default is false)
	 * @param Integer shadowDistance defines the distance from the object to where the shadow is thrown on. The greater the distance is, the bigger the shadow will be.
	 * 				  (optional; default is 3; depends from allSideShadow 0 < x < n)
	 * @param String allSideClass is the css class name which will be applide on the shadow borders id allSideShadow is active (depends from allSideShadow)
	 */
	initialize: function(targetElements, shadowStyleClass, xOffset, yOffset, shadowOpacity, softShadow, cycleFallOff, allSideShadow, shadowDistance, allSideClass) {
		//set default values if no parameters given
		xOffset = $pick(xOffset, 10);
		yOffset = $pick(yOffset, 10);
		shadowOpacity = $pick(shadowOpacity, .8);
		softShadow = $pick(softShadow, true);
		cycleFallOff = $pick(cycleFallOff, .1);
		allSideShadow = $pick(allSideShadow, false);
		shadowDistance = $pick(shadowDistance, 10);
	
		//get the elements
		$$(targetElements).each(function(current) {
			var container = current.clone().empty().injectBefore(current).adopt(current).setStyle('position', 'relative');			
			current.setStyles({
				position: 'absolute',
				top: 0,
				left: 0,
				margin: 0,
				padding: 0
			});
			//first shadow needs to be a solid rectangle
			
			var shadow = current.clone().empty().injectBefore(current).addClass(shadowStyleClass).setOpacity(shadowOpacity);
			if(allSideShadow) {
				shadow.setStyles({
					top: (current.getStyle('top').toInt() + yOffset - shadowDistance) + 'px',
					left: (current.getStyle('left').toInt() + xOffset - shadowDistance) + 'px',
					width: (shadow.getStyle('width').toInt() + shadowDistance * 2 + xOffset) + 'px',
					height: (shadow.getStyle('height').toInt() + shadowDistance * 2 + yOffset) + 'px'
				})
			} else {
				shadow.setStyles({
					top: (current.getStyle('top').toInt() + yOffset) + 'px',
					left: (current.getStyle('left').toInt() + xOffset) + 'px'
				})
			}
			
			//additional shadow layers only need to be 1px in size to not overlap the big shadow
			var counter = 0;
			var tempOpacity = shadowOpacity;
			while(softShadow && (tempOpacity - cycleFallOff).round(2) > 0) {
				tempOpacity = (tempOpacity - cycleFallOff).round(2);
				if(allSideShadow) {
					//shadow on every side
					var shadowFrame = shadow.clone().removeClass(shadowStyleClass).addClass(allSideClass).setOpacity(tempOpacity).injectBefore(current).setStyles({
						height: (shadow.getStyle('height').toInt() + counter * 2) + 'px',
						width: (shadow.getStyle('width').toInt() + counter * 2) + 'px',
						top: (shadow.getStyle('top').toInt() - counter - 1) + 'px',
						left: (shadow.getStyle('left').toInt() - counter - 1) + 'px',
						'background-color': 'transparent'
					});
				} else {
					//shadow only right and bottom
					//vertical shadow
					var vShadow = shadow.clone().setOpacity(tempOpacity).injectBefore(current).setStyles({
						top: (shadow.getStyle('top').toInt() + counter + 1) + 'px',
						left: (shadow.getStyle('left').toInt() + shadow.getStyle('width').toInt() + counter) + 'px',
						height: (shadow.getStyle('height').toInt() - 1) + 'px',						
						width: '1px'
					});
					//horizontal shadow
					var hShadow = shadow.clone().setOpacity(tempOpacity).injectBefore(current).setStyles({
						top: (shadow.getStyle('top').toInt() + shadow.getStyle('height').toInt() + counter) + 'px',
						left: (shadow.getStyle('left').toInt() + counter + 1) + 'px',
						width: (shadow.getStyle('width').toInt() - 1) + 'px',						
						height: '1px'
					});
					//corner shadow
					if((tempOpacity - cycleFallOff).round(2) > 0) {
						var cShadow = hShadow.clone().setOpacity((tempOpacity - cycleFallOff).round(2)).injectBefore(current).setStyles({
							left: (hShadow.getStyle('left').toInt() + hShadow.getStyle('width').toInt()) + 'px',
							width: '1px'
						});
					}
				}
				counter++;
			}
		});
	}
});
