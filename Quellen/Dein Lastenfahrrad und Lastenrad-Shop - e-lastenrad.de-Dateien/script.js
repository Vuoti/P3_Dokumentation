/*!
* FitText.js 1.2
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function( $ ){

  $.fn.fitText = function( kompressor, options ) {

    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);

    return this.each(function(){

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
          var size = Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize));
//          console.log(size);
       $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);

    });

  };

})( jQuery );

$(document).ready(function(){
    
    // prepare the mobile menu
    $('#shop_flyout > a span').addClass('default');
    $('#page').wrap('<div class="site-wrapper" />');
    var $menu = $('.flyout_wrapper').clone();
    
    $('nav > ul > li').each(function(idx, el) {
        var $item = $(el).clone();
        if (idx >= 2) {
            var $ul = $('<ul class="column"></ul>');
            $ul.append($item);
            $menu.find('.flyout_columns').append($ul);
        }
    });
    
    
    $menu.find('.bigtext').remove();
    $menu.prependTo('#page').attr('id', 'mobile-menu-details');
    $('#mobile-menu').on('click', function(e) {
        $('#mobile-menu-details').toggleClass('active');
    });
    
    /* Testing - not working yet */
    $('#shop_flyout .xclose').on('click', function(e) {
        e.stopPropagation();
       $('#shop_flyout .flyout_wrapper').hide();
       setTimeout(function() {
            $('#shop_flyout .flyout_wrapper').removeAttr('style');
       }, 100);
    });
    $('#mobile-menu-details .xclose').html('<i class="icon-cancel"></i>').prependTo('#mobile-menu-details');
    $('#mobile-menu-details').prepend('<h2>Menü</h2>');
    $('#mobile-menu-details').on('click', '.xclose', function(e) {
        e.stopPropagation();
        $('.mobile-default').trigger('click');
    });
    /* End Testing */
    
    var $activeMenu = null;
    // mobile touch events
    $('#mobile-menu-details .column > li > a').click(highlight);
    $('#mobile-menu-details .column > li > span').click(highlight);
    
    function highlight(e) {
        var $link = $(this),
            menuHeight = $('.flyout_columns').removeAttr('style').height(),
            hasSubMenu = $(this).parent().has('ul').length > 0,
            detailsHeight;
            
        if (hasSubMenu) {
            e.preventDefault();
        } else {
            return true;
        }
        // remove previous active
        if ($activeMenu) {
            $activeMenu.removeClass('active');
        }
        $activeMenu = $(this).parent();
        detailsHeight = $activeMenu.children('ul').first().height();
        $('.flyout_columns').height(Math.max(menuHeight, detailsHeight));
        $activeMenu.addClass('active');        
    }
    
    $('.mobile-default').click(function() {
       $('#page').toggleClass('offCanvas');
       $('#mobile-menu-details').toggleClass('active');
    });
    
	// product images
	$('#product-listing-startpage').slick({
		slide: 'a',
		slidesToShow: 3,
		prevArrow: '<button type="button" class="slick-prev icon-left-open" style="font-size:1.5em;"></button>',
		nextArrow: '<button type="button" class="slick-next icon-right-open" style="font-size:1.5em;"></button>',
        responsive: [
            {
                breakpoint: 430,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
	});
    $('#product .carousel').slick({
		slide: 'a',
        lazyLoad: 'ondemand',
		slidesToShow: 1,
		slidesToScroll: 1,
		prevArrow: '<button type="button" class="slick-prev icon-left-open" style="font-size:1.5em;"></button>',
		nextArrow: '<button type="button" class="slick-next icon-right-open" style="font-size:1.5em;"></button>'
	});

	$('#product .more-images').slick({
		slide: 'a',
		slidesToShow: 4,
		slidesToScroll: 1,
		prevArrow: '<button type="button" class="slick-prev icon-left-open"></button>',
		nextArrow: '<button type="button" class="slick-next icon-right-open"></button>',
		centerMode: true,
		onBeforeChange: function(ui, lastIndex, currentIndex) {
			var $current = ui.$slides[currentIndex];
			$($current).trigger('click');
		},
		onAfterChange: function(ui, lastIndex, currentIndex) {
			var $current = ui.$slides[currentIndex];
			$($current).trigger('click');
		}
	});

	var slidesToShow;
	if ($('#content-categorie').length > 0) {
		slidesToShow = 4;
	} else {
		slidesToShow = 6;
	}

	$('.cross-selling .container').slick({
		slidesToScroll: Math.min(3, slidesToShow),
        slidesToShow: slidesToShow,
		slide: '.product',
        swipeToSlide: true,
		prevArrow: '<button type="button" class="slick-prev icon-left-open"></button>',
		nextArrow: '<button type="button" class="slick-next icon-right-open"></button>',
        responsive: [
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: slidesToShow - 1,
                    slidesToScroll: Math.min(3, slidesToShow - 1)
                }
            }, {
                breakpoint: 700,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }, {
                breakpoint: 500,
                settings: {
                    slidesToShow: Math.max(2, slidesToShow - 3),
                    slidesToScroll: Math.min(3, slidesToShow - 3)
                }
            }, {
                breakpoint: 400,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
	});

	var $productImages = $('#product-images .slick-slider .slick-slide'),
		noImageSlides = $productImages.length;

	// correct initial slick classes
	if (noImageSlides <= 3) {
		$('#product-images .slick-slider .slick-slide').each(function(idx, el) {
			if(idx == Math.floor((noImageSlides - 1) / 2)) {
				$(this).addClass('slick-center');
			} else {
				$(this).removeClass('slick-center');
			}
		});
	}

	// scrollToTop marker
	var $siteScroll = $('<a class="site_scroll icon-up-open" />');
	$siteScroll.on('click', function(e) {
		e.preventDefault();

		$(this).data('moving', true);
		$siteScroll.fadeOut(300);
		$('html,body').animate({scrollTop: "0px"}, 500, "swing", function() {
			$siteScroll.data('moving', false);
		});
	}).appendTo('#page');

	$(document).on('scroll', function() {
		if ($siteScroll.data('moving') === true) {
			return;
		}
		if ($(this).scrollTop() > 100) {
			$siteScroll.fadeIn(300);
		} else {
			$siteScroll.fadeOut(300);
		}
	});
	// init
	$(document).scroll();

	if ($('#product-infos').length > 0) {
		$('#product-infos .buipc_bundleContainer a[class=fancy-click-trigger]').fancybox({type:'image'});
	}

	var $homeSlideshow = $('#home-eyecatcher .slideshow'), homeSlideshowOptions;
	if ($homeSlideshow.length > 0) {
		homeSlideshowOptions = $homeSlideshow.data();
		$('#home-eyecatcher .slideshow').slick({
			autoplay: homeSlideshowOptions.autoplay,
			autoplaySpeed: homeSlideshowOptions.duration,
			speed: homeSlideshowOptions.animspeed,
			arrows: homeSlideshowOptions.arrows,
			prevArrow: '<button type="button" class="slick-prev"></button>',
			nextArrow: '<button type="button" class="slick-next"></button>',
			dots: homeSlideshowOptions.dots,
			fade: homeSlideshowOptions.fade
		});
	}

	$.widget('chapter2.amountSpinner', $.ui.spinner, {
		_buttonHtml: function() {
			return "" +
			"<button class='ui-spinner-button ui-spinner-up' type='button'>" +
			"<span class='ui-icon " + this.options.icons.up + "'>&#9658;</span>" +
			"</button>" +
			"<button class='ui-spinner-button ui-spinner-down' type='button'>" +
			"<span class='ui-icon " + this.options.icons.down + "'>&#9668;</span>" +
			"</button>";
		}
	});

	if ($('#product').length > 0) {
        
        $('#product .ptabs').each(function() {
            var $tab = $(this),
                $readmore = $('<div class="read-more"><span>Weiterlesen</span></div>');

            $readmore.on('click', function() {
               $(this).hide().parent()
                      .removeClass('show-readmore')
                      .addClass('no-max-height');
            });
            $tab.addClass("show-readmore")
                .prepend($readmore);
        });
        
		$('#product .add-to-cart input[type=text]').amountSpinner({
			icons: {down: '', up: ''},
			min: 1
		});
	}

	adjustImageSize('.products');

	// adjust cross-selling image height
	adjustImageSize('.cross-selling');

	// adjust startpage products-imagesize
	adjustImageSize('#product-listing-startpage');

	// replace radio markers
	$('#product .buipc_BundleSet input[type=radio]').each(function() {
		var $radio = $(this),
			$marker = $('<span class="radiomarker"></span>');

		if ($radio.is(':checked')) {
			$marker.addClass('active');
		} else {
			$marker.addClass('inactive');
		}

		$radio.hide().after($marker)
			.parent().on('click', '.radiomarker', function(e) {
				e.stopPropagation();
				$(this).parentsUntil('buipc_content').find('.radiomarker').removeClass('active');
				$(this).removeClass('inactive').addClass('active').prev().trigger('click');
			});
	});

	$('#checkout input[type=radio]').each(function() {
		var $radio = $(this),
			$marker = $('<span class="radiomarker" for="' + this.name + '"></span>');

		if ($radio.is(':checked')) {
			$marker.addClass('active');
		}

		$marker.on('click', function() {
			$radio.trigger('click');
		});

		$radio.on('change', function() {
			$marker.closest('form').find('.radiomarker[for=' + this.name + ']').removeClass('active');
			$marker.addClass('active');
		}).hide().after($marker);
	});

	$('#product .buipc_BundleSet').on('click', function(e) {
		if (e.target.tagName == 'TD') {
			$(this).find('.radiomarker').click();
		}
	});

	$('#cart').find('input[id^=cart_delete]').each(function() {
		var $checkbox = $(this),
			label = $('label[for=' + $checkbox.attr('id') + ']');
		label.addClass('button');
		$checkbox.hide()
			.on('change', function() {
				$(this).closest('form').submit();
			});
	});

	// select box styling
	$('select').each(function() {
		var mySelect = this,
			$sb = $(this),
			selectedIndex = this.selectedIndex == -1 ? 0 : this.selectedIndex,
			$outer = $('<div class="sb_outer" />'),
			$active = $('<div class="sb_active"><span class="text"></span><span class="sb_arrow icon-down-open"></span></div>'),
			$options = $('<div class="sb_options" />');

		$sb.find('option').each(function() {
			$options.append('<span data-value="' + this.value + '">' + $(this).text() + '</span>');
		});

		$active.on('click', function() {
			$options.toggle();
		}).find('.text').text($options.find('span').eq(selectedIndex).text());

		$options.on('click', 'span', function() {
			var index = $(this).index();
			$active.find('.text').text($(this).text());
			mySelect.selectedIndex = index;
			$sb.trigger('change');

			$options.hide();
		});

		$outer.append($active, $options).insertAfter($sb);

		$sb.hide();
	});

	// global checkbox replacement
	$('form input[type=checkbox]').each(function() {
		var $checkbox = $(this),
			$marker = $('<span class="cbmarker"><i class="icon-ok"></i></span>');

		if (!$checkbox.is(':visible')) {
			return;
		}

		$marker.data('linked', $checkbox);
		//console.log($marker.data('linked').attr('name'));

		if ($checkbox.is(':checked')) {
			$marker.addClass('active');
		}

		$marker.on('click', function(e) {
			$checkbox.trigger('click');
		});

		$checkbox.change(function() {
			$marker.toggleClass('active');
		}).hide().after($marker);
	});

	var timerFlyout = null;
	$('#contact_flyout').hover(function() {
		timerFlyout = clearTimeout(timerFlyout);
		$(this).stop().animate({'margin-left': '0'}, 500);
	}, function() {
		var $flyout = $(this);
		timerFlyout = setTimeout(function() {
			$flyout.stop().animate({'margin-left': '-220px'}, 500);
		}, 2000);
	});

    // tabs
	$('ul.tabs').each(initTabs);

	// show/hide magnifier in product details
	$('#product-images')
		.on('mouseenter', '.mousetrap', function() {
			// resize magnifier to products-description
			if ($('#product-description').length > 0) {
				var mHeight = $('#magnifier').height(),
					pHeight = $('#product-description').height();

				$('#magnifier').css({height: Math.max(mHeight, pHeight) + 'px'});
			}
			$('#magnifier').show();
		}).on('mouseleave', '.mousetrap', function() { $('#magnifier').hide(); });

    // track box clicks and route them to parent radio button
	$('div.box-hover').click( function(e)
    {
		$(this).find("input[type=radio]").click();
	});

	// autosubmit used with xt_payments - shipping_paypal
    $('input[type=radio]').click(function(e){

        if (this.checked != true && $(this).hasClass('autosubmit')){
            this.checked = true;
            this.form.submit();
        }
        e.stopPropagation();
    });

    // track box clicks to show/hide some desc (shipping/payment)
    $('#checkout input[name=selected_shipping], #checkout input[name=selected_payment]').bind("click change",function(e)
	{
		var $name = $(this).closest('[class$=-name]'),
			$desc = $name.next();

		if ($name.length > 0) {
			$name.closest('form').find('[class$=-desc]').hide();
			$desc.show();
		}
	});

    // autosize the comment textarea
    $('#comments').autosize();

//	 $( "#slider-price" ).slider({
//		range: true,
//		min: 0,
//		max: 500,
//		values: [ 75, 300 ],
//		slide: function( event, ui ) {
//			$( "#price_min" ).val(ui.values[ 0 ]);
//			$( "#price_max" ).val(ui.values[ 1 ]);
//		}
//	});
//	$( "#price_min" ).val($( "#slider-price" ).slider( "values", 0 ));
//	$( "#price_max" ).val($( "#slider-price" ).slider( "values", 1 ));

	/** Products Filter Stuff */
	var data = $('form.product_sort').serializeArray();
	for (index in data) {
		if (data[index].name == 'page') {
			data[index].value = 'c2_products_filter_livedata';
		}
	}

	// Replace radio with buttons
	$('.product_sort input[name=sorting]').each(function(index, element) {
		var $input = $(this),
			$label = $('label[for=' + element.id + ']');

		if ($input.is(':checked')) {
			$label.addClass('active');
		}
		$label.data({name: element.name});
		$label.on('click', function() {
			if ($label.hasClass('active')) {
				return;
			}

			// uncheck previous
			$label.closest('form').find('input[name=' + $label.data('name') + ']').prop('checked', false);
			// unmark previous
			$(this).closest('form').find('label[for^=' + $label.data('name') + ']').removeClass('active');
			$(this).addClass('active');
			// trigger submit
			$input.prop('checked', true);
			$input.closest('form').submit();
		}).addClass('button');
		$input.hide();
	});
	$('.product_sort input[name=order]').each(function(index, element) {
		var $input = $(this),
			$label = $('label[for=' + element.id + ']');

		if ($input.prop('checked')) {
			$label.addClass('active');
		}

		$label.data({name: element.name});
		$label.on('click', function() {
			if ($label.hasClass('active')) {
				return;
			}

			// uncheck previous
			$label.closest('form').find('input[name=' + $label.data('name') + ']').prop('checked', false);
			// unmark previous
			$(this).closest('form').find('label[for^=' + $label.data('name') + ']').removeClass('active');
			$(this).addClass('active');
			// trigger submit
			$input.prop('checked', true);
			$input.closest('form').submit();
		}).addClass('button');
		$input.hide();
	});

	// prepare image slider
	var $shopCategories = $('#shop-categories');
	if ($shopCategories.length) {
		var	shopPageSlides = [];
		$('#shop-categories .category .images .inner').each(function(idx, el) {
			var $images = $(el),
				$link = $images.children().eq(0),
				data = {items: [], active: []};
            
			$images.find('img').each(function(imgIdx, imgEl) {
				var $img = $(this),
					$link = $img.parent();

				$link.css({
					'background-image': 'url("' + this.src + '")'
				})
                // add "to product" link
                .prepend("<span>Zum Produkt</span>");
        
				$img.hide();

				if (imgIdx == 0) {
					$link.show();
					data.active.push($link);
				} else {
					$link.hide();
					data.items.push($link);
				}
			});
			shopPageSlides.push(data);
		});

		var groupIndex = 0;
		setInterval(function() {
			var active = shopPageSlides[groupIndex].active.shift(),
				next = shopPageSlides[groupIndex].items.shift();

			active.hide();
			shopPageSlides[groupIndex].items.push(active);
			next.show();
			shopPageSlides[groupIndex].active.push(next);

			groupIndex = (groupIndex + 1) % shopPageSlides.length;
		}, $shopCategories.data('interval'));
	}


	/* hide slider input labels */
	$('.pf_slider').each(function(idx, el) {
		var $slider = $(el);
		$slider.find('label').hide();
	});

	$('.slider').slider({
		step: 20,
		range:true,
		min: 0,
		max: 8000,
		values: [$('#price_min').val() , $('#price_max').val() || 8000],
		slide: function(event, ui) {
			$('#price_min').val(ui.values[0]);
			$('#price_max').val(ui.values[1]);
		},
		create: function(event, ui) {
			$('#price_min').val($(this).slider('values', 0));
			$('#price_max').val($(this).slider('values', 1));
		}
	});
		/* Start - notify maximum chars */
	var $comments = $('#comments');
	$comments.each(function() {
		var $area = $(this),
			$text = $('<span><span class="hits_current">0</span> / <span class="hits_max"></span> Zeichen</span>'),
			maxlength = $area.attr('maxchars') || $area.attr('maxlength');

		// add hit counter text
		if (maxlength != undefined) {
			$text.css({color: '#000000', display: 'block', textAlign: 'right'})
				 .find('.hits_max').text(maxlength).end()
				 .appendTo($area.parent());

			$area.bind('input propertychange', function() {
				if (this.value.length > maxlength) {
					this.value = this.value.substring(0, maxlength);
				}

				$text.find('.hits_current').text(this.value.length);
			});
		}
	});
	/* End - notify maximum chars */

	$('.search_box input[type="text"]').each(function() {
		var input = $(this),
			placeholder = this.title;

		if (this.value == '') {
			this.value = placeholder;
		}
		input.focus(function() {
			if (this.value == placeholder) {
				this.value = '';
			}
		}).blur(function() {
			if (this.value == '') {
				this.value = placeholder;
			}
		});
	});

	if ($('#content-content')) {
		initContentSidebar();
	}
    
    
    var $window = $(window), resizeEvt;
    $window.resize(function() {
        clearTimeout(resizeEvt);
        resizeEvt = setTimeout(function() {
            var ww = $(window).width();
            // adjust size of frontpage adjacent boxes
            if ($('#home-presentation').length > 0) {
                sortHomeboxes();
                // reset set height
                $('#home-presentation .adjustheight').each(function(index, el) {
                    var $box = $(this),
                        $next = $box.next().next(),
                        $prev = $box.prev().prev(),
                        $refbox, ot = $box.offset().top;

                    if ($prev.length > 0 && $prev.offset().top == ot) {
                        $refbox = $prev;
                    } else if ($next.length > 0 && $next.offset().top == ot) {
                        $refbox = $next;
                    }
                    if ($refbox !== undefined) {
                        $box.height($refbox.height());
                        if ($refbox.find('.desc').length > 0) {
                            $box.find('.content').height($refbox.find('.content').height());
                        } else {
                            $box.find('.content').height('auto');
                        }
                    } else {
                        $box.height('auto');
                        $box.find('.content').height('auto');                        
                    }
                });                
            }
            if ($('#product').length > 0) {
                if ($('#product').width() == $('#product-description').width()) {
                    $('#product .ptabs').mCustomScrollbar('destroy');
                    $('#product .ptabs .read-more').show();
                    
                } else {
                    $('#product .ptabs .read-more').hide();
                    $('#product .ptabs').mCustomScrollbar({
                        mouseWheel: {
                            preventDefault: true,
                            deltaFactor: 60
                        }
                    });
                }
            }        
        }, 100);
    });
    $window.resize();

    // tag home boxes
    $('#home-presentation .box').each(function(index, el) {
        $(el).before('<span class="box-anchor" id="box-anchor-' + (index+1) + '" />');
        $(el).data({
            'order-2col': $(el).data('order-2col'),
            'order-3col': index+1
        });
    });
    
    function sortHomeboxes() {
        var resizeTo = '3col',
            home_width = $('#home-presentation').width(),
            order_changed = false,
            curr_width = 0;
    
        if ($('.box.width1_3').width() > $('#home-presentation').width() * 0.4) {
            resizeTo = '2col';
        }
        $('#home-presentation .box').each(function(index, el) {
            var posCurr  = index + 1, // we use 1 based index here
                pos2 = $(el).data('order-2col'),
                pos3 = $(el).data('order-3col'),
                posNew = resizeTo == '2col' ? pos2 : pos3,
                $el = $(el);            
            
            // reorder items if neccessary
            if (posCurr != posNew) {
                $('#box-anchor-' + posNew).after($el);                
            }        
        });
             
        // loop again and check for correct margins
        $('#home-presentation .box').each(function(index, el) {
            var $el = $(el), outerWidth;

            // remove class first, otherwise margin calculations go sour
            $el.removeClass('nmr');

            outerWidth = $el.outerWidth(true);

            curr_width += Math.floor(outerWidth);
            if (curr_width >= home_width) {                    
                $el.addClass('nmr');
                curr_width = 0;
            }              
        });
    }

	function initContentSidebar() {
		var content = $('#content-content'),
			anchors = $('#content-content [data-anchor]'),
			sidebar = $('<div class="content-sidebar" />');

		if (anchors.length == 0) return;

		content
			.find('.textstyles').addClass('clearfix').css({position: 'relative'})
			.wrapInner('<div class="content-main" />')
			.append(sidebar);

		anchors.each(function(index, element) {
			var box = $('#' + $(element).data('anchor')),
				posTop = $(element).position().top;

			if (box.length == 0) return;

			box.appendTo(sidebar).css({position: 'absolute', top: posTop + 'px'});
			console.log($(element).position().top);
		});
	}
    
    


	function adjustImageSize(selector) {
		var container = $(selector), maxwidth, maxheight;

		if (container.length == 0) {
			return;
		}

		maxwidth = $(container).data('widthimg'),
		maxheight = $(container).data('heightimg');

		$(container).find('.product img').each(function(index, element) {
			element.onload = function() {
				var ratio = this.width / this.height,
					newheight, newwidth;
            
                if (this.width > this.height) {
                    $(this).addClass('landscape');
                }

				newheight = maxwidth / ratio;
				if (newheight > maxheight) {
					newheight = maxheight;
					newwidth = ratio * newheight;
				} else {
					newwidth = ratio * element.height;
					newheight = newwidth / ratio;
				}

				if (newwidth > maxwidth) {
					newwidth = maxwidth;
					newheight = newwidth / ratio;
				}
			};
		});
	}

});

