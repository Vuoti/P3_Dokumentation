
				window.addEvent('domready', function(){
					var imgbox323 = new noobSlide({
						box: $('imgbox323'),
						items: [0,1,2],
						size: 300,
						interval: 3000,
						fxOptions: {
							property:'left',
							duration: 1000,
							transition: Fx.Transitions.Circ.easeOut,
							wait: false
						},
						handles: $$('#thumbs323 div'),
						handle_event: "mouseenter"
					});
					imgbox323.walk(0);
				});