
Shadowbox.init({
	language:   "de-DE",
	handleOversize:     "resize",
	handleUnsupported:  "remove",
	players: ["img", "swf", "iframe", "html", "flv"],
	autoplayMovies: true
});


window.addEvent('domready', function(){
	var domain = window.location.host;
	var level1bg = 'http://'+domain+'/fileadmin/img/bg-level1.png';
	var active = $('topmenu').getElements('li.act');
	var topmenuitems = $('topmenu').getElements('li');
	topmenuitems.addEvents({
		'mouseenter': function (){
		
			if (this.getElement('ul.level2')) {
				var layerdiv = this.getElement('ul.level2');
				layerdiv.setStyle('display','block');
			
				var menu = $('topmenuwrap').getCoordinates();					
				var layer = layerdiv.getCoordinates();
			
				//gesamthoehe berechnen
				var endpos = menu.left+menu.width;
			
				//layerposition und hoehe zusammenrechnen
				var layerpos = layer.left+layer.width;
			
				if(layerpos > endpos+1){
					//alert('layerpos: '+layerpos+' endpos: '+endpos);
					var newpos = endpos-layerpos;
					layerdiv.setStyle('left',newpos);
				}
			}
		},
		'mouseleave': function (){
				this.getElements('ul.level2').setStyle('display','none');
		}
	});
			
	$$('#topmenu ul.level1 li').addEvents({
		'mouseenter': function(e){
			var aTag = this.getElement('a');			
			aTag.setStyle('background-image', 'url("'+level1bg+'")');		
			
		},
		'mouseleave': function() {
			var aTag = this.getElement('a');			
			aTag.setStyle('background-image','none');
		}
	});
	$$('#topmenu ul.level2 li').removeEvents('mouseenter');
	
	//sprachen
	var flagcontainer = $('flagcontainer');
	var maxwidth = flagcontainer.getStyle('width');	
	var arrow = $('arrow-language');
	var flagslideout = function() {		
		this.setStyle('backgroundImage', 'url("http://'+domain+'/fileadmin/img/arrow-language-active.gif")');
		flagcontainer.tween('right', '210px');
		flagcontainer.tween('width', maxwidth);
		arrow.removeEvent('click', flagslideout);
		arrow.addEvent('click', flagslidein);
	}
	var flagslidein = function() {
		$('arrow-language').setStyle('backgroundImage', 'url("http://'+domain+'/fileadmin/img/arrow-language.gif")');
		flagcontainer.tween('right', '210px');
		flagcontainer.tween('width', '39px');	
		arrow.removeEvent('click', flagslidein);
		arrow.addEvent('click', flagslideout);
	}	
	arrow.addEvent('click', flagslidein);		
	
	//meta-schnellsuche
	if ($('togglequicksearch')) {
		var togglerdiv = $('togglequicksearch');
		var quickheaderdiv = $('quickheader');
		var quicksearchdiv = $('quicksearch');		
		
		var togglequicksearch = function() {
			var bottom = quicksearchdiv.getStyle('bottom');
			//einklappen
			if (bottom == '0px') {
				quicksearchdiv.tween('bottom', '-160px');				
				togglerdiv.setStyle('backgroundImage', 'url("http://'+domain+'/typo3conf/ext/ic_unterkuenfte/res/quicksearch-arrow-inactive.png")');
			}
			else {
				togglerdiv.setStyle('backgroundImage', 'url("http://'+domain+'/typo3conf/ext/ic_unterkuenfte/res/quicksearch-arrow.png")');
				quicksearchdiv.tween('bottom', '0px');
			}
			
		}
		togglerdiv.addEvent('click', togglequicksearch);
		quickheaderdiv.addEvent('click', togglequicksearch);
		
	}
	
});