$(window).load(function() {
	// addthis
	if ($('.social-media').length > 0) {
		addthis.init();
	}
});

function initTabs() {
	var $tabs = $(this), $active, $content, $links = $(this).find('a');

	$active = $links.first().addClass('active');
	$content = $(this).parent().find($active.attr('rel'));

	$links.not(':first').each(function () {
		$tabs.parent().find($(this).attr('rel')).hide();
	});

	$(this).on('click', 'a', function(e){

		$active.removeClass('active');
		$content.hide();

		$active = $(this);
		$content = $tabs.parent().find($(this).attr('rel'));

		$active.addClass('active');
		$content.show();

		e.preventDefault();
	});
}

// autosizejs - auto resize textarea to fit its content
   (function ($) {
	var defaults = {
		className: 'autosizejs',
		append: '',
		callback: false
	},
	hidden = 'hidden',
	borderBox = 'border-box',
	lineHeight = 'lineHeight',

	// border:0 is unnecessary, but avoids a bug in FireFox on OSX (http://www.jacklmoore.com/autosize#comment-851)
	copy = '<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden;"/>',

	// line-height is conditionally included because IE7/IE8/old Opera do not return the correct value.
	copyStyle = [
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'letterSpacing',
		'textTransform',
		'wordSpacing',
		'textIndent'
	],
	oninput = 'oninput',
	onpropertychange = 'onpropertychange',

	// to keep track which textarea is being mirrored when adjust() is called.
	mirrored,

	// the mirror element, which is used to calculate what size the mirrored element should be.
	mirror = $(copy).data('autosize', true)[0];

	// test that line-height can be accurately copied.
	mirror.style.lineHeight = '99px';
	if ($(mirror).css(lineHeight) === '99px') {
		copyStyle.push(lineHeight);
	}
	mirror.style.lineHeight = '';

	$.fn.autosize = function (options) {
		options = $.extend({}, defaults, options || {});

		if (mirror.parentNode !== document.body) {
			$(document.body).append(mirror);
		}

		return this.each(function () {
			var
			ta = this,
			$ta = $(ta),
			minHeight,
			active,
			resize,
			boxOffset = 0,
			callback = $.isFunction(options.callback);

			if ($ta.data('autosize')) {
				// exit if autosize has already been applied, or if the textarea is the mirror element.
				return;
			}

			if ($ta.css('box-sizing') === borderBox || $ta.css('-moz-box-sizing') === borderBox || $ta.css('-webkit-box-sizing') === borderBox){
				boxOffset = $ta.outerHeight() - $ta.height();
			}

			minHeight = Math.max(parseInt($ta.css('minHeight'), 10) - boxOffset, $ta.height());

			resize = ($ta.css('resize') === 'none' || $ta.css('resize') === 'vertical') ? 'none' : 'horizontal';

			$ta.css({
				overflow: hidden,
				overflowY: hidden,
				wordWrap: 'break-word',
				resize: resize
			}).data('autosize', true);

			function initMirror() {
				mirrored = ta;
				mirror.className = options.className;

				// mirror is a duplicate textarea located off-screen that
				// is automatically updated to contain the same text as the
				// original textarea.  mirror always has a height of 0.
				// This gives a cross-browser supported way getting the actual
				// height of the text, through the scrollTop property.
				$.each(copyStyle, function(i, val){
					mirror.style[val] = $ta.css(val);
				});
			}

			// Using mainly bare JS in this function because it is going
			// to fire very often while typing, and needs to very efficient.
			function adjust() {
				var height, overflow, original;

				if (mirrored !== ta) {
					initMirror();
				}

				// the active flag keeps IE from tripping all over itself.  Otherwise
				// actions in the adjust function will cause IE to call adjust again.
				if (!active) {
					active = true;
					mirror.value = ta.value + options.append;
					mirror.style.overflowY = ta.style.overflowY;
					original = parseInt(ta.style.height,10);

					// Update the width in case the original textarea width has changed
					// A floor of 0 is needed because IE8 returns a negative value for hidden textareas, raising an error.
					mirror.style.width = Math.max($ta.width(), 0) + 'px';

					// The following three lines can be replaced with `height = mirror.scrollHeight` when dropping IE7 support.
					mirror.scrollTop = 0;
					mirror.scrollTop = 9e4;
					height = mirror.scrollTop;

					var maxHeight = parseInt($ta.css('maxHeight'), 10);
					// Opera returns '-1px' when max-height is set to 'none'.
					maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;
					if (height > maxHeight) {
						height = maxHeight;
						overflow = 'scroll';
					} else if (height < minHeight) {
						height = minHeight;
					}
					height += boxOffset;
					ta.style.overflowY = overflow || hidden;

					if (original !== height) {
						ta.style.height = height + 'px';
						if (callback) {
							options.callback.call(ta);
						}
					}

					// This small timeout gives IE a chance to draw it's scrollbar
					// before adjust can be run again (prevents an infinite loop).
					setTimeout(function () {
						active = false;
					}, 1);
				}
			}

			if (onpropertychange in ta) {
				if (oninput in ta) {
					// Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
					// so binding to onkeyup to catch most of those occassions.  There is no way that I
					// know of to detect something like 'cut' in IE9.
					ta[oninput] = ta.onkeyup = adjust;
				} else {
					// IE7 / IE8
					ta[onpropertychange] = adjust;
				}
			} else {
				// Modern Browsers
				ta[oninput] = adjust;
			}

			$(window).resize(function(){
				active = false;
				adjust();
			});

			// Allow for manual triggering if needed.
			$ta.bind('autosize', function(){
				active = false;
				adjust();
			});

			// Call adjust in case the textarea already contains text.
			adjust();
		});
	};
}(window.jQuery || window.Zepto));