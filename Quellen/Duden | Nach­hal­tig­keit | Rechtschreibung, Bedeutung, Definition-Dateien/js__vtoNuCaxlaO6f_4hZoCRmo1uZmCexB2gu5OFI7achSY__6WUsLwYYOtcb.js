/*!
 * jQCloud 2.0.2
 * Copyright 2011 Luca Ongaro (http://www.lucaongaro.eu)
 * Copyright 2013 Daniel White (http://www.developerdan.com)
 * Copyright 20142016 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
/*jshint -W055 *//* non standard constructor name */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'));
  }
  else {
    factory(root.jQuery);
  }
}(this, function($) {
"use strict";

  /*
   * Plugin class
   */
  var jQCloud = function (element, word_array, options) {
    this.$element = $(element);

    this.word_array = word_array || [];
    this.options = options;

    this.sizeGenerator = null;
    this.colorGenerator = null;

    // Data used internally
    this.data = {
      placed_words: [],
      timeouts: {},
      namespace: null,
      step: null,
      angle: null,
      aspect_ratio: null,
      max_weight: null,
      min_weight: null,
      sizes: [],
      colors: []
    };

    this.initialize();
  };

  jQCloud.DEFAULTS = {
    width: 100,
    height: 100,
    center: { x: 0.5, y: 0.5 },
    steps: 10,
    delay: null,
    shape: 'elliptic',
    classPattern: 'w{n}',
    encodeURI: true,
    removeOverflowing: true,
    afterCloudRender: null,
    autoResize: false,
    colors: null,
    fontSize: null,
    template: null
  };

  jQCloud.prototype = {
    initialize: function() {
      // Set/Get dimensions
      if (this.options.width) {
        this.$element.width(this.options.width);
      }
      else {
        this.options.width = this.$element.width();
      }
      if (this.options.height) {
        this.$element.height(this.options.height);
      }
      else {
        this.options.height = this.$element.height();
      }

      // Default options value
      this.options = $.extend(true, {}, jQCloud.DEFAULTS, this.options);

      // Ensure delay
      if (this.options.delay === null) {
        this.options.delay = this.word_array.length > 50 ? 10 : 0;
      }

      // Backward compatibility
      if (this.options.center.x > 1) {
        this.options.center.x = this.options.center.x / this.options.width;
        this.options.center.y = this.options.center.y / this.options.height;
      }

      // Create colorGenerator function from options
      // Direct function
      if (typeof this.options.colors == 'function') {
        this.colorGenerator = this.options.colors;
      }
      // Array of sizes
      else if ($.isArray(this.options.colors)) {
        var cl = this.options.colors.length;
        if (cl > 0) {
          // Fill the sizes array to X items
          if (cl < this.options.steps) {
            for (var i=cl; i<this.options.steps; i++) {
              this.options.colors[i] = this.options.colors[cl-1];
            }
          }

          this.colorGenerator = function(weight) {
            return this.options.colors[this.options.steps - weight];
          };
        }
      }

      // Create sizeGenerator function from options
      // Direct function
      if (typeof this.options.fontSize == 'function') {
        this.sizeGenerator = this.options.fontSize;
      }
      // Object with 'from' and 'to'
      else if ($.isPlainObject(this.options.fontSize)) {
        this.sizeGenerator = function(width, height, weight) {
          var max = width * this.options.fontSize.from,
              min = width * this.options.fontSize.to;
          return Math.round(min + (max - min) * 1.0 / (this.options.steps-1) * (weight - 1)) + 'px';
        };
      }
      // Array of sizes
      else if ($.isArray(this.options.fontSize)) {
        var sl = this.options.fontSize.length;
        if (sl > 0) {
          // Fill the sizes array to X items
          if (sl < this.options.steps) {
            for (var j=sl; j<this.options.steps; j++) {
              this.options.fontSize[j] = this.options.fontSize[sl-1];
            }
          }

          this.sizeGenerator = function(width, height, weight) {
            return this.options.fontSize[this.options.steps - weight];
          };
        }
      }

      this.data.angle = Math.random() * 6.28;
      this.data.step = (this.options.shape === 'rectangular') ? 18.0 : 2.0;
      this.data.aspect_ratio = this.options.width / this.options.height;
      this.clearTimeouts();

      // Namespace word ids to avoid collisions between multiple clouds
      this.data.namespace = (this.$element.attr('id') || Math.floor((Math.random()*1000000)).toString(36)) + '_word_';

      this.$element.addClass('jqcloud');

      // Container's CSS position cannot be 'static'
      if (this.$element.css('position') === 'static') {
        this.$element.css('position', 'relative');
      }

      // Delay execution so that the browser can render the page before the computatively intensive word cloud drawing
      this.createTimeout($.proxy(this.drawWordCloud, this), 10);

      // Attach window resize event
      if (this.options.autoResize) {
        $(window).on('resize', throttle(this.resize, 50, this));
      }
    },

    // Helper function to keep track of timeouts so they can be destroyed
    createTimeout: function(callback, time) {
      var timeout = setTimeout($.proxy(function(){
        delete this.data.timeouts[timeout];
        callback();
      }, this), time);
      this.data.timeouts[timeout] = true;
    },

    // Destroy all timeouts
    clearTimeouts: function() {
      $.each(this.data.timeouts, function(key){
        clearTimeout(key);
      });
      this.data.timeouts = {};
    },

    // Pairwise overlap detection
    overlapping: function(a, b) {
      if (Math.abs(2.0*a.left + a.width - 2.0*b.left - b.width) < a.width + b.width) {
        if (Math.abs(2.0*a.top + a.height - 2.0*b.top - b.height) < a.height + b.height) {
          return true;
        }
      }
      return false;
    },

    // Helper function to test if an element overlaps others
    hitTest: function(elem) {
      // Check elements for overlap one by one, stop and return false as soon as an overlap is found
      for(var i=0, l=this.data.placed_words.length; i<l; i++) {
        if (this.overlapping(elem, this.data.placed_words[i])) {
          return true;
        }
      }
      return false;
    },

    // Initialize the drawing of the whole cloud
    drawWordCloud: function() {
      var i, l;

      this.$element.children('[id^="' + this.data.namespace + '"]').remove();

      if (this.word_array.length === 0) {
        return;
      }

      // Make sure every weight is a number before sorting
      for (i=0, l=this.word_array.length; i<l; i++) {
        this.word_array[i].weight = parseFloat(this.word_array[i].weight, 10);
      }

      // Sort word_array from the word with the highest weight to the one with the lowest
      this.word_array.sort(function(a, b) {
        return b.weight - a.weight;
      });

      // Kepp trace of bounds
      this.data.max_weight = this.word_array[0].weight;
      this.data.min_weight = this.word_array[this.word_array.length - 1].weight;

      // Generate colors
      this.data.colors = [];
      if (this.colorGenerator) {
        for (i=0; i<this.options.steps; i++) {
          this.data.colors.push(this.colorGenerator(i+1));
        }
      }

      // Generate font sizes
      this.data.sizes = [];
      if (this.sizeGenerator) {
        for (i=0; i<this.options.steps; i++) {
          this.data.sizes.push(this.sizeGenerator(this.options.width, this.options.height, i+1));
        }
      }

      // Iterate drawOneWord on every word, immediately or with delay
      if (this.options.delay > 0){
        this.drawOneWordDelayed();
      }
      else {
        for (i=0, l=this.word_array.length; i<l; i++) {
          this.drawOneWord(i, this.word_array[i]);
        }

        if (typeof this.options.afterCloudRender === 'function') {
          this.options.afterCloudRender.call(this.$element);
        }
      }
    },

    // Function to draw a word, by moving it in spiral until it finds a suitable empty place
    drawOneWord: function(index, word) {
      var word_id = this.data.namespace + index,
          word_selector = '#' + word_id,

          // option.shape == 'elliptic'
          angle = this.data.angle,
          radius = 0.0,

          // option.shape == 'rectangular'
          steps_in_direction = 0.0,
          quarter_turns = 0.0,

          weight = Math.floor(this.options.steps / 2),
          word_span,
          word_size,
          word_style;

      // Create word attr object
      word.attr = $.extend({}, word.html, { id: word_id });

      // Linearly map the original weight to a discrete scale from 1 to 10
      // Only if weights are different
      if (this.data.max_weight != this.data.min_weight) {
        weight = Math.round((word.weight - this.data.min_weight) * 1.0 * (this.options.steps-1) / (this.data.max_weight - this.data.min_weight)) + 1;
      }
      word_span = $('<span>').attr(word.attr);

      // Apply class
      if (this.options.classPattern) {
        word_span.addClass(this.options.classPattern.replace('{n}', weight));
      }

      // Apply color
      if (this.data.colors.length) {
        word_span.css('color', this.data.colors[weight-1]);
      }

      // Apply size
      if (this.data.sizes.length) {
        word_span.css('font-size', this.data.sizes[weight-1]);
      }

      //Render using template function if provided.
      if (this.options.template) {
        word_span.html(this.options.template(word));
      } else if (word.link) {
        // Append link if word.link attribute was set
        // If link is a string, then use it as the link href
        if (typeof word.link === 'string') {
          word.link = { href: word.link };
        }

        if (this.options.encodeURI) {
          word.link.href = encodeURI(word.link.href).replace(/'/g, '%27');
        }

        word_span.append($('<a>').attr(word.link).text(word.text));
      }
      else {
        word_span.text(word.text);
      }

      // Bind handlers to words
      if (word.handlers) {
        word_span.on(word.handlers);
      }

      this.$element.append(word_span);

      word_size = {
        width: word_span.outerWidth(),
        height: word_span.outerHeight()
      };
      word_size.left = this.options.center.x*this.options.width - word_size.width / 2.0;
      word_size.top = this.options.center.y*this.options.height - word_size.height / 2.0;

      // Save a reference to the style property, for better performance
      word_style = word_span[0].style;
      word_style.position = 'absolute';
      word_style.left = word_size.left + 'px';
      word_style.top = word_size.top + 'px';

      while(this.hitTest(word_size)) {
        // option shape is 'rectangular' so move the word in a rectangular spiral
        if (this.options.shape === 'rectangular') {
          steps_in_direction++;

          if (steps_in_direction * this.data.step > (1 + Math.floor(quarter_turns / 2.0)) * this.data.step * ((quarter_turns % 4 % 2) === 0 ? 1 : this.data.aspect_ratio)) {
            steps_in_direction = 0.0;
            quarter_turns++;
          }

          switch(quarter_turns % 4) {
            case 1:
              word_size.left += this.data.step * this.data.aspect_ratio + Math.random() * 2.0;
              break;
            case 2:
              word_size.top -= this.data.step + Math.random() * 2.0;
              break;
            case 3:
              word_size.left -= this.data.step * this.data.aspect_ratio + Math.random() * 2.0;
              break;
            case 0:
              word_size.top += this.data.step + Math.random() * 2.0;
              break;
          }
        }
        // Default settings: elliptic spiral shape
        else {
          radius += this.data.step;
          angle += (index % 2 === 0 ? 1 : -1) * this.data.step;

          word_size.left = this.options.center.x*this.options.width - (word_size.width / 2.0) + (radius*Math.cos(angle)) * this.data.aspect_ratio;
          word_size.top = this.options.center.y*this.options.height + radius*Math.sin(angle) - (word_size.height / 2.0);
        }
        word_style.left = word_size.left + 'px';
        word_style.top = word_size.top + 'px';
      }

      // Don't render word if part of it would be outside the container
      if (this.options.removeOverflowing && (
          word_size.left < 0 || word_size.top < 0 ||
          (word_size.left + word_size.width) > this.options.width ||
          (word_size.top + word_size.height) > this.options.height
        )
      ) {
        word_span.remove();
        return;
      }

      // Save position for further usage
      this.data.placed_words.push(word_size);

      if (typeof word.afterWordRender === 'function') {
        word.afterWordRender.call(word_span);
      }
    },

    // Draw one word then recall the function after a delay
    drawOneWordDelayed: function(index) {
      index = index || 0;

      // if not visible then do not attempt to draw
      if (!this.$element.is(':visible')) {
        this.createTimeout($.proxy(function(){
          this.drawOneWordDelayed(index);
        }, this), 10);

        return;
      }

      if (index < this.word_array.length) {
        this.drawOneWord(index, this.word_array[index]);

        this.createTimeout($.proxy(function(){
          this.drawOneWordDelayed(index + 1);
        }, this), this.options.delay);
      }
      else {
        if (typeof this.options.afterCloudRender == 'function') {
          this.options.afterCloudRender.call(this.$element);
        }
      }
    },

    // Destroy any data and objects added by the plugin
    destroy: function() {
      this.clearTimeouts();
      this.$element.removeClass('jqcloud');
      this.$element.removeData('jqcloud');
      this.$element.children('[id^="' + this.data.namespace + '"]').remove();
    },

    // Update the list of words
    update: function(word_array) {
      this.word_array = word_array;
      this.data.placed_words = [];

      this.clearTimeouts();
      this.drawWordCloud();
    },
    
    resize: function() {
      var new_size = {
        width: this.$element.width(),
        height: this.$element.height()
      };

      if (new_size.width != this.options.width || new_size.height != this.options.height) {
        this.options.width = new_size.width;
        this.options.height = new_size.height;
        this.data.aspect_ratio = this.options.width / this.options.height;

        this.update(this.word_array);
      }
    },
  };

  /*
   * Apply throttling to a callback
   * @param callback {function}
   * @param delay {int} milliseconds
   * @param context {object|null}
   * @return {function}
   */
  function throttle(callback, delay, context) {
    var state = {
      pid: null,
      last: 0
    };

    return function() {
      var elapsed = new Date().getTime() - state.last,
          args = arguments,
          that = this;

      function exec() {
        state.last = new Date().getTime();
        return callback.apply(context || that, Array.prototype.slice.call(args));
      }

      if (elapsed > delay) {
        return exec();
      }
      else {
        clearTimeout(state.pid);
        state.pid = setTimeout(exec, delay - elapsed);
      }
    };
  }

  /*
   * jQuery plugin
   */
  $.fn.jQCloud = function(word_array, option) {
    var args = arguments;

    return this.each(function () {
      var $this = $(this),
          data = $this.data('jqcloud');

      if (!data && word_array === 'destroy') {
        // Don't even try to initialize when called with 'destroy'
        return;
      }
      if (!data) {
        var options = typeof option === 'object' ? option : {};
        $this.data('jqcloud', (data = new jQCloud(this, word_array, options)));
      }
      else if (typeof word_array === 'string') {
        data[word_array].apply(data, Array.prototype.slice.call(args, 1));
      }
    });
  };

  $.fn.jQCloud.defaults = {
    set: function(options) {
      $.extend(true, jQCloud.DEFAULTS, options);
    },
    get: function(key) {
      var options = jQCloud.DEFAULTS;
      if (key) {
        options = options[key];
      }
      return $.extend(true, {}, options);
    }
  };
}));
;/**/
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/modules/custom/duden_share/js/duden_share.js. */
(function(e){Drupal.behaviors.share_widget={attach:function(e,i){t(e)}};function t(t){var i=e('.share-widget-trigger',t);i.removeAttr('href').unbind('click').click(function(){return!1});i.hover(function(){e('.share-widget').show()},function(){e('.share-widget').hide()})}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/modules/custom/duden_share/js/duden_share.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/modules/custom/duden_lexem/duden_lexem.js. */
(function(e){var a={};var i=e('<div />',{id:'overlay'});var t=e('<div />',{id:'overlay-inner'});i.append(t);e(function(){a=e('body')});function o(e){t.html(e);a.append(i);i.bind('click',function(e){if(e.target===this){n()}})};function n(){t.empty();i.remove()};Drupal.behaviors.lexemPermalink={attach:function(i,a){var t=e('[href*="node/"][href*="/permalink"]');t.bind('click',function(i){i.preventDefault();var t=e(this).clone(),a=t[0];a.search='';a.pathname+='/ajax';var n=t.attr('href');e.getJSON(n,{},function(i){o(i);var t=e('[type="text"]');if(t[0]){t[0].setSelectionRange(0,t[0].value.length)}})})}};Drupal.behaviors.lexemShare={attach:function(i,a){var t=e('[href="#duden-share"]');t.each(function(){var i=e('<div class="addthis_inline_share_toolbox"></div>');e('body').append(i);e(this).bind('click',function(t){t.preventDefault();var a=e(this),n=a.offset(),r=a.width(),o=a.height();i.css({left:n.left+r/2,top:n.top+o/2});if(i.hasClass('visible')){i.css('opacity',0);window.setTimeout(function(){i.removeClass('visible')},300)}
else{i.addClass('visible');window.setTimeout(function(){i.css('opacity',1)},0)}})})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/modules/custom/duden_lexem/duden_lexem.js. */
/*! perfect-scrollbar - v0.5.9
* http://noraesae.github.com/perfect-scrollbar/
* Copyright (c) 2015 Hyunje Alex Jun; Licensed MIT */
(function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?e(require("jquery")):e(jQuery)})(function(e){"use strict";function t(e){return"string"==typeof e?parseInt(e,10):~~e}var o={wheelSpeed:1,wheelPropagation:!1,swipePropagation:!0,minScrollbarLength:null,maxScrollbarLength:null,useBothWheelAxes:!1,useKeyboard:!0,suppressScrollX:!1,suppressScrollY:!1,scrollXMarginOffset:0,scrollYMarginOffset:0,includePadding:!1},n=0,r=function(){var e=n++;return function(t){var o=".perfect-scrollbar-"+e;return t===void 0?o:t+o}},l="WebkitAppearance"in document.documentElement.style;e.fn.perfectScrollbar=function(n,i){return this.each(function(){function a(e,o){var n=e+o,r=D-R;j=0>n?0:n>r?r:n;var l=t(j*(Y-D)/(D-R));M.scrollTop(l)}function s(e,o){var n=e+o,r=E-k;W=0>n?0:n>r?r:n;var l=t(W*(C-E)/(E-k));M.scrollLeft(l)}function c(e){return P.minScrollbarLength&&(e=Math.max(e,P.minScrollbarLength)),P.maxScrollbarLength&&(e=Math.min(e,P.maxScrollbarLength)),e}function u(){var e={width:I};e.left=B?M.scrollLeft()+E-C:M.scrollLeft(),N?e.bottom=_-M.scrollTop():e.top=Q+M.scrollTop(),H.css(e);var t={top:M.scrollTop(),height:A};Z?t.right=B?C-M.scrollLeft()-V-J.outerWidth():V-M.scrollLeft():t.left=B?M.scrollLeft()+2*E-C-$-J.outerWidth():$+M.scrollLeft(),G.css(t),U.css({left:W,width:k-z}),J.css({top:j,height:R-et})}function p(){M.removeClass("ps-active-x"),M.removeClass("ps-active-y"),E=P.includePadding?M.innerWidth():M.width(),D=P.includePadding?M.innerHeight():M.height(),C=M.prop("scrollWidth"),Y=M.prop("scrollHeight"),!P.suppressScrollX&&C>E+P.scrollXMarginOffset?(X=!0,I=E-F,k=c(t(I*E/C)),W=t(M.scrollLeft()*(I-k)/(C-E))):(X=!1,k=0,W=0,M.scrollLeft(0)),!P.suppressScrollY&&Y>D+P.scrollYMarginOffset?(O=!0,A=D-tt,R=c(t(A*D/Y)),j=t(M.scrollTop()*(A-R)/(Y-D))):(O=!1,R=0,j=0,M.scrollTop(0)),W>=I-k&&(W=I-k),j>=A-R&&(j=A-R),u(),X&&M.addClass("ps-active-x"),O&&M.addClass("ps-active-y")}function d(){var t,o,n=function(e){s(t,e.pageX-o),p(),e.stopPropagation(),e.preventDefault()},r=function(){M.removeClass("ps-in-scrolling"),e(q).unbind(K("mousemove"),n)};U.bind(K("mousedown"),function(l){o=l.pageX,t=U.position().left,M.addClass("ps-in-scrolling"),e(q).bind(K("mousemove"),n),e(q).one(K("mouseup"),r),l.stopPropagation(),l.preventDefault()}),t=o=null}function f(){var t,o,n=function(e){a(t,e.pageY-o),p(),e.stopPropagation(),e.preventDefault()},r=function(){M.removeClass("ps-in-scrolling"),e(q).unbind(K("mousemove"),n)};J.bind(K("mousedown"),function(l){o=l.pageY,t=J.position().top,M.addClass("ps-in-scrolling"),e(q).bind(K("mousemove"),n),e(q).one(K("mouseup"),r),l.stopPropagation(),l.preventDefault()}),t=o=null}function v(e,t){var o=M.scrollTop();if(0===e){if(!O)return!1;if(0===o&&t>0||o>=Y-D&&0>t)return!P.wheelPropagation}var n=M.scrollLeft();if(0===t){if(!X)return!1;if(0===n&&0>e||n>=C-E&&e>0)return!P.wheelPropagation}return!0}function g(e,t){var o=M.scrollTop(),n=M.scrollLeft(),r=Math.abs(e),l=Math.abs(t);if(l>r){if(0>t&&o===Y-D||t>0&&0===o)return!P.swipePropagation}else if(r>l&&(0>e&&n===C-E||e>0&&0===n))return!P.swipePropagation;return!0}function b(){function e(e){var t=e.originalEvent.deltaX,o=-1*e.originalEvent.deltaY;return(t===void 0||o===void 0)&&(t=-1*e.originalEvent.wheelDeltaX/6,o=e.originalEvent.wheelDeltaY/6),e.originalEvent.deltaMode&&1===e.originalEvent.deltaMode&&(t*=10,o*=10),t!==t&&o!==o&&(t=0,o=e.originalEvent.wheelDelta),[t,o]}function t(t){if(l||!(M.find("select:focus").length>0)){var n=e(t),r=n[0],i=n[1];o=!1,P.useBothWheelAxes?O&&!X?(i?M.scrollTop(M.scrollTop()-i*P.wheelSpeed):M.scrollTop(M.scrollTop()+r*P.wheelSpeed),o=!0):X&&!O&&(r?M.scrollLeft(M.scrollLeft()+r*P.wheelSpeed):M.scrollLeft(M.scrollLeft()-i*P.wheelSpeed),o=!0):(M.scrollTop(M.scrollTop()-i*P.wheelSpeed),M.scrollLeft(M.scrollLeft()+r*P.wheelSpeed)),p(),o=o||v(r,i),o&&(t.stopPropagation(),t.preventDefault())}}var o=!1;window.onwheel!==void 0?M.bind(K("wheel"),t):window.onmousewheel!==void 0&&M.bind(K("mousewheel"),t)}function h(){var t=!1;M.bind(K("mouseenter"),function(){t=!0}),M.bind(K("mouseleave"),function(){t=!1});var o=!1;e(q).bind(K("keydown"),function(n){if((!n.isDefaultPrevented||!n.isDefaultPrevented())&&t){var r=document.activeElement?document.activeElement:q.activeElement;if(r){for(;r.shadowRoot;)r=r.shadowRoot.activeElement;if(e(r).is(":input,[contenteditable]"))return}var l=0,i=0;switch(n.which){case 37:l=-30;break;case 38:i=30;break;case 39:l=30;break;case 40:i=-30;break;case 33:i=90;break;case 32:case 34:i=-90;break;case 35:i=n.ctrlKey?-Y:-D;break;case 36:i=n.ctrlKey?M.scrollTop():D;break;default:return}M.scrollTop(M.scrollTop()-i),M.scrollLeft(M.scrollLeft()+l),o=v(l,i),o&&n.preventDefault()}})}function w(){function e(e){e.stopPropagation()}J.bind(K("click"),e),G.bind(K("click"),function(e){var o=t(R/2),n=e.pageY-G.offset().top-o,r=D-R,l=n/r;0>l?l=0:l>1&&(l=1),M.scrollTop((Y-D)*l)}),U.bind(K("click"),e),H.bind(K("click"),function(e){var o=t(k/2),n=e.pageX-H.offset().left-o,r=E-k,l=n/r;0>l?l=0:l>1&&(l=1),M.scrollLeft((C-E)*l)})}function m(){function t(){var e=window.getSelection?window.getSelection():document.getSlection?document.getSlection():{rangeCount:0};return 0===e.rangeCount?null:e.getRangeAt(0).commonAncestorContainer}function o(){r||(r=setInterval(function(){return x()?(M.scrollTop(M.scrollTop()+l.top),M.scrollLeft(M.scrollLeft()+l.left),p(),void 0):(clearInterval(r),void 0)},50))}function n(){r&&(clearInterval(r),r=null),M.removeClass("ps-in-scrolling"),M.removeClass("ps-in-scrolling")}var r=null,l={top:0,left:0},i=!1;e(q).bind(K("selectionchange"),function(){e.contains(M[0],t())?i=!0:(i=!1,n())}),e(window).bind(K("mouseup"),function(){i&&(i=!1,n())}),e(window).bind(K("mousemove"),function(e){if(i){var t={x:e.pageX,y:e.pageY},r=M.offset(),a={left:r.left,right:r.left+M.outerWidth(),top:r.top,bottom:r.top+M.outerHeight()};t.x<a.left+3?(l.left=-5,M.addClass("ps-in-scrolling")):t.x>a.right-3?(l.left=5,M.addClass("ps-in-scrolling")):l.left=0,t.y<a.top+3?(l.top=5>a.top+3-t.y?-5:-20,M.addClass("ps-in-scrolling")):t.y>a.bottom-3?(l.top=5>t.y-a.bottom+3?5:20,M.addClass("ps-in-scrolling")):l.top=0,0===l.top&&0===l.left?n():o()}})}function T(t,o){function n(e,t){M.scrollTop(M.scrollTop()-t),M.scrollLeft(M.scrollLeft()-e),p()}function r(){h=!0}function l(){h=!1}function i(e){return e.originalEvent.targetTouches?e.originalEvent.targetTouches[0]:e.originalEvent}function a(e){var t=e.originalEvent;return t.targetTouches&&1===t.targetTouches.length?!0:t.pointerType&&"mouse"!==t.pointerType&&t.pointerType!==t.MSPOINTER_TYPE_MOUSE?!0:!1}function s(e){if(a(e)){w=!0;var t=i(e);d.pageX=t.pageX,d.pageY=t.pageY,f=(new Date).getTime(),null!==b&&clearInterval(b),e.stopPropagation()}}function c(e){if(!h&&w&&a(e)){var t=i(e),o={pageX:t.pageX,pageY:t.pageY},r=o.pageX-d.pageX,l=o.pageY-d.pageY;n(r,l),d=o;var s=(new Date).getTime(),c=s-f;c>0&&(v.x=r/c,v.y=l/c,f=s),g(r,l)&&(e.stopPropagation(),e.preventDefault())}}function u(){!h&&w&&(w=!1,clearInterval(b),b=setInterval(function(){return x()?.01>Math.abs(v.x)&&.01>Math.abs(v.y)?(clearInterval(b),void 0):(n(30*v.x,30*v.y),v.x*=.8,v.y*=.8,void 0):(clearInterval(b),void 0)},10))}var d={},f=0,v={},b=null,h=!1,w=!1;t&&(e(window).bind(K("touchstart"),r),e(window).bind(K("touchend"),l),M.bind(K("touchstart"),s),M.bind(K("touchmove"),c),M.bind(K("touchend"),u)),o&&(window.PointerEvent?(e(window).bind(K("pointerdown"),r),e(window).bind(K("pointerup"),l),M.bind(K("pointerdown"),s),M.bind(K("pointermove"),c),M.bind(K("pointerup"),u)):window.MSPointerEvent&&(e(window).bind(K("MSPointerDown"),r),e(window).bind(K("MSPointerUp"),l),M.bind(K("MSPointerDown"),s),M.bind(K("MSPointerMove"),c),M.bind(K("MSPointerUp"),u)))}function y(){M.bind(K("scroll"),function(){p()})}function L(){M.unbind(K()),e(window).unbind(K()),e(q).unbind(K()),M.data("perfect-scrollbar",null),M.data("perfect-scrollbar-update",null),M.data("perfect-scrollbar-destroy",null),U.remove(),J.remove(),H.remove(),G.remove(),M=H=G=U=J=X=O=E=D=C=Y=k=W=_=N=Q=R=j=V=Z=$=B=K=null}function S(){p(),y(),d(),f(),w(),m(),b(),(ot||nt)&&T(ot,nt),P.useKeyboard&&h(),M.data("perfect-scrollbar",M),M.data("perfect-scrollbar-update",p),M.data("perfect-scrollbar-destroy",L)}var P=e.extend(!0,{},o),M=e(this),x=function(){return!!M};if("object"==typeof n?e.extend(!0,P,n):i=n,"update"===i)return M.data("perfect-scrollbar-update")&&M.data("perfect-scrollbar-update")(),M;if("destroy"===i)return M.data("perfect-scrollbar-destroy")&&M.data("perfect-scrollbar-destroy")(),M;if(M.data("perfect-scrollbar"))return M.data("perfect-scrollbar");M.addClass("ps-container");var E,D,C,Y,X,k,W,I,O,R,j,A,B="rtl"===M.css("direction"),K=r(),q=this.ownerDocument||document,H=e("<div class='ps-scrollbar-x-rail'>").appendTo(M),U=e("<div class='ps-scrollbar-x'>").appendTo(H),_=t(H.css("bottom")),N=_===_,Q=N?null:t(H.css("top")),z=t(H.css("borderLeftWidth"))+t(H.css("borderRightWidth")),F=t(H.css("marginLeft"))+t(H.css("marginRight")),G=e("<div class='ps-scrollbar-y-rail'>").appendTo(M),J=e("<div class='ps-scrollbar-y'>").appendTo(G),V=t(G.css("right")),Z=V===V,$=Z?null:t(G.css("left")),et=t(G.css("borderTopWidth"))+t(G.css("borderBottomWidth")),tt=t(G.css("marginTop"))+t(G.css("marginBottom")),ot="ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch,nt=null!==window.navigator.msMaxTouchPoints;return S(),M})}});;/**/
﻿/*
 * jQuery scrollintoview() plugin and :scrollable selector filter
 *
 * Version 1.8 (14 Jul 2011)
 * Requires jQuery 1.4 or newer
 *
 * Copyright (c) 2011 Robert Koritnik
 * Licensed under the terms of the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(f){var c={vertical:{x:false,y:true},horizontal:{x:true,y:false},both:{x:true,y:true},x:{x:true,y:false},y:{x:false,y:true}};var b={duration:"fast",direction:"both"};var e=/^(?:html)$/i;var g=function(k,j){j=j||(document.defaultView&&document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(k,null):k.currentStyle);var i=document.defaultView&&document.defaultView.getComputedStyle?true:false;var h={top:(parseFloat(i?j.borderTopWidth:f.css(k,"borderTopWidth"))||0),left:(parseFloat(i?j.borderLeftWidth:f.css(k,"borderLeftWidth"))||0),bottom:(parseFloat(i?j.borderBottomWidth:f.css(k,"borderBottomWidth"))||0),right:(parseFloat(i?j.borderRightWidth:f.css(k,"borderRightWidth"))||0)};return{top:h.top,left:h.left,bottom:h.bottom,right:h.right,vertical:h.top+h.bottom,horizontal:h.left+h.right}};var d=function(h){var j=f(window);var i=e.test(h[0].nodeName);return{border:i?{top:0,left:0,bottom:0,right:0}:g(h[0]),scroll:{top:(i?j:h).scrollTop(),left:(i?j:h).scrollLeft()},scrollbar:{right:i?0:h.innerWidth()-h[0].clientWidth,bottom:i?0:h.innerHeight()-h[0].clientHeight},rect:(function(){var k=h[0].getBoundingClientRect();return{top:i?0:k.top,left:i?0:k.left,bottom:i?h[0].clientHeight:k.bottom,right:i?h[0].clientWidth:k.right}})()}};f.fn.extend({scrollintoview:function(j){j=f.extend({},b,j);j.direction=c[typeof(j.direction)==="string"&&j.direction.toLowerCase()]||c.both;var n="";if(j.direction.x===true){n="horizontal"}if(j.direction.y===true){n=n?"both":"vertical"}var l=this.eq(0);var i=l.closest(":scrollable("+n+")");if(i.length>0){i=i.eq(0);var m={e:d(l),s:d(i)};var h={top:m.e.rect.top-(m.s.rect.top+m.s.border.top),bottom:m.s.rect.bottom-m.s.border.bottom-m.s.scrollbar.bottom-m.e.rect.bottom,left:m.e.rect.left-(m.s.rect.left+m.s.border.left),right:m.s.rect.right-m.s.border.right-m.s.scrollbar.right-m.e.rect.right};var k={};if(j.direction.y===true){if(h.top<0){k.scrollTop=m.s.scroll.top+h.top}else{if(h.top>0&&h.bottom<0){k.scrollTop=m.s.scroll.top+Math.min(h.top,-h.bottom)}}}if(j.direction.x===true){if(h.left<0){k.scrollLeft=m.s.scroll.left+h.left}else{if(h.left>0&&h.right<0){k.scrollLeft=m.s.scroll.left+Math.min(h.left,-h.right)}}}if(!f.isEmptyObject(k)){if(e.test(i[0].nodeName)){i=f("html,body")}i.animate(k,j.duration).eq(0).queue(function(o){f.isFunction(j.complete)&&j.complete.call(i[0]);o()})}else{f.isFunction(j.complete)&&j.complete.call(i[0])}}return this}});var a={auto:true,scroll:true,visible:false,hidden:false};f.extend(f.expr[":"],{scrollable:function(k,i,n,h){var m=c[typeof(n[3])==="string"&&n[3].toLowerCase()]||c.both;var l=(document.defaultView&&document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(k,null):k.currentStyle);var o={x:a[l.overflowX.toLowerCase()]||false,y:a[l.overflowY.toLowerCase()]||false,isRoot:e.test(k.nodeName)};if(!o.x&&!o.y&&!o.isRoot){return false}var j={height:{scroll:k.scrollHeight,client:k.clientHeight},width:{scroll:k.scrollWidth,client:k.clientWidth},scrollableX:function(){return(o.x||o.isRoot)&&this.width.scroll>this.width.client},scrollableY:function(){return(o.y||o.isRoot)&&this.height.scroll>this.height.client}};return m.y&&j.scrollableY()||m.x&&j.scrollableX()}})})(jQuery);
;/**/
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/res/js/jquery-scrollstop/jquery.scrollstop.min.js. */
!function(t){'function'==typeof define&&define.amd?define(['jquery'],t):'object'==typeof exports?module.exports=t(require('jquery')):t(jQuery)}(function(t){var o=t.event.dispatch||t.event.handle,e=t.event.special,l='D'+ +new Date,n='D'+(+new Date+1);e.scrollstart={setup:function(n){var a,i=t.extend({latency:e.scrollstop.latency},n),s=function(t){var n=this,e=arguments;a?clearTimeout(a):(t.type='scrollstart',o.apply(n,e)),a=setTimeout(function(){a=null},i.latency)};t(this).bind('scroll',s).data(l,s)},teardown:function(){t(this).unbind('scroll',t(this).data(l))}},e.scrollstop={latency:250,setup:function(l){var a,i=t.extend({latency:e.scrollstop.latency},l),s=function(t){var n=this,e=arguments;a&&clearTimeout(a),a=setTimeout(function(){a=null,t.type='scrollstop',o.apply(n,e)},i.latency)};t(this).bind('scroll',s).data(n,s)},teardown:function(){t(this).unbind('scroll',t(this).data(n))}}});;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/res/js/jquery-scrollstop/jquery.scrollstop.min.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/res/js/minimalbox.js/minimalbox.js. */
(function(i){var n=0,t=i('<div/>',{'id':'minimalbox'}).append('<!--before--><!--content--><!--after-->');var a=i('<span/>',{'class':'image'}).append('<!--inner_before--><!--inner_content--><!--inner_after-->');var e,o={init:function(o){_this=this;e=i.extend({'controls':{'last':{'label':'Last','visible':!1,'type':'goto','callback':'getLast','condition':'isNotLast','hotkeys':[34]},'next':{'label':'Next','type':'goto','callback':'getNext','condition':'isNotLast','hotkeys':[68,74,39],'region':'after','weight':0},'prev':{'label':'Previous','type':'goto','callback':'getPrev','condition':'isNotFirst','hotkeys':[65,75,37],'region':'before','weight':0},'first':{'label':'First','visible':!1,'type':'goto','callback':'getFirst','condition':'isNotFirst','hotkeys':[33]},'close':{'label':'❌','type':'execute','callback':'destroy','hotkeys':[27,8],'region':'after','weight':0}}},o);this.bind('click',function(){var e=i(this);n=_this.index(e);var o=e.attr('href');_this.minimalbox('construct');_this.minimalbox('putImage',o);_this.minimalbox('addControls',n);t.find('.image').removeClass('new');return!1})},isNotFirst:function(){return n>0},isNotLast:function(){return n<(this.length-1)},getNext:function(){return n+1},getPrev:function(){return n-1},getFirst:function(){return 0},getLast:function(){return this.length-1},removeImage:function(){t.children('img').remove()},destroy:function(){this.minimalbox('eliminate',t,function(){t.children().remove();i('body.has-minimalbox').removeClass('has-minimalbox')})},construct:function(){i('body').addClass('has-minimalbox').append(t)},changeImage:function(e){n=e;this.minimalbox('refreshControls');var o=t.children('.image');if(!o.hasClass('disappearing')){this.minimalbox('putImage',i(this[e]).attr('href'));this.minimalbox('eliminate',o,function(){o.removeClass('new')});t.trigger('minimalboxChange');this.minimalbox('preload','next');this.minimalbox('preload','prev')}},preload:function(i){switch(i){case'next':cond='isNotLast';call='getNext';break;case'prev':cond='isNotFirst';call='getPrev';break};if(this.minimalbox(cond)){var t=new Image;t.src=this[this.minimalbox(call)].link}},addControls:function(n){_this=this;jQuery.each(e.controls,function(o){var n=e.controls[o];if(t.find('.'+o).length==0&&n.visible!=!1){var a=i('<a />',{'class':o}).append(n.label).bind('click',function(){var i=typeof(n.condition)=='undefined'?!0:_this.minimalbox(n.condition);if(i){if(n.type=='goto'){_this.minimalbox('changeImage',_this.minimalbox(n.callback))}
else if(n.type=='execute'){_this.minimalbox(n.callback)}}});t.minimalbox('addToRegion',a,n.region)};if(typeof(n.hotkeys)=='object'){i(document).bind('keydown',function(i){var t=typeof(n.condition)=='undefined'?!0:_this.minimalbox(n.condition);if(n.hotkeys.indexOf(i.which)!=-1&&t){i.preventDefault();if(n.type=='goto'){_this.minimalbox('changeImage',_this.minimalbox(n.callback))}
else if(n.type=='execute'){_this.minimalbox(n.callback)}}})}});_this.minimalbox('refreshControls')},addToRegion:function(t,n){i.each(this.contents(),function(){if(this.nodeType===8&&this.nodeValue===n){i(this).after(t)}})},refreshControls:function(){i.each(e.controls,function(i){var n=e.controls[i],o=typeof(n.condition)=='undefined'?!0:_this.minimalbox(n.condition);elm=t.find('.'+i);if(o){elm.removeClass('disabled')}
else{elm.addClass('disabled')}})},putImage:function(n){var e=this;e.minimalbox('showTrobber');var r=i('<img/>',{'src':n,'class':'new'}).bind('load',function(){e.minimalbox('removeTrobber')});var o=a.clone();o.minimalbox('addToRegion',r,'inner_content');t.minimalbox('addToRegion',o,'content')},showTrobber:function(){t.append(i('<span />',{'class':'throbber'}).append('loading'))},getAnimationDuration:function(i){var n=0,t=0,o=1;durationAttr=i.css('animation-duration');if(typeof(durationAttr)=='string'&&parseFloat(durationAttr)!=0&&n==0){var e=durationAttr.match(/ms/)?1:1000;n=parseFloat(durationAttr)*e};delayAttr=i.css('animation-delay');if(typeof(delayAttr)=='string'&&parseFloat(delayAttr)!=0&&t==0){var e=delayAttr.match(/ms/)?1:1000;t=parseFloat(delayAttr)*e};iterationCountAttr=i.css('animation-iteration-count');if(iterationCountAttr!='infinite'){o=parseInt(iterationCountAttr)}
else{return 0};return(n+t)*o},eliminate:function(i,t){_this=this;i.addClass('disappearing');var n=_this.minimalbox('getAnimationDuration',i);animating=!0;window.setTimeout(function(){i.removeClass('disappearing').remove();if(typeof(t)=='function'){t.call()}},n)},removeTrobber:function(){_this.minimalbox('eliminate',t.children('.throbber'))}};i.fn.minimalbox=function(t){if(o[t]){return o[t].apply(this,Array.prototype.slice.call(arguments,1))}
else if(typeof t==='object'||!t){return o.init.apply(this,arguments)}
else{i.error('Method '+t+' does not exist in minimalbox.js')}};i(function(){i('a[rel=minimalbox]').minimalbox()})})(jQuery);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/res/js/minimalbox.js/minimalbox.js. */
(function(h,o,g){var p=function(){for(var b=/audio(.min)?.js.*/,a=document.getElementsByTagName("script"),c=0,d=a.length;c<d;c++){var e=a[c].getAttribute("src");if(b.test(e))return e.replace(b,"")}}();g[h]={instanceCount:0,instances:{},flashSource:'      <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="$1" width="1" height="1" name="$1" style="position: absolute; left: -1px;">         <param name="movie" value="$2?playerInstance='+h+'.instances[\'$1\']&datetime=$3">         <param name="allowscriptaccess" value="always">         <embed name="$1" src="$2?playerInstance='+
h+'.instances[\'$1\']&datetime=$3" width="1" height="1" allowscriptaccess="always">       </object>',settings:{autoplay:false,loop:false,preload:true,imageLocation:p+"player-graphics.gif",swfLocation:p+"audiojs.swf",useFlash:function(){var b=document.createElement("audio");return!(b.canPlayType&&b.canPlayType("audio/mpeg;").replace(/no/,""))}(),hasFlash:function(){if(navigator.plugins&&navigator.plugins.length&&navigator.plugins["Shockwave Flash"])return true;else if(navigator.mimeTypes&&navigator.mimeTypes.length){var b=
navigator.mimeTypes["application/x-shockwave-flash"];return b&&b.enabledPlugin}else try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash");return true}catch(a){}return false}(),createPlayer:{markup:'          <div class="play-pause">             <p class="play"></p>             <p class="pause"></p>             <p class="loading"></p>             <p class="error"></p>           </div>           <div class="scrubber">             <div class="progress"></div>             <div class="loaded"></div>           </div>           <div class="time">             <em class="played">00:00</em>/<strong class="duration">00:00</strong>           </div>           <div class="error-message"></div>',
playPauseClass:"play-pause",scrubberClass:"scrubber",progressClass:"progress",loaderClass:"loaded",timeClass:"time",durationClass:"duration",playedClass:"played",errorMessageClass:"error-message",playingClass:"playing",loadingClass:"loading",errorClass:"error"},css:'        .audiojs audio { position: absolute; left: -1px; }         .audiojs { width: 460px; height: 36px; background: #404040; overflow: hidden; font-family: monospace; font-size: 12px;           background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #444), color-stop(0.5, #555), color-stop(0.51, #444), color-stop(1, #444));           background-image: -moz-linear-gradient(center top, #444 0%, #555 50%, #444 51%, #444 100%);           -webkit-box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3); -moz-box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3);           -o-box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3); box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3); }         .audiojs .play-pause { width: 25px; height: 40px; padding: 4px 6px; margin: 0px; float: left; overflow: hidden; border-right: 1px solid #000; }         .audiojs p { display: none; width: 25px; height: 40px; margin: 0px; cursor: pointer; }         .audiojs .play { display: block; }         .audiojs .scrubber { position: relative; float: left; width: 280px; background: #5a5a5a; height: 14px; margin: 10px; border-top: 1px solid #3f3f3f; border-left: 0px; border-bottom: 0px; overflow: hidden; }         .audiojs .progress { position: absolute; top: 0px; left: 0px; height: 14px; width: 0px; background: #ccc; z-index: 1;           background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #ccc), color-stop(0.5, #ddd), color-stop(0.51, #ccc), color-stop(1, #ccc));           background-image: -moz-linear-gradient(center top, #ccc 0%, #ddd 50%, #ccc 51%, #ccc 100%); }         .audiojs .loaded { position: absolute; top: 0px; left: 0px; height: 14px; width: 0px; background: #000;           background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #222), color-stop(0.5, #333), color-stop(0.51, #222), color-stop(1, #222));           background-image: -moz-linear-gradient(center top, #222 0%, #333 50%, #222 51%, #222 100%); }         .audiojs .time { float: left; height: 36px; line-height: 36px; margin: 0px 0px 0px 6px; padding: 0px 6px 0px 12px; border-left: 1px solid #000; color: #ddd; text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5); }         .audiojs .time em { padding: 0px 2px 0px 0px; color: #f9f9f9; font-style: normal; }         .audiojs .time strong { padding: 0px 0px 0px 2px; font-weight: normal; }         .audiojs .error-message { float: left; display: none; margin: 0px 10px; height: 36px; width: 400px; overflow: hidden; line-height: 36px; white-space: nowrap; color: #fff;           text-overflow: ellipsis; -o-text-overflow: ellipsis; -icab-text-overflow: ellipsis; -khtml-text-overflow: ellipsis; -moz-text-overflow: ellipsis; -webkit-text-overflow: ellipsis; }         .audiojs .error-message a { color: #eee; text-decoration: none; padding-bottom: 1px; border-bottom: 1px solid #999; white-space: wrap; }                 .audiojs .play { background: url("$1") -2px -1px no-repeat; }         .audiojs .loading { background: url("$1") -2px -31px no-repeat; }         .audiojs .error { background: url("$1") -2px -61px no-repeat; }         .audiojs .pause { background: url("$1") -2px -91px no-repeat; }                 .playing .play, .playing .loading, .playing .error { display: none; }         .playing .pause { display: block; }                 .loading .play, .loading .pause, .loading .error { display: none; }         .loading .loading { display: block; }                 .error .time, .error .play, .error .pause, .error .scrubber, .error .loading { display: none; }         .error .error { display: block; }         .error .play-pause p { cursor: auto; }         .error .error-message { display: block; }',
trackEnded:function(){},flashError:function(){var b=this.settings.createPlayer,a=j(b.errorMessageClass,this.wrapper),c='Missing <a href="http://get.adobe.com/flashplayer/">flash player</a> plugin.';if(this.mp3)c+=' <a href="'+this.mp3+'">Download audio file</a>.';g[h].helpers.removeClass(this.wrapper,b.loadingClass);g[h].helpers.addClass(this.wrapper,b.errorClass);a.innerHTML=c},loadError:function(){var b=this.settings.createPlayer,a=j(b.errorMessageClass,this.wrapper);g[h].helpers.removeClass(this.wrapper,
b.loadingClass);g[h].helpers.addClass(this.wrapper,b.errorClass);a.innerHTML='Error loading: "'+this.mp3+'"'},init:function(){g[h].helpers.addClass(this.wrapper,this.settings.createPlayer.loadingClass)},loadStarted:function(){var b=this.settings.createPlayer,a=j(b.durationClass,this.wrapper),c=Math.floor(this.duration/60),d=Math.floor(this.duration%60);g[h].helpers.removeClass(this.wrapper,b.loadingClass);a.innerHTML=(c<10?"0":"")+c+":"+(d<10?"0":"")+d},loadProgress:function(b){var a=this.settings.createPlayer,
c=j(a.scrubberClass,this.wrapper);j(a.loaderClass,this.wrapper).style.width=c.offsetWidth*b+"px"},playPause:function(){this.playing?this.settings.play():this.settings.pause()},play:function(){g[h].helpers.addClass(this.wrapper,this.settings.createPlayer.playingClass)},pause:function(){g[h].helpers.removeClass(this.wrapper,this.settings.createPlayer.playingClass)},updatePlayhead:function(b){var a=this.settings.createPlayer,c=j(a.scrubberClass,this.wrapper);j(a.progressClass,this.wrapper).style.width=
c.offsetWidth*b+"px";a=j(a.playedClass,this.wrapper);c=this.duration*b;b=Math.floor(c/60);c=Math.floor(c%60);a.innerHTML=(b<10?"0":"")+b+":"+(c<10?"0":"")+c}},create:function(b,a){a=a||{};return b.length?this.createAll(a,b):this.newInstance(b,a)},createAll:function(b,a){var c=a||document.getElementsByTagName("audio"),d=[];b=b||{};for(var e=0,i=c.length;e<i;e++)d.push(this.newInstance(c[e],b));return d},newInstance:function(b,a){var c=this.helpers.clone(this.settings),d="audiojs"+this.instanceCount,
e="audiojs_wrapper"+this.instanceCount;this.instanceCount++;if(b.getAttribute("autoplay")!=null)c.autoplay=true;if(b.getAttribute("loop")!=null)c.loop=true;if(b.getAttribute("preload")=="none")c.preload=false;a&&this.helpers.merge(c,a);if(c.createPlayer.markup)b=this.createPlayer(b,c.createPlayer,e);else b.parentNode.setAttribute("id",e);e=new g[o](b,c);c.css&&this.helpers.injectCss(e,c.css);if(c.useFlash&&c.hasFlash){this.injectFlash(e,d);this.attachFlashEvents(e.wrapper,e)}else c.useFlash&&!c.hasFlash&&
this.settings.flashError.apply(e);if(!c.useFlash||c.useFlash&&c.hasFlash)this.attachEvents(e.wrapper,e);return this.instances[d]=e},createPlayer:function(b,a,c){var d=document.createElement("div"),e=b.cloneNode(true);d.setAttribute("class","audiojs");d.setAttribute("className","audiojs");d.setAttribute("id",c);if(e.outerHTML&&!document.createElement("audio").canPlayType){e=this.helpers.cloneHtml5Node(b);d.innerHTML=a.markup;d.appendChild(e);b.outerHTML=d.outerHTML;d=document.getElementById(c)}else{d.appendChild(e);
d.innerHTML+=a.markup;b.parentNode.replaceChild(d,b)}return d.getElementsByTagName("audio")[0]},attachEvents:function(b,a){if(a.settings.createPlayer){var c=a.settings.createPlayer,d=j(c.playPauseClass,b),e=j(c.scrubberClass,b);g[h].events.addListener(d,"click",function(){a.playPause.apply(a)});g[h].events.addListener(e,"click",function(i){i=i.clientX;var f=this,k=0;if(f.offsetParent){do k+=f.offsetLeft;while(f=f.offsetParent)}a.skipTo((i-k)/e.offsetWidth)});if(!a.settings.useFlash){g[h].events.trackLoadProgress(a);
g[h].events.addListener(a.element,"timeupdate",function(){a.updatePlayhead.apply(a)});g[h].events.addListener(a.element,"ended",function(){a.trackEnded.apply(a)});g[h].events.addListener(a.source,"error",function(){clearInterval(a.readyTimer);clearInterval(a.loadTimer);a.settings.loadError.apply(a)})}}},attachFlashEvents:function(b,a){a.swfReady=false;a.load=function(c){a.mp3=c;a.swfReady&&a.element.load(c)};a.loadProgress=function(c,d){a.loadedPercent=c;a.duration=d;a.settings.loadStarted.apply(a);
a.settings.loadProgress.apply(a,[c])};a.skipTo=function(c){if(!(c>a.loadedPercent)){a.updatePlayhead.call(a,[c]);a.element.skipTo(c)}};a.updatePlayhead=function(c){a.settings.updatePlayhead.apply(a,[c])};a.play=function(){if(!a.settings.preload){a.settings.preload=true;a.element.init(a.mp3)}a.playing=true;a.element.pplay();a.settings.play.apply(a)};a.pause=function(){a.playing=false;a.element.ppause();a.settings.pause.apply(a)};a.setVolume=function(c){a.element.setVolume(c)};a.loadStarted=function(){a.swfReady=
true;a.settings.preload&&a.element.init(a.mp3);a.settings.autoplay&&a.play.apply(a)}},injectFlash:function(b,a){var c=this.flashSource.replace(/\$1/g,a);c=c.replace(/\$2/g,b.settings.swfLocation);c=c.replace(/\$3/g,+new Date+Math.random());var d=b.wrapper.innerHTML,e=document.createElement("div");e.innerHTML=c+d;b.wrapper.innerHTML=e.innerHTML;b.element=this.helpers.getSwf(a)},helpers:{merge:function(b,a){for(attr in a)if(b.hasOwnProperty(attr)||a.hasOwnProperty(attr))b[attr]=a[attr]},clone:function(b){if(b==
null||typeof b!=="object")return b;var a=new b.constructor,c;for(c in b)a[c]=arguments.callee(b[c]);return a},addClass:function(b,a){RegExp("(\\s|^)"+a+"(\\s|$)").test(b.className)||(b.className+=" "+a)},removeClass:function(b,a){b.className=b.className.replace(RegExp("(\\s|^)"+a+"(\\s|$)")," ")},injectCss:function(b,a){for(var c="",d=document.getElementsByTagName("style"),e=a.replace(/\$1/g,b.settings.imageLocation),i=0,f=d.length;i<f;i++){var k=d[i].getAttribute("title");if(k&&~k.indexOf("audiojs")){f=
d[i];if(f.innerHTML===e)return;c=f.innerHTML;break}}d=document.getElementsByTagName("head")[0];i=d.firstChild;f=document.createElement("style");if(d){f.setAttribute("type","text/css");f.setAttribute("title","audiojs");if(f.styleSheet)f.styleSheet.cssText=c+e;else f.appendChild(document.createTextNode(c+e));i?d.insertBefore(f,i):d.appendChild(styleElement)}},cloneHtml5Node:function(b){var a=document.createDocumentFragment(),c=a.createElement?a:document;c.createElement("audio");c=c.createElement("div");
a.appendChild(c);c.innerHTML=b.outerHTML;return c.firstChild},getSwf:function(b){b=document[b]||window[b];return b.length>1?b[b.length-1]:b}},events:{memoryLeaking:false,listeners:[],addListener:function(b,a,c){if(b.addEventListener)b.addEventListener(a,c,false);else if(b.attachEvent){this.listeners.push(b);if(!this.memoryLeaking){window.attachEvent("onunload",function(){if(this.listeners)for(var d=0,e=this.listeners.length;d<e;d++)g[h].events.purge(this.listeners[d])});this.memoryLeaking=true}b.attachEvent("on"+
a,function(){c.call(b,window.event)})}},trackLoadProgress:function(b){if(b.settings.preload){var a,c;b=b;var d=/(ipod|iphone|ipad)/i.test(navigator.userAgent);a=setInterval(function(){if(b.element.readyState>-1)d||b.init.apply(b);if(b.element.readyState>1){b.settings.autoplay&&b.play.apply(b);clearInterval(a);c=setInterval(function(){b.loadProgress.apply(b);b.loadedPercent>=1&&clearInterval(c)})}},10);b.readyTimer=a;b.loadTimer=c}},purge:function(b){var a=b.attributes,c;if(a)for(c=0;c<a.length;c+=
1)if(typeof b[a[c].name]==="function")b[a[c].name]=null;if(a=b.childNodes)for(c=0;c<a.length;c+=1)purge(b.childNodes[c])},ready:function(){return function(b){var a=window,c=false,d=true,e=a.document,i=e.documentElement,f=e.addEventListener?"addEventListener":"attachEvent",k=e.addEventListener?"removeEventListener":"detachEvent",n=e.addEventListener?"":"on",m=function(l){if(!(l.type=="readystatechange"&&e.readyState!="complete")){(l.type=="load"?a:e)[k](n+l.type,m,false);if(!c&&(c=true))b.call(a,l.type||
l)}},q=function(){try{i.doScroll("left")}catch(l){setTimeout(q,50);return}m("poll")};if(e.readyState=="complete")b.call(a,"lazy");else{if(e.createEventObject&&i.doScroll){try{d=!a.frameElement}catch(r){}d&&q()}e[f](n+"DOMContentLoaded",m,false);e[f](n+"readystatechange",m,false);a[f](n+"load",m,false)}}}()}};g[o]=function(b,a){this.element=b;this.wrapper=b.parentNode;this.source=b.getElementsByTagName("source")[0]||b;this.mp3=function(c){var d=c.getElementsByTagName("source")[0];return c.getAttribute("src")||
(d?d.getAttribute("src"):null)}(b);this.settings=a;this.loadStartedCalled=false;this.loadedPercent=0;this.duration=1;this.playing=false};g[o].prototype={updatePlayhead:function(){this.settings.updatePlayhead.apply(this,[this.element.currentTime/this.duration])},skipTo:function(b){if(!(b>this.loadedPercent)){this.element.currentTime=this.duration*b;this.updatePlayhead()}},load:function(b){this.loadStartedCalled=false;this.source.setAttribute("src",b);this.element.load();this.mp3=b;g[h].events.trackLoadProgress(this)},
loadError:function(){this.settings.loadError.apply(this)},init:function(){this.settings.init.apply(this)},loadStarted:function(){if(!this.element.duration)return false;this.duration=this.element.duration;this.updatePlayhead();this.settings.loadStarted.apply(this)},loadProgress:function(){if(this.element.buffered!=null&&this.element.buffered.length){if(!this.loadStartedCalled)this.loadStartedCalled=this.loadStarted();this.loadedPercent=this.element.buffered.end(this.element.buffered.length-1)/this.duration;
this.settings.loadProgress.apply(this,[this.loadedPercent])}},playPause:function(){this.playing?this.pause():this.play()},play:function(){/(ipod|iphone|ipad)/i.test(navigator.userAgent)&&this.element.readyState==0&&this.init.apply(this);if(!this.settings.preload){this.settings.preload=true;this.element.setAttribute("preload","auto");g[h].events.trackLoadProgress(this)}this.playing=true;this.element.play();this.settings.play.apply(this)},pause:function(){this.playing=false;this.element.pause();this.settings.pause.apply(this)},
setVolume:function(b){this.element.volume=b},trackEnded:function(){this.skipTo.apply(this,[0]);this.settings.loop||this.pause.apply(this);this.settings.trackEnded.apply(this)}};var j=function(b,a){var c=[];a=a||document;if(a.getElementsByClassName)c=a.getElementsByClassName(b);else{var d,e,i=a.getElementsByTagName("*"),f=RegExp("(^|\\s)"+b+"(\\s|$)");d=0;for(e=i.length;d<e;d++)f.test(i[d].className)&&c.push(i[d])}return c.length>1?c:c[0]}})("audiojs","audiojsInstance",this);
;/**/
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/res/polyfill/stickyfill/dist/stickyfill.js. */
(function(e,i){var t=[],r,f=!1,X=e.documentElement,z=function(){},R,T='hidden',a='visibilitychange';if(e.webkitHidden!==undefined){T='webkitHidden';a='webkitvisibilitychange'};if(!i.getComputedStyle){O()};var E=['','-webkit-','-moz-','-ms-'],k=document.createElement('div');for(var p=E.length-1;p>=0;p--){try{k.style.position=E[p]+'sticky'}catch(I){};if(k.style.position!=''){O()}};d();function O(){l=x=n=s=c=H=z};function P(t,e){for(var i in e){if(e.hasOwnProperty(i)){t[i]=e[i]}}};function o(t){return parseFloat(t)||0};function d(){r={top:i.pageYOffset,left:i.pageXOffset}};function W(){if(i.pageXOffset!=r.left){d();n();return};if(i.pageYOffset!=r.top){d();S()}};function C(t){setTimeout(function(){if(i.pageYOffset!=r.top){r.top=i.pageYOffset;S()}},0)};function S(){for(var e=t.length-1;e>=0;e--){B(t[e])}};function B(t){if(!t.inited)return;var e=(r.top<=t.limit.start?0:r.top>=t.limit.end?2:1);if(t.mode!=e){j(t,e)}};function Y(){for(var e=t.length-1;e>=0;e--){if(!t[e].inited)continue;var o=Math.abs(u(t[e].clone)-t[e].docOffsetTop),i=Math.abs(t[e].parent.node.offsetHeight-t[e].parent.height);if(o>=2||i>=2)return!1};return!0};function F(t){if(isNaN(parseFloat(t.computed.top))||t.isCell||t.computed.display=='none')return;t.inited=!0;if(!t.clone)M(t);if(t.parent.computed.position!='absolute'&&t.parent.computed.position!='relative')t.parent.node.style.position='relative';B(t);t.parent.height=t.parent.node.offsetHeight;t.docOffsetTop=u(t.clone)};function y(e){var o=!0;e.clone&&Q(e);P(e.node.style,e.css);for(var i=t.length-1;i>=0;i--){if(t[i].node!==e.node&&t[i].parent.node===e.parent.node){o=!1;break}};if(o)e.parent.node.style.position=e.parent.css.position;e.mode=-1};function g(){for(var e=t.length-1;e>=0;e--){F(t[e])}};function h(){for(var e=t.length-1;e>=0;e--){y(t[e])}};function j(t,i){var e=t.node.style;switch(i){case 0:e.position='absolute';e.left=t.offset.left+'px';e.right=t.offset.right+'px';e.top=(t.offset.top-9)+'px';e.bottom='auto';e.width='auto';e.marginLeft=0;e.marginRight=0;e.marginTop=0;break;case 1:e.position='fixed';e.left=t.box.left+'px';e.right=t.box.right+'px';e.top=t.css.top;e.bottom='auto';e.width='auto';e.marginLeft=0;e.marginRight=0;e.marginTop=0;break;case 2:e.position='absolute';e.left=t.offset.left+'px';e.right=t.offset.right+'px';e.top='auto';e.bottom=0;e.width='auto';e.marginLeft=0;e.marginRight=0;break};t.mode=i};function M(t){t.clone=document.createElement('div');var i=t.node.nextSibling||t.node,e=t.clone.style;e.height=t.height+'px';e.width=t.width+'px';e.padding=e.border=e.borderSpacing=0;e.fontSize='1em';e.position='static';e.cssFloat=t.computed.cssFloat;t.node.parentNode.insertBefore(t.clone,i)};function Q(t){t.clone.parentNode.removeChild(t.clone);t.clone=undefined};function L(t){var e=getComputedStyle(t),f=t.parentNode,n=getComputedStyle(f),s=t.style.position;t.style.position='relative';var c={top:e.top,marginTop:e.marginTop,marginBottom:e.marginBottom,marginLeft:e.marginLeft,marginRight:e.marginRight,cssFloat:e.cssFloat,display:e.display},d={top:o(e.top),marginBottom:o(e.marginBottom),paddingLeft:o(e.paddingLeft),paddingRight:o(e.paddingRight),borderLeftWidth:o(e.borderLeftWidth),borderRightWidth:o(e.borderRightWidth)};t.style.position=s;var l={position:t.style.position,top:t.style.top,bottom:t.style.bottom,left:t.style.left,right:t.style.right,width:t.style.width,marginTop:t.style.marginTop,marginLeft:t.style.marginLeft,marginRight:t.style.marginRight},i=w(t),a=w(f),r={node:f,css:{position:f.style.position},computed:{position:n.position},numeric:{borderLeftWidth:o(n.borderLeftWidth),borderRightWidth:o(n.borderRightWidth),borderTopWidth:o(n.borderTopWidth),borderBottomWidth:o(n.borderBottomWidth)}},p={node:t,box:{left:i.win.left,right:X.clientWidth-i.win.right},offset:{top:i.win.top-a.win.top-r.numeric.borderTopWidth,left:i.win.left-a.win.left-r.numeric.borderLeftWidth,right:-i.win.right+a.win.right-r.numeric.borderRightWidth},css:l,isCell:e.display=='table-cell',computed:c,numeric:d,width:i.win.right-i.win.left,height:i.win.bottom-i.win.top,mode:-1,inited:!1,parent:r,limit:{start:i.doc.top-d.top,end:a.doc.top+f.offsetHeight-r.numeric.borderBottomWidth-t.offsetHeight-d.top-d.marginBottom}};return p};function u(t){var e=0;while(t){e+=t.offsetTop;t=t.offsetParent};return e};function w(t){var e=t.getBoundingClientRect();return{doc:{top:e.top+i.pageYOffset,left:e.left+i.pageXOffset},win:e}};function b(){R=setInterval(function(){!Y()&&n()},500)};function m(){clearInterval(R)};function v(){if(!f)return;if(document[T]){m()}
else{b()}};function l(){if(f)return;d();g();i.addEventListener('scroll',W);i.addEventListener('wheel',C);i.addEventListener('resize',n);i.addEventListener('orientationchange',n);e.addEventListener(a,v);b();f=!0};function n(){if(!f)return;h();for(var e=t.length-1;e>=0;e--){t[e]=L(t[e].node)};g()};function s(){i.removeEventListener('scroll',W);i.removeEventListener('wheel',C);i.removeEventListener('resize',n);i.removeEventListener('orientationchange',n);e.removeEventListener(a,v);m();f=!1};function c(){s();h()};function H(){c();while(t.length){t.pop()}};function x(e){for(var i=t.length-1;i>=0;i--){if(t[i].node===e)return};var o=L(e);t.push(o);if(!f){l()}
else{F(o)}};function N(e){for(var i=t.length-1;i>=0;i--){if(t[i].node===e){y(t[i]);t.splice(i,1)}}};i.Stickyfill={stickies:t,add:x,remove:N,init:l,rebuild:n,pause:s,stop:c,kill:H}})(document,window);if(window.jQuery){(function(t){t.fn.Stickyfill=function(t){this.each(function(){Stickyfill.add(this)});return this}})(window.jQuery)};;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/res/polyfill/stickyfill/dist/stickyfill.js. */
/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&la(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==oa?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ma.length;){if(c=ma[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return ua++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:xa?M:ya?P:wa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Ea&&d-e===0,g=b&(Ga|Ha)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=ra(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=qa(j.x)>qa(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};b.eventType!==Ea&&f.eventType!==Ga||(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Ha&&(i>Da||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=qa(l.x)>qa(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:pa(a.pointers[c].clientX),clientY:pa(a.pointers[c].clientY)},c++;return{timeStamp:ra(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:pa(a[0].clientX),y:pa(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:pa(c/b),y:pa(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ia:qa(a)>=qa(b)?0>a?Ja:Ka:0>b?La:Ma}function H(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Ra)+I(a[1],a[0],Ra)}function K(a,b){return H(b[0],b[1],Ra)/H(a[0],a[1],Ra)}function L(){this.evEl=Ta,this.evWin=Ua,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Xa,this.evWin=Ya,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=$a,this.evWin=_a,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ga|Ha)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=bb,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Ea|Fa)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Ea)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ga|Ha)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a),this.primaryTouch=null,this.lastTouches=[]}function S(a,b){a&Ea?(this.primaryTouch=b.changedPointers[0].identifier,T.call(this,b)):a&(Ga|Ha)&&T.call(this,b)}function T(a){var b=a.changedPointers[0];if(b.identifier===this.primaryTouch){var c={x:b.clientX,y:b.clientY};this.lastTouches.push(c);var d=this.lastTouches,e=function(){var a=d.indexOf(c);a>-1&&d.splice(a,1)};setTimeout(e,cb)}}function U(a){for(var b=a.srcEvent.clientX,c=a.srcEvent.clientY,d=0;d<this.lastTouches.length;d++){var e=this.lastTouches[d],f=Math.abs(b-e.x),g=Math.abs(c-e.y);if(db>=f&&db>=g)return!0}return!1}function V(a,b){this.manager=a,this.set(b)}function W(a){if(p(a,jb))return jb;var b=p(a,kb),c=p(a,lb);return b&&c?jb:b||c?b?kb:lb:p(a,ib)?ib:hb}function X(){if(!fb)return!1;var b={},c=a.CSS&&a.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(d){b[d]=c?a.CSS.supports("touch-action",d):!0}),b}function Y(a){this.options=la({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=nb,this.simultaneous={},this.requireFail=[]}function Z(a){return a&sb?"cancel":a&qb?"end":a&pb?"move":a&ob?"start":""}function $(a){return a==Ma?"down":a==La?"up":a==Ja?"left":a==Ka?"right":""}function _(a,b){var c=b.manager;return c?c.get(a):a}function aa(){Y.apply(this,arguments)}function ba(){aa.apply(this,arguments),this.pX=null,this.pY=null}function ca(){aa.apply(this,arguments)}function da(){Y.apply(this,arguments),this._timer=null,this._input=null}function ea(){aa.apply(this,arguments)}function fa(){aa.apply(this,arguments)}function ga(){Y.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function ha(a,b){return b=b||{},b.recognizers=l(b.recognizers,ha.defaults.preset),new ia(a,b)}function ia(a,b){this.options=la({},ha.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=a,this.input=y(this),this.touchAction=new V(this,this.options.touchAction),ja(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function ja(a,b){var c=a.element;if(c.style){var d;g(a.options.cssProps,function(e,f){d=u(c.style,f),b?(a.oldCssProps[d]=c.style[d],c.style[d]=e):c.style[d]=a.oldCssProps[d]||""}),b||(a.oldCssProps={})}}function ka(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var la,ma=["","webkit","Moz","MS","ms","o"],na=b.createElement("div"),oa="function",pa=Math.round,qa=Math.abs,ra=Date.now;la="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var sa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),ta=h(function(a,b){return sa(a,b,!0)},"merge","Use `assign`."),ua=1,va=/mobile|tablet|ip(ad|hone|od)|android/i,wa="ontouchstart"in a,xa=u(a,"PointerEvent")!==d,ya=wa&&va.test(navigator.userAgent),za="touch",Aa="pen",Ba="mouse",Ca="kinect",Da=25,Ea=1,Fa=2,Ga=4,Ha=8,Ia=1,Ja=2,Ka=4,La=8,Ma=16,Na=Ja|Ka,Oa=La|Ma,Pa=Na|Oa,Qa=["x","y"],Ra=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Sa={mousedown:Ea,mousemove:Fa,mouseup:Ga},Ta="mousedown",Ua="mousemove mouseup";i(L,x,{handler:function(a){var b=Sa[a.type];b&Ea&&0===a.button&&(this.pressed=!0),b&Fa&&1!==a.which&&(b=Ga),this.pressed&&(b&Ga&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:Ba,srcEvent:a}))}});var Va={pointerdown:Ea,pointermove:Fa,pointerup:Ga,pointercancel:Ha,pointerout:Ha},Wa={2:za,3:Aa,4:Ba,5:Ca},Xa="pointerdown",Ya="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Xa="MSPointerDown",Ya="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Va[d],f=Wa[a.pointerType]||a.pointerType,g=f==za,h=r(b,a.pointerId,"pointerId");e&Ea&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ga|Ha)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Za={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},$a="touchstart",_a="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Za[a.type];if(b===Ea&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ga|Ha)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}}});var ab={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},bb="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=ab[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}});var cb=2500,db=25;i(R,x,{handler:function(a,b,c){var d=c.pointerType==za,e=c.pointerType==Ba;if(!(e&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(d)S.call(this,b,c);else if(e&&U.call(this,c))return;this.callback(a,b,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var eb=u(na.style,"touchAction"),fb=eb!==d,gb="compute",hb="auto",ib="manipulation",jb="none",kb="pan-x",lb="pan-y",mb=X();V.prototype={set:function(a){a==gb&&(a=this.compute()),fb&&this.manager.element.style&&mb[a]&&(this.manager.element.style[eb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),W(a.join(" "))},preventDefaults:function(a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,jb)&&!mb[jb],f=p(d,lb)&&!mb[lb],g=p(d,kb)&&!mb[kb];if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}return g&&f?void 0:e||f&&c&Na||g&&c&Oa?this.preventSrc(b):void 0},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var nb=1,ob=2,pb=4,qb=8,rb=qb,sb=16,tb=32;Y.prototype={defaults:{},set:function(a){return la(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=_(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=_(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=_(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=_(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;qb>d&&b(c.options.event+Z(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=qb&&b(c.options.event+Z(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=tb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(tb|nb)))return!1;a++}return!0},recognize:function(a){var b=la({},a);return k(this.options.enable,[this,b])?(this.state&(rb|sb|tb)&&(this.state=nb),this.state=this.process(b),void(this.state&(ob|pb|qb|sb)&&this.tryEmit(b))):(this.reset(),void(this.state=tb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(aa,Y,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(ob|pb),e=this.attrTest(a);return d&&(c&Ha||!e)?b|sb:d||e?c&Ga?b|qb:b&ob?b|pb:ob:tb}}),i(ba,aa,{defaults:{event:"pan",threshold:10,pointers:1,direction:Pa},getTouchAction:function(){var a=this.options.direction,b=[];return a&Na&&b.push(lb),a&Oa&&b.push(kb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Na?(e=0===f?Ia:0>f?Ja:Ka,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ia:0>g?La:Ma,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return aa.prototype.attrTest.call(this,a)&&(this.state&ob||!(this.state&ob)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=$(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i(ca,aa,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&ob)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(da,Y,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[hb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ga|Ha)&&!f)this.reset();else if(a.eventType&Ea)this.reset(),this._timer=e(function(){this.state=rb,this.tryEmit()},b.time,this);else if(a.eventType&Ga)return rb;return tb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===rb&&(a&&a.eventType&Ga?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=ra(),this.manager.emit(this.options.event,this._input)))}}),i(ea,aa,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&ob)}}),i(fa,aa,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Na|Oa,pointers:1},getTouchAction:function(){return ba.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Na|Oa)?b=a.overallVelocity:c&Na?b=a.overallVelocityX:c&Oa&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&qa(b)>this.options.velocity&&a.eventType&Ga},emit:function(a){var b=$(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ga,Y,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[ib]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Ea&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ga)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=rb,this.tryEmit()},b.interval,this),ob):rb}return tb},failTimeout:function(){return this._timer=e(function(){this.state=tb},this.options.interval,this),tb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==rb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),ha.VERSION="2.0.8",ha.defaults={domEvents:!1,touchAction:gb,enable:!0,inputTarget:null,inputClass:null,preset:[[ea,{enable:!1}],[ca,{enable:!1},["rotate"]],[fa,{direction:Na}],[ba,{direction:Na},["swipe"]],[ga],[ga,{event:"doubletap",taps:2},["tap"]],[da]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var ub=1,vb=2;ia.prototype={set:function(a){return la(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?vb:ub},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&rb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===vb||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(ob|pb|qb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof Y)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){if(a!==d&&b!==d){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this}},off:function(a,b){if(a!==d){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this}},emit:function(a,b){this.options.domEvents&&ka(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&ja(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},la(ha,{INPUT_START:Ea,INPUT_MOVE:Fa,INPUT_END:Ga,INPUT_CANCEL:Ha,STATE_POSSIBLE:nb,STATE_BEGAN:ob,STATE_CHANGED:pb,STATE_ENDED:qb,STATE_RECOGNIZED:rb,STATE_CANCELLED:sb,STATE_FAILED:tb,DIRECTION_NONE:Ia,DIRECTION_LEFT:Ja,DIRECTION_RIGHT:Ka,DIRECTION_UP:La,DIRECTION_DOWN:Ma,DIRECTION_HORIZONTAL:Na,DIRECTION_VERTICAL:Oa,DIRECTION_ALL:Pa,Manager:ia,Input:x,TouchAction:V,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:Y,AttrRecognizer:aa,Tap:ga,Pan:ba,Swipe:fa,Pinch:ca,Rotate:ea,Press:da,on:m,off:n,each:g,merge:ta,extend:sa,assign:la,inherit:i,bindFn:j,prefixed:u});var wb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};wb.Hammer=ha,"function"==typeof define&&define.amd?define(function(){return ha}):"undefined"!=typeof module&&module.exports?module.exports=ha:a[c]=ha}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.js.map;/**/
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/common.js. */
(function(){var t;t=(function(t){var i,e,r,n;e=t.createElement('details');r=void 0;n=void 0;i=void 0;if(!('open' in e)){return!1};n=t.body||(function(){var e;e=t.documentElement;r=!0;return e.insertBefore(t.createElement('body'),e.firstElementChild||e.firstChild)})();e.innerHTML='<summary>a</summary>b';e.style.display='block';n.appendChild(e);i=e.offsetHeight;e.open=!0;i=i!==e.offsetHeight;n.removeChild(e);if(r){n.parentNode.removeChild(n)};return i})(document);(function(e){Drupal.behaviors.details={attach:function(n,i){if(!t){return e('details',n).once('details-polyfill',function(){var t,n,i;n=e(this);i=n.children('summary');t=e('<div />',{'class':'details-content'});i.siblings().appendTo(t);n.append(t).addClass('open');return i.bind('click',function(){t.toggle();return n.toggleClass('open')}).trigger('click')})}}};Drupal.behaviors.cutOffs={attach:function(t,n){return e('.cut-off',t).once('cut-off',function(){var n,t;t=e(this);t.addClass('cutted-off');n=e('<p />',{'class':'uncutt'}).html(Drupal.t('Continue reading'));t.after(n);return n.bind('click',function(e){e.preventDefault();n.hide();return t.removeClass('cutted-off')})})}};return Drupal.behaviors.sticky={attach:function(t,i){var n;n=e('.block-sticky');return n.once('sticky',function(){var t;t=e(this);return t.Stickyfill()})}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/common.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/smooth-scroll.js. */
(function(){(function(t){return t(function(){return t('a[href*=#]:not([href=#])').click(function(o){var a,e,i,h,n;h=t(this);i=h.parents('.ui-tabs-nav').length>0;if(!i&&(location.pathname.replace(/^\//,'')===this.pathname.replace(/^\//,'')&&location.hostname===this.hostname)){e=this.hash;n=t(e);n=n.length?n:t('[name='+this.hash.slice(1)+']');if(n.length){a={scrollTop:n.offset().top};t('html,body').animate(a,1000,function(){return location.hash=e});return o.preventDefault()}}})})})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/smooth-scroll.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/tabs.js. */
(function(){(function(t){return Drupal.behaviors.tabs={attach:function(a,r){var n;n=t('div.tabs');return n.once('tabs',function(){var n;n=t(this);return n.tabs()})}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/tabs.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/accordion.js. */
(function(){(function(r){return Drupal.behaviors.accordion={attach:function(c,i){var n;n=r('.accordion');return n.once('accordion',function(){var i,c,n;i=r(this);n=0;c=0;i.children('div').each(function(){var o,i;i=r(this);o=i.find('.error');if(o.length){c=n;!1};return n++});return i.accordion({autoHeight:!1,active:c,collapsible:!0})})}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/accordion.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/tag-clouds.js. */
(function(){(function(t){t.fn.on=function(t,n){this.bind(t,function(){n.apply(this,arguments)});return this};return Drupal.behaviors.tagClouds={attach:function(n,a){var e;e=t('.tag-cloud');return e.once('tag-cloud',function(){var u,i,n,r,a,e;n=t(this);i=n.find('a');u=n.children('.lemma');e=[];i.each(function(){var n,a;n=t(this);a={text:n.html()===null?'':n.html().replace(/\u00AD/g,'').replace(/&shy;/g,''),weight:parseInt(n.attr('data-weight')),link:n.attr('href')};return e.push(a)});r={text:u.html(),weight:13};e.push(r);n.empty();a={delay:50,height:300,autoResize:!0};return n.jQCloud(e,a)})}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/tag-clouds.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/same-height.js. */
(function(){(function(e){var t;t=function(e){var i,t;t=parseInt(e.css('padding-bottom'));i=parseInt(e.css('padding-top'));return t+i};return Drupal.behaviors.sameHeight={attach:function(i,h){var r,n,o,s;s=' .slideshow-vertical, .teasers, #playground, .sub-menu, nav.tabs, .row';n=e.browser.msie&&e.browser.version<9;o=e(s,i);r=e(window);r.trigger('resize');return o.once('same-height',function(){var o,i,s;i=e(this).children();s=e(this).find('.teaser > .title');if(s.length>0){i=i.add(s)};if(i.length>1){o=e('img',i);r.bind('resize',function(){var r;i.css({'min-height':0});r={};i.each(function(){var s,u,a,i,h,o;s=e(this);if(s.is(':visible')){o=s.outerHeight();u=s.css('box-sizing');a=u==='border-box';if(n&&a){o+=t(s)};h=this.getBoundingClientRect();i=h.top.toString();if(typeof r[i]==='undefined'){r[i]={borderBox:a,amount:0,height:0,top:h.top,elements:[]}};r[i].height=Math.max(r[i].height,o);r[i].amount++;return r[i].elements.push(s)}});return e.each(r,function(r,i){if(i.amount>1&&i.height>0){return e.each(i.elements,function(e,r){var s;s=i.height;if(n&&i.borderBox){s-=t(r)};return r.css({'min-height':s})})}})});r.trigger('resize');return o.bind('load error',function(){return r.trigger('resize')})}
else{return i.css({'min-height':0})}})}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/same-height.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/one-line-form.js. */
(function(){(function(r){Drupal.behaviors.oneLineForms={attach:function(e,n){var t;t=r('.one-line-form .radios',e);return t.once('custom-radios',function(){var n,t,e;e=r(this);n=r('.form-autocomplete');n.bind('focus',function(){return e.removeClass('open')});t=e.children('label');return t.bind('click',function(r){return e.toggleClass('open')})})}};return r(function(){var e,n,t;t=r('.one-line-form [data-short-placeholder]');e=r(window);n=500;if(t.length>0){t.each(function(){var o,a,i;o=r(this);a=o.attr('placeholder');i=o.attr('data-short-placeholder');return e.bind('resize',function(){t.attr('data-long-placeholder',a);if(n>=e.width()){return o.attr('placeholder',i)}
else{return o.attr('placeholder',a)}})})};return e.trigger('resize')})})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/one-line-form.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/slideshow.js. */
(function(){(function(e){Drupal.behaviors.slideshow={attach:function(t,n){var r;r=e('.slideshow');return r.once('slideshow',function(){var t,o,r,s,l,n,i,a;t=e(this);r=e('.links > li',t);o=e('.slide',t);r.bind('mouseenter touchstart',function(n){var s,i,a;if(n.type!=='mouseenter'){n.preventDefault();n.stopPropagation()};i=e(this);a=e('.to-slide',i).attr('href');s=e(a,t);o.hide();s.show();r.removeClass('active');return i.addClass('active')});if(!t.hasClass('slideshow-horizontal ')){r.each(function(t){var i,r,n;r=e(this);n=e('.to-full',r).attr('href');i=e('<a />').addClass('tab-link').attr('href',n);return r.append(i)})};o.each(function(){var s,r,a,i,n;r=e(this);n=r.attr('id');a=e('[href="#'+n+'"]',t);i=a.siblings('.to-full').attr('href');s=e('<a />').attr('href',i).addClass('slide-link');return r.append(s)});r.first().trigger('mouseenter');i=!1;n=function(e){var t,n;if(e==null){e='next'};if(!i){t=r.filter('.active');n=t.length<1?r.first():e==='next'?t.is(':last-child')?t.siblings(':first-child'):t.next():t.is(':first-child')?t.siblings(':last-child'):t.prev();n.trigger('mouseenter');return i=!1}};s=setInterval(n,5000);a=function(){clearInterval(s);return s=setInterval(n,5000)};l=new Hammer(t[0]);l.on('swipeleft',function(){n();return a()}).on('swiperight',function(){n('prev');return a()});t.mouseenter(function(e){return i=!0});t.mouseleave(function(e){return i=!1})})}};return Drupal.behaviors.horizontalScroll={attach:function(t,i){var r,n;n=e(window);r=e('.block > .teasers',t);return r.once('horizontal-scroll',function(){var r,t;t=e(this);r=t.parent();return n.bind('resize',function(){var i,s,a,o,n;if(t.is(':scrollable')){r.addClass('has-footer');i=e('<nav />',{'class':'block-footer teaser-pager'});a=t.children('.teaser:not(.intro)');n=0;a.each(function(){var t,r;r=e(this);n++;t=e('<a>'+n+'</a>');t.bind('click',function(){return r.scrollintoview()});return i.append(t)});s=i.children();o=function(e){var t,r;t=e.getBoundingClientRect().left;r=e.getBoundingClientRect().right;n=-1;a.each(function(){var e;n++;e=this.getBoundingClientRect().left;if((e-t)>=0){return!1}});return n};t.bind('scroll',function(e){var t;t=o(this);s.removeClass('active');return s.eq(t).addClass('active')}).trigger('scroll');return i.appendTo(r)}
else{r.removeClass('has-footer');return r.children('.block-footer').remove()}}).trigger('resize')})}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/slideshow.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/main-menu.js. */
(function(){(function(e){return Drupal.behaviors.mainMenu={attach:function(n,a){var s,u,t,i,r;i=e('.deeper-levels',n);i.once('submenu-open',function(){var a,s,u,r,t,i;a=e(this);t=e('.submenu-open ',this);r=e([]);t.each(function(){var t,n;n=e(this).attr('id');t=e('[for="'+n+'"]');return r=r.add(t)});t.bind('change',function(){var t,n;n=e(this).attr('id');t=e('[for="'+n+'"]');r.removeClass('active');return t.addClass('active')});t.first().trigger('change');s=a.prev('.menu');u=e('.submenu-handle + a',s);u.bind('mouseover',function(){var t,r,n;t=e(this);n=t.prev().attr('for');e('#'+n).attr('checked','checked').trigger('change');if(e.browser.msie&&e.browser.version<9){r=e('#'+n);r.siblings('.menu').removeClass('visible');return r.next('.menu').addClass('visible')}});i=e('.sub-menu > .menu > li',n);return i.once('menu-teaser',function(){var n,t,r;n=e(this);r=n.children('.menu-teaser');t=n.parent().parent();if(r.length>0){return n.bind('mouseover',function(){t.children('.menu-teaser').remove();return t.append(r)})}})});if(document.createElement('detect').style.transition!==''){s=e('#header-top > .menu > li');r=500;u={display:'none'};t={display:'block'};return s.each(function(){var i,n;i=e(this);n=i.children('.sub-menu');n.css({dislay:'none',opacity:1,visibility:'visible'});i.mouseenter(function(){var e;e=function(){return n.css(t)};return setTimeout(e,r)});n.hide();return i.mouseleave(function(){var e;e=function(){return n.css(u)};return setTimeout(e,r)})})}}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/main-menu.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/footer.js. */
(function(){(function(n){return Drupal.behaviors.footer={attach:function(l,o){var e;e=n('.footer-region',l);return e.once('footer-regions',function(){var l,o,c,s,r,i,t;l=n(this);s=l.children('.menu');c=l.children('.icons');o=l.children('h3, h4');t=s.length>0;r=o.length>0;i=c.length>0;if(t&&r){l.addClass('collapsible').addClass('collapsed');o.bind('click',function(){e.not(l).trigger('collapse');return l.toggleClass('collapsed')});l.bind('collapse',function(){return l.addClass('collapsed')})};if(i&&r){return o.addClass('icons-prefix')}})}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/footer.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/audio.js. */
(function(){(function(r){Drupal.behaviors.audioSamples={attach:function(n,t){var e,a;a=r('a.audio');e=r('body');return a.once('audio',function(){var n;n=r(this);return n.bind('click',function(t){var a,u;t.preventDefault();n.html('🔊');u=n.attr('href');a=r('<audio />',{src:u});e.prepend(a);a[0].play();return a.bind('ended',function(){a.remove();return n.html('🔉')})})})}};Drupal.behaviors.audio={attach:function(n,a){var e;if(r.browser.msie&&parseInt(r.browser.version,10)===9){e=r('audio',n);return e.once('audio',function(){var r;r=this;return r.load()})}}};return audiojs.events.ready(function(){var as;return as=audiojs.createAll({css:!1})})})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/audio.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/image-zoom.js. */
(function(){(function(e){Drupal.behaviors.imageZoom={attach:function(r,t){return e('.zoomable',r).once('zoomable',function(){var r;r=e(this);return r.minimalbox()})}};return Drupal.behaviors.BookPreview={attach:function(r,t){return e('[href^="#preview"]',r).once('book-preview',function(){var a,l,s,t,i,o,r,n;l=e('body');o=e(this);r=e(o.attr('href'));t={};r.addClass('pages-preview').show();n=e('<div />',{'id':'pages-preview-wrapper'}).hide();r.children().bind('focus',function(){var o,a,i,n;t=e(this);n=t.width();a=r.width();o=t.offset();i=r.scrollLeft();return r.animate({scrollLeft:i+o.left-a/2+n/2})});r.scroll(function(){var e;if(r.scrollLeft()===0){a.addClass('hidden')}
else{a.removeClass('hidden')};e=1;if(r.scrollLeft()+r.width()+e>=r[0].scrollWidth){i.addClass('hidden')}
else{i.removeClass('hidden')}});s=e('<span />',{'id':'pages-preview-close'}).html('❌').bind('click',function(){return n.hide()});i=e('<span />',{'id':'pages-preview-forward'}).html('→').bind('click',function(e){var r;e.preventDefault();r=t.next();if(r.length>0){return r.focus()}
else{return t.focus()}});a=e('<span />',{'id':'pages-preview-backward'}).html('←').bind('click',function(e){var r;e.preventDefault();r=t.prev();if(r.length>0){return r.focus()}
else{return t.focus()}});n.append(r).append(s).append(i).append(a);n.appendTo(l);return o.bind('click',function(){var t;t=r.find('a');t.each(function(){var i,r,n,t;r=e(this);n=r.attr('href').replace('%3F','?');t=r.text();i=e('<img />').attr('src',n).attr('title',t);return r.parent().append(i).end().remove()});n.show();r.children().attr({'tabIndex':''}).first().focus();return r.trigger('scroll')})})}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/image-zoom.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/tiles.js. */
(function(){(function(t){return Drupal.behaviors.linkTiles={attach:function(r,i){var n,e;n=t('.block',r);e=t([]);return n.each(function(){var r,n;n=t(this);r=n.find('> .pseudo-button-wrapper > .pseudo-button');if(r.length===1){return n.once('link-tiles',function(){var i,e,n;e=t(this);n=r.attr('href');i=t('<a />').addClass('tile-link').attr('href',n);if(n!=='#preview'){return e.append(i)}})}})}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/tiles.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/tableheader.js. */
(function(){(function(e){Drupal.behaviors.tableHeader={attach:function(i,t){if(!e.support.positionFixed){return};e('table.sticky-enabled:not(.flexible-table)',i).once('tableheader',function(){e(this).data('drupal-tableheader',new Drupal.tableHeader(this))})}};Drupal.tableHeader=function(t){var i;i=this;this.originalTable=e(t);this.originalHeader=e(t).children('thead');this.originalHeaderCells=this.originalHeader.find('> tr > th');this.displayWeight=null;this.originalTable.bind('columnschange',function(e,t){i.widthCalculated=i.displayWeight!==null&&i.displayWeight===t;i.displayWeight=t});this.stickyTable=e('<table class="sticky-header"/>').insertBefore(this.originalTable).css({position:'fixed',top:'0px'});this.stickyHeader=this.originalHeader.clone(!0).hide().appendTo(this.stickyTable);this.stickyHeaderCells=this.stickyHeader.find('> tr > th');this.originalTable.addClass('sticky-table');e(window).bind('scroll.drupal-tableheader',e.proxy(this,'eventhandlerRecalculateStickyHeader')).bind('resize.drupal-tableheader',{calculateWidth:!0},e.proxy(this,'eventhandlerRecalculateStickyHeader')).bind('drupalDisplaceAnchor.drupal-tableheader',function(){window.scrollBy(0,-i.stickyTable.outerHeight())}).bind('drupalDisplaceFocus.drupal-tableheader',function(e){if(i.stickyVisible&&e.clientY<i.stickyOffsetTop+i.stickyTable.outerHeight()&&e.$target.closest('sticky-header').length===0){window.scrollBy(0,-i.stickyTable.outerHeight())}}).triggerHandler('resize.drupal-tableheader');this.stickyHeader.show()};Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader=function(i){var n,t,h,l,a,c,s,o,u,r,d;u=this;h=i.data&&i.data.calculateWidth;this.stickyOffsetTop=Drupal.settings.tableHeaderOffset?eval(Drupal.settings.tableHeaderOffset+'()'):0;this.stickyTable.css('top',this.stickyOffsetTop+'px');d=document.documentElement.scrollHeight||document.body.scrollHeight;if(h||this.viewHeight!==d){this.viewHeight=d;this.vPosition=this.originalTable.offset().top-4-this.stickyOffsetTop;this.hPosition=this.originalTable.offset().left;this.vLength=this.originalTable[0].clientHeight-100;h=!0};c=document.documentElement.scrollLeft||document.body.scrollLeft;r=(document.documentElement.scrollTop||document.body.scrollTop)-this.vPosition;this.stickyVisible=r>0&&r<this.vLength;this.stickyTable.css({left:-c+this.hPosition+'px',visibility:this.stickyVisible?'visible':'hidden'});if(this.stickyVisible&&(h||!this.widthCalculated)){this.widthCalculated=!0;t=null;n=null;a=null;l=null;s=0;o=this.originalHeaderCells.length;while(s<o){t=e(this.originalHeaderCells[s]);n=this.stickyHeaderCells.eq(t.index());a=t.css('display');if(a!=='none'){l=t.css('width');if(l==='auto'){l=t[0].clientWidth+'px'};n.css({'width':l,'display':a})}
else{n.css('display','none')};s+=1};this.stickyTable.css('width',this.originalTable.outerWidth())}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/tableheader.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/dropdown.js. */
(function(){(function(n){return Drupal.behaviors.dropDown={attach:function(o,t){var r;r=n('.dropdown');return r.once('dropdown',function(){var t,o,r;r=n(this);o=r.children('.drop');t=r.children('.down');return o.click(function(){return r.toggleClass('open')})})}}})(jQuery)}).call(this);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/asterisk/static/js/dropdown.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/modules/custom/search_duden/autocomplete_patch.js. */
;jQuery(document).ready(function(e){Drupal.jsAC.prototype.onkeydown=function(t,i){if(!i){i=window.event};switch(i.keyCode){case 13:this.action=e(this.popup).find('.selected').data('autocompleteAction');return!0;case 40:this.selectDown();return!1;case 38:this.selectUp();return!1;default:return!0}};Drupal.jsAC.prototype.selectDown=function(){if(this.selected&&this.selected.nextSibling){if(e(this.selected.nextSibling).data('autocompleteValue')){this.highlight(this.selected.nextSibling)}
else{this.highlight(this.selected.nextSibling.nextSibling)}}
else if(this.popup){var t=e('li',this.popup);if(t.length>0){this.highlight(t.get(0))}}};Drupal.jsAC.prototype.selectUp=function(){if(this.selected&&this.selected.previousSibling){if(e(this.selected.previousSibling).data('autocompleteValue')){this.highlight(this.selected.previousSibling)}
else{this.highlight(this.selected.previousSibling.previousSibling)}}};Drupal.jsAC.prototype.onkeyup=function(e,t){if(!t){t=window.event};switch(t.keyCode){case 16:case 17:case 18:case 20:case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:return!0;case 13:if(this.action){window.location=this.action;return!1}
else{this.input.form.submit();return!0};case 9:case 27:this.hidePopup(t.keyCode);return!0;default:if(e.value.length>0&&!e.readOnly){this.populatePopup()}
else{this.hidePopup(t.keyCode)};return!0}};Drupal.jsAC.prototype.highlight=function(t){if(this.selected){e(this.selected).removeClass('selected')};e(t).addClass('selected');this.selected=t;e(this.ariaLive).html(e(this.selected).html());this.input.value=e(t).data('autocompleteValue')};Drupal.jsAC.prototype.found=function(t){if(!this.input.value.length){return!1};var s=e('<ul></ul>'),p=this,c='',o='';for(key_combo in t){var i=t[key_combo].result;o=t[key_combo].count;for(k in i){var a=i[k].key,l=i[k].label,u=i[k].action,h=i[k].ignore;if(!h){var n=e('<li class="'+key_combo+'"></li>').html(l).mousedown(function(){p.select(this)}).mouseover(function(){p.highlight(this)}).mouseout(function(){p.unhighlight(this)}).data('autocompleteValue',a).appendTo(s)}
else{var n=e('<li class="'+key_combo+'"></li>').html('<strong>'+l+'</strong>').appendTo(s)};if(u){n.data('autocompleteAction',u)}}};if(this.popup){if(s.children().length){e(this.popup).empty().append(s);if(o){e(this.popup).append(e('<div class="count">'+o+' </div>'))};e(this.popup).show();e(this.ariaLive).html(Drupal.t('Autocomplete popup'))}
else{e(this.popup).css({visibility:'hidden'});this.hidePopup()}}};Drupal.jsAC.prototype.populatePopup=function(){var t=e(this.input),i=t.position();if(this.popup){e(this.popup).remove()};this.selected=!1;this.popup=e('<div id="autocomplete"></div>')[0];this.popup.owner=this;t.before(this.popup);this.db.owner=this;this.db.search(this.input.value)};e.ajaxSetup({beforeSend:function(e,t){t.error=function(e,t,i){}}})});(function(e){Drupal.autocompleteSubmit=function(){e('#autocomplete').each(function(){this.owner.hidePopup()}).length==0}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/modules/custom/search_duden/autocomplete_patch.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/modules/custom/search_duden/focus.js. */
;jQuery(document).ready(function(t){var e=function(){var e=navigator.userAgent.toLowerCase();return/(iphone|ipod|ipad).* os 8_/.test(e)};if(document.URL.search(/#\w+/)==-1&&!e){t('#edit-q').focus()}});;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/modules/custom/search_duden/focus.js. */
