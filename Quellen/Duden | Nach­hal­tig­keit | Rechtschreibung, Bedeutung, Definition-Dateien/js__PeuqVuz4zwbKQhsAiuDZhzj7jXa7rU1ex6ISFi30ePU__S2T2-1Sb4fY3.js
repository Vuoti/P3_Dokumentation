/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/themes/dudende/js/jump.js. */
;jQuery(document).ready(function(e){e('.jump_to_top').append('<a href="#top">Nach oben</a>');e('.helpref').each(function(){e(this).append(' <a href="../hilfe/'+e(this).attr('class').substring(26)+'"></a>')})});;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/themes/dudende/js/jump.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/modules/custom/duden_misc/js/cta_sprachberatung.js. */
(function(n){Drupal.behaviors.duden_google_analytics={attach:function(c,a){n('#sprachberatung_cta').click(function(){t()})}};function t(){if(typeof ga=='function'){ga('send','event','Button','click','Klick auf Sprachberatungs-Button im Header')}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/modules/custom/duden_misc/js/cta_sprachberatung.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/misc/autocomplete.js. */
(function(t){Drupal.behaviors.autocomplete={attach:function(e,s){var i=[];t('input.autocomplete',e).once('autocomplete',function(){var e=this.value;if(!i[e]){i[e]=new Drupal.ACDB(e)};var s=t('#'+this.id.substr(0,this.id.length-13)).attr('autocomplete','OFF').attr('aria-autocomplete','list');t(s[0].form).submit(Drupal.autocompleteSubmit);s.parent().attr('role','application').append(t('<span class="element-invisible" aria-live="assertive"></span>').attr('id',s.attr('id')+'-autocomplete-aria-live'));new Drupal.jsAC(s,i[e])})}};Drupal.autocompleteSubmit=function(){return t('#autocomplete').each(function(){this.owner.hidePopup()}).length==0};Drupal.jsAC=function(e,s){var i=this;this.input=e[0];this.ariaLive=t('#'+this.input.id+'-autocomplete-aria-live');this.db=s;e.keydown(function(t){return i.onkeydown(this,t)}).keyup(function(t){i.onkeyup(this,t)}).blur(function(){i.hidePopup();i.db.cancel()})};Drupal.jsAC.prototype.onkeydown=function(t,e){if(!e){e=window.event};switch(e.keyCode){case 40:this.selectDown();return!1;case 38:this.selectUp();return!1;default:return!0}};Drupal.jsAC.prototype.onkeyup=function(t,e){if(!e){e=window.event};switch(e.keyCode){case 16:case 17:case 18:case 20:case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:return!0;case 9:case 13:case 27:this.hidePopup(e.keyCode);return!0;default:if(t.value.length>0&&!t.readOnly){this.populatePopup()}
else{this.hidePopup(e.keyCode)};return!0}};Drupal.jsAC.prototype.select=function(e){this.input.value=t(e).data('autocompleteValue');t(this.input).trigger('autocompleteSelect',[e])};Drupal.jsAC.prototype.selectDown=function(){if(this.selected&&this.selected.nextSibling){this.highlight(this.selected.nextSibling)}
else if(this.popup){var e=t('li',this.popup);if(e.length>0){this.highlight(e.get(0))}}};Drupal.jsAC.prototype.selectUp=function(){if(this.selected&&this.selected.previousSibling){this.highlight(this.selected.previousSibling)}};Drupal.jsAC.prototype.highlight=function(e){if(this.selected){t(this.selected).removeClass('selected')};t(e).addClass('selected');this.selected=e;t(this.ariaLive).html(t(this.selected).html())};Drupal.jsAC.prototype.unhighlight=function(e){t(e).removeClass('selected');this.selected=!1;t(this.ariaLive).empty()};Drupal.jsAC.prototype.hidePopup=function(e){if(this.selected&&((e&&e!=46&&e!=8&&e!=27)||!e)){this.select(this.selected)};var i=this.popup;if(i){this.popup=null;t(i).fadeOut('fast',function(){t(i).remove()})};this.selected=!1;t(this.ariaLive).empty()};Drupal.jsAC.prototype.populatePopup=function(){var e=t(this.input),i=e.position();if(this.popup){t(this.popup).remove()};this.selected=!1;this.popup=t('<div id="autocomplete"></div>')[0];this.popup.owner=this;t(this.popup).css({top:parseInt(i.top+this.input.offsetHeight,10)+'px',left:parseInt(i.left,10)+'px',width:e.innerWidth()+'px',display:'none'});e.before(this.popup);this.db.owner=this;this.db.search(this.input.value)};Drupal.jsAC.prototype.found=function(e){if(!this.input.value.length){return!1};var s=t('<ul></ul>'),i=this;for(key in e){t('<li></li>').html(t('<div></div>').html(e[key])).mousedown(function(){i.hidePopup(this)}).mouseover(function(){i.highlight(this)}).mouseout(function(){i.unhighlight(this)}).data('autocompleteValue',key).appendTo(s)};if(this.popup){if(s.children().length){t(this.popup).empty().append(s).show();t(this.ariaLive).html(Drupal.t('Autocomplete popup'))}
else{t(this.popup).css({visibility:'hidden'});this.hidePopup()}}};Drupal.jsAC.prototype.setStatus=function(e){switch(e){case'begin':t(this.input).addClass('throbbing');t(this.ariaLive).html(Drupal.t('Searching for matches...'));break;case'cancel':case'error':case'found':t(this.input).removeClass('throbbing');break}};Drupal.ACDB=function(t){this.uri=t;this.delay=300;this.cache={}};Drupal.ACDB.prototype.search=function(e){var i=this;this.searchString=e;e=e.replace(/^\s+|\.{2,}\/|\s+$/g,'');if(e.length<=0||e.charAt(e.length-1)==','){return};if(this.cache[e]){return this.owner.found(this.cache[e])};if(this.timer){clearTimeout(this.timer)};this.timer=setTimeout(function(){i.owner.setStatus('begin');t.ajax({type:'GET',url:i.uri+'/'+Drupal.encodePath(e),dataType:'json',success:function(t){if(typeof t.status=='undefined'||t.status!=0){i.cache[e]=t;if(i.searchString==e){i.owner.found(t)};i.owner.setStatus('found')}},error:function(t){alert(Drupal.ajaxError(t,i.uri))}})},this.delay)};Drupal.ACDB.prototype.cancel=function(){if(this.owner)this.owner.setStatus('cancel');if(this.timer)clearTimeout(this.timer);this.searchString=''}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/misc/autocomplete.js. */
/* Source and licensing information for the line(s) below can be found at http://www.duden.de/sites/all/modules/custom/duden_ads/duden_epoq/epoq.js. */
(function(e){var c=e(window);function o(n,t,o,a){var c=Drupal.settings.epoq_templates,p=c.teaser_template,r=a,s=a.data('epoq');if(s in c){var r=e(c[s]);r=i(r,o,p);a.append(r)}
else{i(a,o,p)};e('a',a).each(function(){this.href=this.href+'?eqrecqid='+t});a.children().unwrap()};function r(e){var i=[];i['Buch']='1F4D6';i['Buch + CD']='1F4D6-1F4BF';i['Hörbuch']='1F3A7';i['E-Book (EPUB)']='epub';i['E-Book (PDF)']='pdf';i['E-Book']='e-book';i['Software']='1F4BF';i['Software-Download']='2913';return'<span class="icon"><svg height="26" width="26" title="'+e+'" aria-label="Produkt ist verfügbar als '+e+'"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#'+i[e]+'"></use></svg></span>'};function i(i,n,o){var a='';e(n).each(function(e,n){var t=this,i=o;i=i.replace(/###name###/g,t['@name']);i=i.replace(/###img_src###/g,t['@image_link']);i=i.replace(/###price###/g,t['@price'].toString().replace('.',','));i=i.replace(/###link###/g,t['@link']);i=i.replace(/###product_type###/g,r(t['@custom1']));a+=i});var t=e(a);e('[src=""]',t).remove();if(i.is('epoq-content')){i=t}
else{e('epoq-content',i).replaceWith(t)};return i};function a(){var c=e(window),a={};e('[data-epoq-id]').each(function(){var i=e(this),n=i.parents('section');a[i.data('epoq-id')]=i});if(t(a)){var i=[];e.each(a,function(e,n){i.push(n.data('epoq'))});var i=i.join(';'),r={tenantId:'duden',rules:i,locakey:'de',fields:'brand,category,custom1',success:function(i){var t=i['recommendations'];if(typeof(t['domain'])!='undefined'){if(!(t['domain']instanceof Array)){var r=[];r[0]=t['domain'];t['domain']=r};e.each(t['domain'],function(t,i){var r=null,c=null,f=i['@rules'];e.each(a,function(e,i){if(i.data('epoq')==f){r=i;c=r.parents('section')}});if(!!r&&typeof(i['items'])!='undefined'){var d=[];for(var s=0;s<i['items'].item.length;s++){d[s]=i['items'].item[s]['@id']};var u=i.recommendationId['$'];if(!(i['items']['item']instanceof Array)){var p=[];p[0]=i['items']['item'];i['items']['item']=p};o(d,u,i['items']['item'],r);n(i['items']['item'],'epoq feed');if(!!c){Drupal.attachBehaviors(c.parent());c.fadeIn(500)}}})};c.trigger('resize')}}};if(typeof epoq_productId!='undefined'){r.productId=epoq_productId};epoq.go(r)};function n(i,n){n=n||'slider';e(i).each(function(i,e){var t='';if(e['@category']!=''){t=e['@category'].split(',')[0]};ga('ec:addImpression',{'id':e['@id'],'name':e['@name'],'price':e['@price'],'brand':e['@brand'],'category':t,'position':i+1,'list':n})});ga('send','event','karussell','impression','epoq product impression',{nonInteraction:!0})};function t(e){var n=0,i;for(i in e){if(e.hasOwnProperty(i))n++};return n};e(function(){a()})})(jQuery);;
/* Source and licensing information for the above line(s) can be found at http://www.duden.de/sites/all/modules/custom/duden_ads/duden_epoq/epoq.js. */
