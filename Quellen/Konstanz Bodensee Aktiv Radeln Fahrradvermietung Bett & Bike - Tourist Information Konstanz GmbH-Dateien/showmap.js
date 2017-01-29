window.addEvent('domready', function(){
	
	var maploaded = 0;
	var domain = window.location.host;
	var mapPid = $('kartenid').innerHTML;	
	var kartendivheight='652'	
	var kartendivheight='657'	
	var fadevalue = 1;


	var karte = $('karte');
	var top = $('top');
	top.set('tween', {duration: '1000'});
	var fxKarte = new Fx.Tween(karte, {duration: '4000'});
	var fxTop = new Fx.Tween(top, {property: 'height'});
	
	var showHeadimage = function(){			
		karte.fade(0);
		top.tween('height', '489px');
		$('mapbutton').removeEvent('click', showHeadimage);
		$('mapbutton').addEvent('click', showMap);
		var test = $('mapbutton').getElements('img');
		test.setProperty('src', 'http://'+domain+'/fileadmin/img/kartenlink.png');
		test.setProperty('height', '45');
		test.setProperty('width', '65');
		$('mapbutton').setStyle('left', '905px');
		
		karte.setProperty('class', 'inactive');			
	}
	
	var showMap = function(){		
		if (maploaded == 0) {
			if ((karte.getProperty('class')) == 'inactive') {				
				top.tween('height', '772px');			
				karte.setStyle('opacity', '0');
				//karte.setStyle('height', '664px');
				karte.setStyle('height', '670px');
				karte.fade(1);
				karte.set('class', 'active');
			}
			
			if (!$('mapframe')) {				
				var el = new Element('iframe', {'src': 'http://'+domain+'/index.php?id='+mapPid, 'frameborder': '0', 'height': '745', 'width': '960', 'scrolling': 'no', 'id': 'mapframe', 'name': 'mapframe'});
				el.inject(karte);
				}
						
			maploaded = 1;
			$('mapbutton').removeEvent('click', showMap);
			$('mapbutton').addEvent('click', showHeadimage);
		}
		if (maploaded == 1) {
			if ((karte.getProperty('class')) == 'inactive') {
				top.tween('height', '772px');
				karte.setStyle('opacity', '0');
				karte.setStyle('height', '670px');
				karte.fade(1);
				karte.set('class', 'active');				
			}
			$('mapbutton').removeEvent('click', showMap);
			$('mapbutton').addEvent('click', showHeadimage);
		}
		var test = $('mapbutton').getElements('img');
		test.setProperty('src', 'http://'+domain+'/fileadmin/img/bildlink.png');
		test.setProperty('height', '21');
		test.setProperty('width', '69');
		$('mapbutton').setStyle('left', '900px');
		if($('poishowmap')){
			$('poishowmap').set('onclick', 'return false;');
		}
		return false;
	}
	var showPoiJS = function() {	
		var uid = $('icextaddress_poiid').get('value');
		var lng = $('icextaddress_poilng').get('value');
		var lat = $('icextaddress_poilat').get('value');
		var company = $('icextaddress_poicompany').get('value');
		var scroll = new Fx.Scroll(window).toElement('karte');
		if ($('mapframe')) {
			showMap();
			values = new Array(uid, lng, lat, company);				
			window.setTimeout("parent.mapframe.setPoiValues(values)", 1000);				
		}
	}
	
	var showPoiFirst = function() {
		var scroll = new Fx.Scroll(window).toElement('karte');
		if (karte.get('class') == 'active') {			
			showPoiJS();			
		}
		else {			
			showMap();
			$('poishowmap').removeEvent('click', showPoiFirst);			
			$('poishowmap').addEvent('click', showPoiJS);
		}		
	}
	
	if ($('mapbutton')) { 
		$('mapbutton').addEvent('click', showMap);	
		}
	
	if($('poishowmap')){	
		$('poishowmap').addEvent('click', showPoiFirst);
	}
	
	//zur karte scrollen und sie anzeigen
	//gilf für alle links mit der klasse scrolltomap
	$(document.body).getElements('a.scrolltomap').addEvents({
		'click': function(){
			var scroll = new Fx.Scroll(window).toElement('karte');
			if ((karte.getProperty('class')) == 'inactive') {				
				top.tween('height', '772px');			
				karte.setStyle('opacity', '0');
				karte.setStyle('height', '670px');
				karte.fade(1);
				karte.set('class', 'active');
			}			
			if (!$('mapframe')) {				
				var el = new Element('iframe', {'src': 'http://'+domain+'/index.php?id='+mapPid, 'frameborder': '0', 'height': '745', 'width': '960', 'scrolling': 'no', 'id': 'mapframe', 'name': 'mapframe'});
				el.inject(karte);
				}						
			maploaded = 1;
			$('mapbutton').removeEvent('click', showMap);
			$('mapbutton').addEvent('click', showHeadimage);
		}
	});
});