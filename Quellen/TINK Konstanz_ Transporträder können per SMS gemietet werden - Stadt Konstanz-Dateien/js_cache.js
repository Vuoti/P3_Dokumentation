
 //~ =======  ::Datei:: javascripts/SEITENBAU.js ========
/*
  Create Seitenbau-Namespace
*/
if (typeof top.SEITENBAU === 'undefined' || !top.SEITENBAU) {
  top.SEITENBAU = {};
}
if (typeof SEITENBAU === 'undefined' || !SEITENBAU) {
  var SEITENBAU = top.SEITENBAU;
}
/**
 * Create jQuery-UI Datepicker
 */
if (typeof SEITENBAU.fnc === 'undefined' || !SEITENBAU.fnc) {
  SEITENBAU.fnc = {};
}

/**
  * wurde die SEITENBAU.js bereits geladen
  */
if( typeof SEITENBAU.loaded === 'undefined' || SEITENBAU.loaded !== true  )
{
  /**
   * SEITENBAU.js als geladen setzen
   */
  SEITENBAU.loaded = true;


  /**
   * Registry-Tool
   *
   * Internal Registry-Tool
   */
  SEITENBAU.registry = function() {
    var sbReg = {};
    var defaultReg = 'defaultRegistry';

    var searchKey = function(regValue, regObj, caseInsensitive) {
      if(typeof regObj === 'undefiend' || !sbReg) {
        return false;
      }

      if(true === caseInsensitive) {
        regValue = regValue.toLowerCase();
      }

      for(var param in regObj) {
        var regCurValue = regObj[param];
        if(true === caseInsensitive) {
          regCurValue =  regCurValue.toLowerCase();
        }

        if(regValue === regCurValue) {
          return param;
        }
      }

      return false;
    }

    return {


      /**
       * set(regKey, regValue, regObj)
       *
       * @param regKey:String
       * @param regValue:[ANY]
       * @prarm regObj:String
       *
       * @return Boolean:TRUE
       */
      'set': function(regKey, regValue, regObj) {
        if(typeof regObj === 'undefiend' || !regObj) {
          regObj = defaultReg;
        }
        if(typeof sbReg[regObj] === 'undefiend' || !sbReg[regObj]) {
          sbReg[regObj] = [];
        }
        sbReg[regObj][regKey] = regValue;

        return true;
      },


      /**
       * get(regKey, regObj)
       *
       * @param regKey:String
       * @prarm regObj:String
       *
       * @return regValue:[ANY] || undefiend
       */
      'get': function(regKey, regObj) {
        if(typeof regObj === 'undefiend' || !regObj) {
          regObj = defaultReg;
        }
        if(typeof sbReg[regObj][regKey] === 'undefiend') {
          return undefiend;
        }
        else {
          return sbReg[regObj][regKey];
        }
      },

      /**
       * search(regValue, regObj, caseInsensitive)
       *
       * @param regValue:[ANY]
       * @param regObj:String
       * @param caseInsensitive:Boolean
       *
       * @return Array || false
       */
      'search': function(regValue, regObj, caseInsensitive) {
        if(typeof regObj === 'string' && regObj) {
          return searchKey(regValue, sbReg[regObj], caseInsensitive);
        }
        else {
          var returnArray = [];
          for(var param in sbReg) {
            var searchResult = searchKey(regValue, sbReg[param], caseInsensitive);
            if(false !== searchResult) {
              returnArray.push(searchResult);
            }
          }
          if(returnArray.length > 0) {
            return returnArray;
          }
          else {
            return false;
          }
        }
      },


      /**
       * drop(regKey, regObj, dropTree)
       *
       * @param regKey:String
       * @prarm regObj:String
       * @param dropTree:Boolean
       *
       * @return Boolean
       */
      'drop': function(regKey, regObj, dropTree) {
        if(typeof regObj === 'undefiend' || !regObj) {
          regObj = defaultReg;
        }
        if(typeof dropType !== 'undefiend' && true === dropTree) {
          delete sbReg[regObj];
          return true;
        }
        else {
          if(typeof sbReg[regObj][regKey] !== 'undefiend') {
            delete sbReg[regObj][regKey];
            return true;
          }
          return false;
        }
      }

    };
  } ();


  /**
   *
   * Internal funktionen duer den Datenaustausch
   *
   */
  SEITENBAU.DataExchange = function ( )
  {
    return {

      /**
       * Austausch-Daten speichern
       *
       * DataExchange.set( sExchangeId, hExchangeData );
       *
       * @param sExchangeId:Austausch-ID
       * @param hExchangeData:Austausch-Daten
       *
       * @return mixed
       */
      'set': function( sExchangeId, hExchangeData )
      {
        // Austauschdaten merken
        top.SEITENBAU.registry.drop( sExchangeId, 'DATAEXCHANGE', true );
        top.SEITENBAU.registry.set( sExchangeId, hExchangeData, 'DATAEXCHANGE' );

        return true;
      },

      /**
       * Austausch-Daten abfragen
       *
       * getDataExchange( sExchangeId );
       *
       * @param sExchangeId:Austausch-ID
       *
       * @return mixed:Austausch-Daten
       */
      'get': function( sExchangeId )
      {
        // Austauschdaten ermitteln
        return top.SEITENBAU.registry.get( sExchangeId, 'DATAEXCHANGE' );
      }

    };
  } ();


  /**
   * load external Script
   *
   * getSript(src, callback, refresh);
   *
   * @param src:String
   * @param callback:Function
   * @param refresh:Boolean
   *
   * @return Void
   */
  SEITENBAU.getScript = function() {
    var regObjName = 'getScriptCache';
    var regKey;

    return function(src, callback, refresh) {
      if(typeof jQuery === 'undefiend' || !jQuery) {
        return false;
      }

      regKey = SEITENBAU.registry.search(src, regObjName, false)

      if(true === refresh || false === regKey) {
        if(false === regKey) {
          var hashDate = new Date();
          regKey = hashDate.getTime();
        }

        jQuery.getScript(src, function() {
          SEITENBAU.registry.set(regKey, src, regObjName);
          if(typeof callback === 'function') {
            callback();
          }
        });
      }
      else {
        if(typeof callback === 'function') {
          callback();
        }
      }
    };
  } ();

  /**
  * Datepicker fuer das Artikeldatum
  */
  SEITENBAU.fnc.artikeldatumPicker = function(){
    return function(opts) {

        var sDatumBisher = $(opts.sDatumsFeld).val();
        if(!sDatumBisher && opts.iSetToday){
          $(opts.sDatumsFeld).val(opts.iSetToday);
          updateLinked(opts.iSetToday);
        }
        $.datepicker.setDefaults($.datepicker.regional[opts.sLang]);
         $(opts.sDatumsFeld).datepicker(
                                         {
                                            minDate: new Date(2003, 1 - 1, 1)
                                            ,maxDate: new Date(2018, 12 - 1, 31)
                                            ,beforeShow: readLinked
                                            ,onSelect: updateLinked
                                            ,showOn: 'both'
                                            ,dateFormat: 'yymmdd'
                                            ,buttonImageOnly: true
                                            ,buttonImage: '/cms_tools/images/datePicker/cal.gif'
                                            //~ ,buttonText: 'CAL'
                                        }
         );
        // Prepare to show a date picker linked to three select controls
        function readLinked() {
            $(opts.sDatumsFeld).val(
                $(opts.sJahrSelect).val() +
                $(opts.sMonatSelect).val() +
                $(opts.sTagSelect).val()
            );
        }

        // Update three select controls to match a date picker selection
        function updateLinked(date) {
            $(opts.sTagSelect).val(date.substring(6,8));
            $(opts.sMonatSelect).val(date.substring(4, 6));
            $(opts.sJahrSelect).val(date.substring(0, 4));
        }

        $([opts.sTagSelect,opts.sMonatSelect,opts.sJahrSelect]).each( function(){$(this).change(checkLinkedDays);});
        // Prevent selection of invalid dates through the select controls
        function checkLinkedDays() {
            var daysInMonth = 32 - new Date($(opts.sJahrSelect).val(),
            $(opts.sMonatSelect).val() - 1, 32).getDate();
            $('option',opts.sTagSelect).removeAttr('disabled');
            $('option:gt(' + (daysInMonth - 1) +')',opts.sTagSelect).attr('disabled', 'disabled');
            if ($(opts.sTagSelect).val() > daysInMonth) {
                $(opts.sTagSelect).val(daysInMonth);
            }
            readLinked();
        }
    }
  }();
  /**
  * Datepicker fuer das Reminderdatum
  */
  SEITENBAU.fnc.reminderDatumPicker = function(){
    return function(opts) {
        var sDatumBisher = $(opts.sDatumsFeld).val();
        if(!sDatumBisher && opts.iSetToday){
          $(opts.sDatumsFeld).val(opts.iSetToday);
          updateLinked(opts.iSetToday);
        }
        $.datepicker.setDefaults($.datepicker.regional[opts.sLang]);
         $(opts.sDatumsFeld).datepicker(
                                         {
                                            minDate: new Date(2008, 1 - 1, 1)
                                            ,maxDate: new Date(2018, 12 - 1, 31)
                                            ,beforeShow: readLinked
                                            ,onSelect: updateLinked
                                            ,showOn: 'both'
                                            ,dateFormat: 'yy-mm-dd'
                                            ,buttonImageOnly: true
                                            ,buttonImage: '/cms_tools/images/datePicker/cal.gif'
                                            //~ ,buttonText: 'CAL'
                                        }
         );
        // Prepare to show a date picker linked to three select controls
        function readLinked() {
            $(opts.sDatumsFeld).val(
                $(opts.sJahrSelect).val() +'-'+
                $(opts.sMonatSelect).val() +'-'+
                $(opts.sTagSelect).val()
            );
        }

        // Update three select controls to match a date picker selection
        function updateLinked(date) {
            $(opts.sTagSelect).val(date.substring(8,10));
            $(opts.sMonatSelect).val(date.substring(5, 7));
            $(opts.sJahrSelect).val(date.substring(0, 4));
        }

        $([opts.sTagSelect,opts.sMonatSelect,opts.sJahrSelect]).each( function(){$(this).change(checkLinkedDays);});
        // Prevent selection of invalid dates through the select controls
        function checkLinkedDays() {
            var daysInMonth = 32 - new Date($(opts.sJahrSelect).val(),
            $(opts.sMonatSelect).val() - 1, 32).getDate();
            $('option',opts.sTagSelect).removeAttr('disabled');
            $('option:gt(' + (daysInMonth - 1) +')',opts.sTagSelect).attr('disabled', 'disabled');
            if ($(opts.sTagSelect).val() > daysInMonth) {
                $(opts.sTagSelect).val(daysInMonth);
            }
            readLinked();
        }
    }
  }();


  /**
  * Datepicker fuer das Expirydatum
  */
  SEITENBAU.fnc.expiryDatumPicker = function(){
    return function(opts) {
        var sDatumBisher = $(opts.sDatumsFeld).val();
        if(!sDatumBisher && opts.iSetToday){
          $(opts.sDatumsFeld).val(opts.iSetToday);
          updateLinked(opts.iSetToday);
        }
        $.datepicker.setDefaults($.datepicker.regional[opts.sLang]);
         $(opts.sDatumsFeld).datepicker(
                                         {
                                            minDate: new Date(2008, 1 - 1, 1)
                                            ,maxDate: new Date(2018, 12 - 1, 31)
                                            ,beforeShow: readLinked
                                            ,onSelect: updateLinked
                                            ,showOn: 'both'
                                            ,dateFormat: 'yy-mm-dd'
                                            ,buttonImageOnly: true
                                            ,buttonImage: '/cms_tools/images/datePicker/cal.gif'
                                            //~ ,buttonText: 'CAL'
                                        }
         );
        // Prepare to show a date picker linked to three select controls
        function readLinked() {
            $(opts.sDatumsFeld).val(
                $(opts.sJahrSelect).val() +'-'+
                $(opts.sMonatSelect).val() +'-'+
                $(opts.sTagSelect).val() +' '+
                $(opts.sStundeSelect).val() +':'+
                $(opts.sMinuteSelect).val()
            );
        }

        // Update three select controls to match a date picker selection
        function updateLinked(date) {
            $(opts.sTagSelect).val(date.substring(8,10));
            $(opts.sMonatSelect).val(date.substring(5, 7));
            $(opts.sJahrSelect).val(date.substring(0, 4));
            readLinked();
        }

        $([opts.sTagSelect,opts.sMonatSelect,opts.sJahrSelect,opts.sStundeSelect,opts.sMinuteSelect]).each( function(){$(this).change(checkLinkedDays);});
        // Prevent selection of invalid dates through the select controls
        function checkLinkedDays() {
            var daysInMonth = 32 - new Date($(opts.sJahrSelect).val(),
            $(opts.sMonatSelect).val() - 1, 32).getDate();
            $('option',opts.sTagSelect).removeAttr('disabled');
            $('option:gt(' + (daysInMonth - 1) +')',opts.sTagSelect).attr('disabled', 'disabled');
            if ($(opts.sTagSelect).val() > daysInMonth) {
                $(opts.sTagSelect).val(daysInMonth);
            }
            readLinked();
        }
    }
  }();


  /**
  * Datepicker fuer das Satzungsdatum
  */
  SEITENBAU.fnc.satzungsdatumPicker = function(){
    return function(opts) {

        var sDatumBisher = $(opts.sDatumsFeld).val();
        if(!sDatumBisher && opts.iSetToday){
          $(opts.sDatumsFeld).val(opts.iSetToday);
          updateLinked(opts.iSetToday);
        }
        $.datepicker.setDefaults($.datepicker.regional[opts.sLang]);
         $(opts.sDatumsFeld).datepicker(
                                         {
                                            minDate: new Date(2003, 1 - 1, 1)
                                            ,maxDate: new Date(2015, 12 - 1, 31)
                                            ,beforeShow: readLinked
                                            ,onSelect: updateLinked
                                            ,showOn: 'both'
                                            ,dateFormat: 'yymmdd'
                                            ,buttonImageOnly: true
                                            ,buttonImage: '/cms_tools/images/datePicker/cal.gif'
                                            //~ ,buttonText: 'CAL'
                                        }
         );
        // Prepare to show a date picker linked to three select controls
        function readLinked() {
            $(opts.sDatumsFeld).val(
                $(opts.sJahrSelect).val() +
                $(opts.sMonatSelect).val() +
                $(opts.sTagSelect).val()
            );
        }

        // Update three select controls to match a date picker selection
        function updateLinked(date) {
            $(opts.sTagSelect).val(date.substring(6,8));
            $(opts.sMonatSelect).val(date.substring(4, 6));
            $(opts.sJahrSelect).val(date.substring(0, 4));
        }

        $([opts.sTagSelect,opts.sMonatSelect,opts.sJahrSelect]).each( function(){$(this).change(checkLinkedDays);});
        // Prevent selection of invalid dates through the select controls
        function checkLinkedDays() {
            var daysInMonth = 32 - new Date($(opts.sJahrSelect).val(),
            $(opts.sMonatSelect).val() - 1, 32).getDate();
            $('option',opts.sTagSelect).removeAttr('disabled');
            $('option:gt(' + (daysInMonth - 1) +')',opts.sTagSelect).attr('disabled', 'disabled');
            if ($(opts.sTagSelect).val() > daysInMonth) {
                $(opts.sTagSelect).val(daysInMonth);
            }
            readLinked();
        }
    }
  }();

} // ENDE Klammerung: SEITENBAU.js bereits geladen

;

 //~ =======  ::Datei:: javascripts/jquery/jquery-1.10.1.min.js ========
/*! jQuery v1.10.1 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-1.10.1.min.map
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.1",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=lt(),k=lt(),E=lt(),S=!1,A=function(){return 0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=bt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+xt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return At(e.replace(z,"$1"),t,n,i)}function st(e){return K.test(e+"")}function lt(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function ut(e){return e[b]=!0,e}function ct(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function pt(e,t,n){e=e.split("|");var r,i=e.length,a=n?null:t;while(i--)(r=o.attrHandle[e[i]])&&r!==t||(o.attrHandle[e[i]]=a)}function ft(e,t){var n=e.getAttributeNode(t);return n&&n.specified?n.value:e[t]===!0?t.toLowerCase():null}function dt(e,t){return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}function ht(e){return"input"===e.nodeName.toLowerCase()?e.defaultValue:t}function gt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function mt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function yt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function vt(e){return ut(function(t){return t=+t,ut(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.parentWindow;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.frameElement&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ct(function(e){return e.innerHTML="<a href='#'></a>",pt("type|href|height|width",dt,"#"===e.firstChild.getAttribute("href")),pt(B,ft,null==e.getAttribute("disabled")),e.className="i",!e.getAttribute("className")}),r.input=ct(function(e){return e.innerHTML="<input>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")}),pt("value",ht,r.attributes&&r.input),r.getElementsByTagName=ct(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ct(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ct(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=st(n.querySelectorAll))&&(ct(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ct(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=st(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ct(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=st(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},r.sortDetached=ct(function(e){return 1&e.compareDocumentPosition(n.createElement("div"))}),A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return gt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?gt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:ut,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=bt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?ut(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:ut(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?ut(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:ut(function(e){return function(t){return at(e,t).length>0}}),contains:ut(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:ut(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:vt(function(){return[0]}),last:vt(function(e,t){return[t-1]}),eq:vt(function(e,t,n){return[0>n?n+t:n]}),even:vt(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:vt(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:vt(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:vt(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}};for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=mt(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=yt(n);function bt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function xt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function wt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function Tt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function Ct(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function Nt(e,t,n,r,i,o){return r&&!r[b]&&(r=Nt(r)),i&&!i[b]&&(i=Nt(i,o)),ut(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||St(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:Ct(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=Ct(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=Ct(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function kt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=wt(function(e){return e===t},s,!0),p=wt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[wt(Tt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return Nt(l>1&&Tt(f),l>1&&xt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&kt(e.slice(l,r)),i>r&&kt(e=e.slice(r)),i>r&&xt(e))}f.push(n)}return Tt(f)}function Et(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=Ct(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?ut(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=bt(e)),n=t.length;while(n--)o=kt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Et(i,r))}return o};function St(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function At(e,t,n,i){var a,s,u,c,p,f=bt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&xt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}o.pseudos.nth=o.pseudos.eq;function jt(){}jt.prototype=o.filters=o.pseudos,o.setFilters=new jt,r.sortStable=b.split("").sort(A).join("")===b,p(),[0,0].sort(A),r.detectDuplicates=S,x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],!l||i&&!u||(n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)
}),n=s=l=u=r=o=null,t}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e,r="boolean"==typeof t;return x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var o,a=0,s=x(this),l=t,u=e.match(T)||[];while(o=u[a++])l=r?l:!s.hasClass(o),s[l?"addClass":"removeClass"](o)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){var t="boolean"==typeof e;return this.each(function(){(t?e:nn(this))?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);

/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
// jQuery.migrateMute = true;
jQuery.migrateMute===void 0&&(jQuery.migrateMute=!0),function(e,t,n){function r(n){var r=t.console;i[n]||(i[n]=!0,e.migrateWarnings.push(n),r&&r.warn&&!e.migrateMute&&(r.warn("JQMIGRATE: "+n),e.migrateTrace&&r.trace&&r.trace()))}function a(t,a,i,o){if(Object.defineProperty)try{return Object.defineProperty(t,a,{configurable:!0,enumerable:!0,get:function(){return r(o),i},set:function(e){r(o),i=e}}),n}catch(s){}e._definePropertyBroken=!0,t[a]=i}var i={};e.migrateWarnings=[],!e.migrateMute&&t.console&&t.console.log&&t.console.log("JQMIGRATE: Logging is active"),e.migrateTrace===n&&(e.migrateTrace=!0),e.migrateReset=function(){i={},e.migrateWarnings.length=0},"BackCompat"===document.compatMode&&r("jQuery is not compatible with Quirks Mode");var o=e("<input/>",{size:1}).attr("size")&&e.attrFn,s=e.attr,u=e.attrHooks.value&&e.attrHooks.value.get||function(){return null},c=e.attrHooks.value&&e.attrHooks.value.set||function(){return n},l=/^(?:input|button)$/i,d=/^[238]$/,p=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,f=/^(?:checked|selected)$/i;a(e,"attrFn",o||{},"jQuery.attrFn is deprecated"),e.attr=function(t,a,i,u){var c=a.toLowerCase(),g=t&&t.nodeType;return u&&(4>s.length&&r("jQuery.fn.attr( props, pass ) is deprecated"),t&&!d.test(g)&&(o?a in o:e.isFunction(e.fn[a])))?e(t)[a](i):("type"===a&&i!==n&&l.test(t.nodeName)&&t.parentNode&&r("Can't change the 'type' of an input or button in IE 6/7/8"),!e.attrHooks[c]&&p.test(c)&&(e.attrHooks[c]={get:function(t,r){var a,i=e.prop(t,r);return i===!0||"boolean"!=typeof i&&(a=t.getAttributeNode(r))&&a.nodeValue!==!1?r.toLowerCase():n},set:function(t,n,r){var a;return n===!1?e.removeAttr(t,r):(a=e.propFix[r]||r,a in t&&(t[a]=!0),t.setAttribute(r,r.toLowerCase())),r}},f.test(c)&&r("jQuery.fn.attr('"+c+"') may use property instead of attribute")),s.call(e,t,a,i))},e.attrHooks.value={get:function(e,t){var n=(e.nodeName||"").toLowerCase();return"button"===n?u.apply(this,arguments):("input"!==n&&"option"!==n&&r("jQuery.fn.attr('value') no longer gets properties"),t in e?e.value:null)},set:function(e,t){var a=(e.nodeName||"").toLowerCase();return"button"===a?c.apply(this,arguments):("input"!==a&&"option"!==a&&r("jQuery.fn.attr('value', val) no longer sets properties"),e.value=t,n)}};var g,h,v=e.fn.init,m=e.parseJSON,y=/^([^<]*)(<[\w\W]+>)([^>]*)$/;e.fn.init=function(t,n,a){var i;return t&&"string"==typeof t&&!e.isPlainObject(n)&&(i=y.exec(e.trim(t)))&&i[0]&&("<"!==t.charAt(0)&&r("$(html) HTML strings must start with '<' character"),i[3]&&r("$(html) HTML text after last tag is ignored"),"#"===i[0].charAt(0)&&(r("HTML string cannot start with a '#' character"),e.error("JQMIGRATE: Invalid selector string (XSS)")),n&&n.context&&(n=n.context),e.parseHTML)?v.call(this,e.parseHTML(i[2],n,!0),n,a):v.apply(this,arguments)},e.fn.init.prototype=e.fn,e.parseJSON=function(e){return e||null===e?m.apply(this,arguments):(r("jQuery.parseJSON requires a valid JSON string"),null)},e.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||0>e.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e.browser||(g=e.uaMatch(navigator.userAgent),h={},g.browser&&(h[g.browser]=!0,h.version=g.version),h.chrome?h.webkit=!0:h.webkit&&(h.safari=!0),e.browser=h),a(e,"browser",e.browser,"jQuery.browser is deprecated"),e.sub=function(){function t(e,n){return new t.fn.init(e,n)}e.extend(!0,t,this),t.superclass=this,t.fn=t.prototype=this(),t.fn.constructor=t,t.sub=this.sub,t.fn.init=function(r,a){return a&&a instanceof e&&!(a instanceof t)&&(a=t(a)),e.fn.init.call(this,r,a,n)},t.fn.init.prototype=t.fn;var n=t(document);return r("jQuery.sub() is deprecated"),t},e.ajaxSetup({converters:{"text json":e.parseJSON}});var b=e.fn.data;e.fn.data=function(t){var a,i,o=this[0];return!o||"events"!==t||1!==arguments.length||(a=e.data(o,t),i=e._data(o,t),a!==n&&a!==i||i===n)?b.apply(this,arguments):(r("Use of jQuery.fn.data('events') is deprecated"),i)};var j=/\/(java|ecma)script/i,w=e.fn.andSelf||e.fn.addBack;e.fn.andSelf=function(){return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"),w.apply(this,arguments)},e.clean||(e.clean=function(t,a,i,o){a=a||document,a=!a.nodeType&&a[0]||a,a=a.ownerDocument||a,r("jQuery.clean() is deprecated");var s,u,c,l,d=[];if(e.merge(d,e.buildFragment(t,a).childNodes),i)for(c=function(e){return!e.type||j.test(e.type)?o?o.push(e.parentNode?e.parentNode.removeChild(e):e):i.appendChild(e):n},s=0;null!=(u=d[s]);s++)e.nodeName(u,"script")&&c(u)||(i.appendChild(u),u.getElementsByTagName!==n&&(l=e.grep(e.merge([],u.getElementsByTagName("script")),c),d.splice.apply(d,[s+1,0].concat(l)),s+=l.length));return d});var Q=e.event.add,x=e.event.remove,k=e.event.trigger,N=e.fn.toggle,T=e.fn.live,M=e.fn.die,S="ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",C=RegExp("\\b(?:"+S+")\\b"),H=/(?:^|\s)hover(\.\S+|)\b/,A=function(t){return"string"!=typeof t||e.event.special.hover?t:(H.test(t)&&r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"),t&&t.replace(H,"mouseenter$1 mouseleave$1"))};e.event.props&&"attrChange"!==e.event.props[0]&&e.event.props.unshift("attrChange","attrName","relatedNode","srcElement"),e.event.dispatch&&a(e.event,"handle",e.event.dispatch,"jQuery.event.handle is undocumented and deprecated"),e.event.add=function(e,t,n,a,i){e!==document&&C.test(t)&&r("AJAX events should be attached to document: "+t),Q.call(this,e,A(t||""),n,a,i)},e.event.remove=function(e,t,n,r,a){x.call(this,e,A(t)||"",n,r,a)},e.fn.error=function(){var e=Array.prototype.slice.call(arguments,0);return r("jQuery.fn.error() is deprecated"),e.splice(0,0,"error"),arguments.length?this.bind.apply(this,e):(this.triggerHandler.apply(this,e),this)},e.fn.toggle=function(t,n){if(!e.isFunction(t)||!e.isFunction(n))return N.apply(this,arguments);r("jQuery.fn.toggle(handler, handler...) is deprecated");var a=arguments,i=t.guid||e.guid++,o=0,s=function(n){var r=(e._data(this,"lastToggle"+t.guid)||0)%o;return e._data(this,"lastToggle"+t.guid,r+1),n.preventDefault(),a[r].apply(this,arguments)||!1};for(s.guid=i;a.length>o;)a[o++].guid=i;return this.click(s)},e.fn.live=function(t,n,a){return r("jQuery.fn.live() is deprecated"),T?T.apply(this,arguments):(e(this.context).on(t,this.selector,n,a),this)},e.fn.die=function(t,n){return r("jQuery.fn.die() is deprecated"),M?M.apply(this,arguments):(e(this.context).off(t,this.selector||"**",n),this)},e.event.trigger=function(e,t,n,a){return n||C.test(e)||r("Global events are undocumented and deprecated"),k.call(this,e,t,n||document,a)},e.each(S.split("|"),function(t,n){e.event.special[n]={setup:function(){var t=this;return t!==document&&(e.event.add(document,n+"."+e.guid,function(){e.event.trigger(n,null,t,!0)}),e._data(this,n,e.guid++)),!1},teardown:function(){return this!==document&&e.event.remove(document,n+"."+e._data(this,n)),!1}}})}(jQuery,window);
;

 //~ =======  ::Datei:: javascripts/jquery/plugins/jquery.metadata.min.js ========
/*
 * Metadata - jQuery plugin for parsing metadata from elements
 *
 * Copyright (c) 2006 John Resig, Yehuda Katz, Joern Zaefferer, Paul McLanahan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.metadata.js 3620 2007-10-10 20:55:38Z pmclanahan $
 *
 */
(function($){$.extend({metadata:{defaults:{type:'class',name:'metadata',cre:/({.*})/,single:'metadata'},setType:function(type,name){this.defaults.type=type;this.defaults.name=name;},get:function(elem,opts){var settings=$.extend({},this.defaults,opts);if(!settings.single.length)settings.single='metadata';var data=$.data(elem,settings.single);if(data)return data;data="{}";if(settings.type=="class"){var m=settings.cre.exec(elem.className);if(m)data=m[1];}else if(settings.type=="elem"){if(!elem.getElementsByTagName)return;var e=elem.getElementsByTagName(settings.name);if(e.length)data=$.trim(e[0].innerHTML);}else if(elem.getAttribute!=undefined){var attr=elem.getAttribute(settings.name);if(attr)data=attr;}if(data.indexOf('{')<0)data="{"+data+"}";data=eval("("+data+")");$.data(elem,settings.single,data);return data;}}});$.fn.metadata=function(opts){return $.metadata.get(this[0],opts);};})(jQuery);
;

 //~ =======  ::Datei:: javascripts/jquery/plugins/jquery.media.js ========
/*
 * jQuery Media Plugin for converting elements into rich media content.
 *
 * Examples and documentation at: http://malsup.com/jquery/media/
 * Copyright (c) 2007-2008 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @author: M. Alsup
 * @version: 0.84 (12/01/2008)
 * @requires jQuery v1.1.2 or later
 * $Id: jquery.media.js 2460 2007-07-23 02:53:15Z malsup $
 *
 * Supported Media Players:
 *    - Flash
 *    - Quicktime
 *    - Real Player
 *    - Silverlight
 *    - Windows Media Player
 *    - iframe
 *
 * Supported Media Formats:
 *   Any types supported by the above players, such as:
 *     Video: asf, avi, flv, mov, mpg, mpeg, mp4, qt, smil, swf, wmv, 3g2, 3gp
 *     Audio: aif, aac, au, gsm, mid, midi, mov, mp3, m4a, snd, rm, wav, wma
 *     Other: bmp, html, pdf, psd, qif, qtif, qti, tif, tiff, xaml
 *
 * Thanks to Mark Hicken and Brent Pedersen for helping me debug this on the Mac!
 * Thanks to Dan Rossi for numerous bug reports and code bits!
 */
;(function($) {

/**
 * Chainable method for converting elements into rich media.
 *
 * @param options
 * @param callback fn invoked for each matched element before conversion
 * @param callback fn invoked for each matched element after conversion
 */
$.fn.media = function(options, f1, f2) {
    return this.each(function() {
        if (typeof options == 'function') {
            f2 = f1;
            f1 = options;
            options = {};
        }
        var o = getSettings(this, options);
        // pre-conversion callback, passes original element and fully populated options
        if (typeof f1 == 'function') f1(this, o);

        var r = getTypesRegExp();
        var m = r.exec(o.src) || [''];
        o.type ? m[0] = o.type : m.shift();
        for (var i=0; i < m.length; i++) {
            fn = m[i].toLowerCase();
            if (isDigit(fn[0])) fn = 'fn' + fn; // fns can't begin with numbers
            if (!$.fn.media[fn])
                continue;  // unrecognized media type
            // normalize autoplay settings
            var player = $.fn.media[fn+'_player'];
            if (!o.params) o.params = {};
            if (player) {
                var num = player.autoplayAttr == 'autostart';
                o.params[player.autoplayAttr || 'autoplay'] = num ? (o.autoplay ? 1 : 0) : o.autoplay ? true : false;
            }
            var $div = $.fn.media[fn](this, o);

            $div.css('backgroundColor', o.bgColor).width(o.width);
            // post-conversion callback, passes original element, new div element and fully populated options
            if (typeof f2 == 'function') f2(this, $div[0], o, player.name);
            break;
        }
    });
};

/**
 * Non-chainable method for adding or changing file format / player mapping
 * @name mapFormat
 * @param String format File format extension (ie: mov, wav, mp3)
 * @param String player Player name to use for the format (one of: flash, quicktime, realplayer, winmedia, silverlight or iframe
 */
$.fn.media.mapFormat = function(format, player) {
    if (!format || !player || !$.fn.media.defaults.players[player]) return; // invalid
    format = format.toLowerCase();
    if (isDigit(format[0])) format = 'fn' + format;
    $.fn.media[format] = $.fn.media[player];
    $.fn.media[format+'_player'] = $.fn.media.defaults.players[player];
};

// global defautls; override as needed
$.fn.media.defaults = {
    width:         400,
    height:        400,
    autoplay:      0,         // normalized cross-player setting
    bgColor:       '#ffffff', // background color
    params:        { wmode: 'transparent'},  // added to object element as param elements; added to embed element as attrs
    attrs:         {},        // added to object and embed elements as attrs
    flvKeyName:    'file',    // key used for object src param (thanks to Andrea Ercolino)
    flashvars:     {},        // added to flash content as flashvars param/attr
    flashVersion:  '7',       // required flash version
    expressInstaller: null,   // src for express installer

    // default flash video and mp3 player (@see: http://jeroenwijering.com/?item=Flash_Media_Player)
    flvPlayer:     '/javascripts/jquery/plugins/mediaplayer.swf',
    mp3Player:     '/javascripts/jquery/plugins/mediaplayer.swf',

    // @see http://msdn2.microsoft.com/en-us/library/bb412401.aspx
    silverlight: {
        inplaceInstallPrompt: 'true', // display in-place install prompt?
        isWindowless:         'true', // windowless mode (false for wrapping markup)
        framerate:            '24',   // maximum framerate
        version:              '0.9',  // Silverlight version
        onError:              null,   // onError callback
        onLoad:               null,   // onLoad callback
        initParams:           null,   // object init params
        userContext:          null    // callback arg passed to the load callback
    }
};

// Media Players; think twice before overriding
$.fn.media.defaults.players = {
    flash: {
        name:         'flash',
        types:        'flv,mp3,swf,mp4',
        oAttrs:   {
            classid:  'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
            type:     'application/x-oleobject',
            codebase: 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + $.fn.media.defaults.flashVersion
        },
        eAttrs: {
            type:         'application/x-shockwave-flash',
            pluginspage:  'http://www.adobe.com/go/getflashplayer'
        }
    },
    quicktime: {
        name:         'quicktime',
        types:        'aif,aiff,aac,au,bmp,gsm,mov,mid,midi,mpg,mpeg,m4a,psd,qt,qtif,qif,qti,snd,tif,tiff,wav,3g2,3gp',
        oAttrs:   {
            classid:  'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B',
            codebase: 'http://www.apple.com/qtactivex/qtplugin.cab'
        },
        eAttrs: {
            pluginspage:  'http://www.apple.com/quicktime/download/'
        }
    },
    realplayer: {
        name:         'real',
        types:        'ra,ram,rm,rpm,rv,smi,smil',
        autoplayAttr: 'autostart',
        oAttrs:   {
            classid:  'clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA'
        },
        eAttrs: {
            type:         'audio/x-pn-realaudio-plugin',
            pluginspage:  'http://www.real.com/player/'
        }
    },
    winmedia: {
        name:         'winmedia',
        types:        'asf,avi,wma,wmv',
        autoplayAttr: 'autostart',
        oUrl:         'url',
        oAttrs:   {
            classid:  'clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6',
            type:     'application/x-oleobject'
        },
        eAttrs: {
            type:         $.browser.mozilla && isFirefoxWMPPluginInstalled() ? 'application/x-ms-wmp' : 'application/x-mplayer2',
            pluginspage:  'http://www.microsoft.com/Windows/MediaPlayer/'
        }
    },
    // special cases
    iframe: {
        name:  'iframe',
        types: 'html,pdf'
    },
    silverlight: {
        name:  'silverlight',
        types: 'xaml'
    }
};

//
//  everything below here is private
//


// detection script for FF WMP plugin (http://www.therossman.org/experiments/wmp_play.html)
// (hat tip to Mark Ross for this script)
function isFirefoxWMPPluginInstalled() {
    var plugs = navigator.plugins;
    for (i = 0; i < plugs.length; i++) {
        var plugin = plugs[i];
        if (plugin['filename'] == 'np-mswmp.dll')
            return true;
    }
    return false;
}

var counter = 1;

for (var player in $.fn.media.defaults.players) {
    var types = $.fn.media.defaults.players[player].types;
    $.each(types.split(','), function(i,o) {
        if (isDigit(o[0])) o = 'fn' + o;
        $.fn.media[o] = $.fn.media[player] = getGenerator(player);
        $.fn.media[o+'_player'] = $.fn.media.defaults.players[player];
    });
};

function getTypesRegExp() {
    var types = '';
    for (var player in $.fn.media.defaults.players) {
        if (types.length) types += ',';
        types += $.fn.media.defaults.players[player].types;
    };
    return new RegExp('\\.(' + types.replace(/,/g,'|') + ')$\\b');
};

function getGenerator(player) {
    return function(el, options) {
        return generate(el, options, player);
    };
};

function isDigit(c) {
    return '0123456789'.indexOf(c) > -1;
};

// flatten all possible options: global defaults, meta, option obj
function getSettings(el, options) {
    options = options || {};
    var $el = $(el);
    var cls = el.className || '';
    // support metadata plugin (v1.0 and v2.0)
    var meta = $.metadata ? $el.metadata() : $.meta ? $el.data() : {};
    meta = meta || {};
    var w = meta.width  || parseInt(((cls.match(/w:(\d+)/)||[])[1]||0));
    var h = meta.height || parseInt(((cls.match(/h:(\d+)/)||[])[1]||0));

    if (w) meta.width  = w;
    if (h) meta.height = h;
    if (cls) meta.cls = cls;

    var a = $.fn.media.defaults;
    var b = options;
    var c = meta;

    var p = { params: { bgColor: options.bgColor || $.fn.media.defaults.bgColor } };
    var opts = $.extend({}, a, b, c);
    $.each(['attrs','params','flashvars','silverlight'], function(i,o) {
        opts[o] = $.extend({}, p[o] || {}, a[o] || {}, b[o] || {}, c[o] || {});
    });

    if (typeof opts.caption == 'undefined') opts.caption = $el.text();

    // make sure we have a source!
    opts.src = opts.src || $el.attr('href') || $el.attr('src') || 'unknown';
    return opts;
};

//
//  Flash Player
//

// generate flash using SWFObject library if possible
$.fn.media.swf = function(el, opts) {
    if (!window.SWFObject && !window.swfobject) {
        // roll our own
        if (opts.flashvars) {
            var a = [];
            for (var f in opts.flashvars)
                a.push(f + '=' + opts.flashvars[f]);
            if (!opts.params) opts.params = {};
            opts.params.flashvars = a.join('&');
        }
        return generate(el, opts, 'flash');
    }

    var id = el.id ? (' id="'+el.id+'"') : '';
    var cls = opts.cls ? (' class="' + opts.cls + '"') : '';
    var $div = $('<div' + id + cls + '>');

    // swfobject v2+
    if (window.swfobject) {
        $(el).after($div).appendTo($div);
        if (!el.id) el.id = 'movie_player_' + counter++;

        // replace el with swfobject content
        swfobject.embedSWF(opts.src, el.id, opts.width, opts.height, opts.flashVersion,
            opts.expressInstaller, opts.flashvars, opts.params, opts.attrs);
    }
    // swfobject < v2
    else {
        $(el).after($div).remove();
        var so = new SWFObject(opts.src, 'movie_player_' + counter++, opts.width, opts.height, opts.flashVersion, opts.bgColor);
        if (opts.expressInstaller) so.useExpressInstall(opts.expressInstaller);

        for (var p in opts.params)
            if (p != 'bgColor') so.addParam(p, opts.params[p]);
        for (var f in opts.flashvars)
            so.addVariable(f, opts.flashvars[f]);
        so.write($div[0]);
    }

    if (opts.caption) $('<div>').appendTo($div).html(opts.caption);
    return $div;
};

// map flv and mp3 files to the swf player by default
$.fn.media.flv = $.fn.media.mp4 = $.fn.media.mp3 = function(el, opts) {
    var src = opts.src;
    var player = /\.mp3\b/i.test(src) ? $.fn.media.defaults.mp3Player : $.fn.media.defaults.flvPlayer;
    var key = opts.flvKeyName;
    src = encodeURIComponent(src);
    opts.src = player;
    opts.src = opts.src + '?'+key+'=' + (src);
    var srcObj = {};
    srcObj[key] = src;
    opts.flashvars = $.extend({}, srcObj, opts.flashvars );
    return $.fn.media.swf(el, opts);
};

//
//  Silverlight
//
$.fn.media.xaml = function(el, opts) {
    if (!window.Sys || !window.Sys.Silverlight) {
        if ($.fn.media.xaml.warning) return;
        $.fn.media.xaml.warning = 1;
        alert('You must include the Silverlight.js script.');
        return;
    }

    var props = {
        width: opts.width,
        height: opts.height,
        background: opts.bgColor,
        inplaceInstallPrompt: opts.silverlight.inplaceInstallPrompt,
        isWindowless: opts.silverlight.isWindowless,
        framerate: opts.silverlight.framerate,
        version: opts.silverlight.version
    };
    var events = {
        onError: opts.silverlight.onError,
        onLoad: opts.silverlight.onLoad
    };

    var id1 = el.id ? (' id="'+el.id+'"') : '';
    var id2 = opts.id || 'AG' + counter++;
    // convert element to div
    var cls = opts.cls ? (' class="' + opts.cls + '"') : '';
    var $div = $('<div' + id1 + cls + '>');
    $(el).after($div).remove();

    Sys.Silverlight.createObjectEx({
        source: opts.src,
        initParams: opts.silverlight.initParams,
        userContext: opts.silverlight.userContext,
        id: id2,
        parentElement: $div[0],
        properties: props,
        events: events
    });

    if (opts.caption) $('<div>').appendTo($div).html(opts.caption);
    return $div;
};

//
// generate object/embed markup
//
function generate(el, opts, player) {
    var $el = $(el);
    var o = $.fn.media.defaults.players[player];

    if (player == 'iframe') {
        var o = $('<iframe' + ' width="' + opts.width + '" height="' + opts.height + '" >');
        o.attr('src', opts.src);
        o.css('backgroundColor', o.bgColor);
    }
    else if ($.browser.msie) {

        var a = ['<object width="' + opts.width + '" height="' + opts.height + '" '];
        for (var key in opts.attrs)
            a.push(key + '="'+opts.attrs[key]+'" ');
        for (var key in o.oAttrs || {}) {
            var v = o.oAttrs[key];
            if (key == 'codebase' && window.location.protocol == 'https')
                v = v.replace('http','https');
            a.push(key + '="'+v+'" ');
        }
        a.push('></ob'+'ject'+'>');
        var p = ['<param name="' + (o.oUrl || 'src') +'" value="' + opts.src + '">'];
        for (var key in opts.params)
            p.push('<param name="'+ key +'" value="' + opts.params[key] + '">');
        var o = document.createElement(a.join(''));
        for (var i=0; i < p.length; i++)
            o.appendChild(document.createElement(p[i]));
    }
    else {
        var a = ['<embed width="' + opts.width + '" height="' + opts.height + '" style="display:block"'];
        if (opts.src) a.push(' src="' + opts.src + '" ');
        for (var key in opts.attrs)
            a.push(key + '="'+opts.attrs[key]+'" ');
        for (var key in o.eAttrs || {})
            a.push(key + '="'+o.eAttrs[key]+'" ');
        for (var key in opts.params)
            if (key != 'wmode') // FF3/Quicktime borks on wmode
                a.push(key + '="'+opts.params[key]+'" ');
        a.push('></em'+'bed'+'>');
    }
    // convert element to div
    var id = el.id ? (' id="'+el.id+'"') : '';
    var cls = opts.cls ? (' class="' + opts.cls + '"') : '';
    var $div = $('<div' + id + cls + '>');
    $el.after($div).remove();
    ($.browser.msie || player == 'iframe') ? $div.append(o) : $div.html(a.join(''));
    if (opts.caption) $('<div>').appendTo($div).html(opts.caption);
    return $div;
};



})(jQuery);
;

 //~ =======  ::Datei:: javascripts/jquery/plugins/jquery_ui/minified/jquery.ui.all.min.js ========
(function(C){C.ui={plugin:{add:function(E,F,H){var G=C.ui[E].prototype;for(var D in H){G.plugins[D]=G.plugins[D]||[];G.plugins[D].push([F,H[D]])}},call:function(D,F,E){var H=D.plugins[F];if(!H){return }for(var G=0;G<H.length;G++){if(D.options[H[G][0]]){H[G][1].apply(D.element,E)}}}},cssCache:{},css:function(D){if(C.ui.cssCache[D]){return C.ui.cssCache[D]}var E=C('<div class="ui-resizable-gen">').addClass(D).css({position:"absolute",top:"-5000px",left:"-5000px",display:"block"}).appendTo("body");C.ui.cssCache[D]=!!((!(/auto|default/).test(E.css("cursor"))||(/^[1-9]/).test(E.css("height"))||(/^[1-9]/).test(E.css("width"))||!(/none/).test(E.css("backgroundImage"))||!(/transparent|rgba\(0, 0, 0, 0\)/).test(E.css("backgroundColor"))));try{C("body").get(0).removeChild(E.get(0))}catch(F){}return C.ui.cssCache[D]},disableSelection:function(D){D.unselectable="on";D.onselectstart=function(){return false};if(D.style){D.style.MozUserSelect="none"}},enableSelection:function(D){D.unselectable="off";D.onselectstart=function(){return true};if(D.style){D.style.MozUserSelect=""}},hasScroll:function(G,E){var D=/top/.test(E||"top")?"scrollTop":"scrollLeft",F=false;if(G[D]>0){return true}G[D]=1;F=G[D]>0?true:false;G[D]=0;return F}};var B=C.fn.remove;C.fn.remove=function(){C("*",this).add(this).trigger("remove");return B.apply(this,arguments)};function A(E,F,G){var D=C[E][F].getter||[];D=(typeof D=="string"?D.split(/,?\s+/):D);return(C.inArray(G,D)!=-1)}C.widget=function(E,D){var F=E.split(".")[0];E=E.split(".")[1];C.fn[E]=function(J){var H=(typeof J=="string"),I=Array.prototype.slice.call(arguments,1);if(H&&A(F,E,J)){var G=C.data(this[0],E);return(G?G[J].apply(G,I):undefined)}return this.each(function(){var K=C.data(this,E);if(H&&K&&C.isFunction(K[J])){K[J].apply(K,I)}else{if(!H){C.data(this,E,new C[F][E](this,J))}}})};C[F][E]=function(I,H){var G=this;this.widgetName=E;this.widgetBaseClass=F+"-"+E;this.options=C.extend({disabled:false},C[F][E].defaults,H);this.element=C(I).bind("setData."+E,function(L,J,K){return G.setData(J,K)}).bind("getData."+E,function(K,J){return G.getData(J)}).bind("remove",function(){return G.destroy()});this.init()};C[F][E].prototype=C.extend({},C.widget.prototype,D)};C.widget.prototype={init:function(){},destroy:function(){this.element.removeData(this.widgetName)},getData:function(D){return this.options[D]},setData:function(D,E){this.options[D]=E;if(D=="disabled"){this.element[E?"addClass":"removeClass"](this.widgetBaseClass+"-disabled")}},enable:function(){this.setData("disabled",false)},disable:function(){this.setData("disabled",true)}};C.ui.mouse={mouseInit:function(){var D=this;this.element.bind("mousedown."+this.widgetName,function(E){return D.mouseDown(E)});if(C.browser.msie){this._mouseUnselectable=this.element.attr("unselectable");this.element.attr("unselectable","on")}this.started=false},mouseDestroy:function(){this.element.unbind("."+this.widgetName);(C.browser.msie&&this.element.attr("unselectable",this._mouseUnselectable))},mouseDown:function(F){(this._mouseStarted&&this.mouseUp(F));this._mouseDownEvent=F;var E=this,G=(F.which==1),D=(typeof this.options.cancel=="string"?C(F.target).is(this.options.cancel):false);if(!G||D||!this.mouseCapture(F)){return true}this._mouseDelayMet=!this.options.delay;if(!this._mouseDelayMet){this._mouseDelayTimer=setTimeout(function(){E._mouseDelayMet=true},this.options.delay)}if(this.mouseDistanceMet(F)&&this.mouseDelayMet(F)){this._mouseStarted=(this.mouseStart(F)!==false);if(!this._mouseStarted){F.preventDefault();return true}}this._mouseMoveDelegate=function(H){return E.mouseMove(H)};this._mouseUpDelegate=function(H){return E.mouseUp(H)};C(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);return false},mouseMove:function(D){if(C.browser.msie&&!D.button){return this.mouseUp(D)}if(this._mouseStarted){this.mouseDrag(D);return false}if(this.mouseDistanceMet(D)&&this.mouseDelayMet(D)){this._mouseStarted=(this.mouseStart(this._mouseDownEvent,D)!==false);(this._mouseStarted?this.mouseDrag(D):this.mouseUp(D))}return !this._mouseStarted},mouseUp:function(D){C(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=false;this.mouseStop(D)}return false},mouseDistanceMet:function(D){return(Math.max(Math.abs(this._mouseDownEvent.pageX-D.pageX),Math.abs(this._mouseDownEvent.pageY-D.pageY))>=this.options.distance)},mouseDelayMet:function(D){return this._mouseDelayMet},mouseStart:function(D){},mouseDrag:function(D){},mouseStop:function(D){},mouseCapture:function(D){return true}};C.ui.mouse.defaults={cancel:null,distance:1,delay:0}})(jQuery);(function(A){A.widget("ui.draggable",A.extend(A.ui.mouse,{init:function(){var B=this.options;if(B.helper=="original"&&!(/(relative|absolute|fixed)/).test(this.element.css("position"))){this.element.css("position","relative")}this.element.addClass("ui-draggable");(B.disabled&&this.element.addClass("ui-draggable-disabled"));this.mouseInit()},mouseStart:function(F){var H=this.options;if(this.helper||H.disabled||A(F.target).is(".ui-resizable-handle")){return false}var C=!this.options.handle||!A(this.options.handle,this.element).length?true:false;A(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==F.target){C=true}});if(!C){return false}if(A.ui.ddmanager){A.ui.ddmanager.current=this}this.helper=A.isFunction(H.helper)?A(H.helper.apply(this.element[0],[F])):(H.helper=="clone"?this.element.clone():this.element);if(!this.helper.parents("body").length){this.helper.appendTo((H.appendTo=="parent"?this.element[0].parentNode:H.appendTo))}if(this.helper[0]!=this.element[0]&&!(/(fixed|absolute)/).test(this.helper.css("position"))){this.helper.css("position","absolute")}this.margins={left:(parseInt(this.element.css("marginLeft"),10)||0),top:(parseInt(this.element.css("marginTop"),10)||0)};this.cssPosition=this.helper.css("position");this.offset=this.element.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};this.offset.click={left:F.pageX-this.offset.left,top:F.pageY-this.offset.top};this.offsetParent=this.helper.offsetParent();var B=this.offsetParent.offset();if(this.offsetParent[0]==document.body&&A.browser.mozilla){B={top:0,left:0}}this.offset.parent={top:B.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:B.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)};var E=this.element.position();this.offset.relative=this.cssPosition=="relative"?{top:E.top-(parseInt(this.helper.css("top"),10)||0)+this.offsetParent[0].scrollTop,left:E.left-(parseInt(this.helper.css("left"),10)||0)+this.offsetParent[0].scrollLeft}:{top:0,left:0};this.originalPosition=this.generatePosition(F);this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};if(H.cursorAt){if(H.cursorAt.left!=undefined){this.offset.click.left=H.cursorAt.left+this.margins.left}if(H.cursorAt.right!=undefined){this.offset.click.left=this.helperProportions.width-H.cursorAt.right+this.margins.left}if(H.cursorAt.top!=undefined){this.offset.click.top=H.cursorAt.top+this.margins.top}if(H.cursorAt.bottom!=undefined){this.offset.click.top=this.helperProportions.height-H.cursorAt.bottom+this.margins.top}}if(H.containment){if(H.containment=="parent"){H.containment=this.helper[0].parentNode}if(H.containment=="document"||H.containment=="window"){this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,A(H.containment=="document"?document:window).width()-this.offset.relative.left-this.offset.parent.left-this.helperProportions.width-this.margins.left-(parseInt(this.element.css("marginRight"),10)||0),(A(H.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.offset.relative.top-this.offset.parent.top-this.helperProportions.height-this.margins.top-(parseInt(this.element.css("marginBottom"),10)||0)]}if(!(/^(document|window|parent)$/).test(H.containment)){var D=A(H.containment)[0];var G=A(H.containment).offset();this.containment=[G.left+(parseInt(A(D).css("borderLeftWidth"),10)||0)-this.offset.relative.left-this.offset.parent.left,G.top+(parseInt(A(D).css("borderTopWidth"),10)||0)-this.offset.relative.top-this.offset.parent.top,G.left+Math.max(D.scrollWidth,D.offsetWidth)-(parseInt(A(D).css("borderLeftWidth"),10)||0)-this.offset.relative.left-this.offset.parent.left-this.helperProportions.width-this.margins.left-(parseInt(this.element.css("marginRight"),10)||0),G.top+Math.max(D.scrollHeight,D.offsetHeight)-(parseInt(A(D).css("borderTopWidth"),10)||0)-this.offset.relative.top-this.offset.parent.top-this.helperProportions.height-this.margins.top-(parseInt(this.element.css("marginBottom"),10)||0)]}}this.propagate("start",F);this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};if(A.ui.ddmanager&&!H.dropBehaviour){A.ui.ddmanager.prepareOffsets(this,F)}this.helper.addClass("ui-draggable-dragging");this.mouseDrag(F);return true},convertPositionTo:function(C,D){if(!D){D=this.position}var B=C=="absolute"?1:-1;return{top:(D.top+this.offset.relative.top*B+this.offset.parent.top*B-(this.cssPosition=="fixed"||(this.cssPosition=="absolute"&&this.offsetParent[0]==document.body)?0:this.offsetParent[0].scrollTop)*B+(this.cssPosition=="fixed"?this.offsetParent[0].scrollTop:0)*B+this.margins.top*B),left:(D.left+this.offset.relative.left*B+this.offset.parent.left*B-(this.cssPosition=="fixed"||(this.cssPosition=="absolute"&&this.offsetParent[0]==document.body)?0:this.offsetParent[0].scrollLeft)*B+(this.cssPosition=="fixed"?this.offsetParent[0].scrollLeft:0)*B+this.margins.left*B)}},generatePosition:function(E){var F=this.options;var B={top:(E.pageY-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(this.cssPosition=="fixed"||(this.cssPosition=="absolute"&&this.offsetParent[0]==document.body)?0:this.offsetParent[0].scrollTop)-(this.cssPosition=="fixed"?this.offsetParent[0].scrollTop:0)),left:(E.pageX-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(this.cssPosition=="fixed"||(this.cssPosition=="absolute"&&this.offsetParent[0]==document.body)?0:this.offsetParent[0].scrollLeft)-(this.cssPosition=="fixed"?this.offsetParent[0].scrollLeft:0))};if(!this.originalPosition){return B}if(this.containment){if(B.left<this.containment[0]){B.left=this.containment[0]}if(B.top<this.containment[1]){B.top=this.containment[1]}if(B.left>this.containment[2]){B.left=this.containment[2]}if(B.top>this.containment[3]){B.top=this.containment[3]}}if(F.grid){var D=this.originalPosition.top+Math.round((B.top-this.originalPosition.top)/F.grid[1])*F.grid[1];B.top=this.containment?(!(D<this.containment[1]||D>this.containment[3])?D:(!(D<this.containment[1])?D-F.grid[1]:D+F.grid[1])):D;var C=this.originalPosition.left+Math.round((B.left-this.originalPosition.left)/F.grid[0])*F.grid[0];B.left=this.containment?(!(C<this.containment[0]||C>this.containment[2])?C:(!(C<this.containment[0])?C-F.grid[0]:C+F.grid[0])):C}return B},mouseDrag:function(B){this.position=this.generatePosition(B);this.positionAbs=this.convertPositionTo("absolute");this.position=this.propagate("drag",B)||this.position;if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"}if(A.ui.ddmanager){A.ui.ddmanager.drag(this,B)}return false},mouseStop:function(C){if(A.ui.ddmanager&&!this.options.dropBehaviour){A.ui.ddmanager.drop(this,C)}if(this.options.revert){var B=this;A(this.helper).animate(this.originalPosition,parseInt(this.options.revert,10)||500,function(){B.propagate("stop",C);B.clear()})}else{this.propagate("stop",C);this.clear()}return false},clear:function(){this.helper.removeClass("ui-draggable-dragging");if(this.options.helper!="original"&&!this.cancelHelperRemoval){this.helper.remove()}this.helper=null;this.cancelHelperRemoval=false},plugins:{},uiHash:function(B){return{helper:this.helper,position:this.position,absolutePosition:this.positionAbs,options:this.options}},propagate:function(C,B){A.ui.plugin.call(this,C,[B,this.uiHash()]);return this.element.triggerHandler(C=="drag"?C:"drag"+C,[B,this.uiHash()],this.options[C])},destroy:function(){if(!this.element.data("draggable")){return }this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable");this.mouseDestroy()}}));A.extend(A.ui.draggable,{defaults:{appendTo:"parent",axis:false,cancel:":input,button",delay:0,distance:0,helper:"original"}});A.ui.plugin.add("draggable","cursor",{start:function(D,C){var B=A("body");if(B.css("cursor")){C.options._cursor=B.css("cursor")}B.css("cursor",C.options.cursor)},stop:function(C,B){if(B.options._cursor){A("body").css("cursor",B.options._cursor)}}});A.ui.plugin.add("draggable","zIndex",{start:function(D,C){var B=A(C.helper);if(B.css("zIndex")){C.options._zIndex=B.css("zIndex")}B.css("zIndex",C.options.zIndex)},stop:function(C,B){if(B.options._zIndex){A(B.helper).css("zIndex",B.options._zIndex)}}});A.ui.plugin.add("draggable","opacity",{start:function(D,C){var B=A(C.helper);if(B.css("opacity")){C.options._opacity=B.css("opacity")}B.css("opacity",C.options.opacity)},stop:function(C,B){if(B.options._opacity){A(B.helper).css("opacity",B.options._opacity)}}});A.ui.plugin.add("draggable","iframeFix",{start:function(C,B){A(B.options.iframeFix===true?"iframe":B.options.iframeFix).each(function(){A('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1000}).css(A(this).offset()).appendTo("body")})},stop:function(C,B){A("div.DragDropIframeFix").each(function(){this.parentNode.removeChild(this)})}});A.ui.plugin.add("draggable","scroll",{start:function(D,C){var E=C.options;var B=A(this).data("draggable");E.scrollSensitivity=E.scrollSensitivity||20;E.scrollSpeed=E.scrollSpeed||20;B.overflowY=function(F){do{if(/auto|scroll/.test(F.css("overflow"))||(/auto|scroll/).test(F.css("overflow-y"))){return F}F=F.parent()}while(F[0].parentNode);return A(document)}(this);B.overflowX=function(F){do{if(/auto|scroll/.test(F.css("overflow"))||(/auto|scroll/).test(F.css("overflow-x"))){return F}F=F.parent()}while(F[0].parentNode);return A(document)}(this);if(B.overflowY[0]!=document&&B.overflowY[0].tagName!="HTML"){B.overflowYOffset=B.overflowY.offset()}if(B.overflowX[0]!=document&&B.overflowX[0].tagName!="HTML"){B.overflowXOffset=B.overflowX.offset()}},drag:function(D,C){var E=C.options;var B=A(this).data("draggable");if(B.overflowY[0]!=document&&B.overflowY[0].tagName!="HTML"){if((B.overflowYOffset.top+B.overflowY[0].offsetHeight)-D.pageY<E.scrollSensitivity){B.overflowY[0].scrollTop=B.overflowY[0].scrollTop+E.scrollSpeed}if(D.pageY-B.overflowYOffset.top<E.scrollSensitivity){B.overflowY[0].scrollTop=B.overflowY[0].scrollTop-E.scrollSpeed}}else{if(D.pageY-A(document).scrollTop()<E.scrollSensitivity){A(document).scrollTop(A(document).scrollTop()-E.scrollSpeed)}if(A(window).height()-(D.pageY-A(document).scrollTop())<E.scrollSensitivity){A(document).scrollTop(A(document).scrollTop()+E.scrollSpeed)}}if(B.overflowX[0]!=document&&B.overflowX[0].tagName!="HTML"){if((B.overflowXOffset.left+B.overflowX[0].offsetWidth)-D.pageX<E.scrollSensitivity){B.overflowX[0].scrollLeft=B.overflowX[0].scrollLeft+E.scrollSpeed}if(D.pageX-B.overflowXOffset.left<E.scrollSensitivity){B.overflowX[0].scrollLeft=B.overflowX[0].scrollLeft-E.scrollSpeed}}else{if(D.pageX-A(document).scrollLeft()<E.scrollSensitivity){A(document).scrollLeft(A(document).scrollLeft()-E.scrollSpeed)}if(A(window).width()-(D.pageX-A(document).scrollLeft())<E.scrollSensitivity){A(document).scrollLeft(A(document).scrollLeft()+E.scrollSpeed)}}}});A.ui.plugin.add("draggable","snap",{start:function(D,C){var B=A(this).data("draggable");B.snapElements=[];A(C.options.snap===true?".ui-draggable":C.options.snap).each(function(){var F=A(this);var E=F.offset();if(this!=B.element[0]){B.snapElements.push({item:this,width:F.outerWidth(),height:F.outerHeight(),top:E.top,left:E.left})}})},drag:function(J,N){var I=A(this).data("draggable");var L=N.options.snapTolerance||20;var D=N.absolutePosition.left,C=D+I.helperProportions.width,P=N.absolutePosition.top,O=P+I.helperProportions.height;for(var H=I.snapElements.length-1;H>=0;H--){var E=I.snapElements[H].left,B=E+I.snapElements[H].width,R=I.snapElements[H].top,M=R+I.snapElements[H].height;if(!((E-L<D&&D<B+L&&R-L<P&&P<M+L)||(E-L<D&&D<B+L&&R-L<O&&O<M+L)||(E-L<C&&C<B+L&&R-L<P&&P<M+L)||(E-L<C&&C<B+L&&R-L<O&&O<M+L))){continue}if(N.options.snapMode!="inner"){var K=Math.abs(R-O)<=20;var Q=Math.abs(M-P)<=20;var G=Math.abs(E-C)<=20;var F=Math.abs(B-D)<=20;if(K){N.position.top=I.convertPositionTo("relative",{top:R-I.helperProportions.height,left:0}).top}if(Q){N.position.top=I.convertPositionTo("relative",{top:M,left:0}).top}if(G){N.position.left=I.convertPositionTo("relative",{top:0,left:E-I.helperProportions.width}).left}if(F){N.position.left=I.convertPositionTo("relative",{top:0,left:B}).left}}if(N.options.snapMode!="outer"){var K=Math.abs(R-P)<=20;var Q=Math.abs(M-O)<=20;var G=Math.abs(E-D)<=20;var F=Math.abs(B-C)<=20;if(K){N.position.top=I.convertPositionTo("relative",{top:R,left:0}).top}if(Q){N.position.top=I.convertPositionTo("relative",{top:M-I.helperProportions.height,left:0}).top}if(G){N.position.left=I.convertPositionTo("relative",{top:0,left:E}).left}if(F){N.position.left=I.convertPositionTo("relative",{top:0,left:B-I.helperProportions.width}).left}}}}});A.ui.plugin.add("draggable","connectToSortable",{start:function(D,C){var B=A(this).data("draggable");B.sortables=[];A(C.options.connectToSortable).each(function(){if(A.data(this,"sortable")){var E=A.data(this,"sortable");B.sortables.push({instance:E,shouldRevert:E.options.revert});E.refresh();E.propagate("activate",D,B)}})},stop:function(D,C){var B=A(this).data("draggable");A.each(B.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;B.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert){this.instance.options.revert=true}this.instance.mouseStop(D);this.instance.element.triggerHandler("sortreceive",[D,A.extend(this.instance.ui(),{sender:B.element})],this.instance.options["receive"]);this.instance.options.helper=this.instance.options._helper}else{this.instance.propagate("deactivate",D,B)}})},drag:function(F,E){var D=A(this).data("draggable"),B=this;var C=function(K){var H=K.left,J=H+K.width,I=K.top,G=I+K.height;return(H<(this.positionAbs.left+this.offset.click.left)&&(this.positionAbs.left+this.offset.click.left)<J&&I<(this.positionAbs.top+this.offset.click.top)&&(this.positionAbs.top+this.offset.click.top)<G)};A.each(D.sortables,function(G){if(C.call(D,this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=A(B).clone().appendTo(this.instance.element).data("sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return E.helper[0]};F.target=this.instance.currentItem[0];this.instance.mouseCapture(F,true,true);this.instance.mouseStart(F,true,true);this.instance.offset.click.top=D.offset.click.top;this.instance.offset.click.left=D.offset.click.left;this.instance.offset.parent.left-=D.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=D.offset.parent.top-this.instance.offset.parent.top;D.propagate("toSortable",F)}if(this.instance.currentItem){this.instance.mouseDrag(F)}}else{if(this.instance.isOver){this.instance.isOver=0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance.mouseStop(F,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();this.instance.placeholder.remove();D.propagate("fromSortable",F)}}})}});A.ui.plugin.add("draggable","stack",{start:function(D,B){var C=A.makeArray(A(B.options.stack.group)).sort(function(F,E){return(parseInt(A(F).css("zIndex"),10)||B.options.stack.min)-(parseInt(A(E).css("zIndex"),10)||B.options.stack.min)});A(C).each(function(E){this.style.zIndex=B.options.stack.min+E});this[0].style.zIndex=B.options.stack.min+C.length}})})(jQuery);(function(A){A.widget("ui.droppable",{init:function(){this.element.addClass("ui-droppable");this.isover=0;this.isout=1;var C=this.options,B=C.accept;C=A.extend(C,{accept:C.accept&&C.accept.constructor==Function?C.accept:function(D){return A(D).is(B)}});this.proportions={width:this.element.outerWidth(),height:this.element.outerHeight()};A.ui.ddmanager.droppables.push(this)},plugins:{},ui:function(B){return{draggable:(B.currentItem||B.element),helper:B.helper,position:B.position,absolutePosition:B.positionAbs,options:this.options,element:this.element}},destroy:function(){var B=A.ui.ddmanager.droppables;for(var C=0;C<B.length;C++){if(B[C]==this){B.splice(C,1)}}this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable")},over:function(C){var B=A.ui.ddmanager.current;if(!B||(B.currentItem||B.element)[0]==this.element[0]){return }if(this.options.accept.call(this.element,(B.currentItem||B.element))){A.ui.plugin.call(this,"over",[C,this.ui(B)]);this.element.triggerHandler("dropover",[C,this.ui(B)],this.options.over)}},out:function(C){var B=A.ui.ddmanager.current;if(!B||(B.currentItem||B.element)[0]==this.element[0]){return }if(this.options.accept.call(this.element,(B.currentItem||B.element))){A.ui.plugin.call(this,"out",[C,this.ui(B)]);this.element.triggerHandler("dropout",[C,this.ui(B)],this.options.out)}},drop:function(D,C){var B=C||A.ui.ddmanager.current;if(!B||(B.currentItem||B.element)[0]==this.element[0]){return false}var E=false;this.element.find(".ui-droppable").not(".ui-draggable-dragging").each(function(){var F=A.data(this,"droppable");if(F.options.greedy&&A.ui.intersect(B,A.extend(F,{offset:F.element.offset()}),F.options.tolerance)){E=true;return false}});if(E){return false}if(this.options.accept.call(this.element,(B.currentItem||B.element))){A.ui.plugin.call(this,"drop",[D,this.ui(B)]);this.element.triggerHandler("drop",[D,this.ui(B)],this.options.drop);return true}return false},activate:function(C){var B=A.ui.ddmanager.current;A.ui.plugin.call(this,"activate",[C,this.ui(B)]);if(B){this.element.triggerHandler("dropactivate",[C,this.ui(B)],this.options.activate)}},deactivate:function(C){var B=A.ui.ddmanager.current;A.ui.plugin.call(this,"deactivate",[C,this.ui(B)]);if(B){this.element.triggerHandler("dropdeactivate",[C,this.ui(B)],this.options.deactivate)}}});A.extend(A.ui.droppable,{defaults:{disabled:false,tolerance:"intersect"}});A.ui.intersect=function(L,F,J){if(!F.offset){return false}var D=(L.positionAbs||L.position.absolute).left,C=D+L.helperProportions.width,I=(L.positionAbs||L.position.absolute).top,H=I+L.helperProportions.height;var E=F.offset.left,B=E+F.proportions.width,K=F.offset.top,G=K+F.proportions.height;switch(J){case"fit":return(E<D&&C<B&&K<I&&H<G);break;case"intersect":return(E<D+(L.helperProportions.width/2)&&C-(L.helperProportions.width/2)<B&&K<I+(L.helperProportions.height/2)&&H-(L.helperProportions.height/2)<G);break;case"pointer":return(E<((L.positionAbs||L.position.absolute).left+(L.clickOffset||L.offset.click).left)&&((L.positionAbs||L.position.absolute).left+(L.clickOffset||L.offset.click).left)<B&&K<((L.positionAbs||L.position.absolute).top+(L.clickOffset||L.offset.click).top)&&((L.positionAbs||L.position.absolute).top+(L.clickOffset||L.offset.click).top)<G);break;case"touch":return((I>=K&&I<=G)||(H>=K&&H<=G)||(I<K&&H>G))&&((D>=E&&D<=B)||(C>=E&&C<=B)||(D<E&&C>B));break;default:return false;break}};A.ui.ddmanager={current:null,droppables:[],prepareOffsets:function(D,F){var B=A.ui.ddmanager.droppables;var E=F?F.type:null;for(var C=0;C<B.length;C++){if(B[C].options.disabled||(D&&!B[C].options.accept.call(B[C].element,(D.currentItem||D.element)))){continue}B[C].visible=B[C].element.is(":visible");if(!B[C].visible){continue}B[C].offset=B[C].element.offset();B[C].proportions={width:B[C].element.outerWidth(),height:B[C].element.outerHeight()};if(E=="dragstart"||E=="sortactivate"){B[C].activate.call(B[C],F)}}},drop:function(B,C){var D=false;A.each(A.ui.ddmanager.droppables,function(){if(!this.options){return }if(!this.options.disabled&&this.visible&&A.ui.intersect(B,this,this.options.tolerance)){D=this.drop.call(this,C)}if(!this.options.disabled&&this.visible&&this.options.accept.call(this.element,(B.currentItem||B.element))){this.isout=1;this.isover=0;this.deactivate.call(this,C)}});return D},drag:function(B,C){if(B.options.refreshPositions){A.ui.ddmanager.prepareOffsets(B,C)}A.each(A.ui.ddmanager.droppables,function(){if(this.disabled||this.greedyChild||!this.visible){return }var E=A.ui.intersect(B,this,this.options.tolerance);var G=!E&&this.isover==1?"isout":(E&&this.isover==0?"isover":null);if(!G){return }var F;if(this.options.greedy){var D=this.element.parents(".ui-droppable:eq(0)");if(D.length){F=A.data(D[0],"droppable");F.greedyChild=(G=="isover"?1:0)}}if(F&&G=="isover"){F["isover"]=0;F["isout"]=1;F.out.call(F,C)}this[G]=1;this[G=="isout"?"isover":"isout"]=0;this[G=="isover"?"over":"out"].call(this,C);if(F&&G=="isout"){F["isout"]=0;F["isover"]=1;F.over.call(F,C)}})}};A.ui.plugin.add("droppable","activeClass",{activate:function(C,B){A(this).addClass(B.options.activeClass)},deactivate:function(C,B){A(this).removeClass(B.options.activeClass)},drop:function(C,B){A(this).removeClass(B.options.activeClass)}});A.ui.plugin.add("droppable","hoverClass",{over:function(C,B){A(this).addClass(B.options.hoverClass)},out:function(C,B){A(this).removeClass(B.options.hoverClass)},drop:function(C,B){A(this).removeClass(B.options.hoverClass)}})})(jQuery);(function(A){A.widget("ui.resizable",A.extend(A.ui.mouse,{init:function(){var M=this,N=this.options;var Q=this.element.css("position");this.element.addClass("ui-resizable").css({position:/static/.test(Q)?"relative":Q});A.extend(N,{_aspectRatio:!!(N.aspectRatio),proxy:N.proxy||N.ghost||N.animate?N.proxy||"proxy":null,knobHandles:N.knobHandles===true?"ui-resizable-knob-handle":N.knobHandles});var H="1px solid #DEDEDE";N.defaultTheme={"ui-resizable":{display:"block"},"ui-resizable-handle":{position:"absolute",background:"#F2F2F2",fontSize:"0.1px"},"ui-resizable-n":{cursor:"n-resize",height:"4px",left:"0px",right:"0px",borderTop:H},"ui-resizable-s":{cursor:"s-resize",height:"4px",left:"0px",right:"0px",borderBottom:H},"ui-resizable-e":{cursor:"e-resize",width:"4px",top:"0px",bottom:"0px",borderRight:H},"ui-resizable-w":{cursor:"w-resize",width:"4px",top:"0px",bottom:"0px",borderLeft:H},"ui-resizable-se":{cursor:"se-resize",width:"4px",height:"4px",borderRight:H,borderBottom:H},"ui-resizable-sw":{cursor:"sw-resize",width:"4px",height:"4px",borderBottom:H,borderLeft:H},"ui-resizable-ne":{cursor:"ne-resize",width:"4px",height:"4px",borderRight:H,borderTop:H},"ui-resizable-nw":{cursor:"nw-resize",width:"4px",height:"4px",borderLeft:H,borderTop:H}};N.knobTheme={"ui-resizable-handle":{background:"#F2F2F2",border:"1px solid #808080",height:"8px",width:"8px"},"ui-resizable-n":{cursor:"n-resize",top:"0px",left:"45%"},"ui-resizable-s":{cursor:"s-resize",bottom:"0px",left:"45%"},"ui-resizable-e":{cursor:"e-resize",right:"0px",top:"45%"},"ui-resizable-w":{cursor:"w-resize",left:"0px",top:"45%"},"ui-resizable-se":{cursor:"se-resize",right:"0px",bottom:"0px"},"ui-resizable-sw":{cursor:"sw-resize",left:"0px",bottom:"0px"},"ui-resizable-nw":{cursor:"nw-resize",left:"0px",top:"0px"},"ui-resizable-ne":{cursor:"ne-resize",right:"0px",top:"0px"}};N._nodeName=this.element[0].nodeName;if(N._nodeName.match(/canvas|textarea|input|select|button|img/i)){var B=this.element;if(/relative/.test(B.css("position"))&&A.browser.opera){B.css({position:"relative",top:"auto",left:"auto"})}B.wrap(A('<div class="ui-wrapper"	style="overflow: hidden;"></div>').css({position:B.css("position"),width:B.outerWidth(),height:B.outerHeight(),top:B.css("top"),left:B.css("left")}));var J=this.element;this.element=this.element.parent();this.element.data("resizable",this);this.element.css({marginLeft:J.css("marginLeft"),marginTop:J.css("marginTop"),marginRight:J.css("marginRight"),marginBottom:J.css("marginBottom")});J.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0});if(A.browser.safari&&N.preventDefault){J.css("resize","none")}N.proportionallyResize=J.css({position:"static",zoom:1,display:"block"});this.element.css({margin:J.css("margin")});this._proportionallyResize()}if(!N.handles){N.handles=!A(".ui-resizable-handle",this.element).length?"e,s,se":{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}}if(N.handles.constructor==String){N.zIndex=N.zIndex||1000;if(N.handles=="all"){N.handles="n,e,s,w,se,sw,ne,nw"}var O=N.handles.split(",");N.handles={};var G={handle:"position: absolute; display: none; overflow:hidden;",n:"top: 0pt; width:100%;",e:"right: 0pt; height:100%;",s:"bottom: 0pt; width:100%;",w:"left: 0pt; height:100%;",se:"bottom: 0pt; right: 0px;",sw:"bottom: 0pt; left: 0px;",ne:"top: 0pt; right: 0px;",nw:"top: 0pt; left: 0px;"};for(var R=0;R<O.length;R++){var S=A.trim(O[R]),L=N.defaultTheme,F="ui-resizable-"+S,C=!A.ui.css(F)&&!N.knobHandles,P=A.ui.css("ui-resizable-knob-handle"),T=A.extend(L[F],L["ui-resizable-handle"]),D=A.extend(N.knobTheme[F],!P?N.knobTheme["ui-resizable-handle"]:{});var K=/sw|se|ne|nw/.test(S)?{zIndex:++N.zIndex}:{};var I=(C?G[S]:""),E=A(['<div class="ui-resizable-handle ',F,'" style="',I,G.handle,'"></div>'].join("")).css(K);N.handles[S]=".ui-resizable-"+S;this.element.append(E.css(C?T:{}).css(N.knobHandles?D:{}).addClass(N.knobHandles?"ui-resizable-knob-handle":"").addClass(N.knobHandles))}if(N.knobHandles){this.element.addClass("ui-resizable-knob").css(!A.ui.css("ui-resizable-knob")?{}:{})}}this._renderAxis=function(Y){Y=Y||this.element;for(var V in N.handles){if(N.handles[V].constructor==String){N.handles[V]=A(N.handles[V],this.element).show()}if(N.transparent){N.handles[V].css({opacity:0})}if(this.element.is(".ui-wrapper")&&N._nodeName.match(/textarea|input|select|button/i)){var W=A(N.handles[V],this.element),X=0;X=/sw|ne|nw|se|n|s/.test(V)?W.outerHeight():W.outerWidth();var U=["padding",/ne|nw|n/.test(V)?"Top":/se|sw|s/.test(V)?"Bottom":/^e$/.test(V)?"Right":"Left"].join("");if(!N.transparent){Y.css(U,X)}this._proportionallyResize()}if(!A(N.handles[V]).length){continue}}};this._renderAxis(this.element);N._handles=A(".ui-resizable-handle",M.element);if(N.disableSelection){N._handles.each(function(U,V){A.ui.disableSelection(V)})}N._handles.mouseover(function(){if(!N.resizing){if(this.className){var U=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)}M.axis=N.axis=U&&U[1]?U[1]:"se"}});if(N.autohide){N._handles.hide();A(M.element).addClass("ui-resizable-autohide").hover(function(){A(this).removeClass("ui-resizable-autohide");N._handles.show()},function(){if(!N.resizing){A(this).addClass("ui-resizable-autohide");N._handles.hide()}})}this.mouseInit()},plugins:{},ui:function(){return{axis:this.options.axis,options:this.options}},propagate:function(C,B){A.ui.plugin.call(this,C,[B,this.ui()]);this.element.triggerHandler(C=="resize"?C:["resize",C].join(""),[B,this.ui()],this.options[C])},destroy:function(){var D=this.element,C=D.children(".ui-resizable").get(0);this.mouseDestroy();var B=function(E){A(E).removeClass("ui-resizable ui-resizable-disabled").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};B(D);if(D.is(".ui-wrapper")&&C){D.parent().append(A(C).css({position:D.css("position"),width:D.outerWidth(),height:D.outerHeight(),top:D.css("top"),left:D.css("left")})).end().remove();B(C)}},mouseStart:function(K){if(this.options.disabled){return false}var J=false;for(var H in this.options.handles){if(A(this.options.handles[H])[0]==K.target){J=true}}if(!J){return false}var C=this.options,B=this.element.position(),D=this.element,I=function(O){return parseInt(O,10)||0},G=A.browser.msie&&A.browser.version<7;C.resizing=true;C.documentScroll={top:A(document).scrollTop(),left:A(document).scrollLeft()};if(D.is(".ui-draggable")||(/absolute/).test(D.css("position"))){var M=A.browser.msie&&!C.containment&&(/absolute/).test(D.css("position"))&&!(/relative/).test(D.parent().css("position"));var L=M?C.documentScroll.top:0,F=M?C.documentScroll.left:0;D.css({position:"absolute",top:(B.top+L),left:(B.left+F)})}if(A.browser.opera&&/relative/.test(D.css("position"))){D.css({position:"relative",top:"auto",left:"auto"})}this._renderProxy();var N=I(this.helper.css("left")),E=I(this.helper.css("top"));this.offset=this.helper.offset();this.position={left:N,top:E};this.size=C.proxy||G?{width:D.outerWidth(),height:D.outerHeight()}:{width:D.width(),height:D.height()};this.originalSize=C.proxy||G?{width:D.outerWidth(),height:D.outerHeight()}:{width:D.width(),height:D.height()};this.originalPosition={left:N,top:E};this.sizeDiff={width:D.outerWidth()-D.width(),height:D.outerHeight()-D.height()};this.originalMousePosition={left:K.pageX,top:K.pageY};C.aspectRatio=(typeof C.aspectRatio=="number")?C.aspectRatio:((this.originalSize.height/this.originalSize.width)||1);if(C.preserveCursor){A("body").css("cursor",this.axis+"-resize")}this.propagate("start",K);return true},mouseDrag:function(I){var D=this.helper,C=this.options,J={},M=this,F=this.originalMousePosition,K=this.axis;var N=(I.pageX-F.left)||0,L=(I.pageY-F.top)||0;var E=this._change[K];if(!E){return false}var H=E.apply(this,[I,N,L]),G=A.browser.msie&&A.browser.version<7,B=this.sizeDiff;if(C._aspectRatio||I.shiftKey){H=this._updateRatio(H,I)}H=this._respectSize(H,I);this.propagate("resize",I);D.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"});if(!C.proxy&&C.proportionallyResize){this._proportionallyResize()}this._updateCache(H);return false},mouseStop:function(I){this.options.resizing=false;var E=this.options,H=function(M){return parseInt(M,10)||0},K=this;if(E.proxy){var D=E.proportionallyResize,B=D&&(/textarea/i).test(D.get(0).nodeName),C=B&&A.ui.hasScroll(D.get(0),"left")?0:K.sizeDiff.height,G=B?0:K.sizeDiff.width;var L={width:(K.size.width-G),height:(K.size.height-C)},F=(parseInt(K.element.css("left"),10)+(K.position.left-K.originalPosition.left))||null,J=(parseInt(K.element.css("top"),10)+(K.position.top-K.originalPosition.top))||null;if(!E.animate){this.element.css(A.extend(L,{top:J,left:F}))}if(E.proxy&&!E.animate){this._proportionallyResize()}}if(E.preserveCursor){A("body").css("cursor","auto")}this.propagate("stop",I);if(E.proxy){this.helper.remove()}return false},_updateCache:function(B){var C=this.options;this.offset=this.helper.offset();if(B.left){this.position.left=B.left}if(B.top){this.position.top=B.top}if(B.height){this.size.height=B.height}if(B.width){this.size.width=B.width}},_updateRatio:function(D,E){var F=this.options,G=this.position,C=this.size,B=this.axis;if(D.height){D.width=(C.height/F.aspectRatio)}else{if(D.width){D.height=(C.width*F.aspectRatio)}}if(B=="sw"){D.left=G.left+(C.width-D.width);D.top=null}if(B=="nw"){D.top=G.top+(C.height-D.height);D.left=G.left+(C.width-D.width)}return D},_respectSize:function(H,I){var F=this.helper,E=this.options,N=E._aspectRatio||I.shiftKey,M=this.axis,P=H.width&&E.maxWidth&&E.maxWidth<H.width,J=H.height&&E.maxHeight&&E.maxHeight<H.height,D=H.width&&E.minWidth&&E.minWidth>H.width,O=H.height&&E.minHeight&&E.minHeight>H.height;if(D){H.width=E.minWidth}if(O){H.height=E.minHeight}if(P){H.width=E.maxWidth}if(J){H.height=E.maxHeight}var C=this.originalPosition.left+this.originalSize.width,L=this.position.top+this.size.height;var G=/sw|nw|w/.test(M),B=/nw|ne|n/.test(M);if(D&&G){H.left=C-E.minWidth}if(P&&G){H.left=C-E.maxWidth}if(O&&B){H.top=L-E.minHeight}if(J&&B){H.top=L-E.maxHeight}var K=!H.width&&!H.height;if(K&&!H.left&&H.top){H.top=null}else{if(K&&!H.top&&H.left){H.left=null}}return H},_proportionallyResize:function(){var F=this.options;if(!F.proportionallyResize){return }var D=F.proportionallyResize,C=this.helper||this.element;if(!F.borderDif){var B=[D.css("borderTopWidth"),D.css("borderRightWidth"),D.css("borderBottomWidth"),D.css("borderLeftWidth")],E=[D.css("paddingTop"),D.css("paddingRight"),D.css("paddingBottom"),D.css("paddingLeft")];F.borderDif=A.map(B,function(G,I){var H=parseInt(G,10)||0,J=parseInt(E[I],10)||0;return H+J})}D.css({height:(C.height()-F.borderDif[0]-F.borderDif[2])+"px",width:(C.width()-F.borderDif[1]-F.borderDif[3])+"px"})},_renderProxy:function(){var C=this.element,F=this.options;this.elementOffset=C.offset();if(F.proxy){this.helper=this.helper||A('<div style="overflow:hidden;"></div>');var B=A.browser.msie&&A.browser.version<7,D=(B?1:0),E=(B?2:-1);this.helper.addClass(F.proxy).css({width:C.outerWidth()+E,height:C.outerHeight()+E,position:"absolute",left:this.elementOffset.left-D+"px",top:this.elementOffset.top-D+"px",zIndex:++F.zIndex});this.helper.appendTo("body");if(F.disableSelection){A.ui.disableSelection(this.helper.get(0))}}else{this.helper=C}},_change:{e:function(D,C,B){return{width:this.originalSize.width+C}},w:function(F,C,B){var G=this.options,D=this.originalSize,E=this.originalPosition;return{left:E.left+C,width:D.width-C}},n:function(F,C,B){var G=this.options,D=this.originalSize,E=this.originalPosition;return{top:E.top+B,height:D.height-B}},s:function(D,C,B){return{height:this.originalSize.height+B}},se:function(D,C,B){return A.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[D,C,B]))},sw:function(D,C,B){return A.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[D,C,B]))},ne:function(D,C,B){return A.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[D,C,B]))},nw:function(D,C,B){return A.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[D,C,B]))}}}));A.extend(A.ui.resizable,{defaults:{cancel:":input,button",distance:0,delay:0,preventDefault:true,transparent:false,minWidth:10,minHeight:10,aspectRatio:false,disableSelection:true,preserveCursor:true,autohide:false,knobHandles:false}});A.ui.plugin.add("resizable","containment",{start:function(I,K){var E=K.options,M=A(this).data("resizable"),G=M.element;var C=E.containment,F=(C instanceof A)?C.get(0):(/parent/.test(C))?G.parent().get(0):C;if(!F){return }M.containerElement=A(F);if(/document/.test(C)||C==document){M.containerOffset={left:0,top:0};M.containerPosition={left:0,top:0};M.parentData={element:A(document),left:0,top:0,width:A(document).width(),height:A(document).height()||document.body.parentNode.scrollHeight}}else{M.containerOffset=A(F).offset();M.containerPosition=A(F).position();M.containerSize={height:A(F).innerHeight(),width:A(F).innerWidth()};var J=M.containerOffset,B=M.containerSize.height,H=M.containerSize.width,D=(A.ui.hasScroll(F,"left")?F.scrollWidth:H),L=(A.ui.hasScroll(F)?F.scrollHeight:B);M.parentData={element:F,left:J.left,top:J.top,width:D,height:L}}},resize:function(H,K){var E=K.options,N=A(this).data("resizable"),C=N.containerSize,J=N.containerOffset,G=N.size,I=N.position,L=E._aspectRatio||H.shiftKey,B={top:0,left:0},D=N.containerElement;if(/static/.test(D.css("position"))){B=N.containerPosition}if(I.left<(E.proxy?J.left:B.left)){N.size.width=N.size.width+(E.proxy?(N.position.left-J.left):(N.position.left-B.left));if(L){N.size.height=N.size.width*E.aspectRatio}N.position.left=E.proxy?J.left:B.left}if(I.top<(E.proxy?J.top:0)){N.size.height=N.size.height+(E.proxy?(N.position.top-J.top):N.position.top);if(L){N.size.width=N.size.height/E.aspectRatio}N.position.top=E.proxy?J.top:0}var F=(E.proxy?N.offset.left-J.left:(N.position.left-B.left))+N.sizeDiff.width,M=(E.proxy?N.offset.top-J.top:N.position.top)+N.sizeDiff.height;if(F+N.size.width>=N.parentData.width){N.size.width=N.parentData.width-F;if(L){N.size.height=N.size.width*E.aspectRatio}}if(M+N.size.height>=N.parentData.height){N.size.height=N.parentData.height-M;if(L){N.size.width=N.size.height/E.aspectRatio}}},stop:function(G,J){var C=J.options,L=A(this).data("resizable"),H=L.position,I=L.containerOffset,B=L.containerPosition,D=L.containerElement;var E=A(L.helper),M=E.offset(),K=E.innerWidth(),F=E.innerHeight();if(C.proxy&&!C.animate&&/relative/.test(D.css("position"))){A(this).css({left:(M.left-I.left),top:(M.top-I.top),width:K,height:F})}if(C.proxy&&!C.animate&&/static/.test(D.css("position"))){A(this).css({left:B.left+(M.left-I.left),top:B.top+(M.top-I.top),width:K,height:F})}}});A.ui.plugin.add("resizable","grid",{resize:function(H,J){var D=J.options,L=A(this).data("resizable"),G=L.size,E=L.originalSize,F=L.originalPosition,K=L.axis,I=D._aspectRatio||H.shiftKey;D.grid=typeof D.grid=="number"?[D.grid,D.grid]:D.grid;var C=Math.round((G.width-E.width)/(D.grid[0]||1))*(D.grid[0]||1),B=Math.round((G.height-E.height)/(D.grid[1]||1))*(D.grid[1]||1);if(/^(se|s|e)$/.test(K)){L.size.width=E.width+C;L.size.height=E.height+B}else{if(/^(ne)$/.test(K)){L.size.width=E.width+C;L.size.height=E.height+B;L.position.top=F.top-B}else{if(/^(sw)$/.test(K)){L.size.width=E.width+C;L.size.height=E.height+B;L.position.left=F.left-C}else{L.size.width=E.width+C;L.size.height=E.height+B;L.position.top=F.top-B;L.position.left=F.left-C}}}}});A.ui.plugin.add("resizable","animate",{stop:function(I,K){var F=K.options,L=A(this).data("resizable");var E=F.proportionallyResize,B=E&&(/textarea/i).test(E.get(0).nodeName),C=B&&A.ui.hasScroll(E.get(0),"left")?0:L.sizeDiff.height,H=B?0:L.sizeDiff.width;var D={width:(L.size.width-H),height:(L.size.height-C)},G=(parseInt(L.element.css("left"),10)+(L.position.left-L.originalPosition.left))||null,J=(parseInt(L.element.css("top"),10)+(L.position.top-L.originalPosition.top))||null;L.element.animate(A.extend(D,J&&G?{top:J,left:G}:{}),{duration:F.animateDuration||"slow",easing:F.animateEasing||"swing",step:function(){var M={width:parseInt(L.element.css("width"),10),height:parseInt(L.element.css("height"),10),top:parseInt(L.element.css("top"),10),left:parseInt(L.element.css("left"),10)};if(E){E.css({width:M.width,height:M.height})}L._updateCache(M);L.propagate("animate",I)}})}});A.ui.plugin.add("resizable","ghost",{start:function(E,D){var F=D.options,B=A(this).data("resizable"),G=F.proportionallyResize,C=B.size;if(!G){B.ghost=B.element.clone()}else{B.ghost=G.clone()}B.ghost.css({opacity:0.25,display:"block",position:"relative",height:C.height,width:C.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof F.ghost=="string"?F.ghost:"");B.ghost.appendTo(B.helper)},resize:function(D,C){var E=C.options,B=A(this).data("resizable"),F=E.proportionallyResize;if(B.ghost){B.ghost.css({position:"relative",height:B.size.height,width:B.size.width})}},stop:function(D,C){var E=C.options,B=A(this).data("resizable"),F=E.proportionallyResize;if(B.ghost&&B.helper){B.helper.get(0).removeChild(B.ghost.get(0))}}});A.ui.plugin.add("resizable","alsoResize",{start:function(E,C){var F=C.options,B=A(this).data("resizable"),D=function(G){A(G).each(function(){A(this).data("resizable-alsoresize",{width:parseInt(A(this).width(),10),height:parseInt(A(this).height(),10),left:parseInt(A(this).css("left"),10),top:parseInt(A(this).css("top"),10)})})};if(typeof (F.alsoResize)=="object"){A.each(F.alsoResize,function(G,H){D(G)})}else{D(F.alsoResize)}},resize:function(F,E){var G=E.options,C=A(this).data("resizable"),D=C.originalSize,I=C.originalPosition;var H={height:(C.size.height-D.height)||0,width:(C.size.width-D.width)||0,top:(C.position.top-I.top)||0,left:(C.position.left-I.left)||0},B=function(J,K){A(J).each(function(){var N=A(this).data("resizable-alsoresize"),M={},L=K&&K.length?K:["width","height","top","left"];A.each(L||["width","height","top","left"],function(O,Q){var P=(N[Q]||0)+(H[Q]||0);if(P&&P>=0){M[Q]=P||null}});A(this).css(M)})};if(typeof (G.alsoResize)=="object"){A.each(G.alsoResize,function(J,K){B(J,K)})}else{B(G.alsoResize)}},stop:function(C,B){A(this).removeData("resizable-alsoresize-start")}})})(jQuery);(function(A){A.widget("ui.selectable",A.extend(A.ui.mouse,{init:function(){var B=this;this.element.addClass("ui-selectable");this.dragged=false;var C;this.refresh=function(){C=A(B.options.filter,B.element[0]);C.each(function(){var D=A(this);var E=D.offset();A.data(this,"selectable-item",{element:this,$element:D,left:E.left,top:E.top,right:E.left+D.width(),bottom:E.top+D.height(),startselected:false,selected:D.hasClass("ui-selected"),selecting:D.hasClass("ui-selecting"),unselecting:D.hasClass("ui-unselecting")})})};this.refresh();this.selectees=C.addClass("ui-selectee");this.mouseInit();this.helper=A(document.createElement("div")).css({border:"1px dotted black"})},toggle:function(){if(this.options.disabled){this.enable()}else{this.disable()}},destroy:function(){this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable");this.mouseDestroy()},mouseStart:function(E){var C=this;this.opos=[E.pageX,E.pageY];if(this.options.disabled){return }var D=this.options;this.selectees=A(D.filter,this.element[0]);this.element.triggerHandler("selectablestart",[E,{"selectable":this.element[0],"options":D}],D.start);A("body").append(this.helper);this.helper.css({"z-index":100,"position":"absolute","left":E.clientX,"top":E.clientY,"width":0,"height":0});if(D.autoRefresh){this.refresh()}this.selectees.filter(".ui-selected").each(function(){var F=A.data(this,"selectable-item");F.startselected=true;if(!E.ctrlKey){F.$element.removeClass("ui-selected");F.selected=false;F.$element.addClass("ui-unselecting");F.unselecting=true;C.element.triggerHandler("selectableunselecting",[E,{selectable:C.element[0],unselecting:F.element,options:D}],D.unselecting)}});var B=false;A(E.target).parents().andSelf().each(function(){if(A.data(this,"selectable-item")){B=true}});return this.options.keyboard?!B:true},mouseDrag:function(I){var C=this;this.dragged=true;if(this.options.disabled){return }var E=this.options;var D=this.opos[0],H=this.opos[1],B=I.pageX,G=I.pageY;if(D>B){var F=B;B=D;D=F}if(H>G){var F=G;G=H;H=F}this.helper.css({left:D,top:H,width:B-D,height:G-H});this.selectees.each(function(){var J=A.data(this,"selectable-item");if(!J||J.element==C.element[0]){return }var K=false;if(E.tolerance=="touch"){K=(!(J.left>B||J.right<D||J.top>G||J.bottom<H))}else{if(E.tolerance=="fit"){K=(J.left>D&&J.right<B&&J.top>H&&J.bottom<G)}}if(K){if(J.selected){J.$element.removeClass("ui-selected");J.selected=false}if(J.unselecting){J.$element.removeClass("ui-unselecting");J.unselecting=false}if(!J.selecting){J.$element.addClass("ui-selecting");J.selecting=true;C.element.triggerHandler("selectableselecting",[I,{selectable:C.element[0],selecting:J.element,options:E}],E.selecting)}}else{if(J.selecting){if(I.ctrlKey&&J.startselected){J.$element.removeClass("ui-selecting");J.selecting=false;J.$element.addClass("ui-selected");J.selected=true}else{J.$element.removeClass("ui-selecting");J.selecting=false;if(J.startselected){J.$element.addClass("ui-unselecting");J.unselecting=true}C.element.triggerHandler("selectableunselecting",[I,{selectable:C.element[0],unselecting:J.element,options:E}],E.unselecting)}}if(J.selected){if(!I.ctrlKey&&!J.startselected){J.$element.removeClass("ui-selected");J.selected=false;J.$element.addClass("ui-unselecting");J.unselecting=true;C.element.triggerHandler("selectableunselecting",[I,{selectable:C.element[0],unselecting:J.element,options:E}],E.unselecting)}}}});return false},mouseStop:function(D){var B=this;this.dragged=false;var C=this.options;A(".ui-unselecting",this.element[0]).each(function(){var E=A.data(this,"selectable-item");E.$element.removeClass("ui-unselecting");E.unselecting=false;E.startselected=false;B.element.triggerHandler("selectableunselected",[D,{selectable:B.element[0],unselected:E.element,options:C}],C.unselected)});A(".ui-selecting",this.element[0]).each(function(){var E=A.data(this,"selectable-item");E.$element.removeClass("ui-selecting").addClass("ui-selected");E.selecting=false;E.selected=true;E.startselected=true;B.element.triggerHandler("selectableselected",[D,{selectable:B.element[0],selected:E.element,options:C}],C.selected)});this.element.triggerHandler("selectablestop",[D,{selectable:B.element[0],options:this.options}],this.options.stop);this.helper.remove();return false}}));A.extend(A.ui.selectable,{defaults:{distance:0,delay:0,cancel:":input,button",appendTo:"body",autoRefresh:true,filter:"*",tolerance:"touch"}})})(jQuery);(function(B){function A(E,D){var C=B.browser.safari&&B.browser.version<522;if(E.contains&&!C){return E.contains(D)}if(E.compareDocumentPosition){return !!(E.compareDocumentPosition(D)&16)}while(D=D.parentNode){if(D==E){return true}}return false}B.widget("ui.sortable",B.extend(B.ui.mouse,{init:function(){var C=this.options;this.containerCache={};this.element.addClass("ui-sortable");this.refresh();this.floating=this.items.length?(/left|right/).test(this.items[0].item.css("float")):false;if(!(/(relative|absolute|fixed)/).test(this.element.css("position"))){this.element.css("position","relative")}this.offset=this.element.offset();this.mouseInit()},plugins:{},ui:function(C){return{helper:(C||this)["helper"],placeholder:(C||this)["placeholder"]||B([]),position:(C||this)["position"],absolutePosition:(C||this)["positionAbs"],options:this.options,element:this.element,item:(C||this)["currentItem"],sender:C?C.element:null}},propagate:function(F,E,C,D){B.ui.plugin.call(this,F,[E,this.ui(C)]);if(!D){this.element.triggerHandler(F=="sort"?F:"sort"+F,[E,this.ui(C)],this.options[F])}},serialize:function(E){var C=(B.isFunction(this.options.items)?this.options.items.call(this.element):B(this.options.items,this.element)).not(".ui-sortable-helper");var D=[];E=E||{};C.each(function(){var F=(B(this).attr(E.attribute||"id")||"").match(E.expression||(/(.+)[-=_](.+)/));if(F){D.push((E.key||F[1])+"[]="+(E.key?F[1]:F[2]))}});return D.join("&")},toArray:function(C){var D=(B.isFunction(this.options.items)?this.options.items.call(this.element):B(this.options.items,this.element)).not(".ui-sortable-helper");var E=[];D.each(function(){E.push(B(this).attr(C||"id"))});return E},intersectsWith:function(J){var E=this.positionAbs.left,D=E+this.helperProportions.width,I=this.positionAbs.top,H=I+this.helperProportions.height;var F=J.left,C=F+J.width,K=J.top,G=K+J.height;if(this.options.tolerance=="pointer"||(this.options.tolerance=="guess"&&this.helperProportions[this.floating?"width":"height"]>J[this.floating?"width":"height"])){return(I+this.offset.click.top>K&&I+this.offset.click.top<G&&E+this.offset.click.left>F&&E+this.offset.click.left<C)}else{return(F<E+(this.helperProportions.width/2)&&D-(this.helperProportions.width/2)<C&&K<I+(this.helperProportions.height/2)&&H-(this.helperProportions.height/2)<G)}},intersectsWithEdge:function(J){var E=this.positionAbs.left,D=E+this.helperProportions.width,I=this.positionAbs.top,H=I+this.helperProportions.height;var F=J.left,C=F+J.width,K=J.top,G=K+J.height;if(this.options.tolerance=="pointer"||(this.options.tolerance=="guess"&&this.helperProportions[this.floating?"width":"height"]>J[this.floating?"width":"height"])){if(!(I+this.offset.click.top>K&&I+this.offset.click.top<G&&E+this.offset.click.left>F&&E+this.offset.click.left<C)){return false}if(this.floating){if(E+this.offset.click.left>F&&E+this.offset.click.left<F+J.width/2){return 2}if(E+this.offset.click.left>F+J.width/2&&E+this.offset.click.left<C){return 1}}else{if(I+this.offset.click.top>K&&I+this.offset.click.top<K+J.height/2){return 2}if(I+this.offset.click.top>K+J.height/2&&I+this.offset.click.top<G){return 1}}}else{if(!(F<E+(this.helperProportions.width/2)&&D-(this.helperProportions.width/2)<C&&K<I+(this.helperProportions.height/2)&&H-(this.helperProportions.height/2)<G)){return false}if(this.floating){if(D>F&&E<F){return 2}if(E<C&&D>C){return 1}}else{if(H>K&&I<K){return 1}if(I<G&&H>G){return 2}}}return false},refresh:function(){this.refreshItems();this.refreshPositions()},refreshItems:function(){this.items=[];this.containers=[this];var C=this.items;var E=[B.isFunction(this.options.items)?this.options.items.call(this.element):B(this.options.items,this.element)];if(this.options.connectWith){for(var F=this.options.connectWith.length-1;F>=0;F--){var H=B(this.options.connectWith[F]);for(var D=H.length-1;D>=0;D--){var G=B.data(H[D],"sortable");if(G&&!G.options.disabled){E.push(B.isFunction(G.options.items)?G.options.items.call(G.element):B(G.options.items,G.element));this.containers.push(G)}}}}for(var F=E.length-1;F>=0;F--){E[F].each(function(){B.data(this,"sortable-item",true);C.push({item:B(this),width:0,height:0,left:0,top:0})})}},refreshPositions:function(C){for(var E=this.items.length-1;E>=0;E--){var D=this.items[E].item;if(!C){this.items[E].width=(this.options.toleranceElement?B(this.options.toleranceElement,D):D).outerWidth()}if(!C){this.items[E].height=(this.options.toleranceElement?B(this.options.toleranceElement,D):D).outerHeight()}var F=(this.options.toleranceElement?B(this.options.toleranceElement,D):D).offset();this.items[E].left=F.left;this.items[E].top=F.top}for(var E=this.containers.length-1;E>=0;E--){var F=this.containers[E].element.offset();this.containers[E].containerCache.left=F.left;this.containers[E].containerCache.top=F.top;this.containers[E].containerCache.width=this.containers[E].element.outerWidth();this.containers[E].containerCache.height=this.containers[E].element.outerHeight()}},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");this.mouseDestroy();for(var C=this.items.length-1;C>=0;C--){this.items[C].item.removeData("sortable-item")}},createPlaceholder:function(E){var C=E||this,F=C.options;if(F.placeholder.constructor==String){var D=F.placeholder;F.placeholder={element:function(){return B("<div></div>").addClass(D)[0]},update:function(G,H){H.css(G.offset()).css({width:G.outerWidth(),height:G.outerHeight()})}}}C.placeholder=B(F.placeholder.element.call(C.element,C.currentItem)).appendTo("body").css({position:"absolute"});F.placeholder.update.call(C.element,C.currentItem,C.placeholder)},contactContainers:function(F){for(var D=this.containers.length-1;D>=0;D--){if(this.intersectsWith(this.containers[D].containerCache)){if(!this.containers[D].containerCache.over){if(this.currentContainer!=this.containers[D]){var I=10000;var H=null;var E=this.positionAbs[this.containers[D].floating?"left":"top"];for(var C=this.items.length-1;C>=0;C--){if(!A(this.containers[D].element[0],this.items[C].item[0])){continue}var G=this.items[C][this.containers[D].floating?"left":"top"];if(Math.abs(G-E)<I){I=Math.abs(G-E);H=this.items[C]}}if(!H&&!this.options.dropOnEmpty){continue}if(this.placeholder){this.placeholder.remove()}if(this.containers[D].options.placeholder){this.containers[D].createPlaceholder(this)}else{this.placeholder=null}H?this.rearrange(F,H):this.rearrange(F,null,this.containers[D].element);this.propagate("change",F);this.containers[D].propagate("change",F,this);this.currentContainer=this.containers[D]}this.containers[D].propagate("over",F,this);this.containers[D].containerCache.over=1}}else{if(this.containers[D].containerCache.over){this.containers[D].propagate("out",F,this);this.containers[D].containerCache.over=0}}}},mouseCapture:function(F,E){if(this.options.disabled||this.options.type=="static"){return false}var D=null,C=B(F.target).parents().each(function(){if(B.data(this,"sortable-item")){D=B(this);return false}});if(B.data(F.target,"sortable-item")){D=B(F.target)}if(!D){return false}if(this.options.handle&&!E){var G=false;B(this.options.handle,D).find("*").andSelf().each(function(){if(this==F.target){G=true}});if(!G){return false}}this.currentItem=D;return true},mouseStart:function(H,F,C){var J=this.options;this.currentContainer=this;this.refresh();this.helper=typeof J.helper=="function"?B(J.helper.apply(this.element[0],[H,this.currentItem])):this.currentItem.clone();if(!this.helper.parents("body").length){this.helper.appendTo((J.appendTo!="parent"?J.appendTo:this.currentItem[0].parentNode))}this.helper.css({position:"absolute",clear:"both"}).addClass("ui-sortable-helper");this.margins={left:(parseInt(this.currentItem.css("marginLeft"),10)||0),top:(parseInt(this.currentItem.css("marginTop"),10)||0)};this.offset=this.currentItem.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};this.offset.click={left:H.pageX-this.offset.left,top:H.pageY-this.offset.top};this.offsetParent=this.helper.offsetParent();var D=this.offsetParent.offset();this.offset.parent={top:D.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:D.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)};this.originalPosition=this.generatePosition(H);this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};if(J.cursorAt){if(J.cursorAt.left!=undefined){this.offset.click.left=J.cursorAt.left}if(J.cursorAt.right!=undefined){this.offset.click.left=this.helperProportions.width-J.cursorAt.right}if(J.cursorAt.top!=undefined){this.offset.click.top=J.cursorAt.top}if(J.cursorAt.bottom!=undefined){this.offset.click.top=this.helperProportions.height-J.cursorAt.bottom}}this.domPosition=this.currentItem.prev()[0];if(J.containment){if(J.containment=="parent"){J.containment=this.helper[0].parentNode}if(J.containment=="document"||J.containment=="window"){this.containment=[0-this.offset.parent.left,0-this.offset.parent.top,B(J.containment=="document"?document:window).width()-this.offset.parent.left-this.helperProportions.width-this.margins.left-(parseInt(this.element.css("marginRight"),10)||0),(B(J.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.offset.parent.top-this.helperProportions.height-this.margins.top-(parseInt(this.element.css("marginBottom"),10)||0)]}if(!(/^(document|window|parent)$/).test(J.containment)){var G=B(J.containment)[0];var I=B(J.containment).offset();this.containment=[I.left+(parseInt(B(G).css("borderLeftWidth"),10)||0)-this.offset.parent.left,I.top+(parseInt(B(G).css("borderTopWidth"),10)||0)-this.offset.parent.top,I.left+Math.max(G.scrollWidth,G.offsetWidth)-(parseInt(B(G).css("borderLeftWidth"),10)||0)-this.offset.parent.left-this.helperProportions.width-this.margins.left-(parseInt(this.currentItem.css("marginRight"),10)||0),I.top+Math.max(G.scrollHeight,G.offsetHeight)-(parseInt(B(G).css("borderTopWidth"),10)||0)-this.offset.parent.top-this.helperProportions.height-this.margins.top-(parseInt(this.currentItem.css("marginBottom"),10)||0)]}}if(J.placeholder){this.createPlaceholder()}this.propagate("start",H);this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};if(this.options.placeholder!="clone"){this.currentItem.css("visibility","hidden")}if(!C){for(var E=this.containers.length-1;E>=0;E--){this.containers[E].propagate("activate",H,this)}}if(B.ui.ddmanager){B.ui.ddmanager.current=this}if(B.ui.ddmanager&&!J.dropBehaviour){B.ui.ddmanager.prepareOffsets(this,H)}this.dragging=true;this.mouseDrag(H);return true},convertPositionTo:function(D,E){if(!E){E=this.position}var C=D=="absolute"?1:-1;return{top:(E.top+this.offset.parent.top*C-(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)*C+this.margins.top*C),left:(E.left+this.offset.parent.left*C-(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft)*C+this.margins.left*C)}},generatePosition:function(F){var G=this.options;var C={top:(F.pageY-this.offset.click.top-this.offset.parent.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)),left:(F.pageX-this.offset.click.left-this.offset.parent.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft))};if(!this.originalPosition){return C}if(this.containment){if(C.left<this.containment[0]){C.left=this.containment[0]}if(C.top<this.containment[1]){C.top=this.containment[1]}if(C.left>this.containment[2]){C.left=this.containment[2]}if(C.top>this.containment[3]){C.top=this.containment[3]}}if(G.grid){var E=this.originalPosition.top+Math.round((C.top-this.originalPosition.top)/G.grid[1])*G.grid[1];C.top=this.containment?(!(E<this.containment[1]||E>this.containment[3])?E:(!(E<this.containment[1])?E-G.grid[1]:E+G.grid[1])):E;var D=this.originalPosition.left+Math.round((C.left-this.originalPosition.left)/G.grid[0])*G.grid[0];C.left=this.containment?(!(D<this.containment[0]||D>this.containment[2])?D:(!(D<this.containment[0])?D-G.grid[0]:D+G.grid[0])):D}return C},mouseDrag:function(D){this.position=this.generatePosition(D);this.positionAbs=this.convertPositionTo("absolute");for(var C=this.items.length-1;C>=0;C--){var E=this.intersectsWithEdge(this.items[C]);if(!E){continue}if(this.items[C].item[0]!=this.currentItem[0]&&this.currentItem[E==1?"next":"prev"]()[0]!=this.items[C].item[0]&&!A(this.currentItem[0],this.items[C].item[0])&&(this.options.type=="semi-dynamic"?!A(this.element[0],this.items[C].item[0]):true)){this.direction=E==1?"down":"up";this.rearrange(D,this.items[C]);this.propagate("change",D);break}}this.contactContainers(D);this.propagate("sort",D);if(!this.options.axis||this.options.axis=="x"){this.helper[0].style.left=this.position.left+"px"}if(!this.options.axis||this.options.axis=="y"){this.helper[0].style.top=this.position.top+"px"}if(B.ui.ddmanager){B.ui.ddmanager.drag(this,D)}return false},mouseStop:function(E,D){if(B.ui.ddmanager&&!this.options.dropBehaviour){B.ui.ddmanager.drop(this,E)}if(this.options.revert){var C=this;var F=C.currentItem.offset();if(C.placeholder){C.placeholder.animate({opacity:"hide"},(parseInt(this.options.revert,10)||500)-50)}B(this.helper).animate({left:F.left-this.offset.parent.left-C.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:F.top-this.offset.parent.top-C.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){C.propagate("stop",E,null,D);C.clear(E)})}else{this.propagate("stop",E,null,D);this.clear(E,D)}return false},clear:function(E,D){if(this.domPosition!=this.currentItem.prev().not(".ui-sortable-helper")[0]){this.propagate("update",E,null,D)}if(!A(this.element[0],this.currentItem[0])){if(this.domPosition==this.currentItem.prev().not(".ui-sortable-helper")[0]){this.propagate("update",E,null,D)}this.propagate("remove",E,null,D);for(var C=this.containers.length-1;C>=0;C--){if(A(this.containers[C].element[0],this.currentItem[0])){this.containers[C].propagate("update",E,this,D);this.containers[C].propagate("receive",E,this,D)}}}for(var C=this.containers.length-1;C>=0;C--){this.containers[C].propagate("deactivate",E,this,D);if(this.containers[C].containerCache.over){this.containers[C].propagate("out",E,this);this.containers[C].containerCache.over=0}}this.dragging=false;if(this.cancelHelperRemoval){return false}B(this.currentItem).css("visibility","");if(this.placeholder){this.placeholder.remove()}this.helper.remove();return true},rearrange:function(E,D,C){C?C.append(this.currentItem):D.item[this.direction=="down"?"before":"after"](this.currentItem);this.refreshPositions(true);if(this.options.placeholder){this.options.placeholder.update.call(this.element,this.currentItem,this.placeholder)}}}));B.extend(B.ui.sortable,{getter:"serialize toArray",defaults:{tolerance:"guess",distance:0,delay:0,cancel:":input,button",items:"> *",zIndex:1000,dropOnEmpty:true,appendTo:"parent"}});B.ui.plugin.add("sortable","cursor",{start:function(E,D){var C=B("body");if(C.css("cursor")){D.options._cursor=C.css("cursor")}C.css("cursor",D.options.cursor)},stop:function(D,C){if(C.options._cursor){B("body").css("cursor",C.options._cursor)}}});B.ui.plugin.add("sortable","zIndex",{start:function(E,D){var C=D.helper;if(C.css("zIndex")){D.options._zIndex=C.css("zIndex")}C.css("zIndex",D.options.zIndex)},stop:function(D,C){if(C.options._zIndex){B(C.helper).css("zIndex",C.options._zIndex)}}});B.ui.plugin.add("sortable","opacity",{start:function(E,D){var C=D.helper;if(C.css("opacity")){D.options._opacity=C.css("opacity")}C.css("opacity",D.options.opacity)},stop:function(D,C){if(C.options._opacity){B(C.helper).css("opacity",C.options._opacity)}}});B.ui.plugin.add("sortable","scroll",{start:function(E,D){var F=D.options;var C=B(this).data("sortable");F.scrollSensitivity=F.scrollSensitivity||20;F.scrollSpeed=F.scrollSpeed||20;C.overflowY=function(G){do{if(/auto|scroll/.test(G.css("overflow"))||(/auto|scroll/).test(G.css("overflow-y"))){return G}G=G.parent()}while(G[0].parentNode);return B(document)}(C.currentItem);C.overflowX=function(G){do{if(/auto|scroll/.test(G.css("overflow"))||(/auto|scroll/).test(G.css("overflow-x"))){return G}G=G.parent()}while(G[0].parentNode);return B(document)}(C.currentItem);if(C.overflowY[0]!=document&&C.overflowY[0].tagName!="HTML"){C.overflowYOffset=C.overflowY.offset()}if(C.overflowX[0]!=document&&C.overflowX[0].tagName!="HTML"){C.overflowXOffset=C.overflowX.offset()}},sort:function(E,D){var F=D.options;var C=B(this).data("sortable");if(C.overflowY[0]!=document&&C.overflowY[0].tagName!="HTML"){if((C.overflowYOffset.top+C.overflowY[0].offsetHeight)-E.pageY<F.scrollSensitivity){C.overflowY[0].scrollTop=C.overflowY[0].scrollTop+F.scrollSpeed}if(E.pageY-C.overflowYOffset.top<F.scrollSensitivity){C.overflowY[0].scrollTop=C.overflowY[0].scrollTop-F.scrollSpeed}}else{if(E.pageY-B(document).scrollTop()<F.scrollSensitivity){B(document).scrollTop(B(document).scrollTop()-F.scrollSpeed)}if(B(window).height()-(E.pageY-B(document).scrollTop())<F.scrollSensitivity){B(document).scrollTop(B(document).scrollTop()+F.scrollSpeed)}}if(C.overflowX[0]!=document&&C.overflowX[0].tagName!="HTML"){if((C.overflowXOffset.left+C.overflowX[0].offsetWidth)-E.pageX<F.scrollSensitivity){C.overflowX[0].scrollLeft=C.overflowX[0].scrollLeft+F.scrollSpeed}if(E.pageX-C.overflowXOffset.left<F.scrollSensitivity){C.overflowX[0].scrollLeft=C.overflowX[0].scrollLeft-F.scrollSpeed}}else{if(E.pageX-B(document).scrollLeft()<F.scrollSensitivity){B(document).scrollLeft(B(document).scrollLeft()-F.scrollSpeed)}if(B(window).width()-(E.pageX-B(document).scrollLeft())<F.scrollSensitivity){B(document).scrollLeft(B(document).scrollLeft()+F.scrollSpeed)}}}})})(jQuery);(function(C){C.effects=C.effects||{};C.extend(C.effects,{save:function(F,G){for(var E=0;E<G.length;E++){if(G[E]!==null){C.data(F[0],"ec.storage."+G[E],F[0].style[G[E]])}}},restore:function(F,G){for(var E=0;E<G.length;E++){if(G[E]!==null){F.css(G[E],C.data(F[0],"ec.storage."+G[E]))}}},setMode:function(E,F){if(F=="toggle"){F=E.is(":hidden")?"show":"hide"}return F},getBaseline:function(F,G){var H,E;switch(F[0]){case"top":H=0;break;case"middle":H=0.5;break;case"bottom":H=1;break;default:H=F[0]/G.height}switch(F[1]){case"left":E=0;break;case"center":E=0.5;break;case"right":E=1;break;default:E=F[1]/G.width}return{x:E,y:H}},createWrapper:function(F){if(F.parent().attr("id")=="fxWrapper"){return F}var E={width:F.outerWidth({margin:true}),height:F.outerHeight({margin:true}),"float":F.css("float")};F.wrap('<div id="fxWrapper" style="font-size:100%;background:transparent;border:none;margin:0;padding:0"></div>');var I=F.parent();if(F.css("position")=="static"){I.css({position:"relative"});F.css({position:"relative"})}else{var H=parseInt(F.css("top"),10);if(isNaN(H)){H="auto"}var G=parseInt(F.css("left"),10);if(isNaN(H)){G="auto"}I.css({position:F.css("position"),top:H,left:G,zIndex:F.css("z-index")}).show();F.css({position:"relative",top:0,left:0})}I.css(E);return I},removeWrapper:function(E){if(E.parent().attr("id")=="fxWrapper"){return E.parent().replaceWith(E)}return E},setTransition:function(F,G,E,H){H=H||{};C.each(G,function(J,I){unit=F.cssUnit(I);if(unit[0]>0){H[I]=unit[0]*E+unit[1]}});return H},animateClass:function(G,H,J,I){var E=(typeof J=="function"?J:(I?I:null));var F=(typeof J=="object"?J:null);return this.each(function(){var O={};var M=C(this);var N=M.attr("style")||"";if(typeof N=="object"){N=N["cssText"]}if(G.toggle){M.hasClass(G.toggle)?G.remove=G.toggle:G.add=G.toggle}var K=C.extend({},(document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle));if(G.add){M.addClass(G.add)}if(G.remove){M.removeClass(G.remove)}var L=C.extend({},(document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle));if(G.add){M.removeClass(G.add)}if(G.remove){M.addClass(G.remove)}for(var P in L){if(typeof L[P]!="function"&&L[P]&&P.indexOf("Moz")==-1&&P.indexOf("length")==-1&&L[P]!=K[P]&&(P.match(/color/i)||(!P.match(/color/i)&&!isNaN(parseInt(L[P],10))))&&(K.position!="static"||(K.position=="static"&&!P.match(/left|top|bottom|right/)))){O[P]=L[P]}}M.animate(O,H,F,function(){if(typeof C(this).attr("style")=="object"){C(this).attr("style")["cssText"]="";C(this).attr("style")["cssText"]=N}else{C(this).attr("style",N)}if(G.add){C(this).addClass(G.add)}if(G.remove){C(this).removeClass(G.remove)}if(E){E.apply(this,arguments)}})})}});C.fn.extend({_show:C.fn.show,_hide:C.fn.hide,__toggle:C.fn.toggle,_addClass:C.fn.addClass,_removeClass:C.fn.removeClass,_toggleClass:C.fn.toggleClass,effect:function(E,G,F,H){return C.effects[E]?C.effects[E].call(this,{method:E,options:G||{},duration:F,callback:H}):null},show:function(){if(!arguments[0]||(arguments[0].constructor==Number||/(slow|normal|fast)/.test(arguments[0]))){return this._show.apply(this,arguments)}else{var E=arguments[1]||{};E["mode"]="show";return this.effect.apply(this,[arguments[0],E,arguments[2]||E.duration,arguments[3]||E.callback])}},hide:function(){if(!arguments[0]||(arguments[0].constructor==Number||/(slow|normal|fast)/.test(arguments[0]))){return this._hide.apply(this,arguments)}else{var E=arguments[1]||{};E["mode"]="hide";return this.effect.apply(this,[arguments[0],E,arguments[2]||E.duration,arguments[3]||E.callback])}},toggle:function(){if(!arguments[0]||(arguments[0].constructor==Number||/(slow|normal|fast)/.test(arguments[0]))||(arguments[0].constructor==Function)){return this.__toggle.apply(this,arguments)}else{var E=arguments[1]||{};E["mode"]="toggle";return this.effect.apply(this,[arguments[0],E,arguments[2]||E.duration,arguments[3]||E.callback])}},addClass:function(F,E,H,G){return E?C.effects.animateClass.apply(this,[{add:F},E,H,G]):this._addClass(F)},removeClass:function(F,E,H,G){return E?C.effects.animateClass.apply(this,[{remove:F},E,H,G]):this._removeClass(F)},toggleClass:function(F,E,H,G){return E?C.effects.animateClass.apply(this,[{toggle:F},E,H,G]):this._toggleClass(F)},morph:function(E,G,F,I,H){return C.effects.animateClass.apply(this,[{add:G,remove:E},F,I,H])},switchClass:function(){return this.morph.apply(this,arguments)},cssUnit:function(E){var F=this.css(E),G=[];C.each(["em","px","%","pt"],function(H,I){if(F.indexOf(I)>0){G=[parseFloat(F),I]}});return G}});jQuery.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","color","outlineColor"],function(F,E){jQuery.fx.step[E]=function(G){if(G.state==0){G.start=D(G.elem,E);G.end=B(G.end)}G.elem.style[E]="rgb("+[Math.max(Math.min(parseInt((G.pos*(G.end[0]-G.start[0]))+G.start[0]),255),0),Math.max(Math.min(parseInt((G.pos*(G.end[1]-G.start[1]))+G.start[1]),255),0),Math.max(Math.min(parseInt((G.pos*(G.end[2]-G.start[2]))+G.start[2]),255),0)].join(",")+")"}});function B(F){var E;if(F&&F.constructor==Array&&F.length==3){return F}if(E=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(F)){return[parseInt(E[1]),parseInt(E[2]),parseInt(E[3])]}if(E=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(F)){return[parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55]}if(E=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(F)){return[parseInt(E[1],16),parseInt(E[2],16),parseInt(E[3],16)]}if(E=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(F)){return[parseInt(E[1]+E[1],16),parseInt(E[2]+E[2],16),parseInt(E[3]+E[3],16)]}if(E=/rgba\(0, 0, 0, 0\)/.exec(F)){return A["transparent"]}return A[jQuery.trim(F).toLowerCase()]}function D(G,E){var F;do{F=jQuery.curCSS(G,E);if(F!=""&&F!="transparent"||jQuery.nodeName(G,"body")){break}E="backgroundColor"}while(G=G.parentNode);return B(F)}var A={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]};jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(F,G,E,I,H){return jQuery.easing[jQuery.easing.def](F,G,E,I,H)},easeInQuad:function(F,G,E,I,H){return I*(G/=H)*G+E},easeOutQuad:function(F,G,E,I,H){return -I*(G/=H)*(G-2)+E},easeInOutQuad:function(F,G,E,I,H){if((G/=H/2)<1){return I/2*G*G+E}return -I/2*((--G)*(G-2)-1)+E},easeInCubic:function(F,G,E,I,H){return I*(G/=H)*G*G+E},easeOutCubic:function(F,G,E,I,H){return I*((G=G/H-1)*G*G+1)+E},easeInOutCubic:function(F,G,E,I,H){if((G/=H/2)<1){return I/2*G*G*G+E}return I/2*((G-=2)*G*G+2)+E},easeInQuart:function(F,G,E,I,H){return I*(G/=H)*G*G*G+E},easeOutQuart:function(F,G,E,I,H){return -I*((G=G/H-1)*G*G*G-1)+E},easeInOutQuart:function(F,G,E,I,H){if((G/=H/2)<1){return I/2*G*G*G*G+E}return -I/2*((G-=2)*G*G*G-2)+E},easeInQuint:function(F,G,E,I,H){return I*(G/=H)*G*G*G*G+E},easeOutQuint:function(F,G,E,I,H){return I*((G=G/H-1)*G*G*G*G+1)+E},easeInOutQuint:function(F,G,E,I,H){if((G/=H/2)<1){return I/2*G*G*G*G*G+E}return I/2*((G-=2)*G*G*G*G+2)+E},easeInSine:function(F,G,E,I,H){return -I*Math.cos(G/H*(Math.PI/2))+I+E},easeOutSine:function(F,G,E,I,H){return I*Math.sin(G/H*(Math.PI/2))+E},easeInOutSine:function(F,G,E,I,H){return -I/2*(Math.cos(Math.PI*G/H)-1)+E},easeInExpo:function(F,G,E,I,H){return(G==0)?E:I*Math.pow(2,10*(G/H-1))+E},easeOutExpo:function(F,G,E,I,H){return(G==H)?E+I:I*(-Math.pow(2,-10*G/H)+1)+E},easeInOutExpo:function(F,G,E,I,H){if(G==0){return E}if(G==H){return E+I}if((G/=H/2)<1){return I/2*Math.pow(2,10*(G-1))+E}return I/2*(-Math.pow(2,-10*--G)+2)+E},easeInCirc:function(F,G,E,I,H){return -I*(Math.sqrt(1-(G/=H)*G)-1)+E},easeOutCirc:function(F,G,E,I,H){return I*Math.sqrt(1-(G=G/H-1)*G)+E},easeInOutCirc:function(F,G,E,I,H){if((G/=H/2)<1){return -I/2*(Math.sqrt(1-G*G)-1)+E}return I/2*(Math.sqrt(1-(G-=2)*G)+1)+E},easeInElastic:function(F,H,E,L,K){var I=1.70158;var J=0;var G=L;if(H==0){return E}if((H/=K)==1){return E+L}if(!J){J=K*0.3}if(G<Math.abs(L)){G=L;var I=J/4}else{var I=J/(2*Math.PI)*Math.asin(L/G)}return -(G*Math.pow(2,10*(H-=1))*Math.sin((H*K-I)*(2*Math.PI)/J))+E},easeOutElastic:function(F,H,E,L,K){var I=1.70158;var J=0;var G=L;if(H==0){return E}if((H/=K)==1){return E+L}if(!J){J=K*0.3}if(G<Math.abs(L)){G=L;var I=J/4}else{var I=J/(2*Math.PI)*Math.asin(L/G)}return G*Math.pow(2,-10*H)*Math.sin((H*K-I)*(2*Math.PI)/J)+L+E},easeInOutElastic:function(F,H,E,L,K){var I=1.70158;var J=0;var G=L;if(H==0){return E}if((H/=K/2)==2){return E+L}if(!J){J=K*(0.3*1.5)}if(G<Math.abs(L)){G=L;var I=J/4}else{var I=J/(2*Math.PI)*Math.asin(L/G)}if(H<1){return -0.5*(G*Math.pow(2,10*(H-=1))*Math.sin((H*K-I)*(2*Math.PI)/J))+E}return G*Math.pow(2,-10*(H-=1))*Math.sin((H*K-I)*(2*Math.PI)/J)*0.5+L+E},easeInBack:function(F,G,E,J,I,H){if(H==undefined){H=1.70158}return J*(G/=I)*G*((H+1)*G-H)+E},easeOutBack:function(F,G,E,J,I,H){if(H==undefined){H=1.70158}return J*((G=G/I-1)*G*((H+1)*G+H)+1)+E},easeInOutBack:function(F,G,E,J,I,H){if(H==undefined){H=1.70158}if((G/=I/2)<1){return J/2*(G*G*(((H*=(1.525))+1)*G-H))+E}return J/2*((G-=2)*G*(((H*=(1.525))+1)*G+H)+2)+E},easeInBounce:function(F,G,E,I,H){return I-jQuery.easing.easeOutBounce(F,H-G,0,I,H)+E},easeOutBounce:function(F,G,E,I,H){if((G/=H)<(1/2.75)){return I*(7.5625*G*G)+E}else{if(G<(2/2.75)){return I*(7.5625*(G-=(1.5/2.75))*G+0.75)+E}else{if(G<(2.5/2.75)){return I*(7.5625*(G-=(2.25/2.75))*G+0.9375)+E}else{return I*(7.5625*(G-=(2.625/2.75))*G+0.984375)+E}}}},easeInOutBounce:function(F,G,E,I,H){if(G<H/2){return jQuery.easing.easeInBounce(F,G*2,0,I,H)*0.5+E}return jQuery.easing.easeOutBounce(F,G*2-H,0,I,H)*0.5+I*0.5+E}})})(jQuery);(function(A){A.effects.blind=function(B){return this.queue(function(){var D=A(this),C=["position","top","left"];var H=A.effects.setMode(D,B.options.mode||"hide");var G=B.options.direction||"vertical";A.effects.save(D,C);D.show();var J=A.effects.createWrapper(D).css({overflow:"hidden"});var E=(G=="vertical")?"height":"width";var I=(G=="vertical")?J.height():J.width();if(H=="show"){J.css(E,0)}var F={};F[E]=H=="show"?I:0;J.animate(F,B.duration,B.options.easing,function(){if(H=="hide"){D.hide()}A.effects.restore(D,C);A.effects.removeWrapper(D);if(B.callback){B.callback.apply(D[0],arguments)}D.dequeue()})})}})(jQuery);(function(A){A.effects.bounce=function(B){return this.queue(function(){var E=A(this),K=["position","top","left"];var J=A.effects.setMode(E,B.options.mode||"effect");var M=B.options.direction||"up";var C=B.options.distance||20;var D=B.options.times||5;var G=B.duration||250;if(/show|hide/.test(J)){K.push("opacity")}A.effects.save(E,K);E.show();A.effects.createWrapper(E);var F=(M=="up"||M=="down")?"top":"left";var O=(M=="up"||M=="left")?"pos":"neg";var C=B.options.distance||(F=="top"?E.outerHeight({margin:true})/3:E.outerWidth({margin:true})/3);if(J=="show"){E.css("opacity",0).css(F,O=="pos"?-C:C)}if(J=="hide"){C=C/(D*2)}if(J!="hide"){D--}if(J=="show"){var H={opacity:1};H[F]=(O=="pos"?"+=":"-=")+C;E.animate(H,G/2,B.options.easing);C=C/2;D--}for(var I=0;I<D;I++){var N={},L={};N[F]=(O=="pos"?"-=":"+=")+C;L[F]=(O=="pos"?"+=":"-=")+C;E.animate(N,G/2,B.options.easing).animate(L,G/2,B.options.easing);C=(J=="hide")?C*2:C/2}if(J=="hide"){var H={opacity:0};H[F]=(O=="pos"?"-=":"+=")+C;E.animate(H,G/2,B.options.easing,function(){E.hide();A.effects.restore(E,K);A.effects.removeWrapper(E);if(B.callback){B.callback.apply(this,arguments)}})}else{var N={},L={};N[F]=(O=="pos"?"-=":"+=")+C;L[F]=(O=="pos"?"+=":"-=")+C;E.animate(N,G/2,B.options.easing).animate(L,G/2,B.options.easing,function(){A.effects.restore(E,K);A.effects.removeWrapper(E);if(B.callback){B.callback.apply(this,arguments)}})}E.queue("fx",function(){E.dequeue()});E.dequeue()})}})(jQuery);(function(A){A.effects.clip=function(B){return this.queue(function(){var D=A(this),C=["position","top","left","width","height"];var H=A.effects.setMode(D,B.options.mode||"hide");var G=B.options.direction||"vertical";A.effects.save(D,C);D.show();A.effects.createWrapper(D).css({overflow:"hidden"});var E={size:(G=="vertical")?"height":"width",position:(G=="vertical")?"top":"left"};var I=(G=="vertical")?D.height():D.width();if(H=="show"){D.css(E.size,0);D.css(E.position,I/2)}var F={};F[E.size]=H=="show"?I:0;F[E.position]=H=="show"?0:I/2;D.animate(F,{queue:false,duration:B.duration,easing:B.options.easing,complete:function(){if(H=="hide"){D.hide()}A.effects.restore(D,C);A.effects.removeWrapper(D);if(B.callback){B.callback.apply(this,arguments)}D.dequeue()}})})}})(jQuery);(function(A){A.effects.drop=function(B){return this.queue(function(){var E=A(this),D=["position","top","left","opacity"];var I=A.effects.setMode(E,B.options.mode||"hide");var H=B.options.direction||"left";A.effects.save(E,D);E.show();A.effects.createWrapper(E);var F=(H=="up"||H=="down")?"top":"left";var C=(H=="up"||H=="left")?"pos":"neg";var J=B.options.distance||(F=="top"?E.outerHeight({margin:true})/2:E.outerWidth({margin:true})/2);if(I=="show"){E.css("opacity",0).css(F,C=="pos"?-J:J)}var G={opacity:I=="show"?1:0};G[F]=(I=="show"?(C=="pos"?"+=":"-="):(C=="pos"?"-=":"+="))+J;E.animate(G,{queue:false,duration:B.duration,easing:B.options.easing,complete:function(){if(I=="hide"){E.hide()}A.effects.restore(E,D);A.effects.removeWrapper(E);if(B.callback){B.callback.apply(this,arguments)}E.dequeue()}})})}})(jQuery);(function(A){A.effects.explode=function(B){return this.queue(function(){var I=B.options.pieces?Math.round(Math.sqrt(B.options.pieces)):3;var E=B.options.pieces?Math.round(Math.sqrt(B.options.pieces)):3;B.options.mode=B.options.mode=="toggle"?(A(this).is(":visible")?"hide":"show"):B.options.mode;var H=A(this).show().css("visibility","hidden");var J=H.offset();J.top-=parseInt(H.css("marginTop"))||0;J.left-=parseInt(H.css("marginLeft"))||0;var G=H.outerWidth(true);var C=H.outerHeight(true);for(var F=0;F<I;F++){for(var D=0;D<E;D++){H.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-D*(G/E),top:-F*(C/I)}).parent().addClass("effects-explode").css({position:"absolute",overflow:"hidden",width:G/E,height:C/I,left:J.left+D*(G/E)+(B.options.mode=="show"?(D-Math.floor(E/2))*(G/E):0),top:J.top+F*(C/I)+(B.options.mode=="show"?(F-Math.floor(I/2))*(C/I):0),opacity:B.options.mode=="show"?0:1}).animate({left:J.left+D*(G/E)+(B.options.mode=="show"?0:(D-Math.floor(E/2))*(G/E)),top:J.top+F*(C/I)+(B.options.mode=="show"?0:(F-Math.floor(I/2))*(C/I)),opacity:B.options.mode=="show"?1:0},B.duration||500)}}setTimeout(function(){B.options.mode=="show"?H.css({visibility:"visible"}):H.css({visibility:"visible"}).hide();if(B.callback){B.callback.apply(H[0])}H.dequeue();A(".effects-explode").remove()},B.duration||500)})}})(jQuery);(function(A){A.effects.fold=function(B){return this.queue(function(){var E=A(this),H=["position","top","left"];var G=A.effects.setMode(E,B.options.mode||"hide");var K=B.options.size||15;A.effects.save(E,H);E.show();var C=A.effects.createWrapper(E).css({overflow:"hidden"});var F=(G=="show")?["width","height"]:["height","width"];var D=(G=="show")?[C.width(),C.height()]:[C.height(),C.width()];if(G=="show"){C.css({height:K,width:0})}var J={},I={};J[F[0]]=G=="show"?D[0]:K;I[F[1]]=G=="show"?D[1]:0;C.animate(J,B.duration/2,B.options.easing).animate(I,B.duration/2,B.options.easing,function(){if(G=="hide"){E.hide()}A.effects.restore(E,H);A.effects.removeWrapper(E);if(B.callback){B.callback.apply(E[0],arguments)}E.dequeue()})})}})(jQuery);(function(A){A.effects.highlight=function(B){return this.queue(function(){var E=A(this),D=["backgroundImage","backgroundColor","opacity"];var H=A.effects.setMode(E,B.options.mode||"show");var C=B.options.color||"#ffff99";var G=E.css("backgroundColor");A.effects.save(E,D);E.show();E.css({backgroundImage:"none",backgroundColor:C});var F={backgroundColor:G};if(H=="hide"){F["opacity"]=0}E.animate(F,{queue:false,duration:B.duration,easing:B.options.easing,complete:function(){if(H=="hide"){E.hide()}A.effects.restore(E,D);if(H=="show"&&jQuery.browser.msie){this.style.removeAttribute("filter")}if(B.callback){B.callback.apply(this,arguments)}E.dequeue()}})})}})(jQuery);(function(A){A.effects.pulsate=function(B){return this.queue(function(){var D=A(this);var F=A.effects.setMode(D,B.options.mode||"show");var E=B.options.times||5;if(F=="hide"){E--}if(D.is(":hidden")){D.css("opacity",0);D.show();D.animate({opacity:1},B.duration/2,B.options.easing);E=E-2}for(var C=0;C<E;C++){D.animate({opacity:0},B.duration/2,B.options.easing).animate({opacity:1},B.duration/2,B.options.easing)}if(F=="hide"){D.animate({opacity:0},B.duration/2,B.options.easing,function(){D.hide();if(B.callback){B.callback.apply(this,arguments)}})}else{D.animate({opacity:0},B.duration/2,B.options.easing).animate({opacity:1},B.duration/2,B.options.easing,function(){if(B.callback){B.callback.apply(this,arguments)}})}D.queue("fx",function(){D.dequeue()});D.dequeue()})}})(jQuery);(function(A){A.effects.puff=function(B){return this.queue(function(){var F=A(this);var C=A.extend(true,{},B);var H=A.effects.setMode(F,B.options.mode||"hide");var G=parseInt(B.options.percent)||150;C.fade=true;var E={height:F.height(),width:F.width()};var D=G/100;F.from=(H=="hide")?E:{height:E.height*D,width:E.width*D};C.from=F.from;C.percent=(H=="hide")?G:100;C.mode=H;F.effect("scale",C,B.duration,B.callback);F.dequeue()})};A.effects.scale=function(B){return this.queue(function(){var C=A(this);var K=A.extend(true,{},B);var E=A.effects.setMode(C,B.options.mode||"effect");var G=parseInt(B.options.percent)||(parseInt(B.options.percent)==0?0:(E=="hide"?0:100));var I=B.options.direction||"both";var J=B.options.origin;if(E!="effect"){J=J||["middle","center"];K.restore=true}var D={height:C.height(),width:C.width()};C.from=B.options.from||(E=="show"?{height:0,width:0}:D);var H={y:I!="horizontal"?(G/100):1,x:I!="vertical"?(G/100):1};C.to={height:D.height*H.y,width:D.width*H.x};if(J){var F=A.effects.getBaseline(J,D);C.from.top=(D.height-C.from.height)*F.y;C.from.left=(D.width-C.from.width)*F.x;C.to.top=(D.height-C.to.height)*F.y;C.to.left=(D.width-C.to.width)*F.x}if(B.options.fade){if(E=="show"){C.from.opacity=0;C.to.opacity=1}if(E=="hide"){C.from.opacity=1;C.to.opacity=0}}K.from=C.from;K.to=C.to;K.mode=E;C.effect("size",K,B.duration,B.callback);C.dequeue()})};A.effects.size=function(B){return this.queue(function(){var C=A(this),M=["position","top","left","width","height","overflow","opacity"];var L=["position","overflow","opacity"];var I=["width","height","overflow"];var N=["fontSize"];var J=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"];var F=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"];var G=A.effects.setMode(C,B.options.mode||"effect");var H=B.options.restore||false;var E=B.options.scale||"both";var D={height:C.height(),width:C.width()};C.from=B.options.from||D;C.to=B.options.to||D;var K={from:{y:C.from.height/D.height,x:C.from.width/D.width},to:{y:C.to.height/D.height,x:C.to.width/D.width}};if(E=="box"||E=="both"){if(K.from.y!=K.to.y){M=M.concat(J);C.from=A.effects.setTransition(C,J,K.from.y,C.from);C.to=A.effects.setTransition(C,J,K.to.y,C.to)}if(K.from.x!=K.to.x){M=M.concat(F);C.from=A.effects.setTransition(C,F,K.from.x,C.from);C.to=A.effects.setTransition(C,F,K.to.x,C.to)}}if(E=="content"||E=="both"){if(K.from.y!=K.to.y){M=M.concat(N);C.from=A.effects.setTransition(C,N,K.from.y,C.from);C.to=A.effects.setTransition(C,N,K.to.y,C.to)}}A.effects.save(C,H?M:L);C.show();A.effects.createWrapper(C);C.css("overflow","hidden").css(C.from);if(E=="content"||E=="both"){J=J.concat(["marginTop","marginBottom"]).concat(N);F=F.concat(["marginLeft","marginRight"]);I=M.concat(J).concat(F);C.find("*[width]").each(function(){child=A(this);if(H){A.effects.save(child,I)}var O={height:child.height(),width:child.width()};child.from={height:O.height*K.from.y,width:O.width*K.from.x};child.to={height:O.height*K.to.y,width:O.width*K.to.x};if(K.from.y!=K.to.y){child.from=A.effects.setTransition(child,J,K.from.y,child.from);child.to=A.effects.setTransition(child,J,K.to.y,child.to)}if(K.from.x!=K.to.x){child.from=A.effects.setTransition(child,F,K.from.x,child.from);child.to=A.effects.setTransition(child,F,K.to.x,child.to)}child.css(child.from);child.animate(child.to,B.duration,B.options.easing,function(){if(H){A.effects.restore(child,I)}})})}C.animate(C.to,{queue:false,duration:B.duration,easing:B.options.easing,complete:function(){if(G=="hide"){C.hide()}A.effects.restore(C,H?M:L);A.effects.removeWrapper(C);if(B.callback){B.callback.apply(this,arguments)}C.dequeue()}})})}})(jQuery);(function(A){A.effects.shake=function(B){return this.queue(function(){var E=A(this),K=["position","top","left"];var J=A.effects.setMode(E,B.options.mode||"effect");var M=B.options.direction||"left";var C=B.options.distance||20;var D=B.options.times||3;var G=B.duration||B.options.duration||140;A.effects.save(E,K);E.show();A.effects.createWrapper(E);var F=(M=="up"||M=="down")?"top":"left";var O=(M=="up"||M=="left")?"pos":"neg";var H={},N={},L={};H[F]=(O=="pos"?"-=":"+=")+C;N[F]=(O=="pos"?"+=":"-=")+C*2;L[F]=(O=="pos"?"-=":"+=")+C*2;E.animate(H,G,B.options.easing);for(var I=1;I<D;I++){E.animate(N,G,B.options.easing).animate(L,G,B.options.easing)}E.animate(N,G,B.options.easing).animate(H,G/2,B.options.easing,function(){A.effects.restore(E,K);A.effects.removeWrapper(E);if(B.callback){B.callback.apply(this,arguments)}});E.queue("fx",function(){E.dequeue()});E.dequeue()})}})(jQuery);(function(A){A.effects.slide=function(B){return this.queue(function(){var E=A(this),D=["position","top","left"];var I=A.effects.setMode(E,B.options.mode||"show");var H=B.options.direction||"left";A.effects.save(E,D);E.show();A.effects.createWrapper(E).css({overflow:"hidden"});var F=(H=="up"||H=="down")?"top":"left";var C=(H=="up"||H=="left")?"pos":"neg";var J=B.options.distance||(F=="top"?E.outerHeight({margin:true}):E.outerWidth({margin:true}));if(I=="show"){E.css(F,C=="pos"?-J:J)}var G={};G[F]=(I=="show"?(C=="pos"?"+=":"-="):(C=="pos"?"-=":"+="))+J;E.animate(G,{queue:false,duration:B.duration,easing:B.options.easing,complete:function(){if(I=="hide"){E.hide()}A.effects.restore(E,D);A.effects.removeWrapper(E);if(B.callback){B.callback.apply(this,arguments)}E.dequeue()}})})}})(jQuery);(function(A){A.effects.transfer=function(B){return this.queue(function(){var E=A(this);var G=A.effects.setMode(E,B.options.mode||"effect");var F=A(B.options.to);var C=E.offset();var D=A('<div class="ui-effects-transfer"></div>').appendTo(document.body);if(B.options.className){D.addClass(B.options.className)}D.addClass(B.options.className);D.css({top:C.top,left:C.left,height:E.outerHeight(true)-parseInt(D.css("borderTopWidth"))-parseInt(D.css("borderBottomWidth")),width:E.outerWidth(true)-parseInt(D.css("borderLeftWidth"))-parseInt(D.css("borderRightWidth")),position:"absolute"});C=F.offset();animation={top:C.top,left:C.left,height:F.outerHeight()-parseInt(D.css("borderTopWidth"))-parseInt(D.css("borderBottomWidth")),width:F.outerWidth()-parseInt(D.css("borderLeftWidth"))-parseInt(D.css("borderRightWidth"))};D.animate(animation,B.duration,B.options.easing,function(){D.remove();if(B.callback){B.callback.apply(E[0],arguments)}E.dequeue()})})}})(jQuery);(function(E){E.widget("ui.accordion",{init:function(){var G=this.options;if(G.navigation){var J=this.element.find("a").filter(G.navigationFilter);if(J.length){if(J.filter(G.header).length){G.active=J}else{G.active=J.parent().parent().prev();J.addClass("current")}}}G.headers=this.element.find(G.header);G.active=C(G.headers,G.active);if(E.browser.msie){this.element.find("a").css("zoom","1")}if(!this.element.hasClass("ui-accordion")){this.element.addClass("ui-accordion");E("<span class='ui-accordion-left'/>").insertBefore(G.headers);E("<span class='ui-accordion-right'/>").appendTo(G.headers);G.headers.addClass("ui-accordion-header").attr("tabindex","0")}var I;if(G.fillSpace){I=this.element.parent().height();G.headers.each(function(){I-=E(this).outerHeight()});var H=0;G.headers.next().each(function(){H=Math.max(H,E(this).innerHeight()-E(this).height())}).height(I-H)}else{if(G.autoHeight){I=0;G.headers.next().each(function(){I=Math.max(I,E(this).outerHeight())}).height(I)}}G.headers.not(G.active||"").next().hide();G.active.parent().andSelf().addClass(G.selectedClass);if(G.event){this.element.bind((G.event)+".accordion",F)}},activate:function(G){F.call(this.element[0],{target:C(this.options.headers,G)[0]})},destroy:function(){this.options.headers.next().css("display","");if(this.options.fillSpace||this.options.autoHeight){this.options.headers.next().css("height","")}E.removeData(this.element[0],"accordion");this.element.removeClass("ui-accordion").unbind(".accordion")}});function B(H,G){return function(){return H.apply(G,arguments)}}function D(I){if(!E.data(this,"accordion")){return }var G=E.data(this,"accordion");var H=G.options;H.running=I?0:--H.running;if(H.running){return }if(H.clearStyle){H.toShow.add(H.toHide).css({height:"",overflow:""})}E(this).triggerHandler("accordionchange",[H.data],H.change)}function A(G,K,L,J,M){var I=E.data(this,"accordion").options;I.toShow=G;I.toHide=K;I.data=L;var H=B(D,this);I.running=K.size()===0?G.size():K.size();if(I.animated){if(!I.alwaysOpen&&J){E.ui.accordion.animations[I.animated]({toShow:jQuery([]),toHide:K,complete:H,down:M,autoHeight:I.autoHeight})}else{E.ui.accordion.animations[I.animated]({toShow:G,toHide:K,complete:H,down:M,autoHeight:I.autoHeight})}}else{if(!I.alwaysOpen&&J){G.toggle()}else{K.hide();G.show()}H(true)}}function F(L){var J=E.data(this,"accordion").options;if(J.disabled){return false}if(!L.target&&!J.alwaysOpen){J.active.parent().andSelf().toggleClass(J.selectedClass);var I=J.active.next(),M={options:J,newHeader:jQuery([]),oldHeader:J.active,newContent:jQuery([]),oldContent:I},G=(J.active=E([]));A.call(this,G,I,M);return false}var K=E(L.target);if(K.parents(J.header).length){while(!K.is(J.header)){K=K.parent()}}var H=K[0]==J.active[0];if(J.running||(J.alwaysOpen&&H)){return false}if(!K.is(J.header)){return }J.active.parent().andSelf().toggleClass(J.selectedClass);if(!H){K.parent().andSelf().addClass(J.selectedClass)}var G=K.next(),I=J.active.next(),M={options:J,newHeader:K,oldHeader:J.active,newContent:G,oldContent:I},N=J.headers.index(J.active[0])>J.headers.index(K[0]);J.active=H?E([]):K;A.call(this,G,I,M,H,N);return false}function C(H,G){return G!=undefined?typeof G=="number"?H.filter(":eq("+G+")"):H.not(H.not(G)):G===false?E([]):H.filter(":eq(0)")}E.extend(E.ui.accordion,{defaults:{selectedClass:"selected",alwaysOpen:true,animated:"slide",event:"click",header:"a",autoHeight:true,running:0,navigationFilter:function(){return this.href.toLowerCase()==location.href.toLowerCase()}},animations:{slide:function(G,I){G=E.extend({easing:"swing",duration:300},G,I);if(!G.toHide.size()){G.toShow.animate({height:"show"},G);return }var H=G.toHide.height(),J=G.toShow.height(),K=J/H;G.toShow.css({height:0,overflow:"hidden"}).show();G.toHide.filter(":hidden").each(G.complete).end().filter(":visible").animate({height:"hide"},{step:function(L){var M=(H-L)*K;if(E.browser.msie||E.browser.opera){M=Math.ceil(M)}G.toShow.height(M)},duration:G.duration,easing:G.easing,complete:function(){if(!G.autoHeight){G.toShow.css("height","auto")}G.complete()}})},bounceslide:function(G){this.slide(G,{easing:G.down?"bounceout":"swing",duration:G.down?1000:200})},easeslide:function(G){this.slide(G,{easing:"easeinout",duration:700})}}});E.fn.activate=function(G){return this.accordion("activate",G)}})(jQuery);(function($){function Datepicker(){this.debug=false;this._nextId=0;this._inst=[];this._curInst=null;this._disabledInputs=[];this._datepickerShowing=false;this._inDialog=false;this.regional=[];this.regional[""]={clearText:"Clear",clearStatus:"Erase the current date",closeText:"Close",closeStatus:"Close without change",prevText:"&#x3c;Prev",prevStatus:"Show the previous month",nextText:"Next&#x3e;",nextStatus:"Show the next month",currentText:"Today",currentStatus:"Show the current month",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],monthStatus:"Show a different month",yearStatus:"Show a different year",weekHeader:"Wk",weekStatus:"Week of the year",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],dayStatus:"Set DD as first week day",dateStatus:"Select DD, M d",dateFormat:"mm/dd/yy",firstDay:0,initStatus:"Select a date",isRTL:false};this._defaults={showOn:"focus",showAnim:"show",defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:false,closeAtTop:true,mandatory:false,hideIfNoPrevNext:false,changeMonth:true,changeYear:true,yearRange:"-10:+10",changeFirstDay:true,showOtherMonths:false,showWeeks:false,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",showStatus:false,statusForDate:this.dateStatus,minDate:null,maxDate:null,speed:"normal",beforeShowDay:null,beforeShow:null,onSelect:null,onClose:null,numberOfMonths:1,stepMonths:1,rangeSelect:false,rangeSeparator:" - "};$.extend(this._defaults,this.regional[""]);this._datepickerDiv=$('<div id="ui-datepicker-div"></div>')}$.extend(Datepicker.prototype,{markerClassName:"hasDatepicker",log:function(){if(this.debug){console.log.apply("",arguments)}},_register:function(inst){var id=this._nextId++;this._inst[id]=inst;return id},_getInst:function(id){return this._inst[id]||id},setDefaults:function(settings){extendRemove(this._defaults,settings||{});return this},_attachDatepicker:function(target,settings){var inlineSettings=null;for(attrName in this._defaults){var attrValue=target.getAttribute("date:"+attrName);if(attrValue){inlineSettings=inlineSettings||{};try{inlineSettings[attrName]=eval(attrValue)}catch(err){inlineSettings[attrName]=attrValue}}}var nodeName=target.nodeName.toLowerCase();var instSettings=(inlineSettings?$.extend(settings||{},inlineSettings||{}):settings);if(nodeName=="input"){var inst=(inst&&!inlineSettings?inst:new DatepickerInstance(instSettings,false));this._connectDatepicker(target,inst)}else{if(nodeName=="div"||nodeName=="span"){var inst=new DatepickerInstance(instSettings,true);this._inlineDatepicker(target,inst)}}},_destroyDatepicker:function(target){var nodeName=target.nodeName.toLowerCase();var calId=target._calId;target._calId=null;var $target=$(target);if(nodeName=="input"){$target.siblings(".ui-datepicker-append").replaceWith("").end().siblings(".ui-datepicker-trigger").replaceWith("").end().removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress);var wrapper=$target.parents(".ui-datepicker-wrap");if(wrapper){wrapper.replaceWith(wrapper.html())}}else{if(nodeName=="div"||nodeName=="span"){$target.removeClass(this.markerClassName).empty()}}if($("input[_calId="+calId+"]").length==0){this._inst[calId]=null}},_enableDatepicker:function(target){target.disabled=false;$(target).siblings("button.ui-datepicker-trigger").each(function(){this.disabled=false}).end().siblings("img.ui-datepicker-trigger").css({opacity:"1.0",cursor:""});this._disabledInputs=$.map(this._disabledInputs,function(value){return(value==target?null:value)})},_disableDatepicker:function(target){target.disabled=true;$(target).siblings("button.ui-datepicker-trigger").each(function(){this.disabled=true}).end().siblings("img.ui-datepicker-trigger").css({opacity:"0.5",cursor:"default"});this._disabledInputs=$.map($.datepicker._disabledInputs,function(value){return(value==target?null:value)});this._disabledInputs[$.datepicker._disabledInputs.length]=target},_isDisabledDatepicker:function(target){if(!target){return false}for(var i=0;i<this._disabledInputs.length;i++){if(this._disabledInputs[i]==target){return true}}return false},_changeDatepicker:function(target,name,value){var settings=name||{};if(typeof name=="string"){settings={};settings[name]=value}if(inst=this._getInst(target._calId)){extendRemove(inst._settings,settings);this._updateDatepicker(inst)}},_setDateDatepicker:function(target,date,endDate){if(inst=this._getInst(target._calId)){inst._setDate(date,endDate);this._updateDatepicker(inst)}},_getDateDatepicker:function(target){var inst=this._getInst(target._calId);if(inst){inst._setDateFromField($(target))}return(inst?inst._getDate():null)},_doKeyDown:function(e){var inst=$.datepicker._getInst(this._calId);if($.datepicker._datepickerShowing){switch(e.keyCode){case 9:$.datepicker._hideDatepicker(null,"");break;case 13:$.datepicker._selectDay(inst,inst._selectedMonth,inst._selectedYear,$("td.ui-datepicker-days-cell-over",inst._datepickerDiv)[0]);return false;break;case 27:$.datepicker._hideDatepicker(null,inst._get("speed"));break;case 33:$.datepicker._adjustDate(inst,(e.ctrlKey?-1:-inst._get("stepMonths")),(e.ctrlKey?"Y":"M"));break;case 34:$.datepicker._adjustDate(inst,(e.ctrlKey?+1:+inst._get("stepMonths")),(e.ctrlKey?"Y":"M"));break;case 35:if(e.ctrlKey){$.datepicker._clearDate(inst)}break;case 36:if(e.ctrlKey){$.datepicker._gotoToday(inst)}break;case 37:if(e.ctrlKey){$.datepicker._adjustDate(inst,-1,"D")}break;case 38:if(e.ctrlKey){$.datepicker._adjustDate(inst,-7,"D")}break;case 39:if(e.ctrlKey){$.datepicker._adjustDate(inst,+1,"D")}break;case 40:if(e.ctrlKey){$.datepicker._adjustDate(inst,+7,"D")}break}}else{if(e.keyCode==36&&e.ctrlKey){$.datepicker._showDatepicker(this)}}},_doKeyPress:function(e){var inst=$.datepicker._getInst(this._calId);var chars=$.datepicker._possibleChars(inst._get("dateFormat"));var chr=String.fromCharCode(e.charCode==undefined?e.keyCode:e.charCode);return e.ctrlKey||(chr<" "||!chars||chars.indexOf(chr)>-1)},_connectDatepicker:function(target,inst){var input=$(target);if(input.is("."+this.markerClassName)){return }var appendText=inst._get("appendText");var isRTL=inst._get("isRTL");if(appendText){if(isRTL){input.before('<span class="ui-datepicker-append">'+appendText)}else{input.after('<span class="ui-datepicker-append">'+appendText)}}var showOn=inst._get("showOn");if(showOn=="focus"||showOn=="both"){input.focus(this._showDatepicker)}if(showOn=="button"||showOn=="both"){input.wrap('<span class="ui-datepicker-wrap">');var buttonText=inst._get("buttonText");var buttonImage=inst._get("buttonImage");var trigger=$(inst._get("buttonImageOnly")?$("<img>").addClass("ui-datepicker-trigger").attr({src:buttonImage,alt:buttonText,title:buttonText}):$("<button>").addClass("ui-datepicker-trigger").attr({type:"button"}).html(buttonImage!=""?$("<img>").attr({src:buttonImage,alt:buttonText,title:buttonText}):buttonText));if(isRTL){input.before(trigger)}else{input.after(trigger)}trigger.click(function(){if($.datepicker._datepickerShowing&&$.datepicker._lastInput==target){$.datepicker._hideDatepicker()}else{$.datepicker._showDatepicker(target)}})}input.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).bind("setData.datepicker",function(event,key,value){inst._settings[key]=value}).bind("getData.datepicker",function(event,key){return inst._get(key)});input[0]._calId=inst._id},_inlineDatepicker:function(target,inst){var input=$(target);if(input.is("."+this.markerClassName)){return }input.addClass(this.markerClassName).append(inst._datepickerDiv).bind("setData.datepicker",function(event,key,value){inst._settings[key]=value}).bind("getData.datepicker",function(event,key){return inst._get(key)});input[0]._calId=inst._id;this._updateDatepicker(inst)},_inlineShow:function(inst){var numMonths=inst._getNumberOfMonths();inst._datepickerDiv.width(numMonths[1]*$(".ui-datepicker",inst._datepickerDiv[0]).width())},_dialogDatepicker:function(input,dateText,onSelect,settings,pos){var inst=this._dialogInst;if(!inst){inst=this._dialogInst=new DatepickerInstance({},false);this._dialogInput=$('<input type="text" size="1" style="position: absolute; top: -100px;"/>');this._dialogInput.keydown(this._doKeyDown);$("body").append(this._dialogInput);this._dialogInput[0]._calId=inst._id}extendRemove(inst._settings,settings||{});this._dialogInput.val(dateText);this._pos=(pos?(pos.length?pos:[pos.pageX,pos.pageY]):null);if(!this._pos){var browserWidth=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;var browserHeight=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;var scrollX=document.documentElement.scrollLeft||document.body.scrollLeft;var scrollY=document.documentElement.scrollTop||document.body.scrollTop;this._pos=[(browserWidth/2)-100+scrollX,(browserHeight/2)-150+scrollY]}this._dialogInput.css("left",this._pos[0]+"px").css("top",this._pos[1]+"px");inst._settings.onSelect=onSelect;this._inDialog=true;this._datepickerDiv.addClass("ui-datepicker-dialog");this._showDatepicker(this._dialogInput[0]);if($.blockUI){$.blockUI(this._datepickerDiv)}return this},_showDatepicker:function(input){input=input.target||input;if(input.nodeName.toLowerCase()!="input"){input=$("input",input.parentNode)[0]}if($.datepicker._isDisabledDatepicker(input)||$.datepicker._lastInput==input){return }var inst=$.datepicker._getInst(input._calId);var beforeShow=inst._get("beforeShow");extendRemove(inst._settings,(beforeShow?beforeShow.apply(input,[input,inst]):{}));$.datepicker._hideDatepicker(null,"");$.datepicker._lastInput=input;inst._setDateFromField(input);if($.datepicker._inDialog){input.value=""}if(!$.datepicker._pos){$.datepicker._pos=$.datepicker._findPos(input);$.datepicker._pos[1]+=input.offsetHeight}var isFixed=false;$(input).parents().each(function(){isFixed|=$(this).css("position")=="fixed"});if(isFixed&&$.browser.opera){$.datepicker._pos[0]-=document.documentElement.scrollLeft;$.datepicker._pos[1]-=document.documentElement.scrollTop}inst._datepickerDiv.css("position",($.datepicker._inDialog&&$.blockUI?"static":(isFixed?"fixed":"absolute"))).css({left:$.datepicker._pos[0]+"px",top:$.datepicker._pos[1]+"px"});$.datepicker._pos=null;inst._rangeStart=null;$.datepicker._updateDatepicker(inst);if(!inst._inline){var speed=inst._get("speed");var postProcess=function(){$.datepicker._datepickerShowing=true;$.datepicker._afterShow(inst)};var showAnim=inst._get("showAnim")||"show";inst._datepickerDiv[showAnim](speed,postProcess);if(speed==""){postProcess()}if(inst._input[0].type!="hidden"){inst._input[0].focus()}$.datepicker._curInst=inst}},_updateDatepicker:function(inst){inst._datepickerDiv.empty().append(inst._generateDatepicker());var numMonths=inst._getNumberOfMonths();if(numMonths[0]!=1||numMonths[1]!=1){inst._datepickerDiv.addClass("ui-datepicker-multi")}else{inst._datepickerDiv.removeClass("ui-datepicker-multi")}if(inst._get("isRTL")){inst._datepickerDiv.addClass("ui-datepicker-rtl")}else{inst._datepickerDiv.removeClass("ui-datepicker-rtl")}if(inst._input&&inst._input[0].type!="hidden"){$(inst._input[0]).focus()}},_afterShow:function(inst){var numMonths=inst._getNumberOfMonths();inst._datepickerDiv.width(numMonths[1]*$(".ui-datepicker",inst._datepickerDiv[0])[0].offsetWidth);if($.browser.msie&&parseInt($.browser.version)<7){$("iframe.ui-datepicker-cover").css({width:inst._datepickerDiv.width()+4,height:inst._datepickerDiv.height()+4})}var isFixed=inst._datepickerDiv.css("position")=="fixed";var pos=inst._input?$.datepicker._findPos(inst._input[0]):null;var browserWidth=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;var browserHeight=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;var scrollX=(isFixed?0:document.documentElement.scrollLeft||document.body.scrollLeft);var scrollY=(isFixed?0:document.documentElement.scrollTop||document.body.scrollTop);if((inst._datepickerDiv.offset().left+inst._datepickerDiv.width()-(isFixed&&$.browser.msie?document.documentElement.scrollLeft:0))>(browserWidth+scrollX)){inst._datepickerDiv.css("left",Math.max(scrollX,pos[0]+(inst._input?$(inst._input[0]).width():null)-inst._datepickerDiv.width()-(isFixed&&$.browser.opera?document.documentElement.scrollLeft:0))+"px")}if((inst._datepickerDiv.offset().top+inst._datepickerDiv.height()-(isFixed&&$.browser.msie?document.documentElement.scrollTop:0))>(browserHeight+scrollY)){inst._datepickerDiv.css("top",Math.max(scrollY,pos[1]-(this._inDialog?0:inst._datepickerDiv.height())-(isFixed&&$.browser.opera?document.documentElement.scrollTop:0))+"px")}},_findPos:function(obj){while(obj&&(obj.type=="hidden"||obj.nodeType!=1)){obj=obj.nextSibling}var position=$(obj).offset();return[position.left,position.top]},_hideDatepicker:function(input,speed){var inst=this._curInst;if(!inst){return }var rangeSelect=inst._get("rangeSelect");if(rangeSelect&&this._stayOpen){this._selectDate(inst,inst._formatDate(inst._currentDay,inst._currentMonth,inst._currentYear))}this._stayOpen=false;if(this._datepickerShowing){speed=(speed!=null?speed:inst._get("speed"));var showAnim=inst._get("showAnim");inst._datepickerDiv[(showAnim=="slideDown"?"slideUp":(showAnim=="fadeIn"?"fadeOut":"hide"))](speed,function(){$.datepicker._tidyDialog(inst)});if(speed==""){this._tidyDialog(inst)}var onClose=inst._get("onClose");if(onClose){onClose.apply((inst._input?inst._input[0]:null),[inst._getDate(),inst])}this._datepickerShowing=false;this._lastInput=null;inst._settings.prompt=null;if(this._inDialog){this._dialogInput.css({position:"absolute",left:"0",top:"-100px"});if($.blockUI){$.unblockUI();$("body").append(this._datepickerDiv)}}this._inDialog=false}this._curInst=null},_tidyDialog:function(inst){inst._datepickerDiv.removeClass("ui-datepicker-dialog").unbind(".ui-datepicker");$(".ui-datepicker-prompt",inst._datepickerDiv).remove()},_checkExternalClick:function(event){if(!$.datepicker._curInst){return }var $target=$(event.target);if(($target.parents("#ui-datepicker-div").length==0)&&!$target.hasClass("hasDatepicker")&&!$target.hasClass("ui-datepicker-trigger")&&$.datepicker._datepickerShowing&&!($.datepicker._inDialog&&$.blockUI)){$.datepicker._hideDatepicker(null,"")}},_adjustDate:function(id,offset,period){var inst=this._getInst(id);inst._adjustDate(offset,period);this._updateDatepicker(inst)},_gotoToday:function(id){var date=new Date();var inst=this._getInst(id);inst._selectedDay=date.getDate();inst._drawMonth=inst._selectedMonth=date.getMonth();inst._drawYear=inst._selectedYear=date.getFullYear();this._adjustDate(inst)},_selectMonthYear:function(id,select,period){var inst=this._getInst(id);inst._selectingMonthYear=false;inst[period=="M"?"_drawMonth":"_drawYear"]=select.options[select.selectedIndex].value-0;this._adjustDate(inst)},_clickMonthYear:function(id){var inst=this._getInst(id);if(inst._input&&inst._selectingMonthYear&&!$.browser.msie){inst._input[0].focus()}inst._selectingMonthYear=!inst._selectingMonthYear},_changeFirstDay:function(id,day){var inst=this._getInst(id);inst._settings.firstDay=day;this._updateDatepicker(inst)},_selectDay:function(id,month,year,td){if($(td).is(".ui-datepicker-unselectable")){return }var inst=this._getInst(id);var rangeSelect=inst._get("rangeSelect");if(rangeSelect){if(!this._stayOpen){$(".ui-datepicker td").removeClass("ui-datepicker-current-day");$(td).addClass("ui-datepicker-current-day")}this._stayOpen=!this._stayOpen}inst._selectedDay=inst._currentDay=$("a",td).html();inst._selectedMonth=inst._currentMonth=month;inst._selectedYear=inst._currentYear=year;this._selectDate(id,inst._formatDate(inst._currentDay,inst._currentMonth,inst._currentYear));if(this._stayOpen){inst._endDay=inst._endMonth=inst._endYear=null;inst._rangeStart=new Date(inst._currentYear,inst._currentMonth,inst._currentDay);this._updateDatepicker(inst)}else{if(rangeSelect){inst._endDay=inst._currentDay;inst._endMonth=inst._currentMonth;inst._endYear=inst._currentYear;inst._selectedDay=inst._currentDay=inst._rangeStart.getDate();inst._selectedMonth=inst._currentMonth=inst._rangeStart.getMonth();inst._selectedYear=inst._currentYear=inst._rangeStart.getFullYear();inst._rangeStart=null;if(inst._inline){this._updateDatepicker(inst)}}}},_clearDate:function(id){var inst=this._getInst(id);if(inst._get("mandatory")){return }this._stayOpen=false;inst._endDay=inst._endMonth=inst._endYear=inst._rangeStart=null;this._selectDate(inst,"")},_selectDate:function(id,dateStr){var inst=this._getInst(id);dateStr=(dateStr!=null?dateStr:inst._formatDate());if(inst._rangeStart){dateStr=inst._formatDate(inst._rangeStart)+inst._get("rangeSeparator")+dateStr}if(inst._input){inst._input.val(dateStr)}var onSelect=inst._get("onSelect");if(onSelect){onSelect.apply((inst._input?inst._input[0]:null),[dateStr,inst])}else{if(inst._input){inst._input.trigger("change")}}if(inst._inline){this._updateDatepicker(inst)}else{if(!this._stayOpen){this._hideDatepicker(null,inst._get("speed"));this._lastInput=inst._input[0];if(typeof (inst._input[0])!="object"){inst._input[0].focus()}this._lastInput=null}}},noWeekends:function(date){var day=date.getDay();return[(day>0&&day<6),""]},iso8601Week:function(date){var checkDate=new Date(date.getFullYear(),date.getMonth(),date.getDate(),(date.getTimezoneOffset()/-60));var firstMon=new Date(checkDate.getFullYear(),1-1,4);var firstDay=firstMon.getDay()||7;firstMon.setDate(firstMon.getDate()+1-firstDay);if(firstDay<4&&checkDate<firstMon){checkDate.setDate(checkDate.getDate()-3);return $.datepicker.iso8601Week(checkDate)}else{if(checkDate>new Date(checkDate.getFullYear(),12-1,28)){firstDay=new Date(checkDate.getFullYear()+1,1-1,4).getDay()||7;if(firstDay>4&&(checkDate.getDay()||7)<firstDay-3){checkDate.setDate(checkDate.getDate()+3);return $.datepicker.iso8601Week(checkDate)}}}return Math.floor(((checkDate-firstMon)/86400000)/7)+1},dateStatus:function(date,inst){return $.datepicker.formatDate(inst._get("dateStatus"),date,inst._getFormatConfig())},parseDate:function(format,value,settings){if(format==null||value==null){throw"Invalid arguments"}value=(typeof value=="object"?value.toString():value+"");if(value==""){return null}var shortYearCutoff=(settings?settings.shortYearCutoff:null)||this._defaults.shortYearCutoff;var dayNamesShort=(settings?settings.dayNamesShort:null)||this._defaults.dayNamesShort;var dayNames=(settings?settings.dayNames:null)||this._defaults.dayNames;var monthNamesShort=(settings?settings.monthNamesShort:null)||this._defaults.monthNamesShort;var monthNames=(settings?settings.monthNames:null)||this._defaults.monthNames;var year=-1;var month=-1;var day=-1;var literal=false;var lookAhead=function(match){var matches=(iFormat+1<format.length&&format.charAt(iFormat+1)==match);if(matches){iFormat++}return matches};var getNumber=function(match){lookAhead(match);var size=(match=="y"?4:2);var num=0;while(size>0&&iValue<value.length&&value.charAt(iValue)>="0"&&value.charAt(iValue)<="9"){num=num*10+(value.charAt(iValue++)-0);size--}if(size==(match=="y"?4:2)){throw"Missing number at position "+iValue}return num};var getName=function(match,shortNames,longNames){var names=(lookAhead(match)?longNames:shortNames);var size=0;for(var j=0;j<names.length;j++){size=Math.max(size,names[j].length)}var name="";var iInit=iValue;while(size>0&&iValue<value.length){name+=value.charAt(iValue++);for(var i=0;i<names.length;i++){if(name==names[i]){return i+1}}size--}throw"Unknown name at position "+iInit};var checkLiteral=function(){if(value.charAt(iValue)!=format.charAt(iFormat)){throw"Unexpected literal at position "+iValue}iValue++};var iValue=0;for(var iFormat=0;iFormat<format.length;iFormat++){if(literal){if(format.charAt(iFormat)=="'"&&!lookAhead("'")){literal=false}else{checkLiteral()}}else{switch(format.charAt(iFormat)){case"d":day=getNumber("d");break;case"D":getName("D",dayNamesShort,dayNames);break;case"m":month=getNumber("m");break;case"M":month=getName("M",monthNamesShort,monthNames);break;case"y":year=getNumber("y");break;case"'":if(lookAhead("'")){checkLiteral()}else{literal=true}break;default:checkLiteral()}}}if(year<100){year+=new Date().getFullYear()-new Date().getFullYear()%100+(year<=shortYearCutoff?0:-100)}var date=new Date(year,month-1,day);if(date.getFullYear()!=year||date.getMonth()+1!=month||date.getDate()!=day){throw"Invalid date"}return date},formatDate:function(format,date,settings){if(!date){return""}var dayNamesShort=(settings?settings.dayNamesShort:null)||this._defaults.dayNamesShort;var dayNames=(settings?settings.dayNames:null)||this._defaults.dayNames;var monthNamesShort=(settings?settings.monthNamesShort:null)||this._defaults.monthNamesShort;var monthNames=(settings?settings.monthNames:null)||this._defaults.monthNames;var lookAhead=function(match){var matches=(iFormat+1<format.length&&format.charAt(iFormat+1)==match);if(matches){iFormat++}return matches};var formatNumber=function(match,value){return(lookAhead(match)&&value<10?"0":"")+value};var formatName=function(match,value,shortNames,longNames){return(lookAhead(match)?longNames[value]:shortNames[value])};var output="";var literal=false;if(date){for(var iFormat=0;iFormat<format.length;iFormat++){if(literal){if(format.charAt(iFormat)=="'"&&!lookAhead("'")){literal=false}else{output+=format.charAt(iFormat)}}else{switch(format.charAt(iFormat)){case"d":output+=formatNumber("d",date.getDate());break;case"D":output+=formatName("D",date.getDay(),dayNamesShort,dayNames);break;case"m":output+=formatNumber("m",date.getMonth()+1);break;case"M":output+=formatName("M",date.getMonth(),monthNamesShort,monthNames);break;case"y":output+=(lookAhead("y")?date.getFullYear():(date.getYear()%100<10?"0":"")+date.getYear()%100);break;case"'":if(lookAhead("'")){output+="'"}else{literal=true}break;default:output+=format.charAt(iFormat)}}}}return output},_possibleChars:function(format){var chars="";var literal=false;for(var iFormat=0;iFormat<format.length;iFormat++){if(literal){if(format.charAt(iFormat)=="'"&&!lookAhead("'")){literal=false}else{chars+=format.charAt(iFormat)}}else{switch(format.charAt(iFormat)){case"d"||"m"||"y":chars+="0123456789";break;case"D"||"M":return null;case"'":if(lookAhead("'")){chars+="'"}else{literal=true}break;default:chars+=format.charAt(iFormat)}}}return chars}});function DatepickerInstance(settings,inline){this._id=$.datepicker._register(this);this._selectedDay=0;this._selectedMonth=0;this._selectedYear=0;this._drawMonth=0;this._drawYear=0;this._input=null;this._inline=inline;this._datepickerDiv=(!inline?$.datepicker._datepickerDiv:$('<div id="ui-datepicker-div-'+this._id+'" class="ui-datepicker-inline">'));this._settings=extendRemove(settings||{});if(inline){this._setDate(this._getDefaultDate())}}$.extend(DatepickerInstance.prototype,{_get:function(name){return this._settings[name]!==undefined?this._settings[name]:$.datepicker._defaults[name]},_setDateFromField:function(input){this._input=$(input);var dateFormat=this._get("dateFormat");var dates=this._input?this._input.val().split(this._get("rangeSeparator")):null;this._endDay=this._endMonth=this._endYear=null;var date=defaultDate=this._getDefaultDate();if(dates.length>0){var settings=this._getFormatConfig();if(dates.length>1){date=$.datepicker.parseDate(dateFormat,dates[1],settings)||defaultDate;this._endDay=date.getDate();this._endMonth=date.getMonth();this._endYear=date.getFullYear()}try{date=$.datepicker.parseDate(dateFormat,dates[0],settings)||defaultDate}catch(e){$.datepicker.log(e);date=defaultDate}}this._selectedDay=date.getDate();this._drawMonth=this._selectedMonth=date.getMonth();this._drawYear=this._selectedYear=date.getFullYear();this._currentDay=(dates[0]?date.getDate():0);this._currentMonth=(dates[0]?date.getMonth():0);this._currentYear=(dates[0]?date.getFullYear():0);this._adjustDate()},_getDefaultDate:function(){var date=this._determineDate("defaultDate",new Date());var minDate=this._getMinMaxDate("min",true);var maxDate=this._getMinMaxDate("max");date=(minDate&&date<minDate?minDate:date);date=(maxDate&&date>maxDate?maxDate:date);return date},_determineDate:function(name,defaultDate){var offsetNumeric=function(offset){var date=new Date();date.setDate(date.getDate()+offset);return date};var offsetString=function(offset,getDaysInMonth){var date=new Date();var matches=/^([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?$/.exec(offset);if(matches){var year=date.getFullYear();var month=date.getMonth();var day=date.getDate();switch(matches[2]||"d"){case"d":case"D":day+=(matches[1]-0);break;case"w":case"W":day+=(matches[1]*7);break;case"m":case"M":month+=(matches[1]-0);day=Math.min(day,getDaysInMonth(year,month));break;case"y":case"Y":year+=(matches[1]-0);day=Math.min(day,getDaysInMonth(year,month));break}date=new Date(year,month,day)}return date};var date=this._get(name);return(date==null?defaultDate:(typeof date=="string"?offsetString(date,this._getDaysInMonth):(typeof date=="number"?offsetNumeric(date):date)))},_setDate:function(date,endDate){this._selectedDay=this._currentDay=date.getDate();this._drawMonth=this._selectedMonth=this._currentMonth=date.getMonth();this._drawYear=this._selectedYear=this._currentYear=date.getFullYear();if(this._get("rangeSelect")){if(endDate){this._endDay=endDate.getDate();this._endMonth=endDate.getMonth();this._endYear=endDate.getFullYear()}else{this._endDay=this._currentDay;this._endMonth=this._currentMonth;this._endYear=this._currentYear}}this._adjustDate()},_getDate:function(){var startDate=(!this._currentYear||(this._input&&this._input.val()=="")?null:new Date(this._currentYear,this._currentMonth,this._currentDay));if(this._get("rangeSelect")){return[startDate,(!this._endYear?null:new Date(this._endYear,this._endMonth,this._endDay))]}else{return startDate}},_generateDatepicker:function(){var today=new Date();today=new Date(today.getFullYear(),today.getMonth(),today.getDate());var showStatus=this._get("showStatus");var isRTL=this._get("isRTL");var clear=(this._get("mandatory")?"":'<div class="ui-datepicker-clear"><a onclick="jQuery.datepicker._clearDate('+this._id+');"'+(showStatus?this._addStatus(this._get("clearStatus")||"&#xa0;"):"")+">"+this._get("clearText")+"</a></div>");var controls='<div class="ui-datepicker-control">'+(isRTL?"":clear)+'<div class="ui-datepicker-close"><a onclick="jQuery.datepicker._hideDatepicker();"'+(showStatus?this._addStatus(this._get("closeStatus")||"&#xa0;"):"")+">"+this._get("closeText")+"</a></div>"+(isRTL?clear:"")+"</div>";var prompt=this._get("prompt");var closeAtTop=this._get("closeAtTop");var hideIfNoPrevNext=this._get("hideIfNoPrevNext");var numMonths=this._getNumberOfMonths();var stepMonths=this._get("stepMonths");var isMultiMonth=(numMonths[0]!=1||numMonths[1]!=1);var minDate=this._getMinMaxDate("min",true);var maxDate=this._getMinMaxDate("max");var drawMonth=this._drawMonth;var drawYear=this._drawYear;if(maxDate){var maxDraw=new Date(maxDate.getFullYear(),maxDate.getMonth()-numMonths[1]+1,maxDate.getDate());maxDraw=(minDate&&maxDraw<minDate?minDate:maxDraw);while(new Date(drawYear,drawMonth,1)>maxDraw){drawMonth--;if(drawMonth<0){drawMonth=11;drawYear--}}}var prev='<div class="ui-datepicker-prev">'+(this._canAdjustMonth(-1,drawYear,drawMonth)?'<a onclick="jQuery.datepicker._adjustDate('+this._id+", -"+stepMonths+", 'M');\""+(showStatus?this._addStatus(this._get("prevStatus")||"&#xa0;"):"")+">"+this._get("prevText")+"</a>":(hideIfNoPrevNext?"":"<label>"+this._get("prevText")+"</label>"))+"</div>";var next='<div class="ui-datepicker-next">'+(this._canAdjustMonth(+1,drawYear,drawMonth)?'<a onclick="jQuery.datepicker._adjustDate('+this._id+", +"+stepMonths+", 'M');\""+(showStatus?this._addStatus(this._get("nextStatus")||"&#xa0;"):"")+">"+this._get("nextText")+"</a>":(hideIfNoPrevNext?">":"<label>"+this._get("nextText")+"</label>"))+"</div>";var html=(prompt?'<div class="ui-datepicker-prompt">'+prompt+"</div>":"")+(closeAtTop&&!this._inline?controls:"")+'<div class="ui-datepicker-links">'+(isRTL?next:prev)+(this._isInRange(today)?'<div class="ui-datepicker-current"><a onclick="jQuery.datepicker._gotoToday('+this._id+');"'+(showStatus?this._addStatus(this._get("currentStatus")||"&#xa0;"):"")+">"+this._get("currentText")+"</a></div>":"")+(isRTL?prev:next)+"</div>";var showWeeks=this._get("showWeeks");for(var row=0;row<numMonths[0];row++){for(var col=0;col<numMonths[1];col++){var selectedDate=new Date(drawYear,drawMonth,this._selectedDay);html+='<div class="ui-datepicker-one-month'+(col==0?" ui-datepicker-new-row":"")+'">'+this._generateMonthYearHeader(drawMonth,drawYear,minDate,maxDate,selectedDate,row>0||col>0)+'<table class="ui-datepicker" cellpadding="0" cellspacing="0"><thead><tr class="ui-datepicker-title-row">'+(showWeeks?"<td>"+this._get("weekHeader")+"</td>":"");var firstDay=this._get("firstDay");var changeFirstDay=this._get("changeFirstDay");var dayNames=this._get("dayNames");var dayNamesShort=this._get("dayNamesShort");var dayNamesMin=this._get("dayNamesMin");for(var dow=0;dow<7;dow++){var day=(dow+firstDay)%7;var status=this._get("dayStatus")||"&#xa0;";status=(status.indexOf("DD")>-1?status.replace(/DD/,dayNames[day]):status.replace(/D/,dayNamesShort[day]));html+="<td"+((dow+firstDay+6)%7>=5?' class="ui-datepicker-week-end-cell"':"")+">"+(!changeFirstDay?"<span":'<a onclick="jQuery.datepicker._changeFirstDay('+this._id+", "+day+');"')+(showStatus?this._addStatus(status):"")+' title="'+dayNames[day]+'">'+dayNamesMin[day]+(changeFirstDay?"</a>":"</span>")+"</td>"}html+="</tr></thead><tbody>";var daysInMonth=this._getDaysInMonth(drawYear,drawMonth);if(drawYear==this._selectedYear&&drawMonth==this._selectedMonth){this._selectedDay=Math.min(this._selectedDay,daysInMonth)}var leadDays=(this._getFirstDayOfMonth(drawYear,drawMonth)-firstDay+7)%7;var currentDate=(!this._currentDay?new Date(9999,9,9):new Date(this._currentYear,this._currentMonth,this._currentDay));var endDate=this._endDay?new Date(this._endYear,this._endMonth,this._endDay):currentDate;var printDate=new Date(drawYear,drawMonth,1-leadDays);var numRows=(isMultiMonth?6:Math.ceil((leadDays+daysInMonth)/7));var beforeShowDay=this._get("beforeShowDay");var showOtherMonths=this._get("showOtherMonths");var calculateWeek=this._get("calculateWeek")||$.datepicker.iso8601Week;var dateStatus=this._get("statusForDate")||$.datepicker.dateStatus;for(var dRow=0;dRow<numRows;dRow++){html+='<tr class="ui-datepicker-days-row">'+(showWeeks?'<td class="ui-datepicker-week-col">'+calculateWeek(printDate)+"</td>":"");for(var dow=0;dow<7;dow++){var daySettings=(beforeShowDay?beforeShowDay.apply((this._input?this._input[0]:null),[printDate]):[true,""]);var otherMonth=(printDate.getMonth()!=drawMonth);var unselectable=otherMonth||!daySettings[0]||(minDate&&printDate<minDate)||(maxDate&&printDate>maxDate);html+='<td class="ui-datepicker-days-cell'+((dow+firstDay+6)%7>=5?" ui-datepicker-week-end-cell":"")+(otherMonth?" ui-datepicker-otherMonth":"")+(printDate.getTime()==selectedDate.getTime()&&drawMonth==this._selectedMonth?" ui-datepicker-days-cell-over":"")+(unselectable?" ui-datepicker-unselectable":"")+(otherMonth&&!showOtherMonths?"":" "+daySettings[1]+(printDate.getTime()>=currentDate.getTime()&&printDate.getTime()<=endDate.getTime()?" ui-datepicker-current-day":"")+(printDate.getTime()==today.getTime()?" ui-datepicker-today":""))+'"'+(unselectable?"":" onmouseover=\"jQuery(this).addClass('ui-datepicker-days-cell-over');"+(!showStatus||(otherMonth&&!showOtherMonths)?"":"jQuery('#ui-datepicker-status-"+this._id+"').html('"+(dateStatus.apply((this._input?this._input[0]:null),[printDate,this])||"&#xa0;")+"');")+"\" onmouseout=\"jQuery(this).removeClass('ui-datepicker-days-cell-over');"+(!showStatus||(otherMonth&&!showOtherMonths)?"":"jQuery('#ui-datepicker-status-"+this._id+"').html('&#xa0;');")+'" onclick="jQuery.datepicker._selectDay('+this._id+","+drawMonth+","+drawYear+', this);"')+">"+(otherMonth?(showOtherMonths?printDate.getDate():"&#xa0;"):(unselectable?printDate.getDate():"<a>"+printDate.getDate()+"</a>"))+"</td>";printDate.setDate(printDate.getDate()+1)}html+="</tr>"}drawMonth++;if(drawMonth>11){drawMonth=0;drawYear++}html+="</tbody></table></div>"}}html+=(showStatus?'<div style="clear: both;"></div><div id="ui-datepicker-status-'+this._id+'" class="ui-datepicker-status">'+(this._get("initStatus")||"&#xa0;")+"</div>":"")+(!closeAtTop&&!this._inline?controls:"")+'<div style="clear: both;"></div>'+($.browser.msie&&parseInt($.browser.version)<7&&!this._inline?'<iframe src="javascript:false;" class="ui-datepicker-cover"></iframe>':"");return html},_generateMonthYearHeader:function(drawMonth,drawYear,minDate,maxDate,selectedDate,secondary){minDate=(this._rangeStart&&minDate&&selectedDate<minDate?selectedDate:minDate);var showStatus=this._get("showStatus");var html='<div class="ui-datepicker-header">';var monthNames=this._get("monthNames");if(secondary||!this._get("changeMonth")){html+=monthNames[drawMonth]+"&#xa0;"}else{var inMinYear=(minDate&&minDate.getFullYear()==drawYear);var inMaxYear=(maxDate&&maxDate.getFullYear()==drawYear);html+='<select class="ui-datepicker-new-month" onchange="jQuery.datepicker._selectMonthYear('+this._id+", this, 'M');\" onclick=\"jQuery.datepicker._clickMonthYear("+this._id+');"'+(showStatus?this._addStatus(this._get("monthStatus")||"&#xa0;"):"")+">";for(var month=0;month<12;month++){if((!inMinYear||month>=minDate.getMonth())&&(!inMaxYear||month<=maxDate.getMonth())){html+='<option value="'+month+'"'+(month==drawMonth?' selected="selected"':"")+">"+monthNames[month]+"</option>"}}html+="</select>"}if(secondary||!this._get("changeYear")){html+=drawYear}else{var years=this._get("yearRange").split(":");var year=0;var endYear=0;if(years.length!=2){year=drawYear-10;endYear=drawYear+10}else{if(years[0].charAt(0)=="+"||years[0].charAt(0)=="-"){year=new Date().getFullYear()+parseInt(years[0],10);endYear=new Date().getFullYear()+parseInt(years[1],10)}else{year=parseInt(years[0],10);endYear=parseInt(years[1],10)}}year=(minDate?Math.max(year,minDate.getFullYear()):year);endYear=(maxDate?Math.min(endYear,maxDate.getFullYear()):endYear);html+='<select class="ui-datepicker-new-year" onchange="jQuery.datepicker._selectMonthYear('+this._id+", this, 'Y');\" onclick=\"jQuery.datepicker._clickMonthYear("+this._id+');"'+(showStatus?this._addStatus(this._get("yearStatus")||"&#xa0;"):"")+">";for(;year<=endYear;year++){html+='<option value="'+year+'"'+(year==drawYear?' selected="selected"':"")+">"+year+"</option>"}html+="</select>"}html+="</div>";return html},_addStatus:function(text){return" onmouseover=\"jQuery('#ui-datepicker-status-"+this._id+"').html('"+text+"');\" onmouseout=\"jQuery('#ui-datepicker-status-"+this._id+"').html('&#xa0;');\""},_adjustDate:function(offset,period){var year=this._drawYear+(period=="Y"?offset:0);var month=this._drawMonth+(period=="M"?offset:0);var day=Math.min(this._selectedDay,this._getDaysInMonth(year,month))+(period=="D"?offset:0);var date=new Date(year,month,day);var minDate=this._getMinMaxDate("min",true);var maxDate=this._getMinMaxDate("max");date=(minDate&&date<minDate?minDate:date);date=(maxDate&&date>maxDate?maxDate:date);this._selectedDay=date.getDate();this._drawMonth=this._selectedMonth=date.getMonth();this._drawYear=this._selectedYear=date.getFullYear()},_getNumberOfMonths:function(){var numMonths=this._get("numberOfMonths");return(numMonths==null?[1,1]:(typeof numMonths=="number"?[1,numMonths]:numMonths))},_getMinMaxDate:function(minMax,checkRange){var date=this._determineDate(minMax+"Date",null);if(date){date.setHours(0);date.setMinutes(0);date.setSeconds(0);date.setMilliseconds(0)}return date||(checkRange?this._rangeStart:null)},_getDaysInMonth:function(year,month){return 32-new Date(year,month,32).getDate()},_getFirstDayOfMonth:function(year,month){return new Date(year,month,1).getDay()},_canAdjustMonth:function(offset,curYear,curMonth){var numMonths=this._getNumberOfMonths();var date=new Date(curYear,curMonth+(offset<0?offset:numMonths[1]),1);if(offset<0){date.setDate(this._getDaysInMonth(date.getFullYear(),date.getMonth()))}return this._isInRange(date)},_isInRange:function(date){var newMinDate=(!this._rangeStart?null:new Date(this._selectedYear,this._selectedMonth,this._selectedDay));newMinDate=(newMinDate&&this._rangeStart<newMinDate?this._rangeStart:newMinDate);var minDate=newMinDate||this._getMinMaxDate("min");var maxDate=this._getMinMaxDate("max");return((!minDate||date>=minDate)&&(!maxDate||date<=maxDate))},_getFormatConfig:function(){var shortYearCutoff=this._get("shortYearCutoff");shortYearCutoff=(typeof shortYearCutoff!="string"?shortYearCutoff:new Date().getFullYear()%100+parseInt(shortYearCutoff,10));return{shortYearCutoff:shortYearCutoff,dayNamesShort:this._get("dayNamesShort"),dayNames:this._get("dayNames"),monthNamesShort:this._get("monthNamesShort"),monthNames:this._get("monthNames")}},_formatDate:function(day,month,year){if(!day){this._currentDay=this._selectedDay;this._currentMonth=this._selectedMonth;this._currentYear=this._selectedYear}var date=(day?(typeof day=="object"?day:new Date(year,month,day)):new Date(this._currentYear,this._currentMonth,this._currentDay));return $.datepicker.formatDate(this._get("dateFormat"),date,this._getFormatConfig())}});function extendRemove(target,props){$.extend(target,props);for(var name in props){if(props[name]==null){target[name]=null}}return target}$.fn.datepicker=function(options){var otherArgs=Array.prototype.slice.call(arguments,1);if(typeof options=="string"&&(options=="isDisabled"||options=="getDate")){return $.datepicker["_"+options+"Datepicker"].apply($.datepicker,[this[0]].concat(otherArgs))}return this.each(function(){typeof options=="string"?$.datepicker["_"+options+"Datepicker"].apply($.datepicker,[this].concat(otherArgs)):$.datepicker._attachDatepicker(this,options)})};$.datepicker=new Datepicker();$(document).ready(function(){$(document.body).append($.datepicker._datepickerDiv).mousedown($.datepicker._checkExternalClick)})})(jQuery);(function(B){var A={dragStart:"start.draggable",drag:"drag.draggable",dragStop:"stop.draggable",maxHeight:"maxHeight.resizable",minHeight:"minHeight.resizable",maxWidth:"maxWidth.resizable",minWidth:"minWidth.resizable",resizeStart:"start.resizable",resize:"drag.resizable",resizeStop:"stop.resizable"};B.widget("ui.dialog",{init:function(){var K=this,L=this.options,D=typeof L.resizable=="string"?L.resizable:"n,e,s,w,se,sw,ne,nw",E=this.element.addClass("ui-dialog-content").wrap("<div/>").wrap("<div/>"),H=E.parent().addClass("ui-dialog-container").css({position:"relative"}),I=L.title||E.attr("title")||"",C=(this.uiDialogTitlebar=B('<div class="ui-dialog-titlebar"/>')).append('<span class="ui-dialog-title">'+I+"</span>").append('<a href="#" class="ui-dialog-titlebar-close"><span>X</span></a>').prependTo(H),J=(this.uiDialog=H.parent()).appendTo(document.body).hide().addClass("ui-dialog").addClass(L.dialogClass).addClass(E.attr("className")).removeClass("ui-dialog-content").css({position:"absolute",width:L.width,height:L.height,overflow:"hidden",zIndex:L.zIndex}).attr("tabIndex",-1).css("outline",0).keydown(function(M){if(L.closeOnEscape){var N=27;(M.keyCode&&M.keyCode==N&&K.close())}}).mousedown(function(){K.moveToTop()});this.uiDialogTitlebarClose=B(".ui-dialog-titlebar-close",C).hover(function(){B(this).addClass("ui-dialog-titlebar-close-hover")},function(){B(this).removeClass("ui-dialog-titlebar-close-hover")}).mousedown(function(M){M.stopPropagation()}).click(function(){K.close();return false});var G=false;B.each(L.buttons,function(){return !(G=true)});if(G){var F=B('<div class="ui-dialog-buttonpane"/>').appendTo(J);B.each(L.buttons,function(M,N){B("<button/>").text(M).click(function(){N.apply(K.element[0],arguments)}).appendTo(F)})}if(B.fn.draggable){J.draggable({handle:".ui-dialog-titlebar",start:function(N,M){K.moveToTop();(L.dragStart&&L.dragStart.apply(this,arguments))},drag:L.drag,stop:function(N,M){(L.dragStop&&L.dragStop.apply(this,arguments));B.ui.dialog.overlay.resize()}});(L.draggable||J.draggable("disable"))}if(B.fn.resizable){J.resizable({maxWidth:L.maxWidth,maxHeight:L.maxHeight,minWidth:L.minWidth,minHeight:L.minHeight,start:L.resizeStart,resize:L.resize,handles:D,stop:function(N,M){(L.resizeStop&&L.resizeStop.apply(this,arguments));B.ui.dialog.overlay.resize()}});(L.resizable||J.resizable("disable"))}(L.bgiframe&&B.fn.bgiframe&&J.bgiframe());(L.autoOpen&&this.open())},setData:function(C,D){(A[C]&&this.uiDialog.data(A[C],D));switch(C){case"draggable":this.uiDialog.draggable(D?"enable":"disable");break;case"height":this.uiDialog.height(D);break;case"position":this.position(D);break;case"resizable":(typeof D=="string"&&this.uiDialog.data("handles.resizable",D));this.uiDialog.resizable(D?"enable":"disable");break;case"title":B(".ui-dialog-title",this.uiDialogTitlebar).text(D);break;case"width":this.uiDialog.width(D);break}B.widget.prototype.setData.apply(this,arguments)},position:function(H){var D=B(window),E=B(document),F=E.scrollTop(),C=E.scrollLeft(),G=F;if(B.inArray(H,["center","top","right","bottom","left"])>=0){H=[H=="right"||H=="left"?H:"center",H=="top"||H=="bottom"?H:"middle"]}if(H.constructor!=Array){H=["center","middle"]}if(H[0].constructor==Number){C+=H[0]}else{switch(H[0]){case"left":C+=0;break;case"right":C+=D.width()-this.uiDialog.width();break;default:case"center":C+=(D.width()-this.uiDialog.width())/2}}if(H[1].constructor==Number){F+=H[1]}else{switch(H[1]){case"top":F+=0;break;case"bottom":F+=D.height()-this.uiDialog.height();break;default:case"middle":F+=(D.height()-this.uiDialog.height())/2}}F=Math.max(F,G);this.uiDialog.css({top:F,left:C})},open:function(){this.overlay=this.options.modal?new B.ui.dialog.overlay(this):null;this.uiDialog.appendTo("body");this.position(this.options.position);this.uiDialog.show();this.moveToTop(true);var C=null;var D={options:this.options};this.uiDialogTitlebarClose.focus();this.element.triggerHandler("dialogopen",[C,D],this.options.open)},moveToTop:function(E){if((this.options.modal&&!E)||!this.options.stack){return }var D=this.options.zIndex,C=this.options;B(".ui-dialog:visible").each(function(){D=Math.max(D,parseInt(B(this).css("z-index"),10)||C.zIndex)});(this.overlay&&this.overlay.$el.css("z-index",++D));this.uiDialog.css("z-index",++D)},close:function(){(this.overlay&&this.overlay.destroy());this.uiDialog.hide();var D=null;var C={options:this.options};this.element.triggerHandler("dialogclose",[D,C],this.options.close);B.ui.dialog.overlay.resize()},destroy:function(){(this.overlay&&this.overlay.destroy());this.uiDialog.hide();this.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content").hide().appendTo("body");this.uiDialog.remove()}});B.extend(B.ui.dialog,{defaults:{autoOpen:true,bgiframe:false,buttons:{},closeOnEscape:true,draggable:true,height:200,minHeight:100,minWidth:150,modal:false,overlay:{},position:"center",resizable:true,stack:true,width:300,zIndex:1000},overlay:function(C){this.$el=B.ui.dialog.overlay.create(C)}});B.extend(B.ui.dialog.overlay,{instances:[],events:B.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(C){return C+".dialog-overlay"}).join(" "),create:function(D){if(this.instances.length===0){setTimeout(function(){B("a, :input").bind(B.ui.dialog.overlay.events,function(){var F=false;var H=B(this).parents(".ui-dialog");if(H.length){var E=B(".ui-dialog-overlay");if(E.length){var G=parseInt(E.css("z-index"),10);E.each(function(){G=Math.max(G,parseInt(B(this).css("z-index"),10))});F=parseInt(H.css("z-index"),10)>G}else{F=true}}return F})},1);B(document).bind("keydown.dialog-overlay",function(E){var F=27;(E.keyCode&&E.keyCode==F&&D.close())});B(window).bind("resize.dialog-overlay",B.ui.dialog.overlay.resize)}var C=B("<div/>").appendTo(document.body).addClass("ui-dialog-overlay").css(B.extend({borderWidth:0,margin:0,padding:0,position:"absolute",top:0,left:0,width:this.width(),height:this.height()},D.options.overlay));(D.options.bgiframe&&B.fn.bgiframe&&C.bgiframe());this.instances.push(C);return C},destroy:function(C){this.instances.splice(B.inArray(this.instances,C),1);if(this.instances.length===0){B("a, :input").add([document,window]).unbind(".dialog-overlay")}C.remove()},height:function(){if(B.browser.msie&&B.browser.version<7){var D=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);var C=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);if(D<C){return B(window).height()+"px"}else{return D+"px"}}else{return B(document).height()+"px"}},width:function(){if(B.browser.msie&&B.browser.version<7){var C=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);var D=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);if(C<D){return B(window).width()+"px"}else{return C+"px"}}else{return B(document).width()+"px"}},resize:function(){var C=B([]);B.each(B.ui.dialog.overlay.instances,function(){C=C.add(this)});C.css({width:0,height:0}).css({width:B.ui.dialog.overlay.width(),height:B.ui.dialog.overlay.height()})}});B.extend(B.ui.dialog.overlay.prototype,{destroy:function(){B.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);(function(A){A.fn.unwrap=A.fn.unwrap||function(B){return this.each(function(){A(this).parents(B).eq(0).after(this).remove()})};A.widget("ui.slider",{plugins:{},ui:function(B){return{options:this.options,handle:this.currentHandle,value:this.options.axis!="both"||!this.options.axis?Math.round(this.value(null,this.options.axis=="vertical"?"y":"x")):{x:Math.round(this.value(null,"x")),y:Math.round(this.value(null,"y"))},range:this.getRange()}},propagate:function(C,B){A.ui.plugin.call(this,C,[B,this.ui()]);this.element.triggerHandler(C=="slide"?C:"slide"+C,[B,this.ui()],this.options[C])},destroy:function(){this.element.removeClass("ui-slider ui-slider-disabled").removeData("slider").unbind(".slider");this.handle.unwrap("a");this.handle.each(function(){A(this).data("mouse").mouseDestroy()});this.generated&&this.generated.remove()},setData:function(B,C){A.widget.prototype.setData.apply(this,arguments);if(/min|max|steps/.test(B)){this.initBoundaries()}},init:function(){var B=this;this.element.addClass("ui-slider");this.initBoundaries();this.handle=A(this.options.handle,this.element);if(!this.handle.length){B.handle=B.generated=A(B.options.handles||[0]).map(function(){var D=A("<div/>").addClass("ui-slider-handle").appendTo(B.element);if(this.id){D.attr("id",this.id)}return D[0]})}var C=function(D){this.element=A(D);this.element.data("mouse",this);this.options=B.options;this.element.bind("mousedown",function(){if(B.currentHandle){this.blur(B.currentHandle)}B.focus(this,1)});this.mouseInit()};A.extend(C.prototype,A.ui.mouse,{mouseStart:function(D){return B.start.call(B,D,this.element[0])},mouseStop:function(D){return B.stop.call(B,D,this.element[0])},mouseDrag:function(D){return B.drag.call(B,D,this.element[0])},mouseCapture:function(){return true},trigger:function(D){this.mouseDown(D)}});A(this.handle).each(function(){new C(this)}).wrap('<a href="javascript:void(0)" style="cursor:default;"></a>').parent().bind("focus",function(D){B.focus(this.firstChild)}).bind("blur",function(D){B.blur(this.firstChild)}).bind("keydown",function(D){if(!B.options.noKeyboard){B.keydown(D.keyCode,this.firstChild)}});this.element.bind("mousedown.slider",function(D){B.click.apply(B,[D]);B.currentHandle.data("mouse").trigger(D);B.firstValue=B.firstValue+1});A.each(this.options.handles||[],function(D,E){B.moveTo(E.start,D,true)});if(!isNaN(this.options.startValue)){this.moveTo(this.options.startValue,0,true)}this.previousHandle=A(this.handle[0]);if(this.handle.length==2&&this.options.range){this.createRange()}},initBoundaries:function(){var B=this.element[0],C=this.options;this.actualSize={width:this.element.outerWidth(),height:this.element.outerHeight()};A.extend(C,{axis:C.axis||(B.offsetWidth<B.offsetHeight?"vertical":"horizontal"),max:!isNaN(parseInt(C.max,10))?{x:parseInt(C.max,10),y:parseInt(C.max,10)}:({x:C.max&&C.max.x||100,y:C.max&&C.max.y||100}),min:!isNaN(parseInt(C.min,10))?{x:parseInt(C.min,10),y:parseInt(C.min,10)}:({x:C.min&&C.min.x||0,y:C.min&&C.min.y||0})});C.realMax={x:C.max.x-C.min.x,y:C.max.y-C.min.y};C.stepping={x:C.stepping&&C.stepping.x||parseInt(C.stepping,10)||(C.steps?C.realMax.x/(C.steps.x||parseInt(C.steps,10)||C.realMax.x):0),y:C.stepping&&C.stepping.y||parseInt(C.stepping,10)||(C.steps?C.realMax.y/(C.steps.y||parseInt(C.steps,10)||C.realMax.y):0)}},keydown:function(C,B){if(/(37|38|39|40)/.test(C)){this.moveTo({x:/(37|39)/.test(C)?(C==37?"-":"+")+"="+this.oneStep("x"):0,y:/(38|40)/.test(C)?(C==38?"-":"+")+"="+this.oneStep("y"):0},B)}},focus:function(B,C){this.currentHandle=A(B).addClass("ui-slider-handle-active");if(C){this.currentHandle.parent()[0].focus()}},blur:function(B){A(B).removeClass("ui-slider-handle-active");if(this.currentHandle&&this.currentHandle[0]==B){this.previousHandle=this.currentHandle;this.currentHandle=null}},click:function(C){var D=[C.pageX,C.pageY];var B=false;this.handle.each(function(){if(this==C.target){B=true}});if(B||this.options.disabled||!(this.currentHandle||this.previousHandle)){return }if(!this.currentHandle&&this.previousHandle){this.focus(this.previousHandle,true)}this.offset=this.element.offset();this.moveTo({y:this.convertValue(C.pageY-this.offset.top-this.currentHandle[0].offsetHeight/2,"y"),x:this.convertValue(C.pageX-this.offset.left-this.currentHandle[0].offsetWidth/2,"x")},null,!this.options.distance)},createRange:function(){this.rangeElement=A("<div></div>").addClass("ui-slider-range").css({position:"absolute"}).appendTo(this.element);this.updateRange()},updateRange:function(){var C=this.options.axis=="vertical"?"top":"left";var B=this.options.axis=="vertical"?"height":"width";this.rangeElement.css(C,(parseInt(A(this.handle[0]).css(C),10)||0)+this.handleSize(0,this.options.axis=="vertical"?"y":"x")/2);this.rangeElement.css(B,(parseInt(A(this.handle[1]).css(C),10)||0)-(parseInt(A(this.handle[0]).css(C),10)||0))},getRange:function(){return this.rangeElement?this.convertValue(parseInt(this.rangeElement.css(this.options.axis=="vertical"?"height":"width"),10),this.options.axis=="vertical"?"y":"x"):null},handleIndex:function(){return this.handle.index(this.currentHandle[0])},value:function(D,B){if(this.handle.length==1){this.currentHandle=this.handle}if(!B){B=this.options.axis=="vertical"?"y":"x"}var C=A(D!=undefined&&D!==null?this.handle[D]||D:this.currentHandle);if(C.data("mouse").sliderValue){return parseInt(C.data("mouse").sliderValue[B],10)}else{return parseInt(((parseInt(C.css(B=="x"?"left":"top"),10)/(this.actualSize[B=="x"?"width":"height"]-this.handleSize(D,B)))*this.options.realMax[B])+this.options.min[B],10)}},convertValue:function(C,B){return this.options.min[B]+(C/(this.actualSize[B=="x"?"width":"height"]-this.handleSize(null,B)))*this.options.realMax[B]},translateValue:function(C,B){return((C-this.options.min[B])/this.options.realMax[B])*(this.actualSize[B=="x"?"width":"height"]-this.handleSize(null,B))},translateRange:function(D,B){if(this.rangeElement){if(this.currentHandle[0]==this.handle[0]&&D>=this.translateValue(this.value(1),B)){D=this.translateValue(this.value(1,B)-this.oneStep(B),B)}if(this.currentHandle[0]==this.handle[1]&&D<=this.translateValue(this.value(0),B)){D=this.translateValue(this.value(0,B)+this.oneStep(B),B)}}if(this.options.handles){var C=this.options.handles[this.handleIndex()];if(D<this.translateValue(C.min,B)){D=this.translateValue(C.min,B)}else{if(D>this.translateValue(C.max,B)){D=this.translateValue(C.max,B)}}}return D},translateLimits:function(C,B){if(C>=this.actualSize[B=="x"?"width":"height"]-this.handleSize(null,B)){C=this.actualSize[B=="x"?"width":"height"]-this.handleSize(null,B)}if(C<=0){C=0}return C},handleSize:function(C,B){return A(C!=undefined&&C!==null?this.handle[C]:this.currentHandle)[0]["offset"+(B=="x"?"Width":"Height")]},oneStep:function(B){return this.options.stepping[B]||1},start:function(C,B){var D=this.options;if(D.disabled){return false}this.actualSize={width:this.element.outerWidth(),height:this.element.outerHeight()};if(!this.currentHandle){this.focus(this.previousHandle,true)}this.offset=this.element.offset();this.handleOffset=this.currentHandle.offset();this.clickOffset={top:C.pageY-this.handleOffset.top,left:C.pageX-this.handleOffset.left};this.firstValue=this.value();this.propagate("start",C);this.drag(C,B);return true},stop:function(B){this.propagate("stop",B);if(this.firstValue!=this.value()){this.propagate("change",B)}this.focus(this.currentHandle,true);return false},drag:function(E,D){var F=this.options;var B={top:E.pageY-this.offset.top-this.clickOffset.top,left:E.pageX-this.offset.left-this.clickOffset.left};if(!this.currentHandle){this.focus(this.previousHandle,true)}B.left=this.translateLimits(B.left,"x");B.top=this.translateLimits(B.top,"y");if(F.stepping.x){var C=this.convertValue(B.left,"x");C=Math.round(C/F.stepping.x)*F.stepping.x;B.left=this.translateValue(C,"x")}if(F.stepping.y){var C=this.convertValue(B.top,"y");C=Math.round(C/F.stepping.y)*F.stepping.y;B.top=this.translateValue(C,"y")}B.left=this.translateRange(B.left,"x");B.top=this.translateRange(B.top,"y");if(F.axis!="vertical"){this.currentHandle.css({left:B.left})}if(F.axis!="horizontal"){this.currentHandle.css({top:B.top})}this.currentHandle.data("mouse").sliderValue={x:Math.round(this.convertValue(B.left,"x"))||0,y:Math.round(this.convertValue(B.top,"y"))||0};if(this.rangeElement){this.updateRange()}this.propagate("slide",E);return false},moveTo:function(F,E,G){var H=this.options;this.actualSize={width:this.element.outerWidth(),height:this.element.outerHeight()};if(E==undefined&&!this.currentHandle&&this.handle.length!=1){return false}if(E==undefined&&!this.currentHandle){E=0}if(E!=undefined){this.currentHandle=this.previousHandle=A(this.handle[E]||E)}if(F.x!==undefined&&F.y!==undefined){var B=F.x,I=F.y}else{var B=F,I=F}if(B!==undefined&&B.constructor!=Number){var D=/^\-\=/.test(B),C=/^\+\=/.test(B);if(D||C){B=this.value(null,"x")+parseInt(B.replace(D?"=":"+=",""),10)}else{B=isNaN(parseInt(B,10))?undefined:parseInt(B,10)}}if(I!==undefined&&I.constructor!=Number){var D=/^\-\=/.test(I),C=/^\+\=/.test(I);if(D||C){I=this.value(null,"y")+parseInt(I.replace(D?"=":"+=",""),10)}else{I=isNaN(parseInt(I,10))?undefined:parseInt(I,10)}}if(H.axis!="vertical"&&B!==undefined){if(H.stepping.x){B=Math.round(B/H.stepping.x)*H.stepping.x}B=this.translateValue(B,"x");B=this.translateLimits(B,"x");B=this.translateRange(B,"x");this.currentHandle.css({left:B})}if(H.axis!="horizontal"&&I!==undefined){if(H.stepping.y){I=Math.round(I/H.stepping.y)*H.stepping.y}I=this.translateValue(I,"y");I=this.translateLimits(I,"y");I=this.translateRange(I,"y");this.currentHandle.css({top:I})}if(this.rangeElement){this.updateRange()}this.currentHandle.data("mouse").sliderValue={x:Math.round(this.convertValue(B,"x"))||0,y:Math.round(this.convertValue(I,"y"))||0};if(!G){this.propagate("start",null);this.propagate("stop",null);this.propagate("change",null);this.propagate("slide",null)}}});A.ui.slider.getter="value";A.ui.slider.defaults={handle:".ui-slider-handle",distance:1}})(jQuery);(function(A){A.widget("ui.tabs",{init:function(){this.options.event+=".tabs";this.tabify(true)},setData:function(B,C){if((/^selected/).test(B)){this.select(C)}else{this.options[B]=C;this.tabify()}},length:function(){return this.$tabs.length},tabId:function(B){return B.title&&B.title.replace(/\s/g,"_").replace(/[^A-Za-z0-9\-_:\.]/g,"")||this.options.idPrefix+A.data(B)},ui:function(C,B){return{options:this.options,tab:C,panel:B}},tabify:function(O){this.$lis=A("li:has(a[href])",this.element);this.$tabs=this.$lis.map(function(){return A("a",this)[0]});this.$panels=A([]);var P=this,D=this.options;this.$tabs.each(function(R,Q){if(Q.hash&&Q.hash.replace("#","")){P.$panels=P.$panels.add(Q.hash)}else{if(A(Q).attr("href")!="#"){A.data(Q,"href.tabs",Q.href);A.data(Q,"load.tabs",Q.href);var T=P.tabId(Q);Q.href="#"+T;var S=A("#"+T);if(!S.length){S=A(D.panelTemplate).attr("id",T).addClass(D.panelClass).insertAfter(P.$panels[R-1]||P.element);S.data("destroy.tabs",true)}P.$panels=P.$panels.add(S)}else{D.disabled.push(R+1)}}});if(O){this.element.addClass(D.navClass);this.$panels.each(function(){var Q=A(this);Q.addClass(D.panelClass)});if(D.selected===undefined){if(location.hash){this.$tabs.each(function(S,Q){if(Q.hash==location.hash){D.selected=S;if(A.browser.msie||A.browser.opera){var R=A(location.hash),T=R.attr("id");R.attr("id","");setTimeout(function(){R.attr("id",T)},500)}scrollTo(0,0);return false}})}else{if(D.cookie){var J=parseInt(A.cookie("ui-tabs"+A.data(P.element)),10);if(J&&P.$tabs[J]){D.selected=J}}else{if(P.$lis.filter("."+D.selectedClass).length){D.selected=P.$lis.index(P.$lis.filter("."+D.selectedClass)[0])}}}}D.selected=D.selected===null||D.selected!==undefined?D.selected:0;D.disabled=A.unique(D.disabled.concat(A.map(this.$lis.filter("."+D.disabledClass),function(R,Q){return P.$lis.index(R)}))).sort();if(A.inArray(D.selected,D.disabled)!=-1){D.disabled.splice(A.inArray(D.selected,D.disabled),1)}this.$panels.addClass(D.hideClass);this.$lis.removeClass(D.selectedClass);if(D.selected!==null){this.$panels.eq(D.selected).show().removeClass(D.hideClass);this.$lis.eq(D.selected).addClass(D.selectedClass);var K=function(){A(P.element).triggerHandler("tabsshow",[P.ui(P.$tabs[D.selected],P.$panels[D.selected])],D.show)};if(A.data(this.$tabs[D.selected],"load.tabs")){this.load(D.selected,K)}else{K()}}A(window).bind("unload",function(){P.$tabs.unbind(".tabs");P.$lis=P.$tabs=P.$panels=null})}for(var G=0,N;N=this.$lis[G];G++){A(N)[A.inArray(G,D.disabled)!=-1&&!A(N).hasClass(D.selectedClass)?"addClass":"removeClass"](D.disabledClass)}if(D.cache===false){this.$tabs.removeData("cache.tabs")}var C,I,B={"min-width":0,duration:1},E="normal";if(D.fx&&D.fx.constructor==Array){C=D.fx[0]||B,I=D.fx[1]||B}else{C=I=D.fx||B}var H={display:"",overflow:"",height:""};if(!A.browser.msie){H.opacity=""}function M(R,Q,S){Q.animate(C,C.duration||E,function(){Q.addClass(D.hideClass).css(H);if(A.browser.msie&&C.opacity){Q[0].style.filter=""}if(S){L(R,S,Q)}})}function L(R,S,Q){if(I===B){S.css("display","block")}S.animate(I,I.duration||E,function(){S.removeClass(D.hideClass).css(H);if(A.browser.msie&&I.opacity){S[0].style.filter=""}A(P.element).triggerHandler("tabsshow",[P.ui(R,S[0])],D.show)})}function F(R,T,Q,S){T.addClass(D.selectedClass).siblings().removeClass(D.selectedClass);M(R,Q,S)}this.$tabs.unbind(".tabs").bind(D.event,function(){var T=A(this).parents("li:eq(0)"),Q=P.$panels.filter(":visible"),S=A(this.hash);if((T.hasClass(D.selectedClass)&&!D.unselect)||T.hasClass(D.disabledClass)||A(this).hasClass(D.loadingClass)||A(P.element).triggerHandler("tabsselect",[P.ui(this,S[0])],D.select)===false){this.blur();return false}P.options.selected=P.$tabs.index(this);if(D.unselect){if(T.hasClass(D.selectedClass)){P.options.selected=null;T.removeClass(D.selectedClass);P.$panels.stop();M(this,Q);this.blur();return false}else{if(!Q.length){P.$panels.stop();var R=this;P.load(P.$tabs.index(this),function(){T.addClass(D.selectedClass).addClass(D.unselectClass);L(R,S)});this.blur();return false}}}if(D.cookie){A.cookie("ui-tabs"+A.data(P.element),P.options.selected,D.cookie)}P.$panels.stop();if(S.length){var R=this;P.load(P.$tabs.index(this),Q.length?function(){F(R,T,Q,S)}:function(){T.addClass(D.selectedClass);L(R,S)})}else{throw"jQuery UI Tabs: Mismatching fragment identifier."}if(A.browser.msie){this.blur()}return false});if(!(/^click/).test(D.event)){this.$tabs.bind("click.tabs",function(){return false})}},add:function(E,D,C){if(C==undefined){C=this.$tabs.length}var G=this.options;var I=A(G.tabTemplate.replace(/#\{href\}/g,E).replace(/#\{label\}/g,D));I.data("destroy.tabs",true);var H=E.indexOf("#")==0?E.replace("#",""):this.tabId(A("a:first-child",I)[0]);var F=A("#"+H);if(!F.length){F=A(G.panelTemplate).attr("id",H).addClass(G.hideClass).data("destroy.tabs",true)}F.addClass(G.panelClass);if(C>=this.$lis.length){I.appendTo(this.element);F.appendTo(this.element[0].parentNode)}else{I.insertBefore(this.$lis[C]);F.insertBefore(this.$panels[C])}G.disabled=A.map(G.disabled,function(K,J){return K>=C?++K:K});this.tabify();if(this.$tabs.length==1){I.addClass(G.selectedClass);F.removeClass(G.hideClass);var B=A.data(this.$tabs[0],"load.tabs");if(B){this.load(C,B)}}this.element.triggerHandler("tabsadd",[this.ui(this.$tabs[C],this.$panels[C])],G.add)},remove:function(B){var D=this.options,E=this.$lis.eq(B).remove(),C=this.$panels.eq(B).remove();if(E.hasClass(D.selectedClass)&&this.$tabs.length>1){this.select(B+(B+1<this.$tabs.length?1:-1))}D.disabled=A.map(A.grep(D.disabled,function(G,F){return G!=B}),function(G,F){return G>=B?--G:G});this.tabify();this.element.triggerHandler("tabsremove",[this.ui(E.find("a")[0],C[0])],D.remove)},enable:function(B){var C=this.options;if(A.inArray(B,C.disabled)==-1){return }var D=this.$lis.eq(B).removeClass(C.disabledClass);if(A.browser.safari){D.css("display","inline-block");setTimeout(function(){D.css("display","block")},0)}C.disabled=A.grep(C.disabled,function(F,E){return F!=B});this.element.triggerHandler("tabsenable",[this.ui(this.$tabs[B],this.$panels[B])],C.enable)},disable:function(C){var B=this,D=this.options;if(C!=D.selected){this.$lis.eq(C).addClass(D.disabledClass);D.disabled.push(C);D.disabled.sort();this.element.triggerHandler("tabsdisable",[this.ui(this.$tabs[C],this.$panels[C])],D.disable)}},select:function(B){if(typeof B=="string"){B=this.$tabs.index(this.$tabs.filter("[href$="+B+"]")[0])}this.$tabs.eq(B).trigger(this.options.event)},load:function(G,K){var L=this,D=this.options,E=this.$tabs.eq(G),J=E[0],H=K==undefined||K===false,B=E.data("load.tabs");K=K||function(){};if(!B||!H&&A.data(J,"cache.tabs")){K();return }var M=function(N){var O=A(N),P=O.find("*:last");return P.length&&P||O};var C=function(){L.$tabs.filter("."+D.loadingClass).removeClass(D.loadingClass).each(function(){if(D.spinner){M(this).parent().html(M(this).data("label.tabs"))}});L.xhr=null};if(D.spinner){var I=M(J).html();M(J).wrapInner("<em></em>").find("em").data("label.tabs",I).html(D.spinner)}var F=A.extend({},D.ajaxOptions,{url:B,success:function(O,N){A(J.hash).html(O);C();if(D.cache){A.data(J,"cache.tabs",true)}A(L.element).triggerHandler("tabsload",[L.ui(L.$tabs[G],L.$panels[G])],D.load);D.ajaxOptions.success&&D.ajaxOptions.success(O,N);K()}});if(this.xhr){this.xhr.abort();C()}E.addClass(D.loadingClass);setTimeout(function(){L.xhr=A.ajax(F)},0)},url:function(C,B){this.$tabs.eq(C).removeData("cache.tabs").data("load.tabs",B)},destroy:function(){var B=this.options;this.element.unbind(".tabs").removeClass(B.navClass).removeData("tabs");this.$tabs.each(function(){var C=A.data(this,"href.tabs");if(C){this.href=C}var D=A(this).unbind(".tabs");A.each(["href","load","cache"],function(E,F){D.removeData(F+".tabs")})});this.$lis.add(this.$panels).each(function(){if(A.data(this,"destroy.tabs")){A(this).remove()}else{A(this).removeClass([B.selectedClass,B.unselectClass,B.disabledClass,B.panelClass,B.hideClass].join(" "))}})}});A.ui.tabs.defaults={unselect:false,event:"click",disabled:[],cookie:null,spinner:"Loading&#8230;",cache:false,idPrefix:"ui-tabs-",ajaxOptions:{},fx:null,tabTemplate:'<li><a href="#{href}"><span>#{label}</span></a></li>',panelTemplate:"<div></div>",navClass:"ui-tabs-nav",selectedClass:"ui-tabs-selected",unselectClass:"ui-tabs-unselect",disabledClass:"ui-tabs-disabled",panelClass:"ui-tabs-panel",hideClass:"ui-tabs-hide",loadingClass:"ui-tabs-loading"};A.ui.tabs.getter="length";A.extend(A.ui.tabs.prototype,{rotation:null,rotate:function(C,F){F=F||false;var B=this,E=this.options.selected;function G(){B.rotation=setInterval(function(){E=++E<B.$tabs.length?E:0;B.select(E)},C)}function D(H){if(!H||H.clientX){clearInterval(B.rotation)}}if(C){G();if(!F){this.$tabs.bind(this.options.event,D)}else{this.$tabs.bind(this.options.event,function(){D();E=B.options.selected;G()})}}else{D();this.$tabs.unbind(this.options.event,D)}}})})(jQuery)
;

 //~ =======  ::Datei:: javascripts/jquery/plugins/jquery_ui/i18n/ui.datepicker-de_fr_it.js ========
/* German initialisation for the jQuery UI date picker plugin. */
/* Written by Milian Wolff (mail@milianw.de). */
jQuery(function($){
	$.datepicker.regional['de'] = {clearText: 'löschen', clearStatus: 'aktuelles Datum löschen',
		closeText: 'schließen', closeStatus: 'ohne Änderungen schließen',
		prevText: '&#x3c;zurück', prevStatus: 'letzten Monat zeigen',
		nextText: 'Vor&#x3e;', nextStatus: 'nächsten Monat zeigen',
		currentText: 'heute', currentStatus: '',
		monthNames: ['Januar','Februar','März','April','Mai','Juni',
		'Juli','August','September','Oktober','November','Dezember'],
		monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun',
		'Jul','Aug','Sep','Okt','Nov','Dez'],
		monthStatus: 'anderen Monat anzeigen', yearStatus: 'anderes Jahr anzeigen',
		weekHeader: 'Wo', weekStatus: 'Woche des Monats',
		dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
		dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		dayStatus: 'Setze DD als ersten Wochentag', dateStatus: 'Wähle D, M d',
		dateFormat: 'dd.mm.yy', firstDay: 1,
		initStatus: 'Wähle ein Datum', isRTL: false};


	$.datepicker.regional['fr'] = {clearText: 'Effacer', clearStatus: '',
		closeText: 'Fermer', closeStatus: 'Fermer sans modifier',
		prevText: '&lt;Préc', prevStatus: 'Voir le mois précédent',
		nextText: 'Suiv&gt;', nextStatus: 'Voir le mois suivant',
		currentText: 'Courant', currentStatus: 'Voir le mois courant',
		monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin',
		'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
		monthNamesShort: ['Jan','Fév','Mar','Avr','Mai','Jun',
		'Jul','Aoû','Sep','Oct','Nov','Déc'],
		monthStatus: 'Voir un autre mois', yearStatus: 'Voir un autre année',
		weekHeader: 'Sm', weekStatus: '',
		dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
		dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
		dayNamesMin: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
		dayStatus: 'Utiliser DD comme premier jour de la semaine', dateStatus: 'Choisir le DD, MM d',
		dateFormat: 'dd/mm/yy', firstDay: 0,
		initStatus: 'Choisir la date', isRTL: false};

	$.datepicker.regional['it'] = {clearText: 'Svuota', clearStatus: '',
		closeText: 'Chiudi', closeStatus: '',
		prevText: '&lt;Prec', prevStatus: '',
		nextText: 'Succ&gt;', nextStatus: '',
		currentText: 'Oggi', currentStatus: '',
		monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
		'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
		monthNamesShort: ['Gen','Feb','Mar','Apr','Mag','Giu',
		'Lug','Ago','Set','Ott','Nov','Dic'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Sm', weekStatus: '',
		dayNames: ['Domenica','Luned&#236','Marted&#236','Mercoled&#236','Gioved&#236','Venerd&#236','Sabato'],
		dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
		dayNamesMin: ['Do','Lu','Ma','Me','Gio','Ve','Sa'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'dd/mm/yy', firstDay: 1,
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['de']);
});

;

 //~ =======  ::Datei:: javascripts/fancybox/jquery.fancybox.js ========
/*
 * FancyBox - simple jQuery plugin for fancy image zooming
 * Examples and documentation at: http://fancy.klade.lv/
 * Version: 1.0.0 (29/04/2008)
 * Copyright (c) 2008 Janis Skarnelis
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 * Requires: jQuery v1.2.1 or later
*/
;(function($) {
  var opts = {},
    imgPreloader = new Image, imgTypes = ['png', 'jpg', 'jpeg', 'gif'],
    loadingTimer, loadingFrame = 1;

   $.fn.fancybox = function(settings) {
    opts.settings = $.extend({}, $.fn.fancybox.defaults, settings);

    $.fn.fancybox.init();

    return this.each(function() {
      var $this = $(this);
      var o = $.metadata ? $.extend({}, opts.settings, $this.metadata()) : opts.settings;

      $this.unbind('click').click(function() {
        $.fn.fancybox.start(this, o); return false;
      });
    });
  };

  $.fn.fancybox.start = function(el, o) {
    if (opts.animating) return false;

    if (o.overlayShow) {
      $("#fancy_wrap").prepend('<div id="fancy_overlay"></div>');
      $("#fancy_overlay").css({'width': $(window).width(), 'height': $(document).height(), 'opacity': o.overlayOpacity});

      if ($.browser.msie) {
        $("#fancy_wrap").prepend('<iframe id="fancy_bigIframe" scrolling="no" frameborder="0"></iframe>');
        $("#fancy_bigIframe").css({'width': $(window).width(), 'height': $(document).height(), 'opacity': 0});
      }

      $("#fancy_overlay").click($.fn.fancybox.close);
    }

    opts.itemArray  = [];
    opts.itemNum  = 0;

    if (jQuery.isFunction(o.itemLoadCallback)) {
       o.itemLoadCallback.apply(this, [opts]);

      var c  = $(el).children("img:first").length ? $(el).children("img:first") : $(el);
      var tmp  = {'width': c.width(), 'height': c.height(), 'pos': $.fn.fancybox.getPosition(c)}

       for (var i = 0; i < opts.itemArray.length; i++) {
        opts.itemArray[i].o = $.extend({}, o, opts.itemArray[i].o);

        if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0) {
          opts.itemArray[i].orig = tmp;
        }
       }

    } else {
      if (!el.rel || el.rel == '') {

        //~ SB Hack fuer den Title aus dem metadata des Objects
        var item = {url: el.href, title: ((o.title)?o.title:el.title), o: o};

        if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0) {
          var c = $(el).children("img:first").length ? $(el).children("img:first") : $(el);
          item.orig = {'width': c.width(), 'height': c.height(), 'pos': $.fn.fancybox.getPosition(c)}
        }

        opts.itemArray.push(item);

      } else {
        var arr  = $('a[rel="' + el.rel + '"]').get();

        for (var i = 0; i < arr.length; i++) {
          var tmp    = $.metadata ? $.extend({}, o, $(arr[i]).metadata()) : o;
             var item  = {url: arr[i].href, title: arr[i].title, o: tmp};

             if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0) {
            var c = $(arr[i]).children("img:first").length ? $(arr[i]).children("img:first") : $(el);

            item.orig = {'width': c.width(), 'height': c.height(), 'pos': $.fn.fancybox.getPosition(c)}
          }

          if (arr[i].href == el.href) opts.itemNum = i;

          opts.itemArray.push(item);
        }
      }
    }

    $.fn.fancybox.changeItem(opts.itemNum);
  };

  $.fn.fancybox.changeItem = function(n) {
    $.fn.fancybox.showLoading();

    opts.itemNum = n;

    $("#fancy_nav").empty();
    $("#fancy_outer").stop();
    $("#fancy_title").hide();
    $(document).unbind("keydown");

    imgRegExp = imgTypes.join('|');
      imgRegExp = new RegExp('\.(' + imgRegExp + ')$', 'i');

    var url = opts.itemArray[n].url;

    if (url.match(/#/)) {
      var target = window.location.href.split('#')[0]; target = url.replace(target,'');

          $.fn.fancybox.showItem('<div id="fancy_div">' + $(target).html() + '</div>');

          $("#fancy_loading").hide();

    } else if (url.match(imgRegExp)) {
      $(imgPreloader).unbind('load').bind('load', function() {
        $("#fancy_loading").hide();

        opts.itemArray[n].o.frameWidth  = imgPreloader.width;
        opts.itemArray[n].o.frameHeight  = imgPreloader.height;

        $.fn.fancybox.showItem('<img id="fancy_img" src="' + imgPreloader.src + '" />');

      }).attr('src', url + '?rand=' + Math.floor(Math.random() * 999999999) );

    } else {
      $.fn.fancybox.showItem('<iframe id="fancy_frame" onload="$.fn.fancybox.showIframe()" name="fancy_iframe' + Math.round(Math.random()*1000) + '" frameborder="0" hspace="0" src="' + url + '"></iframe>');
    }
  };

  $.fn.fancybox.showIframe = function() {
    $("#fancy_loading").hide();
    $("#fancy_frame").show();
  };

  $.fn.fancybox.showItem = function(val) {
    $.fn.fancybox.preloadNeighborImages();

    var viewportPos  = $.fn.fancybox.getViewport();
    var itemSize  = $.fn.fancybox.getMaxSize(viewportPos[0] - 50, viewportPos[1] - 100, opts.itemArray[opts.itemNum].o.frameWidth, opts.itemArray[opts.itemNum].o.frameHeight);

    var itemLeft  = viewportPos[2] + Math.round((viewportPos[0] - itemSize[0]) / 2) - 20;
    var itemTop    = viewportPos[3] + Math.round((viewportPos[1] - itemSize[1]) / 2) - 40;

    var itemOpts = {
      'left':    itemLeft,
      'top':    itemTop,
      'width':  itemSize[0] + 'px',
      'height':  itemSize[1] + 'px'
    }

    if (opts.active) {
      $('#fancy_content').fadeOut("normal", function() {
        $("#fancy_content").empty();

        $("#fancy_outer").animate(itemOpts, "normal", function() {
          $("#fancy_content").append($(val)).fadeIn("normal");
          $.fn.fancybox.updateDetails();
        });
      });

    } else {
      opts.active = true;

      $("#fancy_content").empty();

      if ($("#fancy_content").is(":animated")) {
        //~ console.info('animated!');
      }

      if (opts.itemArray[opts.itemNum].o.zoomSpeedIn > 0) {
        opts.animating    = true;
        itemOpts.opacity  = "show";

        $("#fancy_outer").css({
          'top':    opts.itemArray[opts.itemNum].orig.pos.top - 18,
          'left':    opts.itemArray[opts.itemNum].orig.pos.left - 18,
          'height':  opts.itemArray[opts.itemNum].orig.height,
          'width':  opts.itemArray[opts.itemNum].orig.width
        });

        $("#fancy_content").append($(val)).show();

        $("#fancy_outer").animate(itemOpts, opts.itemArray[opts.itemNum].o.zoomSpeedIn, function() {
          opts.animating = false;
          $.fn.fancybox.updateDetails();
        });

      } else {
        $("#fancy_content").append($(val)).show();
        $("#fancy_outer").css(itemOpts).show();
        $.fn.fancybox.updateDetails();
      }
     }
  };

  $.fn.fancybox.updateDetails = function() {
    $("#fancy_bg,#fancy_close").show();

    if (opts.itemArray[opts.itemNum].title !== undefined && opts.itemArray[opts.itemNum].title !== '') {
      //~ console.log(opts.itemArray[opts.itemNum].title);
      $('#fancy_title div').html(opts.itemArray[opts.itemNum].title);
      $('#fancy_title').show();
    }

    if (opts.itemArray[opts.itemNum].o.hideOnContentClick) {
      $("#fancy_content").mousedown($.fn.fancybox.close);
    } else {
      $("#fancy_content").unbind('click');
    }

    if (opts.itemNum != 0) {
      $("#fancy_nav").append('<a id="fancy_left" href="javascript:;"></a>');

      $('#fancy_left').click(function() {
        $.fn.fancybox.changeItem(opts.itemNum - 1); return false;
      });
    }

    if (opts.itemNum != (opts.itemArray.length - 1)) {
      $("#fancy_nav").append('<a id="fancy_right" href="javascript:;"></a>');

      $('#fancy_right').click(function(){
        $.fn.fancybox.changeItem(opts.itemNum + 1); return false;
      });
    }

    $(document).keydown(function(event) {
      if (event.keyCode == 27) {
              $.fn.fancybox.close();

      } else if(event.keyCode == 37 && opts.itemNum != 0) {
              $.fn.fancybox.changeItem(opts.itemNum - 1);

      } else if(event.keyCode == 39 && opts.itemNum != (opts.itemArray.length - 1)) {
              $.fn.fancybox.changeItem(opts.itemNum + 1);
      }
    });
  };

  $.fn.fancybox.preloadNeighborImages = function() {
    if ((opts.itemArray.length - 1) > opts.itemNum) {
      preloadNextImage = new Image();
      preloadNextImage.src = opts.itemArray[opts.itemNum + 1].url;
    }

    if (opts.itemNum > 0) {
      preloadPrevImage = new Image();
      preloadPrevImage.src = opts.itemArray[opts.itemNum - 1].url;
    }
  };

  $.fn.fancybox.close = function() {
    if (opts.animating) return false;

    $(imgPreloader).unbind('load');
    $(document).unbind("keydown");

    $("#fancy_loading,#fancy_title,#fancy_close,#fancy_bg").hide();

    $("#fancy_nav").empty();

    opts.active  = false;

    if (opts.itemArray[opts.itemNum].o.zoomSpeedOut > 0) {
      var itemOpts = {
        'top':    opts.itemArray[opts.itemNum].orig.pos.top - 18,
        'left':    opts.itemArray[opts.itemNum].orig.pos.left - 18,
        'height':  opts.itemArray[opts.itemNum].orig.height,
        'width':  opts.itemArray[opts.itemNum].orig.width,
        'opacity':  'hide'
      };

      opts.animating = true;

      $("#fancy_outer").animate(itemOpts, opts.itemArray[opts.itemNum].o.zoomSpeedOut, function() {
        $("#fancy_content").hide().empty();
        $("#fancy_overlay,#fancy_bigIframe").remove();
        opts.animating = false;
      });

    } else {
      $("#fancy_outer").hide();
      $("#fancy_content").hide().empty();
      $("#fancy_overlay,#fancy_bigIframe").fadeOut("fast").remove();
    }
  };

  $.fn.fancybox.showLoading = function() {
    clearInterval(loadingTimer);

    var pos = $.fn.fancybox.getViewport();

    $("#fancy_loading").css({'left': ((pos[0] - 40) / 2 + pos[2]), 'top': ((pos[1] - 40) / 2 + pos[3])}).show();
    $("#fancy_loading").bind('click', $.fn.fancybox.close);

    loadingTimer = setInterval($.fn.fancybox.animateLoading, 66);
  };

  $.fn.fancybox.animateLoading = function(el, o) {
    if (!$("#fancy_loading").is(':visible')){
      clearInterval(loadingTimer);
      return;
    }

    $("#fancy_loading > div").css('top', (loadingFrame * -40) + 'px');

    loadingFrame = (loadingFrame + 1) % 12;
  };

  $.fn.fancybox.init = function() {
    if (!$('#fancy_wrap').length) {
      $('<div id="fancy_wrap"><div id="fancy_loading"><div></div></div><div id="fancy_outer"><div id="fancy_inner"><div id="fancy_nav"></div><div id="fancy_close"></div><div id="fancy_content"></div><div id="fancy_title"></div></div></div></div>').appendTo("body");
      $('<div id="fancy_bg"><div class="fancy_bg fancy_bg_n"></div><div class="fancy_bg fancy_bg_ne"></div><div class="fancy_bg fancy_bg_e"></div><div class="fancy_bg fancy_bg_se"></div><div class="fancy_bg fancy_bg_s"></div><div class="fancy_bg fancy_bg_sw"></div><div class="fancy_bg fancy_bg_w"></div><div class="fancy_bg fancy_bg_nw"></div></div>').prependTo("#fancy_inner");

      $('<table cellspacing="0" cellpadding="0" border="0"><tr><td id="fancy_title_left"></td><td id="fancy_title_main"><div></div></td><td id="fancy_title_right"></td></tr></table>').appendTo('#fancy_title');
    }

    if ($.browser.msie) {
      $("#fancy_inner").prepend('<iframe id="fancy_freeIframe" scrolling="no" frameborder="0"></iframe>');
    }

    if (jQuery.fn.pngFix) $(document).pngFix();

      $("#fancy_close").click($.fn.fancybox.close);
  };

  $.fn.fancybox.getPosition = function(el) {
    var pos = el.offset();

    pos.top  += $.fn.fancybox.num(el, 'paddingTop');
    pos.top  += $.fn.fancybox.num(el, 'borderTopWidth');

     pos.left += $.fn.fancybox.num(el, 'paddingLeft');
    pos.left += $.fn.fancybox.num(el, 'borderLeftWidth');

    return pos;
  };

  $.fn.fancybox.num = function (el, prop) {
    //return parseInt($.curCSS(el.jquery?el[0]:el,prop,true))||0;
    return parseInt($(el.jquery?el[0]:el).css(prop))||0;
  };

  $.fn.fancybox.getPageScroll = function() {
    var xScroll, yScroll;

    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
      xScroll = self.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
      yScroll = document.documentElement.scrollTop;
      xScroll = document.documentElement.scrollLeft;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
      xScroll = document.body.scrollLeft;
    }

    return [xScroll, yScroll];
  };

  $.fn.fancybox.getViewport = function() {
    var scroll = $.fn.fancybox.getPageScroll();

    return [$(window).width(), $(window).height(), scroll[0], scroll[1]];
  };

  $.fn.fancybox.getMaxSize = function(maxWidth, maxHeight, imageWidth, imageHeight) {
    var r = Math.min(Math.min(maxWidth, imageWidth) / imageWidth, Math.min(maxHeight, imageHeight) / imageHeight);

    return [Math.round(r * imageWidth), Math.round(r * imageHeight)];
  };

  $.fn.fancybox.defaults = {
    hideOnContentClick:  false,
    zoomSpeedIn:    500,
    zoomSpeedOut:    500,
    frameWidth:      600,
    frameHeight:    400,
    overlayShow:    false,
    overlayOpacity:    0.4,
    itemLoadCallback:  null
  };
})(jQuery);

;

 //~ =======  ::Datei:: javascripts/fancybox/jquery.pngFix.pack.js ========
/**
 * --------------------------------------------------------------------
 * jQuery-Plugin "pngFix"
 * Version: 1.1, 11.09.2007
 * by Andreas Eberhard, andreas.eberhard@gmail.com
 *                      http://jquery.andreaseberhard.de/
 *
 * Copyright (c) 2007 Andreas Eberhard
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 */
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(s($){3.1s.1k=s(j){j=3.1a({12:\'1m.1j\'},j);8 k=(n.P=="r 10 Z"&&U(n.v)==4&&n.v.E("14 5.5")!=-1);8 l=(n.P=="r 10 Z"&&U(n.v)==4&&n.v.E("14 6.0")!=-1);o(3.17.16&&(k||l)){3(2).L("1r[@m$=.M]").z(s(){3(2).7(\'q\',3(2).q());3(2).7(\'p\',3(2).p());8 a=\'\';8 b=\'\';8 c=(3(2).7(\'K\'))?\'K="\'+3(2).7(\'K\')+\'" \':\'\';8 d=(3(2).7(\'A\'))?\'A="\'+3(2).7(\'A\')+\'" \':\'\';8 e=(3(2).7(\'C\'))?\'C="\'+3(2).7(\'C\')+\'" \':\'\';8 f=(3(2).7(\'B\'))?\'B="\'+3(2).7(\'B\')+\'" \':\'\';8 g=(3(2).7(\'R\'))?\'1d:\'+3(2).7(\'R\')+\';\':\'\';8 h=(3(2).1c().7(\'1b\'))?\'19:18;\':\'\';o(2.9.y){a+=\'y:\'+2.9.y+\';\';2.9.y=\'\'}o(2.9.t){a+=\'t:\'+2.9.t+\';\';2.9.t=\'\'}o(2.9.w){a+=\'w:\'+2.9.w+\';\';2.9.w=\'\'}8 i=(2.9.15);b+=\'<x \'+c+d+e+f;b+=\'9="13:11;1q-1p:1o-1n;O:W-V;N:1l;\'+g+h;b+=\'q:\'+3(2).q()+\'u;\'+\'p:\'+3(2).p()+\'u;\';b+=\'J:I:H.r.G\'+\'(m=\\\'\'+3(2).7(\'m\')+\'\\\', D=\\\'F\\\');\';b+=i+\'"></x>\';o(a!=\'\'){b=\'<x 9="13:11;O:W-V;\'+a+h+\'q:\'+3(2).q()+\'u;\'+\'p:\'+3(2).p()+\'u;\'+\'">\'+b+\'</x>\'}3(2).1i();3(2).1h(b)});3(2).L("*").z(s(){8 a=3(2).T(\'N-S\');o(a.E(".M")!=-1){8 b=a.X(\'1g("\')[1].X(\'")\')[0];3(2).T(\'N-S\',\'1f\');3(2).Q(0).Y.J="I:H.r.G(m=\'"+b+"\',D=\'F\')"}});3(2).L("1e[@m$=.M]").z(s(){8 a=3(2).7(\'m\');3(2).Q(0).Y.J=\'I:H.r.G\'+\'(m=\\\'\'+a+\'\\\', D=\\\'F\\\');\';3(2).7(\'m\',j.12)})}1t 3}})(3);',62,92,'||this|jQuery||||attr|var|style|||||||||||||src|navigator|if|height|width|Microsoft|function|padding|px|appVersion|margin|span|border|each|class|alt|title|sizingMethod|indexOf|scale|AlphaImageLoader|DXImageTransform|progid|filter|id|find|png|background|display|appName|get|align|image|css|parseInt|block|inline|split|runtimeStyle|Explorer|Internet|relative|blankgif|position|MSIE|cssText|msie|browser|hand|cursor|extend|href|parent|float|input|none|url|after|hide|gif|pngFix|transparent|blank|line|pre|space|white|img|fn|return'.split('|'),0,{}))
;

 //~ =======  ::Datei:: javascripts/jquery.autosuggest.js ========
;;
/* *********************************** */
/*  jQuer-Plugin
/*  autosuggest v.1.0.0
/*  (c) Seitenbau GmbH, Konstanz
/*  packed by: http://dean.edwards.name/packer/
/* *********************************** */
jQuery.fn.autosuggest = function(user_remote, user_conf) {
  // set vars
  var as_input = jQuery(this[0]);
  var as_input_offset = as_input.offset({scroll:false,border:true,margin:true,padding:true});
  var as_user_input = null;
  var as_form = jQuery(as_input.parents('form')[0]);
  var as_result = null;
  var as_hidden = null;
  var as_last_result = false;
  var as_show_result = false;
  var as_result_pos = -1;
  var as_count_request = 0;
  var as_timer = 0;
  var as_key = {
    up:38,
    down:40,
    enter:13,
    esc:27
  };
  var as_deadkeys = new Array(9,16,17,18,19,20,23,33,34,35,36,37,39,44,45,46,91,112,113,114,115,116,117,118,119,120,121,122,123,145,188);

  // check given object
  if(as_input[0].tagName.toLowerCase() != 'input') {
    delete_vars();
    return true;
  }

  // ajax settings
  var remote = {
    url: null,
    data: null,
    method: 'get'
  };
  switch(typeof user_remote)
  {
    case 'object':
      jQuery.extend(remote, user_remote);
      delete user_remote;
      break;
    case 'string':
      remote.url = user_remote;
      delete user_remote;
      break;
    default:
      alert('Cannot handle remote-parameter!');
      delete_vars();
      return true;
      break;
  }

  // plugin-configuration
  var conf = {
    requestMin: 2,
    /*requestTimeout: 400,*/
    requestTimeout: 250,
    inputClass: 'autosuggest',
    inputValue: false,
    inputLoadingClass: 'autosuggest-loading',
    resultClass: 'autosuggest-result',
    resultID: false,
    resultEffect: 'fade',
    resultAppear: 'fast',
    resultCallback: false,
    resultElement: 'li',
    resultSelectedClass: 'selected',
    hiddenName: 'autosuggest-key',
    hiddenKey: 'key',
    submitCallback: false,
    moveLeft: 0,
    moveTop: 0,
    addWidth: 0,
    parentElement: 'body'
  };
  if(user_conf) {
    jQuery.extend(conf, user_conf);
    if(conf.requestMin <= 0) {
      conf.requestMin = 1;
    }
    delete user_conf;
  }

  // create result-object
  as_result = jQuery(document.createElement('div'))
    .addClass(conf.resultClass)
    .css({
      'position':'absolute',
      'left':(as_input_offset.left+conf.moveLeft),
      'top':((as_input_offset.top + as_input.height())+conf.moveTop),
      'width':(as_input.width()+conf.addWidth)
    })
    .appendTo(conf.parentElement)
    .hide();
  if(conf.resultID != false) {
    as_result.attr({'id':conf.resultID});
  }

  // create hidden input
  as_hidden = jQuery(document.createElement('input'))
    .attr({
      'type':'hidden',
      'value':'',
      'name':conf.hiddenName
    })
    .insertAfter(as_input);

  // configure input-object
  as_input.attr({'autocomplete':'off'}).addClass(conf.inputClass);
  if(conf.inputValue != false) {
    as_input.val(conf.inputValue);
  }
  as_input.focus(function(){
    as_show_result = true;
    if(as_input.val() == conf.inputValue) {
      as_input.val('');
    }
    if(as_last_result === true) {
      show_autosuggest();
    }
  });
  as_input.blur(function(){
    setTimeout(function(){
      as_show_result = false;
      if(as_input.val() == '' && conf.inputValue != false) {
        as_input.val(conf.inputValue);
      }
      blur_autosuggest();
    }, 250 );
  });

  // check user-input
  as_input.keydown(function(e){
    e.stopPropagation();
    clearTimeout(as_timer);

    var keycode = e.keyCode || window.event.keyCode;

    // no action on deadkeys
    if(jQuery.inArray(keycode, as_deadkeys) >= 0) {
      return true;
    }

    // switch autosuggest behavior on keycode
    switch(keycode)
    {
      // cancel on esc key
      case as_key.esc:
        as_input.val(as_user_input);
        as_hidden.val('');
        blur_autosuggest(function(){
          cancel_autosuggest();
        });
        break;

      // submit on enter key
      case as_key.enter:
        exec_result();
        return false;
        break;

      // walk through as_result
      case as_key.up:
      case as_key.down:
        //e.preventDefault();
        walk_result(keycode);
        break;

      // valid key pressed
      default:
        // count request
        if(as_count_request > 10000) {
          as_count_request = 0;
        }
        else {
          as_count_request++;
        }

        // deselect result
        deselect_result();
        as_hidden.val('');

        // set timeout for ajax-request
        as_timer = setTimeout(function(){
          if(as_input.val().length >= conf.requestMin) {
            var as_this_request = as_count_request;

            // add loading-class
            as_input.addClass(conf.inputLoadingClass);

            // reset result-position
            as_result_pos = -1;

            // start request
            jQuery.ajax({
              global: false,
              type: remote.method,
              data: jQuery.extend(remote.data, {'autosuggest':as_input.val()}),
              url: remote.url,
              error: function(){
                if(as_this_request == as_count_request) {
                  as_input.removeClass(conf.inputLoadingClass);
                }
                return true;
              },
              success: function(data){
                if(as_this_request == as_count_request) {
                  // run content-callback
                  if(typeof conf.resultCallback == 'function') {
                    data = conf.resultCallback(data);
                  }

                  // append result
                  if(data) {
                    as_user_input = as_input.val();
                    as_result.empty().append(data);
                    as_last_result = true;
                    show_autosuggest();
                    mouse_result();

                    return 'test';
                  }
                  // close div data result is empty
                  else {
                    blur_autosuggest(function(){
                      cancel_autosuggest();
                    });
                  }

                }
              },
              complete: function(){
                if(as_this_request == as_count_request) {
                  as_input.removeClass(conf.inputLoadingClass);
                }
              }
            });
          }
          else {
            cancel_autosuggest();
          }
        },conf.requestTimeout);
        break;
    };
  });

  // cancel autosuggest
  function cancel_autosuggest()
  {
    clearTimeout(as_timer);
    as_result.empty().hide();
    as_last_result = false;
    as_count_request++;
    as_input.removeClass(conf.inputLoadingClass);
  };

  // blur autosuggest
  function blur_autosuggest(fnc)
  {

    switch(conf.resultEffect.toLowerCase())
    {
      default:
      case 'fade':
        as_result.fadeOut(conf.resultAppear,function(){
          if(typeof fnc == 'function') {
            fnc(this);
          }
        });
        break;

      case 'slide':
        as_result.slideUp(conf.resultAppear,function(){
          if(typeof fnc == 'function') {
            fnc(this);
          }
        });
        break;

      case 'show':
        as_result.hide(conf.resultAppear,function(){
          if(typeof fnc == 'function') {
            fnc(this);
          }
        });
        break;
    }
  };

  // show autosuggest
  function show_autosuggest(fnc)
  {
    if(as_show_result === true) {
      switch(conf.resultEffect.toLowerCase())
      {
        default:
        case 'fade':
          as_result.fadeIn(conf.resultAppear,function(){
          if(typeof fnc == 'function') {
            fnc(this);
          }
        });
          break;

        case 'slide':
          as_result.slideDown(conf.resultAppear,function(){
          if(typeof fnc == 'function') {
            fnc(this);
          }
        });
          break;

        case 'show':
          as_result.show(conf.resultAppear,function(){
          if(typeof fnc == 'function') {
            fnc(this);
          }
        });
          break;
      }
    }
  };

  // walk through result
  function walk_result(key)
  {
    var max_result = jQuery(conf.resultElement, as_result).length -1;
    switch(key)
    {
      case as_key.up:
        if((as_result_pos-1) >= 0) {
          as_result_pos = as_result_pos -1;
        }
        else {
          as_result_pos = max_result;
        }
        select_result(as_result_pos,true);
        break;

      case as_key.down:
        if((as_result_pos+1) <= max_result) {
          as_result_pos = as_result_pos+1;
        }
        else {
          as_result_pos = 0;
        }
        select_result(as_result_pos,true);
        break;
    }
  };

  // add class to selected Element and change input-value
  function select_result(i,copyText)
  {
    deselect_result();
    var as_selected = jQuery(conf.resultElement +':eq('+(i)+')', as_result).addClass(conf.resultSelectedClass);
    var as_selected_text = as_selected.text();

    as_hidden.val(as_selected.attr(conf.hiddenKey));
    if(as_selected_text != '' && copyText) {
      as_input.val(as_selected_text);
    }
  };

  // deselect result
  function deselect_result()
  {
    jQuery(conf.resultElement, as_result).removeClass(conf.resultSelectedClass);
  };

  // execute result
  function exec_result()
  {
    if(typeof conf.submitCallback == 'function') {
      conf.submitCallback(as_hidden.val(),as_input.val());
    }
    else {
      as_form.submit();
    }
    cancel_autosuggest();
    return true;
  };

  // select via mouse
  function mouse_result()
  {
    jQuery(conf.resultElement, as_result).hover(
      function(){
        select_result(jQuery(this).prevAll().length, false);
      },
      function(){
        deselect_result();
        as_result_pos = -1;
      }
    ).click(function(){
      select_result(jQuery(this).prevAll().length, true);
      exec_result();
    });
  };

  // delete vars
  function delete_vars()
  {
    delete as_input;
    delete as_input_offset;
    delete as_user_input;
    delete as_form;
    delete as_result;
    delete as_hidden;
    delete as_last_result;
    delete as_show_result;
    delete as_result_pos;
    delete as_count_request;
    delete as_timer;
    delete as_key;
    delete as_deadkeys;
  };
};

;

 //~ =======  ::Datei:: javascripts/classie.js ========
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

window.classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

})( window );
;

 //~ =======  ::Datei:: javascripts/scripts.js ========
function isUndefined(v) {
    var undef;
    return v===undef;
}

function rawPopup(url, target, features) {
    if (isUndefined(target)) {
        target = '_blank';
    }

    var newWindow = window.open(url, target, features);
    newWindow.focus();
    return newWindow;
}

function linkPopup(src, features) {
    return rawPopup(src.getAttribute('href'), src.getAttribute('target') || '_blank', features);
}



function SB_multimedia(that){

    var encrypt         = $(that).metadata().encrypt;
    var type            = $(that).metadata().type;
    var url_encoded     = $(that).metadata().url_encoded;
    var height          = $(that).metadata().height;
    var width           = $(that).metadata().width;
    var popup           = $(that).metadata().popup;
    var autoplay        = $(that).metadata().autoplay;
    var divid           = $(that).metadata().divid;

    if(popup == "ja")
    {
        var newUrl  = '/php/modules/mediamanager/video.php?v='+encrypt+'&t='+type+'&height='+height+'&width='+width;
        $(that).attr('href',newUrl).fancybox({ 'zoomSpeedIn': 0, 'zoomSpeedOut': 0, 'overlayShow': true });
        return false;
    }

    if(popup == "nein")
    {
        function doMedia(o){

            if(type == "flv" || type == "mp3")
            {
                // anpassung b.jansen 21.10.2012
                /*var newUrl  = url_encoded;
                $(o).attr('href',newUrl).media();
                */
                $(o).media();

            }
            else{
                $(o).media();
            }
            //~ console.info($("div.webLegende", divid));
            /*$("div.webLegende", divid).hide();*/

            return false;
        }
        if(autoplay == "false"){
            $(that).click( function(){doMedia(that); return false;} );
            /*return false;*/
        }else{
            doMedia($(that));
        }
    }
}




/* document.ready */
$(document).ready(function() {
    $("html").addClass("js"); // Class zum Triggern von Javascript im CSS

    var $flexContainer = $('.flexslider');
    if($flexContainer.length){ // muessen wir?
        // nicht bei IE6
        if($.browser.msie && $.browser.version <= 6)
        {
        }
        else
        {
          $flexContainer.flexslider({
            animation: "slide",
            slideshowSpeed: 12000
          });
        }
    }   

    //~ Autosuggest
    if($('#suche').length && $('#keywordsQuick').length){
      $('#keywordsQuick').autosuggest('/php/modules/search/livesearch.php',{
        inputLoadingClass: 'qs_loading',
        resultSelectedClass: 'qs_active',
        resultClass: 'qs_results',
        requestMin: 1,
        moveTop: 4,
        moveLeft: -7,
        addWidth: 60,
        parentElement: '#suche>fieldset'
      });
    }
    
    //~ Autosuggest
    if($('#suchetkn').length && $('#keywordsQuick').length){
      $('#keywordsQuick').autosuggest('/tkn/php/modules/search/livesearch.php',{
        inputLoadingClass: 'qs_loading',
        resultSelectedClass: 'qs_active',
        resultClass: 'qs_results',
        requestMin: 1,
        moveTop: 4,
        moveLeft: -7,
        addWidth: 60,
        parentElement: '#suche_tkn>fieldset'
      });
    }

  //~ Funktion zum deaktivieren der FancyBox bei ausgeschalteten CSS-Styles
  // Achtung: Beim deaktivieren der CSS ueber die Firefox-DeveloperBar wird
  // die CSS-Klassen nicht dirket aus dem DOM entfernt
    var oFancyTestDiv = $('<div id="fancy_test"></div>').appendTo("body")
    if( oFancyTestDiv.css('display') != 'none' )
    {
      // Kein Fancybox-CSS geladen -> Fancybox-Funktionen deaktivieren (evtl. hier verbessern)
      $.fn.fancybox = function() {};
      $.fn.fancybox.start = function() {};
    }
    oFancyTestDiv.remove();

    /* alle Links mit der classe fancylink oeffnen in Fancybox */
    // $("a.fancylink").fancybox({ 'zoomSpeedIn': 0, 'zoomSpeedOut': 0, 'overlayShow': true, 'frameWidth': 1152, 'frameHeight': 864 });

    /* Test alle Gemeinderats-Video-Links mit der classe fancylinkGR oeffnen in Fancybox */
    // $("a.fancylinkGR").fancybox({ 'zoomSpeedIn': 0, 'zoomSpeedOut': 0, 'overlayShow': true, 'frameWidth': 1050, 'frameHeight': 576 });


    /* tourismusbanner startseite & tourismusseite */
    if($("#tourismusbanner").length)
    {

      $("#tourismusbanner").removeClass('cssSlide');
      $('#bannertext').animate({opacity: '0'});
      $('#bannertext2').animate({opacity: '0'});

      $("#tourismusbanner").hover(
        /* ausklappen */
        function(){
          $(this).stop(true,true).animate({
            left: '35.8em',
            width: '390px'
          }, 'slow', function(){
            $('#bannertext').stop(true,true).animate({opacity: '1'}, 'slow');
            $('#bannertext2').stop(true,true).animate({opacity: '1'}, 'slow');
          });
        }
        /* einklappen */
        ,function(){
          $(this).stop(true,true).animate({
          left: '48.8em',
          width: '161px'
          }, 'slow', function(){
            $('#bannertext').stop(true,true).animate({opacity: '0'}, 'slow');
            $('#bannertext2').stop(true,true).animate({opacity: '0'}, 'slow');
          });
        }

      );

    }

    /** Serviceportal **/
    var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
        menuRight = document.getElementById( 'cbp-spmenu-s2' ),
        showLeftPush = document.getElementById( 'showLeftPush' ),
        showRightPush = document.getElementById( 'showRightPush' ),
        closeLeftPush = document.getElementById( 'closeLeftPush' ),
        body = document.body;
    if (showLeftPush) {
      showLeftPush.onclick = function() {
          classie.toggle( this, 'active' );
          classie.toggle( body, 'cbp-spmenu-push-toright' );
          classie.toggle( menuLeft, 'cbp-spmenu-open' );
      };
    };

    if (closeLeftPush) {
          closeLeftPush.onclick = function() {
          classie.toggle( this, 'active' );
          classie.toggle( body, 'cbp-spmenu-push-toright' );
          classie.toggle( menuLeft, 'cbp-spmenu-open' );
      }
    };


});

//~ Funktion fuer den IE 6
//~ damit die aufklapp Navigation funktioniert
jQuery(function($) {
  if(jQuery.browser.msie){
    //~ Globalnavi
    $('#globalnavi li')
    .mouseover(function(){$('ul',this).addClass('ausklappen')})
    .mouseout(function(){$('ul',this).removeClass('ausklappen')})
    ;

    //~ Servicenavi
    $('#serviceNavi li')
    .mouseover(function(){$('div',this).addClass('ausklappen')})
    .mouseout(function(){$('div',this).removeClass('ausklappen')})
    ;

    //~ Bildbeschreibung
    $('#headerBild a')
    .mouseover(function(){$('.bildbeschreibung',this).addClass('bildBeschreibungShow')})
    .mouseout(function(){$('.bildbeschreibung',this).removeClass('bildBeschreibungShow')})
    ;
  }

  //~ Fancybox fuer den Stadtplan
  //~ deaktiviert fuer neuen Stadtplan 2011
  //~ $('#service_stadtplan').removeAttr('title').fancybox({ 'zoomSpeedIn': 0, 'zoomSpeedOut': 0, 'overlayShow': true, 'frameWidth':800,'frameHeight':540});

  //~ Ausklappen der Service Punkte bei Steuerung mit der Tastatur
  var oListenLi = $('#serviceNavi li.listeMitPfeil');
  $('a',oListenLi)
  .focus(
    function(){
      //~ $('div',oListenLi).removeClass('ausklappen');
      $(this).parents('div').addClass('ausklappen');
    }
  )
  .blur(
    function(){
      $('div',oListenLi).removeClass('ausklappen');
      //~ $(this).parents('div').addClass('ausklappen');
    }
  )
  ;
});

//~ Fuer alle MulitMediainhalte mit dem jQuery Mediaplugin definieren wir die Parameter hier
$.fn.media.defaults.params = { wmode: 'transparent'};


/*
 * jquery.qtip. The jQuery tooltip plugin
 *
 * Copyright (c) 2009 Craig Thompson
 * http://craigsworks.com
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Launch  : February 2009
 * Version : 1.0.0-rc3
 * Released: Tuesday 12th May, 2009 - 00:00
 * Debug: jquery.qtip.debug.js
 */
(function(f){f.fn.qtip=function(B,u){var y,t,A,s,x,w,v,z;if(typeof B=="string"){if(typeof f(this).data("qtip")!=="object"){f.fn.qtip.log.error.call(self,1,f.fn.qtip.constants.NO_TOOLTIP_PRESENT,false)}if(B=="api"){return f(this).data("qtip").interfaces[f(this).data("qtip").current]}else{if(B=="interfaces"){return f(this).data("qtip").interfaces}}}else{if(!B){B={}}if(typeof B.content!=="object"||(B.content.jquery&&B.content.length>0)){B.content={text:B.content}}if(typeof B.content.title!=="object"){B.content.title={text:B.content.title}}if(typeof B.position!=="object"){B.position={corner:B.position}}if(typeof B.position.corner!=="object"){B.position.corner={target:B.position.corner,tooltip:B.position.corner}}if(typeof B.show!=="object"){B.show={when:B.show}}if(typeof B.show.when!=="object"){B.show.when={event:B.show.when}}if(typeof B.show.effect!=="object"){B.show.effect={type:B.show.effect}}if(typeof B.hide!=="object"){B.hide={when:B.hide}}if(typeof B.hide.when!=="object"){B.hide.when={event:B.hide.when}}if(typeof B.hide.effect!=="object"){B.hide.effect={type:B.hide.effect}}if(typeof B.style!=="object"){B.style={name:B.style}}B.style=c(B.style);s=f.extend(true,{},f.fn.qtip.defaults,B);s.style=a.call({options:s},s.style);s.user=f.extend(true,{},B)}return f(this).each(function(){if(typeof B=="string"){w=B.toLowerCase();A=f(this).qtip("interfaces");if(typeof A=="object"){if(u===true&&w=="destroy"){while(A.length>0){A[A.length-1].destroy()}}else{if(u!==true){A=[f(this).qtip("api")]}for(y=0;y<A.length;y++){if(w=="destroy"){A[y].destroy()}else{if(A[y].status.rendered===true){if(w=="show"){A[y].show()}else{if(w=="hide"){A[y].hide()}else{if(w=="focus"){A[y].focus()}else{if(w=="disable"){A[y].disable(true)}else{if(w=="enable"){A[y].disable(false)}}}}}}}}}}}else{v=f.extend(true,{},s);v.hide.effect.length=s.hide.effect.length;v.show.effect.length=s.show.effect.length;if(v.position.container===false){v.position.container=f(document.body)}if(v.position.target===false){v.position.target=f(this)}if(v.show.when.target===false){v.show.when.target=f(this)}if(v.hide.when.target===false){v.hide.when.target=f(this)}t=f.fn.qtip.interfaces.length;for(y=0;y<t;y++){if(typeof f.fn.qtip.interfaces[y]=="undefined"){t=y;break}}x=new d(f(this),v,t);f.fn.qtip.interfaces[t]=x;if(typeof f(this).data("qtip")=="object"){if(typeof f(this).attr("qtip")==="undefined"){f(this).data("qtip").current=f(this).data("qtip").interfaces.length}f(this).data("qtip").interfaces.push(x)}else{f(this).data("qtip",{current:0,interfaces:[x]})}if(v.content.prerender===false&&v.show.when.event!==false&&v.show.ready!==true){v.show.when.target.bind(v.show.when.event+".qtip-"+t+"-create",{qtip:t},function(C){z=f.fn.qtip.interfaces[C.data.qtip];z.options.show.when.target.unbind(z.options.show.when.event+".qtip-"+C.data.qtip+"-create");z.cache.mouse={x:C.pageX,y:C.pageY};p.call(z);z.options.show.when.target.trigger(z.options.show.when.event)})}else{x.cache.mouse={x:v.show.when.target.offset().left,y:v.show.when.target.offset().top};p.call(x)}}})};function d(u,t,v){var s=this;s.id=v;s.options=t;s.status={animated:false,rendered:false,disabled:false,focused:false};s.elements={target:u.addClass(s.options.style.classes.target),tooltip:null,wrapper:null,content:null,contentWrapper:null,title:null,button:null,tip:null,bgiframe:null};s.cache={mouse:{},position:{},toggle:0};s.timers={};f.extend(s,s.options.api,{show:function(y){var x,z;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"show")}if(s.elements.tooltip.css("display")!=="none"){return s}s.elements.tooltip.stop(true,false);x=s.beforeShow.call(s,y);if(x===false){return s}function w(){if(s.options.position.type!=="static"){s.focus()}s.onShow.call(s,y);if(f.browser.msie){s.elements.tooltip.get(0).style.removeAttribute("filter")}}s.cache.toggle=1;if(s.options.position.type!=="static"){s.updatePosition(y,(s.options.show.effect.length>0))}if(typeof s.options.show.solo=="object"){z=f(s.options.show.solo)}else{if(s.options.show.solo===true){z=f("div.qtip").not(s.elements.tooltip)}}if(z){z.each(function(){if(f(this).qtip("api").status.rendered===true){f(this).qtip("api").hide()}})}if(typeof s.options.show.effect.type=="function"){s.options.show.effect.type.call(s.elements.tooltip,s.options.show.effect.length);s.elements.tooltip.queue(function(){w();f(this).dequeue()})}else{switch(s.options.show.effect.type.toLowerCase()){case"fade":s.elements.tooltip.fadeIn(s.options.show.effect.length,w);break;case"slide":s.elements.tooltip.slideDown(s.options.show.effect.length,function(){w();if(s.options.position.type!=="static"){s.updatePosition(y,true)}});break;case"grow":s.elements.tooltip.show(s.options.show.effect.length,w);break;default:s.elements.tooltip.show(null,w);break}s.elements.tooltip.addClass(s.options.style.classes.active)}return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_SHOWN,"show")},hide:function(y){var x;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"hide")}else{if(s.elements.tooltip.css("display")==="none"){return s}}clearTimeout(s.timers.show);s.elements.tooltip.stop(true,false);x=s.beforeHide.call(s,y);if(x===false){return s}function w(){s.onHide.call(s,y)}s.cache.toggle=0;if(typeof s.options.hide.effect.type=="function"){s.options.hide.effect.type.call(s.elements.tooltip,s.options.hide.effect.length);s.elements.tooltip.queue(function(){w();f(this).dequeue()})}else{switch(s.options.hide.effect.type.toLowerCase()){case"fade":s.elements.tooltip.fadeOut(s.options.hide.effect.length,w);break;case"slide":s.elements.tooltip.slideUp(s.options.hide.effect.length,w);break;case"grow":s.elements.tooltip.hide(s.options.hide.effect.length,w);break;default:s.elements.tooltip.hide(null,w);break}s.elements.tooltip.removeClass(s.options.style.classes.active)}return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_HIDDEN,"hide")},updatePosition:function(w,x){var C,G,L,J,H,E,y,I,B,D,K,A,F,z;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"updatePosition")}else{if(s.options.position.type=="static"){return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.CANNOT_POSITION_STATIC,"updatePosition")}}G={position:{left:0,top:0},dimensions:{height:0,width:0},corner:s.options.position.corner.target};L={position:s.getPosition(),dimensions:s.getDimensions(),corner:s.options.position.corner.tooltip};if(s.options.position.target!=="mouse"){if(s.options.position.target.get(0).nodeName.toLowerCase()=="area"){J=s.options.position.target.attr("coords").split(",");for(C=0;C<J.length;C++){J[C]=parseInt(J[C])}H=s.options.position.target.parent("map").attr("name");E=f('img[usemap="#'+H+'"]:first').offset();G.position={left:Math.floor(E.left+J[0]),top:Math.floor(E.top+J[1])};switch(s.options.position.target.attr("shape").toLowerCase()){case"rect":G.dimensions={width:Math.ceil(Math.abs(J[2]-J[0])),height:Math.ceil(Math.abs(J[3]-J[1]))};break;case"circle":G.dimensions={width:J[2]+1,height:J[2]+1};break;case"poly":G.dimensions={width:J[0],height:J[1]};for(C=0;C<J.length;C++){if(C%2==0){if(J[C]>G.dimensions.width){G.dimensions.width=J[C]}if(J[C]<J[0]){G.position.left=Math.floor(E.left+J[C])}}else{if(J[C]>G.dimensions.height){G.dimensions.height=J[C]}if(J[C]<J[1]){G.position.top=Math.floor(E.top+J[C])}}}G.dimensions.width=G.dimensions.width-(G.position.left-E.left);G.dimensions.height=G.dimensions.height-(G.position.top-E.top);break;default:return f.fn.qtip.log.error.call(s,4,f.fn.qtip.constants.INVALID_AREA_SHAPE,"updatePosition");break}G.dimensions.width-=2;G.dimensions.height-=2}else{if(s.options.position.target.add(document.body).length===1){G.position={left:f(document).scrollLeft(),top:f(document).scrollTop()};G.dimensions={height:f(window).height(),width:f(window).width()}}else{if(typeof s.options.position.target.attr("qtip")!=="undefined"){G.position=s.options.position.target.qtip("api").cache.position}else{G.position=s.options.position.target.offset()}G.dimensions={height:s.options.position.target.outerHeight(),width:s.options.position.target.outerWidth()}}}y=f.extend({},G.position);if(G.corner.search(/right/i)!==-1){y.left+=G.dimensions.width}if(G.corner.search(/bottom/i)!==-1){y.top+=G.dimensions.height}if(G.corner.search(/((top|bottom)Middle)|center/)!==-1){y.left+=(G.dimensions.width/2)}if(G.corner.search(/((left|right)Middle)|center/)!==-1){y.top+=(G.dimensions.height/2)}}else{G.position=y={left:s.cache.mouse.x,top:s.cache.mouse.y};G.dimensions={height:1,width:1}}if(L.corner.search(/right/i)!==-1){y.left-=L.dimensions.width}if(L.corner.search(/bottom/i)!==-1){y.top-=L.dimensions.height}if(L.corner.search(/((top|bottom)Middle)|center/)!==-1){y.left-=(L.dimensions.width/2)}if(L.corner.search(/((left|right)Middle)|center/)!==-1){y.top-=(L.dimensions.height/2)}I=(f.browser.msie)?1:0;B=(f.browser.msie&&parseInt(f.browser.version.charAt(0))===6)?1:0;if(s.options.style.border.radius>0){if(L.corner.search(/Left/)!==-1){y.left-=s.options.style.border.radius}else{if(L.corner.search(/Right/)!==-1){y.left+=s.options.style.border.radius}}if(L.corner.search(/Top/)!==-1){y.top-=s.options.style.border.radius}else{if(L.corner.search(/Bottom/)!==-1){y.top+=s.options.style.border.radius}}}if(I){if(L.corner.search(/top/)!==-1){y.top-=I}else{if(L.corner.search(/bottom/)!==-1){y.top+=I}}if(L.corner.search(/left/)!==-1){y.left-=I}else{if(L.corner.search(/right/)!==-1){y.left+=I}}if(L.corner.search(/leftMiddle|rightMiddle/)!==-1){y.top-=1}}if(s.options.position.adjust.screen===true){y=o.call(s,y,G,L)}if(s.options.position.target==="mouse"&&s.options.position.adjust.mouse===true){if(s.options.position.adjust.screen===true&&s.elements.tip){K=s.elements.tip.attr("rel")}else{K=s.options.position.corner.tooltip}y.left+=(K.search(/right/i)!==-1)?-6:6;y.top+=(K.search(/bottom/i)!==-1)?-6:6}if(!s.elements.bgiframe&&f.browser.msie&&parseInt(f.browser.version.charAt(0))==6){f("select, object").each(function(){A=f(this).offset();A.bottom=A.top+f(this).height();A.right=A.left+f(this).width();if(y.top+L.dimensions.height>=A.top&&y.left+L.dimensions.width>=A.left){k.call(s)}})}y.left+=s.options.position.adjust.x;y.top+=s.options.position.adjust.y;F=s.getPosition();if(y.left!=F.left||y.top!=F.top){z=s.beforePositionUpdate.call(s,w);if(z===false){return s}s.cache.position=y;if(x===true){s.status.animated=true;s.elements.tooltip.animate(y,200,"swing",function(){s.status.animated=false})}else{s.elements.tooltip.css(y)}s.onPositionUpdate.call(s,w);if(typeof w!=="undefined"&&w.type&&w.type!=="mousemove"){f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_POSITION_UPDATED,"updatePosition")}}return s},updateWidth:function(w){var x;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"updateWidth")}else{if(w&&typeof w!=="number"){return f.fn.qtip.log.error.call(s,2,"newWidth must be of type number","updateWidth")}}x=s.elements.contentWrapper.siblings().add(s.elements.tip).add(s.elements.button);if(!w){if(typeof s.options.style.width.value=="number"){w=s.options.style.width.value}else{s.elements.tooltip.css({width:"auto"});x.hide();if(f.browser.msie){s.elements.wrapper.add(s.elements.contentWrapper.children()).css({zoom:"normal"})}w=s.getDimensions().width+1;if(!s.options.style.width.value){if(w>s.options.style.width.max){w=s.options.style.width.max}if(w<s.options.style.width.min){w=s.options.style.width.min}}}}if(w%2!==0){w-=1}s.elements.tooltip.width(w);x.show();if(s.options.style.border.radius){s.elements.tooltip.find(".qtip-betweenCorners").each(function(y){f(this).width(w-(s.options.style.border.radius*2))})}if(f.browser.msie){s.elements.wrapper.add(s.elements.contentWrapper.children()).css({zoom:"1"});s.elements.wrapper.width(w);if(s.elements.bgiframe){s.elements.bgiframe.width(w).height(s.getDimensions.height)}}return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_WIDTH_UPDATED,"updateWidth")},updateStyle:function(w){var z,A,x,y,B;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"updateStyle")}else{if(typeof w!=="string"||!f.fn.qtip.styles[w]){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.STYLE_NOT_DEFINED,"updateStyle")}}s.options.style=a.call(s,f.fn.qtip.styles[w],s.options.user.style);s.elements.content.css(q(s.options.style));if(s.options.content.title.text!==false){s.elements.title.css(q(s.options.style.title,true))}s.elements.contentWrapper.css({borderColor:s.options.style.border.color});if(s.options.style.tip.corner!==false){if(f("<canvas>").get(0).getContext){z=s.elements.tooltip.find(".qtip-tip canvas:first");x=z.get(0).getContext("2d");x.clearRect(0,0,300,300);y=z.parent("div[rel]:first").attr("rel");B=b(y,s.options.style.tip.size.width,s.options.style.tip.size.height);h.call(s,z,B,s.options.style.tip.color||s.options.style.border.color)}else{if(f.browser.msie){z=s.elements.tooltip.find('.qtip-tip [nodeName="shape"]');z.attr("fillcolor",s.options.style.tip.color||s.options.style.border.color)}}}if(s.options.style.border.radius>0){s.elements.tooltip.find(".qtip-betweenCorners").css({backgroundColor:s.options.style.border.color});if(f("<canvas>").get(0).getContext){A=g(s.options.style.border.radius);s.elements.tooltip.find(".qtip-wrapper canvas").each(function(){x=f(this).get(0).getContext("2d");x.clearRect(0,0,300,300);y=f(this).parent("div[rel]:first").attr("rel");r.call(s,f(this),A[y],s.options.style.border.radius,s.options.style.border.color)})}else{if(f.browser.msie){s.elements.tooltip.find('.qtip-wrapper [nodeName="arc"]').each(function(){f(this).attr("fillcolor",s.options.style.border.color)})}}}return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_STYLE_UPDATED,"updateStyle")},updateContent:function(A,y){var z,x,w;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"updateContent")}else{if(!A){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.NO_CONTENT_PROVIDED,"updateContent")}}z=s.beforeContentUpdate.call(s,A);if(typeof z=="string"){A=z}else{if(z===false){return}}if(f.browser.msie){s.elements.contentWrapper.children().css({zoom:"normal"})}if(A.jquery&&A.length>0){A.clone(true).appendTo(s.elements.content).show()}else{s.elements.content.html(A)}x=s.elements.content.find("img[complete=false]");if(x.length>0){w=0;x.each(function(C){f('<img src="'+f(this).attr("src")+'" />').load(function(){if(++w==x.length){B()}})})}else{B()}function B(){s.updateWidth();if(y!==false){if(s.options.position.type!=="static"){s.updatePosition(s.elements.tooltip.is(":visible"),true)}if(s.options.style.tip.corner!==false){n.call(s)}}}s.onContentUpdate.call(s);return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_CONTENT_UPDATED,"loadContent")},loadContent:function(w,z,A){var y;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"loadContent")}y=s.beforeContentLoad.call(s);if(y===false){return s}if(A=="post"){f.post(w,z,x)}else{f.get(w,z,x)}function x(B){s.onContentLoad.call(s);f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_CONTENT_LOADED,"loadContent");s.updateContent(B)}return s},updateTitle:function(w){if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"updateTitle")}else{if(!w){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.NO_CONTENT_PROVIDED,"updateTitle")}}returned=s.beforeTitleUpdate.call(s);if(returned===false){return s}if(s.elements.button){s.elements.button=s.elements.button.clone(true)}s.elements.title.html(w);if(s.elements.button){s.elements.title.prepend(s.elements.button)}s.onTitleUpdate.call(s);return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_TITLE_UPDATED,"updateTitle")},focus:function(A){var y,x,w,z;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"focus")}else{if(s.options.position.type=="static"){return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.CANNOT_FOCUS_STATIC,"focus")}}y=parseInt(s.elements.tooltip.css("z-index"));x=6000+f("div.qtip[qtip]").length-1;if(!s.status.focused&&y!==x){z=s.beforeFocus.call(s,A);if(z===false){return s}f("div.qtip[qtip]").not(s.elements.tooltip).each(function(){if(f(this).qtip("api").status.rendered===true){w=parseInt(f(this).css("z-index"));if(typeof w=="number"&&w>-1){f(this).css({zIndex:parseInt(f(this).css("z-index"))-1})}f(this).qtip("api").status.focused=false}});s.elements.tooltip.css({zIndex:x});s.status.focused=true;s.onFocus.call(s,A);f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_FOCUSED,"focus")}return s},disable:function(w){if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"disable")}if(w){if(!s.status.disabled){s.status.disabled=true;f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_DISABLED,"disable")}else{f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.TOOLTIP_ALREADY_DISABLED,"disable")}}else{if(s.status.disabled){s.status.disabled=false;f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_ENABLED,"disable")}else{f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.TOOLTIP_ALREADY_ENABLED,"disable")}}return s},destroy:function(){var w,x,y;x=s.beforeDestroy.call(s);if(x===false){return s}if(s.status.rendered){s.options.show.when.target.unbind("mousemove.qtip",s.updatePosition);s.options.show.when.target.unbind("mouseout.qtip",s.hide);s.options.show.when.target.unbind(s.options.show.when.event+".qtip");s.options.hide.when.target.unbind(s.options.hide.when.event+".qtip");s.elements.tooltip.unbind(s.options.hide.when.event+".qtip");s.elements.tooltip.unbind("mouseover.qtip",s.focus);s.elements.tooltip.remove()}else{s.options.show.when.target.unbind(s.options.show.when.event+".qtip-create")}if(typeof s.elements.target.data("qtip")=="object"){y=s.elements.target.data("qtip").interfaces;if(typeof y=="object"&&y.length>0){for(w=0;w<y.length-1;w++){if(y[w].id==s.id){y.splice(w,1)}}}}delete f.fn.qtip.interfaces[s.id];if(typeof y=="object"&&y.length>0){s.elements.target.data("qtip").current=y.length-1}else{s.elements.target.removeData("qtip")}s.onDestroy.call(s);f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_DESTROYED,"destroy");return s.elements.target},getPosition:function(){var w,x;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"getPosition")}w=(s.elements.tooltip.css("display")!=="none")?false:true;if(w){s.elements.tooltip.css({visiblity:"hidden"}).show()}x=s.elements.tooltip.offset();if(w){s.elements.tooltip.css({visiblity:"visible"}).hide()}return x},getDimensions:function(){var w,x;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"getDimensions")}w=(!s.elements.tooltip.is(":visible"))?true:false;if(w){s.elements.tooltip.css({visiblity:"hidden"}).show()}x={height:s.elements.tooltip.outerHeight(),width:s.elements.tooltip.outerWidth()};if(w){s.elements.tooltip.css({visiblity:"visible"}).hide()}return x}})}function p(){var s,w,u,t,v,y,x;s=this;s.beforeRender.call(s);s.status.rendered=true;s.elements.tooltip='<div qtip="'+s.id+'" class="qtip '+(s.options.style.classes.tooltip||s.options.style)+'"style="display:none; -moz-border-radius:0; -webkit-border-radius:0; border-radius:0;position:'+s.options.position.type+';">  <div class="qtip-wrapper" style="position:relative; overflow:hidden; text-align:left;">    <div class="qtip-contentWrapper" style="overflow:hidden;">       <div class="qtip-content '+s.options.style.classes.content+'"></div></div></div></div>';s.elements.tooltip=f(s.elements.tooltip);s.elements.tooltip.appendTo(s.options.position.container);s.elements.tooltip.data("qtip",{current:0,interfaces:[s]});s.elements.wrapper=s.elements.tooltip.children("div:first");s.elements.contentWrapper=s.elements.wrapper.children("div:first").css({background:s.options.style.background});s.elements.content=s.elements.contentWrapper.children("div:first").css(q(s.options.style));if(f.browser.msie){s.elements.wrapper.add(s.elements.content).css({zoom:1})}if(s.options.hide.when.event=="unfocus"){s.elements.tooltip.attr("unfocus",true)}if(typeof s.options.style.width.value=="number"){s.updateWidth()}if(f("<canvas>").get(0).getContext||f.browser.msie){if(s.options.style.border.radius>0){m.call(s)}else{s.elements.contentWrapper.css({border:s.options.style.border.width+"px solid "+s.options.style.border.color})}if(s.options.style.tip.corner!==false){e.call(s)}}else{s.elements.contentWrapper.css({border:s.options.style.border.width+"px solid "+s.options.style.border.color});s.options.style.border.radius=0;s.options.style.tip.corner=false;f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.CANVAS_VML_NOT_SUPPORTED,"render")}if((typeof s.options.content.text=="string"&&s.options.content.text.length>0)||(s.options.content.text.jquery&&s.options.content.text.length>0)){u=s.options.content.text}else{if(typeof s.elements.target.attr("title")=="string"&&s.elements.target.attr("title").length>0){u=s.elements.target.attr("title").replace("\\n","<br />");s.elements.target.attr("title","")}else{if(typeof s.elements.target.attr("alt")=="string"&&s.elements.target.attr("alt").length>0){u=s.elements.target.attr("alt").replace("\\n","<br />");s.elements.target.attr("alt","")}else{u=" ";f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.NO_VALID_CONTENT,"render")}}}if(s.options.content.title.text!==false){j.call(s)}s.updateContent(u);l.call(s);if(s.options.show.ready===true){s.show()}if(s.options.content.url!==false){t=s.options.content.url;v=s.options.content.data;y=s.options.content.method||"get";s.loadContent(t,v,y)}s.onRender.call(s);f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_RENDERED,"render")}function m(){var F,z,t,B,x,E,u,G,D,y,w,C,A,s,v;F=this;F.elements.wrapper.find(".qtip-borderBottom, .qtip-borderTop").remove();t=F.options.style.border.width;B=F.options.style.border.radius;x=F.options.style.border.color||F.options.style.tip.color;E=g(B);u={};for(z in E){u[z]='<div rel="'+z+'" style="'+((z.search(/Left/)!==-1)?"left":"right")+":0; position:absolute; height:"+B+"px; width:"+B+'px; overflow:hidden; line-height:0.1px; font-size:1px">';if(f("<canvas>").get(0).getContext){u[z]+='<canvas height="'+B+'" width="'+B+'" style="vertical-align: top"></canvas>'}else{if(f.browser.msie){G=B*2+3;u[z]+='<v:arc stroked="false" fillcolor="'+x+'" startangle="'+E[z][0]+'" endangle="'+E[z][1]+'" style="width:'+G+"px; height:"+G+"px; margin-top:"+((z.search(/bottom/)!==-1)?-2:-1)+"px; margin-left:"+((z.search(/Right/)!==-1)?E[z][2]-3.5:-1)+'px; vertical-align:top; display:inline-block; behavior:url(#default#VML)"></v:arc>'}}u[z]+="</div>"}D=F.getDimensions().width-(Math.max(t,B)*2);y='<div class="qtip-betweenCorners" style="height:'+B+"px; width:"+D+"px; overflow:hidden; background-color:"+x+'; line-height:0.1px; font-size:1px;">';w='<div class="qtip-borderTop" dir="ltr" style="height:'+B+"px; margin-left:"+B+'px; line-height:0.1px; font-size:1px; padding:0;">'+u.topLeft+u.topRight+y;F.elements.wrapper.prepend(w);C='<div class="qtip-borderBottom" dir="ltr" style="height:'+B+"px; margin-left:"+B+'px; line-height:0.1px; font-size:1px; padding:0;">'+u.bottomLeft+u.bottomRight+y;F.elements.wrapper.append(C);if(f("<canvas>").get(0).getContext){F.elements.wrapper.find("canvas").each(function(){A=E[f(this).parent("[rel]:first").attr("rel")];r.call(F,f(this),A,B,x)})}else{if(f.browser.msie){F.elements.tooltip.append('<v:image style="behavior:url(#default#VML);"></v:image>')}}s=Math.max(B,(B+(t-B)));v=Math.max(t-B,0);F.elements.contentWrapper.css({border:"0px solid "+x,borderWidth:v+"px "+s+"px"})}function r(u,w,s,t){var v=u.get(0).getContext("2d");v.fillStyle=t;v.beginPath();v.arc(w[0],w[1],s,0,Math.PI*2,false);v.fill()}function e(v){var t,s,x,u,w;t=this;if(t.elements.tip!==null){t.elements.tip.remove()}s=t.options.style.tip.color||t.options.style.border.color;if(t.options.style.tip.corner===false){return}else{if(!v){v=t.options.style.tip.corner}}x=b(v,t.options.style.tip.size.width,t.options.style.tip.size.height);t.elements.tip='<div class="'+t.options.style.classes.tip+'" dir="ltr" rel="'+v+'" style="position:absolute; height:'+t.options.style.tip.size.height+"px; width:"+t.options.style.tip.size.width+'px; margin:0 auto; line-height:0.1px; font-size:1px;">';if(f("<canvas>").get(0).getContext){t.elements.tip+='<canvas height="'+t.options.style.tip.size.height+'" width="'+t.options.style.tip.size.width+'"></canvas>'}else{if(f.browser.msie){u=t.options.style.tip.size.width+","+t.options.style.tip.size.height;w="m"+x[0][0]+","+x[0][1];w+=" l"+x[1][0]+","+x[1][1];w+=" "+x[2][0]+","+x[2][1];w+=" xe";t.elements.tip+='<v:shape fillcolor="'+s+'" stroked="false" filled="true" path="'+w+'" coordsize="'+u+'" style="width:'+t.options.style.tip.size.width+"px; height:"+t.options.style.tip.size.height+"px; line-height:0.1px; display:inline-block; behavior:url(#default#VML); vertical-align:"+((v.search(/top/)!==-1)?"bottom":"top")+'"></v:shape>';t.elements.tip+='<v:image style="behavior:url(#default#VML);"></v:image>';t.elements.contentWrapper.css("position","relative")}}t.elements.tooltip.prepend(t.elements.tip+"</div>");t.elements.tip=t.elements.tooltip.find("."+t.options.style.classes.tip).eq(0);if(f("<canvas>").get(0).getContext){h.call(t,t.elements.tip.find("canvas:first"),x,s)}if(v.search(/top/)!==-1&&f.browser.msie&&parseInt(f.browser.version.charAt(0))===6){t.elements.tip.css({marginTop:-4})}n.call(t,v)}function h(t,v,s){var u=t.get(0).getContext("2d");u.fillStyle=s;u.beginPath();u.moveTo(v[0][0],v[0][1]);u.lineTo(v[1][0],v[1][1]);u.lineTo(v[2][0],v[2][1]);u.fill()}function n(u){var t,w,s,x,v;t=this;if(t.options.style.tip.corner===false||!t.elements.tip){return}if(!u){u=t.elements.tip.attr("rel")}w=positionAdjust=(f.browser.msie)?1:0;t.elements.tip.css(u.match(/left|right|top|bottom/)[0],0);if(u.search(/top|bottom/)!==-1){if(f.browser.msie){if(parseInt(f.browser.version.charAt(0))===6){positionAdjust=(u.search(/top/)!==-1)?-3:1}else{positionAdjust=(u.search(/top/)!==-1)?1:2}}if(u.search(/Middle/)!==-1){t.elements.tip.css({left:"50%",marginLeft:-(t.options.style.tip.size.width/2)})}else{if(u.search(/Left/)!==-1){t.elements.tip.css({left:t.options.style.border.radius-w})}else{if(u.search(/Right/)!==-1){t.elements.tip.css({right:t.options.style.border.radius+w})}}}if(u.search(/top/)!==-1){t.elements.tip.css({top:-positionAdjust})}else{t.elements.tip.css({bottom:positionAdjust})}}else{if(u.search(/left|right/)!==-1){if(f.browser.msie){positionAdjust=(parseInt(f.browser.version.charAt(0))===6)?1:((u.search(/left/)!==-1)?1:2)}if(u.search(/Middle/)!==-1){t.elements.tip.css({top:"50%",marginTop:-(t.options.style.tip.size.height/2)})}else{if(u.search(/Top/)!==-1){t.elements.tip.css({top:t.options.style.border.radius-w})}else{if(u.search(/Bottom/)!==-1){t.elements.tip.css({bottom:t.options.style.border.radius+w})}}}if(u.search(/left/)!==-1){t.elements.tip.css({left:-positionAdjust})}else{t.elements.tip.css({right:positionAdjust})}}}s="padding-"+u.match(/left|right|top|bottom/)[0];x=t.options.style.tip.size[(s.search(/left|right/)!==-1)?"width":"height"];t.elements.tooltip.css("padding",0);t.elements.tooltip.css(s,x);if(f.browser.msie&&parseInt(f.browser.version.charAt(0))==6){v=parseInt(t.elements.tip.css("margin-top"))||0;v+=parseInt(t.elements.content.css("margin-top"))||0;t.elements.tip.css({marginTop:v})}}function j(){var s=this;if(s.elements.title!==null){s.elements.title.remove()}s.elements.title=f('<div class="'+s.options.style.classes.title+'">').css(q(s.options.style.title,true)).css({zoom:(f.browser.msie)?1:0}).prependTo(s.elements.contentWrapper);if(s.options.content.title.text){s.updateTitle.call(s,s.options.content.title.text)}if(s.options.content.title.button!==false&&typeof s.options.content.title.button=="string"){s.elements.button=f('<a class="'+s.options.style.classes.button+'" style="float:right; position: relative"></a>').css(q(s.options.style.button,true)).html(s.options.content.title.button).prependTo(s.elements.title).click(function(t){if(!s.status.disabled){s.hide(t)}})}}function l(){var t,v,u,s;t=this;v=t.options.show.when.target;u=t.options.hide.when.target;if(t.options.hide.fixed){u=u.add(t.elements.tooltip)}if(t.options.hide.when.event=="inactive"){s=["click","dblclick","mousedown","mouseup","mousemove","mouseout","mouseenter","mouseleave","mouseover"];function y(z){if(t.status.disabled===true){return}clearTimeout(t.timers.inactive);t.timers.inactive=setTimeout(function(){f(s).each(function(){u.unbind(this+".qtip-inactive");t.elements.content.unbind(this+".qtip-inactive")});t.hide(z)},t.options.hide.delay)}}else{if(t.options.hide.fixed===true){t.elements.tooltip.bind("mouseover.qtip",function(){if(t.status.disabled===true){return}clearTimeout(t.timers.hide)})}}function x(z){if(t.status.disabled===true){return}if(t.options.hide.when.event=="inactive"){f(s).each(function(){u.bind(this+".qtip-inactive",y);t.elements.content.bind(this+".qtip-inactive",y)});y()}clearTimeout(t.timers.show);clearTimeout(t.timers.hide);t.timers.show=setTimeout(function(){t.show(z)},t.options.show.delay)}function w(z){if(t.status.disabled===true){return}if(t.options.hide.fixed===true&&t.options.hide.when.event.search(/mouse(out|leave)/i)!==-1&&f(z.relatedTarget).parents("div.qtip[qtip]").length>0){z.stopPropagation();z.preventDefault();clearTimeout(t.timers.hide);return false}clearTimeout(t.timers.show);clearTimeout(t.timers.hide);t.elements.tooltip.stop(true,true);t.timers.hide=setTimeout(function(){t.hide(z)},t.options.hide.delay)}if((t.options.show.when.target.add(t.options.hide.when.target).length===1&&t.options.show.when.event==t.options.hide.when.event&&t.options.hide.when.event!=="inactive")||t.options.hide.when.event=="unfocus"){t.cache.toggle=0;v.bind(t.options.show.when.event+".qtip",function(z){if(t.cache.toggle==0){x(z)}else{w(z)}})}else{v.bind(t.options.show.when.event+".qtip",x);if(t.options.hide.when.event!=="inactive"){u.bind(t.options.hide.when.event+".qtip",w)}}if(t.options.position.type.search(/(fixed|absolute)/)!==-1){t.elements.tooltip.bind("mouseover.qtip",t.focus)}if(t.options.position.target==="mouse"&&t.options.position.type!=="static"){v.bind("mousemove.qtip",function(z){t.cache.mouse={x:z.pageX,y:z.pageY};if(t.status.disabled===false&&t.options.position.adjust.mouse===true&&t.options.position.type!=="static"&&t.elements.tooltip.css("display")!=="none"){t.updatePosition(z)}})}}function o(u,v,A){var z,s,x,y,t,w;z=this;if(A.corner=="center"){return v.position}s=f.extend({},u);y={x:false,y:false};t={left:(s.left<f.fn.qtip.cache.screen.scroll.left),right:(s.left+A.dimensions.width+2>=f.fn.qtip.cache.screen.width+f.fn.qtip.cache.screen.scroll.left),top:(s.top<f.fn.qtip.cache.screen.scroll.top),bottom:(s.top+A.dimensions.height+2>=f.fn.qtip.cache.screen.height+f.fn.qtip.cache.screen.scroll.top)};x={left:(t.left&&(A.corner.search(/right/i)!=-1||(A.corner.search(/right/i)==-1&&!t.right))),right:(t.right&&(A.corner.search(/left/i)!=-1||(A.corner.search(/left/i)==-1&&!t.left))),top:(t.top&&A.corner.search(/top/i)==-1),bottom:(t.bottom&&A.corner.search(/bottom/i)==-1)};if(x.left){if(z.options.position.target!=="mouse"){s.left=v.position.left+v.dimensions.width}else{s.left=z.cache.mouse.x}y.x="Left"}else{if(x.right){if(z.options.position.target!=="mouse"){s.left=v.position.left-A.dimensions.width}else{s.left=z.cache.mouse.x-A.dimensions.width}y.x="Right"}}if(x.top){if(z.options.position.target!=="mouse"){s.top=v.position.top+v.dimensions.height}else{s.top=z.cache.mouse.y}y.y="top"}else{if(x.bottom){if(z.options.position.target!=="mouse"){s.top=v.position.top-A.dimensions.height}else{s.top=z.cache.mouse.y-A.dimensions.height}y.y="bottom"}}if(s.left<0){s.left=u.left;y.x=false}if(s.top<0){s.top=u.top;y.y=false}if(z.options.style.tip.corner!==false){s.corner=new String(A.corner);if(y.x!==false){s.corner=s.corner.replace(/Left|Right|Middle/,y.x)}if(y.y!==false){s.corner=s.corner.replace(/top|bottom/,y.y)}if(s.corner!==z.elements.tip.attr("rel")){e.call(z,s.corner)}}return s}function q(u,t){var v,s;v=f.extend(true,{},u);for(s in v){if(t===true&&s.search(/(tip|classes)/i)!==-1){delete v[s]}else{if(!t&&s.search(/(width|border|tip|title|classes|user)/i)!==-1){delete v[s]}}}return v}function c(s){if(typeof s.tip!=="object"){s.tip={corner:s.tip}}if(typeof s.tip.size!=="object"){s.tip.size={width:s.tip.size,height:s.tip.size}}if(typeof s.border!=="object"){s.border={width:s.border}}if(typeof s.width!=="object"){s.width={value:s.width}}if(typeof s.width.max=="string"){s.width.max=parseInt(s.width.max.replace(/([0-9]+)/i,"$1"))}if(typeof s.width.min=="string"){s.width.min=parseInt(s.width.min.replace(/([0-9]+)/i,"$1"))}if(typeof s.tip.size.x=="number"){s.tip.size.width=s.tip.size.x;delete s.tip.size.x}if(typeof s.tip.size.y=="number"){s.tip.size.height=s.tip.size.y;delete s.tip.size.y}return s}function a(){var s,t,u,x,v,w;s=this;u=[true,{}];for(t=0;t<arguments.length;t++){u.push(arguments[t])}x=[f.extend.apply(f,u)];while(typeof x[0].name=="string"){x.unshift(c(f.fn.qtip.styles[x[0].name]))}x.unshift(true,{classes:{tooltip:"qtip-"+(arguments[0].name||"defaults")}},f.fn.qtip.styles.defaults);v=f.extend.apply(f,x);w=(f.browser.msie)?1:0;v.tip.size.width+=w;v.tip.size.height+=w;if(v.tip.size.width%2>0){v.tip.size.width+=1}if(v.tip.size.height%2>0){v.tip.size.height+=1}if(v.tip.corner===true){v.tip.corner=(s.options.position.corner.tooltip==="center")?false:s.options.position.corner.tooltip}return v}function b(v,u,t){var s={bottomRight:[[0,0],[u,t],[u,0]],bottomLeft:[[0,0],[u,0],[0,t]],topRight:[[0,t],[u,0],[u,t]],topLeft:[[0,0],[0,t],[u,t]],topMiddle:[[0,t],[u/2,0],[u,t]],bottomMiddle:[[0,0],[u,0],[u/2,t]],rightMiddle:[[0,0],[u,t/2],[0,t]],leftMiddle:[[u,0],[u,t],[0,t/2]]};s.leftTop=s.bottomRight;s.rightTop=s.bottomLeft;s.leftBottom=s.topRight;s.rightBottom=s.topLeft;return s[v]}function g(s){var t;if(f("<canvas>").get(0).getContext){t={topLeft:[s,s],topRight:[0,s],bottomLeft:[s,0],bottomRight:[0,0]}}else{if(f.browser.msie){t={topLeft:[-90,90,0],topRight:[-90,90,-s],bottomLeft:[90,270,0],bottomRight:[90,270,-s]}}}return t}function k(){var s,t,u;s=this;u=s.getDimensions();t='<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:false" style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=\'0\'); border: 1px solid red; height:'+u.height+"px; width:"+u.width+'px" />';s.elements.bgiframe=s.elements.wrapper.prepend(t).children(".qtip-bgiframe:first")}f(document).ready(function(){f.fn.qtip.cache={screen:{scroll:{left:f(window).scrollLeft(),top:f(window).scrollTop()},width:f(window).width(),height:f(window).height()}};var s;f(window).bind("resize scroll",function(t){clearTimeout(s);s=setTimeout(function(){if(t.type==="scroll"){f.fn.qtip.cache.screen.scroll={left:f(window).scrollLeft(),top:f(window).scrollTop()}}else{f.fn.qtip.cache.screen.width=f(window).width();f.fn.qtip.cache.screen.height=f(window).height()}for(i=0;i<f.fn.qtip.interfaces.length;i++){var u=f.fn.qtip.interfaces[i];if(u.status.rendered===true&&(u.options.position.type!=="static"||u.options.position.adjust.scroll&&t.type==="scroll"||u.options.position.adjust.resize&&t.type==="resize")){u.updatePosition(t,true)}}},100)});f(document).bind("mousedown.qtip",function(t){if(f(t.target).parents("div.qtip").length===0){f(".qtip[unfocus]").each(function(){var u=f(this).qtip("api");if(f(this).is(":visible")&&!u.status.disabled&&f(t.target).add(u.elements.target).length>1){u.hide(t)}})}})});f.fn.qtip.interfaces=[];f.fn.qtip.log={error:function(){return this}};f.fn.qtip.constants={};f.fn.qtip.defaults={content:{prerender:false,text:false,url:false,data:null,title:{text:false,button:false}},position:{target:false,corner:{target:"bottomRight",tooltip:"topLeft"},adjust:{x:0,y:0,mouse:true,screen:false,scroll:true,resize:true},type:"absolute",container:false},show:{when:{target:false,event:"mouseover"},effect:{type:"fade",length:100},delay:140,solo:false,ready:false},hide:{when:{target:false,event:"mouseout"},effect:{type:"fade",length:100},delay:0,fixed:false},api:{beforeRender:function(){},onRender:function(){},beforePositionUpdate:function(){},onPositionUpdate:function(){},beforeShow:function(){},onShow:function(){},beforeHide:function(){},onHide:function(){},beforeContentUpdate:function(){},onContentUpdate:function(){},beforeContentLoad:function(){},onContentLoad:function(){},beforeTitleUpdate:function(){},onTitleUpdate:function(){},beforeDestroy:function(){},onDestroy:function(){},beforeFocus:function(){},onFocus:function(){}}};f.fn.qtip.styles={defaults:{background:"white",color:"#111",overflow:"hidden",textAlign:"left",width:{min:0,max:250},padding:"5px 9px",border:{width:1,radius:0,color:"#d3d3d3"},tip:{corner:false,color:false,size:{width:13,height:13},opacity:1},title:{background:"#e1e1e1",fontWeight:"bold",padding:"7px 12px"},button:{cursor:"pointer"},classes:{target:"",tip:"qtip-tip",title:"qtip-title",button:"qtip-button",content:"qtip-content",active:"qtip-active"}},cream:{border:{width:3,radius:0,color:"#F9E98E"},title:{background:"#F0DE7D",color:"#A27D35"},background:"#FBF7AA",color:"#A27D35",classes:{tooltip:"qtip-cream"}},light:{border:{width:3,radius:0,color:"#E2E2E2"},title:{background:"#f1f1f1",color:"#454545"},background:"white",color:"#454545",classes:{tooltip:"qtip-light"}},dark:{border:{width:3,radius:0,color:"#303030"},title:{background:"#404040",color:"#f3f3f3"},background:"#505050",color:"#f3f3f3",classes:{tooltip:"qtip-dark"}},red:{border:{width:3,radius:0,color:"#CE6F6F"},title:{background:"#f28279",color:"#9C2F2F"},background:"#F79992",color:"#9C2F2F",classes:{tooltip:"qtip-red"}},green:{border:{width:3,radius:0,color:"#A9DB66"},title:{background:"#b9db8c",color:"#58792E"},background:"#CDE6AC",color:"#58792E",classes:{tooltip:"qtip-green"}},blue:{border:{width:3,radius:0,color:"#ADD9ED"},title:{background:"#D0E9F5",color:"#5E99BD"},background:"#E5F6FE",color:"#4D9FBF",classes:{tooltip:"qtip-blue"}}}})(jQuery);

// Create the tooltips only when document ready
$(document).ready(function()
{
   // Use the each() method to gain access to each elements attributes
   $('area').each(function()
   {
      $(this).attr('title','');
      $(this).qtip(
      {
         content: $(this).attr('alt'), // Use the ALT attribute of the area map
         style: {
            name: 'light', // Give it the preset dark style
            border: {
               width: 2,
               radius: 4
            }
            ,tip: true // Apply a tip at the default tooltip corner
         }
      });
   });
});





;

 //~ =======  ::Datei:: javascripts/jquery/plugins/videojs/video.js ========
/*! Video.js v4.3.0 Copyright 2013 Brightcove, Inc. https://github.com/videojs/video.js/blob/master/LICENSE */ (function() {var b=void 0,f=!0,h=null,l=!1;function m(){return function(){}}function p(a){return function(){return this[a]}}function s(a){return function(){return a}}var t;document.createElement("video");document.createElement("audio");document.createElement("track");function u(a,c,d){if("string"===typeof a){0===a.indexOf("#")&&(a=a.slice(1));if(u.xa[a])return u.xa[a];a=u.w(a)}if(!a||!a.nodeName)throw new TypeError("The element or ID supplied is not valid. (videojs)");return a.player||new u.s(a,c,d)}var v=u;
window.Td=window.Ud=u;u.Tb="4.3";u.Fc="https:"==document.location.protocol?"https://":"http://";u.options={techOrder:["html5","flash"],html5:{},flash:{},width:300,height:150,defaultVolume:0,children:{mediaLoader:{},posterImage:{},textTrackDisplay:{},loadingSpinner:{},bigPlayButton:{},controlBar:{}},notSupportedMessage:'Sorry, no compatible source and playback technology were found for this video. Try using another browser like <a href="http://bit.ly/ccMUEC">Chrome</a> or download the latest <a href="http://adobe.ly/mwfN1">Adobe Flash Player</a>.'};
"GENERATED_CDN_VSN"!==u.Tb&&(v.options.flash.swf=u.Fc+"vjs.zencdn.net/"+u.Tb+"/video-js.swf");u.xa={};u.la=u.CoreObject=m();u.la.extend=function(a){var c,d;a=a||{};c=a.init||a.i||this.prototype.init||this.prototype.i||m();d=function(){c.apply(this,arguments)};d.prototype=u.k.create(this.prototype);d.prototype.constructor=d;d.extend=u.la.extend;d.create=u.la.create;for(var e in a)a.hasOwnProperty(e)&&(d.prototype[e]=a[e]);return d};
u.la.create=function(){var a=u.k.create(this.prototype);this.apply(a,arguments);return a};u.d=function(a,c,d){var e=u.getData(a);e.z||(e.z={});e.z[c]||(e.z[c]=[]);d.t||(d.t=u.t++);e.z[c].push(d);e.W||(e.disabled=l,e.W=function(c){if(!e.disabled){c=u.kc(c);var d=e.z[c.type];if(d)for(var d=d.slice(0),k=0,q=d.length;k<q&&!c.pc();k++)d[k].call(a,c)}});1==e.z[c].length&&(document.addEventListener?a.addEventListener(c,e.W,l):document.attachEvent&&a.attachEvent("on"+c,e.W))};
u.o=function(a,c,d){if(u.oc(a)){var e=u.getData(a);if(e.z)if(c){var g=e.z[c];if(g){if(d){if(d.t)for(e=0;e<g.length;e++)g[e].t===d.t&&g.splice(e--,1)}else e.z[c]=[];u.gc(a,c)}}else for(g in e.z)c=g,e.z[c]=[],u.gc(a,c)}};u.gc=function(a,c){var d=u.getData(a);0===d.z[c].length&&(delete d.z[c],document.removeEventListener?a.removeEventListener(c,d.W,l):document.detachEvent&&a.detachEvent("on"+c,d.W));u.Bb(d.z)&&(delete d.z,delete d.W,delete d.disabled);u.Bb(d)&&u.vc(a)};
u.kc=function(a){function c(){return f}function d(){return l}if(!a||!a.Cb){var e=a||window.event;a={};for(var g in e)"layerX"!==g&&"layerY"!==g&&(a[g]=e[g]);a.target||(a.target=a.srcElement||document);a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement;a.preventDefault=function(){e.preventDefault&&e.preventDefault();a.returnValue=l;a.Ab=c};a.Ab=d;a.stopPropagation=function(){e.stopPropagation&&e.stopPropagation();a.cancelBubble=f;a.Cb=c};a.Cb=d;a.stopImmediatePropagation=function(){e.stopImmediatePropagation&&
e.stopImmediatePropagation();a.pc=c;a.stopPropagation()};a.pc=d;if(a.clientX!=h){g=document.documentElement;var j=document.body;a.pageX=a.clientX+(g&&g.scrollLeft||j&&j.scrollLeft||0)-(g&&g.clientLeft||j&&j.clientLeft||0);a.pageY=a.clientY+(g&&g.scrollTop||j&&j.scrollTop||0)-(g&&g.clientTop||j&&j.clientTop||0)}a.which=a.charCode||a.keyCode;a.button!=h&&(a.button=a.button&1?0:a.button&4?1:a.button&2?2:0)}return a};
u.j=function(a,c){var d=u.oc(a)?u.getData(a):{},e=a.parentNode||a.ownerDocument;"string"===typeof c&&(c={type:c,target:a});c=u.kc(c);d.W&&d.W.call(a,c);if(e&&!c.Cb()&&c.bubbles!==l)u.j(e,c);else if(!e&&!c.Ab()&&(d=u.getData(c.target),c.target[c.type])){d.disabled=f;if("function"===typeof c.target[c.type])c.target[c.type]();d.disabled=l}return!c.Ab()};u.U=function(a,c,d){function e(){u.o(a,c,e);d.apply(this,arguments)}e.t=d.t=d.t||u.t++;u.d(a,c,e)};var w=Object.prototype.hasOwnProperty;
u.e=function(a,c){var d,e;d=document.createElement(a||"div");for(e in c)w.call(c,e)&&(-1!==e.indexOf("aria-")||"role"==e?d.setAttribute(e,c[e]):d[e]=c[e]);return d};u.$=function(a){return a.charAt(0).toUpperCase()+a.slice(1)};u.k={};u.k.create=Object.create||function(a){function c(){}c.prototype=a;return new c};u.k.ua=function(a,c,d){for(var e in a)w.call(a,e)&&c.call(d||this,e,a[e])};u.k.B=function(a,c){if(!c)return a;for(var d in c)w.call(c,d)&&(a[d]=c[d]);return a};
u.k.ic=function(a,c){var d,e,g;a=u.k.copy(a);for(d in c)w.call(c,d)&&(e=a[d],g=c[d],a[d]=u.k.qc(e)&&u.k.qc(g)?u.k.ic(e,g):c[d]);return a};u.k.copy=function(a){return u.k.B({},a)};u.k.qc=function(a){return!!a&&"object"===typeof a&&"[object Object]"===a.toString()&&a.constructor===Object};u.bind=function(a,c,d){function e(){return c.apply(a,arguments)}c.t||(c.t=u.t++);e.t=d?d+"_"+c.t:c.t;return e};u.ra={};u.t=1;u.expando="vdata"+(new Date).getTime();
u.getData=function(a){var c=a[u.expando];c||(c=a[u.expando]=u.t++,u.ra[c]={});return u.ra[c]};u.oc=function(a){a=a[u.expando];return!(!a||u.Bb(u.ra[a]))};u.vc=function(a){var c=a[u.expando];if(c){delete u.ra[c];try{delete a[u.expando]}catch(d){a.removeAttribute?a.removeAttribute(u.expando):a[u.expando]=h}}};u.Bb=function(a){for(var c in a)if(a[c]!==h)return l;return f};u.n=function(a,c){-1==(" "+a.className+" ").indexOf(" "+c+" ")&&(a.className=""===a.className?c:a.className+" "+c)};
u.u=function(a,c){var d,e;if(-1!=a.className.indexOf(c)){d=a.className.split(" ");for(e=d.length-1;0<=e;e--)d[e]===c&&d.splice(e,1);a.className=d.join(" ")}};u.na=u.e("video");u.F=navigator.userAgent;u.Mc=/iPhone/i.test(u.F);u.Lc=/iPad/i.test(u.F);u.Nc=/iPod/i.test(u.F);u.Kc=u.Mc||u.Lc||u.Nc;var aa=u,x;var y=u.F.match(/OS (\d+)_/i);x=y&&y[1]?y[1]:b;aa.Fd=x;u.Ic=/Android/i.test(u.F);var ba=u,z;var A=u.F.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i),B,C;
A?(B=A[1]&&parseFloat(A[1]),C=A[2]&&parseFloat(A[2]),z=B&&C?parseFloat(A[1]+"."+A[2]):B?B:h):z=h;ba.Gc=z;u.Oc=u.Ic&&/webkit/i.test(u.F)&&2.3>u.Gc;u.Jc=/Firefox/i.test(u.F);u.Gd=/Chrome/i.test(u.F);u.ac=!!("ontouchstart"in window||window.Hc&&document instanceof window.Hc);
u.xb=function(a){var c,d,e,g;c={};if(a&&a.attributes&&0<a.attributes.length){d=a.attributes;for(var j=d.length-1;0<=j;j--){e=d[j].name;g=d[j].value;if("boolean"===typeof a[e]||-1!==",autoplay,controls,loop,muted,default,".indexOf(","+e+","))g=g!==h?f:l;c[e]=g}}return c};
u.Kd=function(a,c){var d="";document.defaultView&&document.defaultView.getComputedStyle?d=document.defaultView.getComputedStyle(a,"").getPropertyValue(c):a.currentStyle&&(d=a["client"+c.substr(0,1).toUpperCase()+c.substr(1)]+"px");return d};u.zb=function(a,c){c.firstChild?c.insertBefore(a,c.firstChild):c.appendChild(a)};u.Pb={};u.w=function(a){0===a.indexOf("#")&&(a=a.slice(1));return document.getElementById(a)};
u.La=function(a,c){c=c||a;var d=Math.floor(a%60),e=Math.floor(a/60%60),g=Math.floor(a/3600),j=Math.floor(c/60%60),k=Math.floor(c/3600);if(isNaN(a)||Infinity===a)g=e=d="-";g=0<g||0<k?g+":":"";return g+(((g||10<=j)&&10>e?"0"+e:e)+":")+(10>d?"0"+d:d)};u.Tc=function(){document.body.focus();document.onselectstart=s(l)};u.Bd=function(){document.onselectstart=s(f)};u.trim=function(a){return(a+"").replace(/^\s+|\s+$/g,"")};u.round=function(a,c){c||(c=0);return Math.round(a*Math.pow(10,c))/Math.pow(10,c)};
u.tb=function(a,c){return{length:1,start:function(){return a},end:function(){return c}}};
u.get=function(a,c,d){var e,g;"undefined"===typeof XMLHttpRequest&&(window.XMLHttpRequest=function(){try{return new window.ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(a){}try{return new window.ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(c){}try{return new window.ActiveXObject("Msxml2.XMLHTTP")}catch(d){}throw Error("This browser does not support XMLHttpRequest.");});g=new XMLHttpRequest;try{g.open("GET",a)}catch(j){d(j)}e=0===a.indexOf("file:")||0===window.location.href.indexOf("file:")&&-1===a.indexOf("http");
g.onreadystatechange=function(){4===g.readyState&&(200===g.status||e&&0===g.status?c(g.responseText):d&&d())};try{g.send()}catch(k){d&&d(k)}};u.td=function(a){try{var c=window.localStorage||l;c&&(c.volume=a)}catch(d){22==d.code||1014==d.code?u.log("LocalStorage Full (VideoJS)",d):18==d.code?u.log("LocalStorage not allowed (VideoJS)",d):u.log("LocalStorage Error (VideoJS)",d)}};u.mc=function(a){a.match(/^https?:\/\//)||(a=u.e("div",{innerHTML:'<a href="'+a+'">x</a>'}).firstChild.href);return a};
u.log=function(){u.log.history=u.log.history||[];u.log.history.push(arguments);window.console&&window.console.log(Array.prototype.slice.call(arguments))};u.ad=function(a){var c,d;a.getBoundingClientRect&&a.parentNode&&(c=a.getBoundingClientRect());if(!c)return{left:0,top:0};a=document.documentElement;d=document.body;return{left:c.left+(window.pageXOffset||d.scrollLeft)-(a.clientLeft||d.clientLeft||0),top:c.top+(window.pageYOffset||d.scrollTop)-(a.clientTop||d.clientTop||0)}};
u.c=u.la.extend({i:function(a,c,d){this.b=a;this.g=u.k.copy(this.g);c=this.options(c);this.Q=c.id||(c.el&&c.el.id?c.el.id:a.id()+"_component_"+u.t++);this.gd=c.name||h;this.a=c.el||this.e();this.G=[];this.qb={};this.V={};if((a=this.g)&&a.children){var e=this;u.k.ua(a.children,function(a,c){c!==l&&!c.loadEvent&&(e[a]=e.Z(a,c))})}this.L(d)}});t=u.c.prototype;
t.D=function(){this.j("dispose");if(this.G)for(var a=this.G.length-1;0<=a;a--)this.G[a].D&&this.G[a].D();this.V=this.qb=this.G=h;this.o();this.a.parentNode&&this.a.parentNode.removeChild(this.a);u.vc(this.a);this.a=h};t.b=f;t.K=p("b");t.options=function(a){return a===b?this.g:this.g=u.k.ic(this.g,a)};t.e=function(a,c){return u.e(a,c)};t.w=p("a");t.id=p("Q");t.name=p("gd");t.children=p("G");
t.Z=function(a,c){var d,e;"string"===typeof a?(e=a,c=c||{},d=c.componentClass||u.$(e),c.name=e,d=new window.videojs[d](this.b||this,c)):d=a;this.G.push(d);"function"===typeof d.id&&(this.qb[d.id()]=d);(e=e||d.name&&d.name())&&(this.V[e]=d);"function"===typeof d.el&&d.el()&&(this.sa||this.a).appendChild(d.el());return d};
t.removeChild=function(a){"string"===typeof a&&(a=this.V[a]);if(a&&this.G){for(var c=l,d=this.G.length-1;0<=d;d--)if(this.G[d]===a){c=f;this.G.splice(d,1);break}c&&(this.qb[a.id]=h,this.V[a.name]=h,(c=a.w())&&c.parentNode===(this.sa||this.a)&&(this.sa||this.a).removeChild(a.w()))}};t.T=s("");t.d=function(a,c){u.d(this.a,a,u.bind(this,c));return this};t.o=function(a,c){u.o(this.a,a,c);return this};t.U=function(a,c){u.U(this.a,a,u.bind(this,c));return this};t.j=function(a,c){u.j(this.a,a,c);return this};
t.L=function(a){a&&(this.aa?a.call(this):(this.Sa===b&&(this.Sa=[]),this.Sa.push(a)));return this};t.Ua=function(){this.aa=f;var a=this.Sa;if(a&&0<a.length){for(var c=0,d=a.length;c<d;c++)a[c].call(this);this.Sa=[];this.j("ready")}};t.n=function(a){u.n(this.a,a);return this};t.u=function(a){u.u(this.a,a);return this};t.show=function(){this.a.style.display="block";return this};t.C=function(){this.a.style.display="none";return this};function D(a){a.u("vjs-lock-showing")}
t.disable=function(){this.C();this.show=m()};t.width=function(a,c){return E(this,"width",a,c)};t.height=function(a,c){return E(this,"height",a,c)};t.Xc=function(a,c){return this.width(a,f).height(c)};function E(a,c,d,e){if(d!==b)return a.a.style[c]=-1!==(""+d).indexOf("%")||-1!==(""+d).indexOf("px")?d:"auto"===d?"":d+"px",e||a.j("resize"),a;if(!a.a)return 0;d=a.a.style[c];e=d.indexOf("px");return-1!==e?parseInt(d.slice(0,e),10):parseInt(a.a["offset"+u.$(c)],10)}
u.q=u.c.extend({i:function(a,c){u.c.call(this,a,c);var d=l;this.d("touchstart",function(a){a.preventDefault();d=f});this.d("touchmove",function(){d=l});var e=this;this.d("touchend",function(a){d&&e.p(a);a.preventDefault()});this.d("click",this.p);this.d("focus",this.Oa);this.d("blur",this.Na)}});t=u.q.prototype;
t.e=function(a,c){c=u.k.B({className:this.T(),innerHTML:'<div class="vjs-control-content"><span class="vjs-control-text">'+(this.qa||"Need Text")+"</span></div>",qd:"button","aria-live":"polite",tabIndex:0},c);return u.c.prototype.e.call(this,a,c)};t.T=function(){return"vjs-control "+u.c.prototype.T.call(this)};t.p=m();t.Oa=function(){u.d(document,"keyup",u.bind(this,this.ba))};t.ba=function(a){if(32==a.which||13==a.which)a.preventDefault(),this.p()};
t.Na=function(){u.o(document,"keyup",u.bind(this,this.ba))};u.O=u.c.extend({i:function(a,c){u.c.call(this,a,c);this.Sc=this.V[this.g.barName];this.handle=this.V[this.g.handleName];a.d(this.tc,u.bind(this,this.update));this.d("mousedown",this.Pa);this.d("touchstart",this.Pa);this.d("focus",this.Oa);this.d("blur",this.Na);this.d("click",this.p);this.b.d("controlsvisible",u.bind(this,this.update));a.L(u.bind(this,this.update));this.P={}}});t=u.O.prototype;
t.e=function(a,c){c=c||{};c.className+=" vjs-slider";c=u.k.B({qd:"slider","aria-valuenow":0,"aria-valuemin":0,"aria-valuemax":100,tabIndex:0},c);return u.c.prototype.e.call(this,a,c)};t.Pa=function(a){a.preventDefault();u.Tc();this.P.move=u.bind(this,this.Hb);this.P.end=u.bind(this,this.Ib);u.d(document,"mousemove",this.P.move);u.d(document,"mouseup",this.P.end);u.d(document,"touchmove",this.P.move);u.d(document,"touchend",this.P.end);this.Hb(a)};
t.Ib=function(){u.Bd();u.o(document,"mousemove",this.P.move,l);u.o(document,"mouseup",this.P.end,l);u.o(document,"touchmove",this.P.move,l);u.o(document,"touchend",this.P.end,l);this.update()};t.update=function(){if(this.a){var a,c=this.yb(),d=this.handle,e=this.Sc;isNaN(c)&&(c=0);a=c;if(d){a=this.a.offsetWidth;var g=d.w().offsetWidth;a=g?g/a:0;c*=1-a;a=c+a/2;d.w().style.left=u.round(100*c,2)+"%"}e.w().style.width=u.round(100*a,2)+"%"}};
function F(a,c){var d,e,g,j;d=a.a;e=u.ad(d);j=g=d.offsetWidth;d=a.handle;if(a.g.Cd)return j=e.top,e=c.changedTouches?c.changedTouches[0].pageY:c.pageY,d&&(d=d.w().offsetHeight,j+=d/2,g-=d),Math.max(0,Math.min(1,(j-e+g)/g));g=e.left;e=c.changedTouches?c.changedTouches[0].pageX:c.pageX;d&&(d=d.w().offsetWidth,g+=d/2,j-=d);return Math.max(0,Math.min(1,(e-g)/j))}t.Oa=function(){u.d(document,"keyup",u.bind(this,this.ba))};
t.ba=function(a){37==a.which?(a.preventDefault(),this.yc()):39==a.which&&(a.preventDefault(),this.zc())};t.Na=function(){u.o(document,"keyup",u.bind(this,this.ba))};t.p=function(a){a.stopImmediatePropagation();a.preventDefault()};u.ea=u.c.extend();u.ea.prototype.defaultValue=0;u.ea.prototype.e=function(a,c){c=c||{};c.className+=" vjs-slider-handle";c=u.k.B({innerHTML:'<span class="vjs-control-text">'+this.defaultValue+"</span>"},c);return u.c.prototype.e.call(this,"div",c)};u.ma=u.c.extend();
function ca(a,c){a.Z(c);c.d("click",u.bind(a,function(){D(this)}))}u.ma.prototype.e=function(){var a=this.options().Vc||"ul";this.sa=u.e(a,{className:"vjs-menu-content"});a=u.c.prototype.e.call(this,"div",{append:this.sa,className:"vjs-menu"});a.appendChild(this.sa);u.d(a,"click",function(a){a.preventDefault();a.stopImmediatePropagation()});return a};u.N=u.q.extend({i:function(a,c){u.q.call(this,a,c);this.selected(c.selected)}});
u.N.prototype.e=function(a,c){return u.q.prototype.e.call(this,"li",u.k.B({className:"vjs-menu-item",innerHTML:this.g.label},c))};u.N.prototype.p=function(){this.selected(f)};u.N.prototype.selected=function(a){a?(this.n("vjs-selected"),this.a.setAttribute("aria-selected",f)):(this.u("vjs-selected"),this.a.setAttribute("aria-selected",l))};
u.R=u.q.extend({i:function(a,c){u.q.call(this,a,c);this.wa=this.Ka();this.Z(this.wa);this.I&&0===this.I.length&&this.C();this.d("keyup",this.ba);this.a.setAttribute("aria-haspopup",f);this.a.setAttribute("role","button")}});t=u.R.prototype;t.pa=l;t.Ka=function(){var a=new u.ma(this.b);this.options().title&&a.w().appendChild(u.e("li",{className:"vjs-menu-title",innerHTML:u.$(this.A),zd:-1}));if(this.I=this.createItems())for(var c=0;c<this.I.length;c++)ca(a,this.I[c]);return a};t.ta=m();
t.T=function(){return this.className+" vjs-menu-button "+u.q.prototype.T.call(this)};t.Oa=m();t.Na=m();t.p=function(){this.U("mouseout",u.bind(this,function(){D(this.wa);this.a.blur()}));this.pa?G(this):H(this)};t.ba=function(a){a.preventDefault();32==a.which||13==a.which?this.pa?G(this):H(this):27==a.which&&this.pa&&G(this)};function H(a){a.pa=f;a.wa.n("vjs-lock-showing");a.a.setAttribute("aria-pressed",f);a.I&&0<a.I.length&&a.I[0].w().focus()}
function G(a){a.pa=l;D(a.wa);a.a.setAttribute("aria-pressed",l)}
u.s=u.c.extend({i:function(a,c,d){this.M=a;c=u.k.B(da(a),c);this.v={};this.uc=c.poster;this.sb=c.controls;a.controls=l;u.c.call(this,this,c,d);this.controls()?this.n("vjs-controls-enabled"):this.n("vjs-controls-disabled");this.U("play",function(a){u.j(this.a,{type:"firstplay",target:this.a})||(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation())});this.d("ended",this.hd);this.d("play",this.Kb);this.d("firstplay",this.jd);this.d("pause",this.Jb);this.d("progress",this.ld);this.d("durationchange",
this.sc);this.d("error",this.Gb);this.d("fullscreenchange",this.kd);u.xa[this.Q]=this;c.plugins&&u.k.ua(c.plugins,function(a,c){this[a](c)},this);var e,g,j,k;e=this.Mb;a=function(){e();clearInterval(g);g=setInterval(u.bind(this,e),250)};c=function(){e();clearInterval(g)};this.d("mousedown",a);this.d("mousemove",e);this.d("mouseup",c);this.d("keydown",e);this.d("keyup",e);this.d("touchstart",a);this.d("touchmove",e);this.d("touchend",c);this.d("touchcancel",c);j=setInterval(u.bind(this,function(){this.ka&&
(this.ka=l,this.ja(f),clearTimeout(k),k=setTimeout(u.bind(this,function(){this.ka||this.ja(l)}),2E3))}),250);this.d("dispose",function(){clearInterval(j);clearTimeout(k)})}});t=u.s.prototype;t.g=u.options;t.D=function(){this.j("dispose");this.o("dispose");u.xa[this.Q]=h;this.M&&this.M.player&&(this.M.player=h);this.a&&this.a.player&&(this.a.player=h);clearInterval(this.Ra);this.za();this.h&&this.h.D();u.c.prototype.D.call(this)};
function da(a){var c={sources:[],tracks:[]};u.k.B(c,u.xb(a));if(a.hasChildNodes()){var d,e,g,j;a=a.childNodes;g=0;for(j=a.length;g<j;g++)d=a[g],e=d.nodeName.toLowerCase(),"source"===e?c.sources.push(u.xb(d)):"track"===e&&c.tracks.push(u.xb(d))}return c}
t.e=function(){var a=this.a=u.c.prototype.e.call(this,"div"),c=this.M;c.removeAttribute("width");c.removeAttribute("height");if(c.hasChildNodes()){var d,e,g,j,k;d=c.childNodes;e=d.length;for(k=[];e--;)g=d[e],j=g.nodeName.toLowerCase(),"track"===j&&k.push(g);for(d=0;d<k.length;d++)c.removeChild(k[d])}c.id=c.id||"vjs_video_"+u.t++;a.id=c.id;a.className=c.className;c.id+="_html5_api";c.className="vjs-tech";c.player=a.player=this;this.n("vjs-paused");this.width(this.g.width,f);this.height(this.g.height,
f);c.parentNode&&c.parentNode.insertBefore(a,c);u.zb(c,a);return a};
function I(a,c,d){a.h?(a.aa=l,a.h.D(),a.Eb&&(a.Eb=l,clearInterval(a.Ra)),a.Fb&&J(a),a.h=l):"Html5"!==c&&a.M&&(u.l.jc(a.M),a.M=h);a.ia=c;a.aa=l;var e=u.k.B({source:d,parentEl:a.a},a.g[c.toLowerCase()]);d&&(d.src==a.v.src&&0<a.v.currentTime&&(e.startTime=a.v.currentTime),a.v.src=d.src);a.h=new window.videojs[c](a,e);a.h.L(function(){this.b.Ua();if(!this.m.progressEvents){var a=this.b;a.Eb=f;a.Ra=setInterval(u.bind(a,function(){this.v.lb<this.buffered().end(0)?this.j("progress"):1==this.Ja()&&(clearInterval(this.Ra),
this.j("progress"))}),500);a.h.U("progress",function(){this.m.progressEvents=f;var a=this.b;a.Eb=l;clearInterval(a.Ra)})}this.m.timeupdateEvents||(a=this.b,a.Fb=f,a.d("play",a.Cc),a.d("pause",a.za),a.h.U("timeupdate",function(){this.m.timeupdateEvents=f;J(this.b)}))})}function J(a){a.Fb=l;a.za();a.o("play",a.Cc);a.o("pause",a.za)}t.Cc=function(){this.hc&&this.za();this.hc=setInterval(u.bind(this,function(){this.j("timeupdate")}),250)};t.za=function(){clearInterval(this.hc)};
t.Kb=function(){u.u(this.a,"vjs-paused");u.n(this.a,"vjs-playing")};t.jd=function(){this.g.starttime&&this.currentTime(this.g.starttime);this.n("vjs-has-started")};t.Jb=function(){u.u(this.a,"vjs-playing");u.n(this.a,"vjs-paused")};t.ld=function(){1==this.Ja()&&this.j("loadedalldata")};t.hd=function(){this.g.loop&&(this.currentTime(0),this.play())};t.sc=function(){this.duration(K(this,"duration"))};t.kd=function(){this.H?this.n("vjs-fullscreen"):this.u("vjs-fullscreen")};
t.Gb=function(a){u.log("Video Error",a)};function L(a,c,d){if(a.h&&!a.h.aa)a.h.L(function(){this[c](d)});else try{a.h[c](d)}catch(e){throw u.log(e),e;}}function K(a,c){if(a.h&&a.h.aa)try{return a.h[c]()}catch(d){throw a.h[c]===b?u.log("Video.js: "+c+" method not defined for "+a.ia+" playback technology.",d):"TypeError"==d.name?(u.log("Video.js: "+c+" unavailable on "+a.ia+" playback technology element.",d),a.h.aa=l):u.log(d),d;}}t.play=function(){L(this,"play");return this};
t.pause=function(){L(this,"pause");return this};t.paused=function(){return K(this,"paused")===l?l:f};t.currentTime=function(a){return a!==b?(this.v.rc=a,L(this,"setCurrentTime",a),this.Fb&&this.j("timeupdate"),this):this.v.currentTime=K(this,"currentTime")||0};t.duration=function(a){if(a!==b)return this.v.duration=parseFloat(a),this;this.v.duration===b&&this.sc();return this.v.duration};
t.buffered=function(){var a=K(this,"buffered"),c=a.length-1,d=this.v.lb=this.v.lb||0;a&&(0<=c&&a.end(c)!==d)&&(d=a.end(c),this.v.lb=d);return u.tb(0,d)};t.Ja=function(){return this.duration()?this.buffered().end(0)/this.duration():0};t.volume=function(a){if(a!==b)return a=Math.max(0,Math.min(1,parseFloat(a))),this.v.volume=a,L(this,"setVolume",a),u.td(a),this;a=parseFloat(K(this,"volume"));return isNaN(a)?1:a};t.muted=function(a){return a!==b?(L(this,"setMuted",a),this):K(this,"muted")||l};
t.Ta=function(){return K(this,"supportsFullScreen")||l};
t.ya=function(){var a=u.Pb.ya;this.H=f;a?(u.d(document,a.vb,u.bind(this,function(c){this.H=document[a.H];this.H===l&&u.o(document,a.vb,arguments.callee);this.j("fullscreenchange")})),this.a[a.wc]()):this.h.Ta()?L(this,"enterFullScreen"):(this.cd=f,this.Yc=document.documentElement.style.overflow,u.d(document,"keydown",u.bind(this,this.lc)),document.documentElement.style.overflow="hidden",u.n(document.body,"vjs-full-window"),this.j("enterFullWindow"),this.j("fullscreenchange"));return this};
t.ob=function(){var a=u.Pb.ya;this.H=l;if(a)document[a.nb]();else this.h.Ta()?L(this,"exitFullScreen"):(M(this),this.j("fullscreenchange"));return this};t.lc=function(a){27===a.keyCode&&(this.H===f?this.ob():M(this))};function M(a){a.cd=l;u.o(document,"keydown",a.lc);document.documentElement.style.overflow=a.Yc;u.u(document.body,"vjs-full-window");a.j("exitFullWindow")}
t.src=function(a){if(a instanceof Array){var c;a:{c=a;for(var d=0,e=this.g.techOrder;d<e.length;d++){var g=u.$(e[d]),j=window.videojs[g];if(j.isSupported())for(var k=0,q=c;k<q.length;k++){var n=q[k];if(j.canPlaySource(n)){c={source:n,h:g};break a}}}c=l}c?(a=c.source,c=c.h,c==this.ia?this.src(a):I(this,c,a)):this.a.appendChild(u.e("p",{innerHTML:this.options().notSupportedMessage}))}else a instanceof Object?window.videojs[this.ia].canPlaySource(a)?this.src(a.src):this.src([a]):(this.v.src=a,this.aa?
(L(this,"src",a),"auto"==this.g.preload&&this.load(),this.g.autoplay&&this.play()):this.L(function(){this.src(a)}));return this};t.load=function(){L(this,"load");return this};t.currentSrc=function(){return K(this,"currentSrc")||this.v.src||""};t.Qa=function(a){return a!==b?(L(this,"setPreload",a),this.g.preload=a,this):K(this,"preload")};t.autoplay=function(a){return a!==b?(L(this,"setAutoplay",a),this.g.autoplay=a,this):K(this,"autoplay")};
t.loop=function(a){return a!==b?(L(this,"setLoop",a),this.g.loop=a,this):K(this,"loop")};t.poster=function(a){return a!==b?(this.uc=a,this):this.uc};t.controls=function(a){return a!==b?(a=!!a,this.sb!==a&&((this.sb=a)?(this.u("vjs-controls-disabled"),this.n("vjs-controls-enabled"),this.j("controlsenabled")):(this.u("vjs-controls-enabled"),this.n("vjs-controls-disabled"),this.j("controlsdisabled"))),this):this.sb};u.s.prototype.Sb;t=u.s.prototype;
t.Rb=function(a){return a!==b?(a=!!a,this.Sb!==a&&((this.Sb=a)?(this.n("vjs-using-native-controls"),this.j("usingnativecontrols")):(this.u("vjs-using-native-controls"),this.j("usingcustomcontrols"))),this):this.Sb};t.error=function(){return K(this,"error")};t.seeking=function(){return K(this,"seeking")};t.ka=f;t.Mb=function(){this.ka=f};t.Qb=f;
t.ja=function(a){return a!==b?(a=!!a,a!==this.Qb&&((this.Qb=a)?(this.ka=f,this.u("vjs-user-inactive"),this.n("vjs-user-active"),this.j("useractive")):(this.ka=l,this.h.U("mousemove",function(a){a.stopPropagation();a.preventDefault()}),this.u("vjs-user-active"),this.n("vjs-user-inactive"),this.j("userinactive"))),this):this.Qb};var N,O,P;P=document.createElement("div");O={};
P.Hd!==b?(O.wc="requestFullscreen",O.nb="exitFullscreen",O.vb="fullscreenchange",O.H="fullScreen"):(document.mozCancelFullScreen?(N="moz",O.H=N+"FullScreen"):(N="webkit",O.H=N+"IsFullScreen"),P[N+"RequestFullScreen"]&&(O.wc=N+"RequestFullScreen",O.nb=N+"CancelFullScreen"),O.vb=N+"fullscreenchange");document[O.nb]&&(u.Pb.ya=O);u.Fa=u.c.extend();
u.Fa.prototype.g={Md:"play",children:{playToggle:{},currentTimeDisplay:{},timeDivider:{},durationDisplay:{},remainingTimeDisplay:{},progressControl:{},fullscreenToggle:{},volumeControl:{},muteToggle:{}}};u.Fa.prototype.e=function(){return u.e("div",{className:"vjs-control-bar"})};u.Yb=u.q.extend({i:function(a,c){u.q.call(this,a,c);a.d("play",u.bind(this,this.Kb));a.d("pause",u.bind(this,this.Jb))}});t=u.Yb.prototype;t.qa="Play";t.T=function(){return"vjs-play-control "+u.q.prototype.T.call(this)};
t.p=function(){this.b.paused()?this.b.play():this.b.pause()};t.Kb=function(){u.u(this.a,"vjs-paused");u.n(this.a,"vjs-playing");this.a.children[0].children[0].innerHTML="Pause"};t.Jb=function(){u.u(this.a,"vjs-playing");u.n(this.a,"vjs-paused");this.a.children[0].children[0].innerHTML="Play"};u.Ya=u.c.extend({i:function(a,c){u.c.call(this,a,c);a.d("timeupdate",u.bind(this,this.Ca))}});
u.Ya.prototype.e=function(){var a=u.c.prototype.e.call(this,"div",{className:"vjs-current-time vjs-time-controls vjs-control"});this.content=u.e("div",{className:"vjs-current-time-display",innerHTML:'<span class="vjs-control-text">Current Time </span>0:00',"aria-live":"off"});a.appendChild(u.e("div").appendChild(this.content));return a};
u.Ya.prototype.Ca=function(){var a=this.b.Nb?this.b.v.currentTime:this.b.currentTime();this.content.innerHTML='<span class="vjs-control-text">Current Time </span>'+u.La(a,this.b.duration())};u.Za=u.c.extend({i:function(a,c){u.c.call(this,a,c);a.d("timeupdate",u.bind(this,this.Ca))}});
u.Za.prototype.e=function(){var a=u.c.prototype.e.call(this,"div",{className:"vjs-duration vjs-time-controls vjs-control"});this.content=u.e("div",{className:"vjs-duration-display",innerHTML:'<span class="vjs-control-text">Duration Time </span>0:00',"aria-live":"off"});a.appendChild(u.e("div").appendChild(this.content));return a};u.Za.prototype.Ca=function(){var a=this.b.duration();a&&(this.content.innerHTML='<span class="vjs-control-text">Duration Time </span>'+u.La(a))};
u.cc=u.c.extend({i:function(a,c){u.c.call(this,a,c)}});u.cc.prototype.e=function(){return u.c.prototype.e.call(this,"div",{className:"vjs-time-divider",innerHTML:"<div><span>/</span></div>"})};u.fb=u.c.extend({i:function(a,c){u.c.call(this,a,c);a.d("timeupdate",u.bind(this,this.Ca))}});
u.fb.prototype.e=function(){var a=u.c.prototype.e.call(this,"div",{className:"vjs-remaining-time vjs-time-controls vjs-control"});this.content=u.e("div",{className:"vjs-remaining-time-display",innerHTML:'<span class="vjs-control-text">Remaining Time </span>-0:00',"aria-live":"off"});a.appendChild(u.e("div").appendChild(this.content));return a};u.fb.prototype.Ca=function(){this.b.duration()&&(this.content.innerHTML='<span class="vjs-control-text">Remaining Time </span>-'+u.La(this.b.duration()-this.b.currentTime()))};
u.Ga=u.q.extend({i:function(a,c){u.q.call(this,a,c)}});u.Ga.prototype.qa="Fullscreen";u.Ga.prototype.T=function(){return"vjs-fullscreen-control "+u.q.prototype.T.call(this)};u.Ga.prototype.p=function(){this.b.H?(this.b.ob(),this.a.children[0].children[0].innerHTML="Fullscreen"):(this.b.ya(),this.a.children[0].children[0].innerHTML="Non-Fullscreen")};u.eb=u.c.extend({i:function(a,c){u.c.call(this,a,c)}});u.eb.prototype.g={children:{seekBar:{}}};
u.eb.prototype.e=function(){return u.c.prototype.e.call(this,"div",{className:"vjs-progress-control vjs-control"})};u.Zb=u.O.extend({i:function(a,c){u.O.call(this,a,c);a.d("timeupdate",u.bind(this,this.Ba));a.L(u.bind(this,this.Ba))}});t=u.Zb.prototype;t.g={children:{loadProgressBar:{},playProgressBar:{},seekHandle:{}},barName:"playProgressBar",handleName:"seekHandle"};t.tc="timeupdate";t.e=function(){return u.O.prototype.e.call(this,"div",{className:"vjs-progress-holder","aria-label":"video progress bar"})};
t.Ba=function(){var a=this.b.Nb?this.b.v.currentTime:this.b.currentTime();this.a.setAttribute("aria-valuenow",u.round(100*this.yb(),2));this.a.setAttribute("aria-valuetext",u.La(a,this.b.duration()))};t.yb=function(){var a;"Flash"===this.b.ia&&this.b.seeking()?(a=this.b.v,a=a.rc?a.rc:this.b.currentTime()):a=this.b.currentTime();return a/this.b.duration()};t.Pa=function(a){u.O.prototype.Pa.call(this,a);this.b.Nb=f;this.Dd=!this.b.paused();this.b.pause()};
t.Hb=function(a){a=F(this,a)*this.b.duration();a==this.b.duration()&&(a-=0.1);this.b.currentTime(a)};t.Ib=function(a){u.O.prototype.Ib.call(this,a);this.b.Nb=l;this.Dd&&this.b.play()};t.zc=function(){this.b.currentTime(this.b.currentTime()+5)};t.yc=function(){this.b.currentTime(this.b.currentTime()-5)};u.ab=u.c.extend({i:function(a,c){u.c.call(this,a,c);a.d("progress",u.bind(this,this.update))}});u.ab.prototype.e=function(){return u.c.prototype.e.call(this,"div",{className:"vjs-load-progress",innerHTML:'<span class="vjs-control-text">Loaded: 0%</span>'})};
u.ab.prototype.update=function(){this.a.style&&(this.a.style.width=u.round(100*this.b.Ja(),2)+"%")};u.Xb=u.c.extend({i:function(a,c){u.c.call(this,a,c)}});u.Xb.prototype.e=function(){return u.c.prototype.e.call(this,"div",{className:"vjs-play-progress",innerHTML:'<span class="vjs-control-text">Progress: 0%</span>'})};u.gb=u.ea.extend();u.gb.prototype.defaultValue="00:00";u.gb.prototype.e=function(){return u.ea.prototype.e.call(this,"div",{className:"vjs-seek-handle"})};
u.ib=u.c.extend({i:function(a,c){u.c.call(this,a,c);a.h&&(a.h.m&&a.h.m.volumeControl===l)&&this.n("vjs-hidden");a.d("loadstart",u.bind(this,function(){a.h.m&&a.h.m.volumeControl===l?this.n("vjs-hidden"):this.u("vjs-hidden")}))}});u.ib.prototype.g={children:{volumeBar:{}}};u.ib.prototype.e=function(){return u.c.prototype.e.call(this,"div",{className:"vjs-volume-control vjs-control"})};
u.hb=u.O.extend({i:function(a,c){u.O.call(this,a,c);a.d("volumechange",u.bind(this,this.Ba));a.L(u.bind(this,this.Ba));setTimeout(u.bind(this,this.update),0)}});t=u.hb.prototype;t.Ba=function(){this.a.setAttribute("aria-valuenow",u.round(100*this.b.volume(),2));this.a.setAttribute("aria-valuetext",u.round(100*this.b.volume(),2)+"%")};t.g={children:{volumeLevel:{},volumeHandle:{}},barName:"volumeLevel",handleName:"volumeHandle"};t.tc="volumechange";
t.e=function(){return u.O.prototype.e.call(this,"div",{className:"vjs-volume-bar","aria-label":"volume level"})};t.Hb=function(a){this.b.muted()&&this.b.muted(l);this.b.volume(F(this,a))};t.yb=function(){return this.b.muted()?0:this.b.volume()};t.zc=function(){this.b.volume(this.b.volume()+0.1)};t.yc=function(){this.b.volume(this.b.volume()-0.1)};u.dc=u.c.extend({i:function(a,c){u.c.call(this,a,c)}});
u.dc.prototype.e=function(){return u.c.prototype.e.call(this,"div",{className:"vjs-volume-level",innerHTML:'<span class="vjs-control-text"></span>'})};u.jb=u.ea.extend();u.jb.prototype.defaultValue="00:00";u.jb.prototype.e=function(){return u.ea.prototype.e.call(this,"div",{className:"vjs-volume-handle"})};
u.da=u.q.extend({i:function(a,c){u.q.call(this,a,c);a.d("volumechange",u.bind(this,this.update));a.h&&(a.h.m&&a.h.m.volumeControl===l)&&this.n("vjs-hidden");a.d("loadstart",u.bind(this,function(){a.h.m&&a.h.m.volumeControl===l?this.n("vjs-hidden"):this.u("vjs-hidden")}))}});u.da.prototype.e=function(){return u.q.prototype.e.call(this,"div",{className:"vjs-mute-control vjs-control",innerHTML:'<div><span class="vjs-control-text">Mute</span></div>'})};
u.da.prototype.p=function(){this.b.muted(this.b.muted()?l:f)};u.da.prototype.update=function(){var a=this.b.volume(),c=3;0===a||this.b.muted()?c=0:0.33>a?c=1:0.67>a&&(c=2);this.b.muted()?"Unmute"!=this.a.children[0].children[0].innerHTML&&(this.a.children[0].children[0].innerHTML="Unmute"):"Mute"!=this.a.children[0].children[0].innerHTML&&(this.a.children[0].children[0].innerHTML="Mute");for(a=0;4>a;a++)u.u(this.a,"vjs-vol-"+a);u.n(this.a,"vjs-vol-"+c)};
u.oa=u.R.extend({i:function(a,c){u.R.call(this,a,c);a.d("volumechange",u.bind(this,this.update));a.h&&(a.h.m&&a.h.m.Dc===l)&&this.n("vjs-hidden");a.d("loadstart",u.bind(this,function(){a.h.m&&a.h.m.Dc===l?this.n("vjs-hidden"):this.u("vjs-hidden")}));this.n("vjs-menu-button")}});u.oa.prototype.Ka=function(){var a=new u.ma(this.b,{Vc:"div"}),c=new u.hb(this.b,u.k.B({Cd:f},this.g.Vd));a.Z(c);return a};u.oa.prototype.p=function(){u.da.prototype.p.call(this);u.R.prototype.p.call(this)};
u.oa.prototype.e=function(){return u.q.prototype.e.call(this,"div",{className:"vjs-volume-menu-button vjs-menu-button vjs-control",innerHTML:'<div><span class="vjs-control-text">Mute</span></div>'})};u.oa.prototype.update=u.da.prototype.update;u.cb=u.q.extend({i:function(a,c){u.q.call(this,a,c);(!a.poster()||!a.controls())&&this.C();a.d("play",u.bind(this,this.C))}});
u.cb.prototype.e=function(){var a=u.e("div",{className:"vjs-poster",tabIndex:-1}),c=this.b.poster();c&&("backgroundSize"in a.style?a.style.backgroundImage='url("'+c+'")':a.appendChild(u.e("img",{src:c})));return a};u.cb.prototype.p=function(){this.K().controls()&&this.b.play()};
u.Wb=u.c.extend({i:function(a,c){u.c.call(this,a,c);a.d("canplay",u.bind(this,this.C));a.d("canplaythrough",u.bind(this,this.C));a.d("playing",u.bind(this,this.C));a.d("seeked",u.bind(this,this.C));a.d("seeking",u.bind(this,this.show));a.d("seeked",u.bind(this,this.C));a.d("error",u.bind(this,this.show));a.d("waiting",u.bind(this,this.show))}});u.Wb.prototype.e=function(){return u.c.prototype.e.call(this,"div",{className:"vjs-loading-spinner"})};u.Wa=u.q.extend();
u.Wa.prototype.e=function(){return u.q.prototype.e.call(this,"div",{className:"vjs-big-play-button",innerHTML:'<span aria-hidden="true"></span>',"aria-label":"play video"})};u.Wa.prototype.p=function(){this.b.play()};
u.r=u.c.extend({i:function(a,c,d){u.c.call(this,a,c,d);var e,g;g=this;e=this.K();a=function(){if(e.controls()&&!e.Rb()){var a,c;g.d("mousedown",g.p);g.d("touchstart",function(a){a.preventDefault();a.stopPropagation();c=this.b.ja()});a=function(a){a.stopPropagation();c&&this.b.Mb()};g.d("touchmove",a);g.d("touchleave",a);g.d("touchcancel",a);g.d("touchend",a);var d,n,r;d=0;g.d("touchstart",function(){d=(new Date).getTime();r=f});a=function(){r=l};g.d("touchmove",a);g.d("touchleave",a);g.d("touchcancel",
a);g.d("touchend",function(){r===f&&(n=(new Date).getTime()-d,250>n&&this.j("tap"))});g.d("tap",g.md)}};c=u.bind(g,g.pd);this.L(a);e.d("controlsenabled",a);e.d("controlsdisabled",c)}});u.r.prototype.pd=function(){this.o("tap");this.o("touchstart");this.o("touchmove");this.o("touchleave");this.o("touchcancel");this.o("touchend");this.o("click");this.o("mousedown")};u.r.prototype.p=function(a){0===a.button&&this.K().controls()&&(this.K().paused()?this.K().play():this.K().pause())};
u.r.prototype.md=function(){this.K().ja(!this.K().ja())};u.r.prototype.m={volumeControl:f,fullscreenResize:l,progressEvents:l,timeupdateEvents:l};u.media={};u.media.Va="play pause paused currentTime setCurrentTime duration buffered volume setVolume muted setMuted width height supportsFullScreen enterFullScreen src load currentSrc preload setPreload autoplay setAutoplay loop setLoop error networkState readyState seeking initialTime startOffsetTime played seekable ended videoTracks audioTracks videoWidth videoHeight textTracks defaultPlaybackRate playbackRate mediaGroup controller controls defaultMuted".split(" ");
function ea(){var a=u.media.Va[i];return function(){throw Error('The "'+a+"\" method is not available on the playback technology's API");}}for(var i=u.media.Va.length-1;0<=i;i--)u.r.prototype[u.media.Va[i]]=ea();
u.l=u.r.extend({i:function(a,c,d){this.m.volumeControl=u.l.Uc();this.m.movingMediaElementInDOM=!u.Kc;this.m.fullscreenResize=f;u.r.call(this,a,c,d);(c=c.source)&&this.a.currentSrc===c.src&&0<this.a.networkState?a.j("loadstart"):c&&(this.a.src=c.src);if(u.ac&&a.options().nativeControlsForTouch!==l){var e,g,j,k;e=this;g=this.K();c=g.controls();e.a.controls=!!c;j=function(){e.a.controls=f};k=function(){e.a.controls=l};g.d("controlsenabled",j);g.d("controlsdisabled",k);c=function(){g.o("controlsenabled",
j);g.o("controlsdisabled",k)};e.d("dispose",c);g.d("usingcustomcontrols",c);g.Rb(f)}a.L(function(){this.M&&(this.g.autoplay&&this.paused())&&(delete this.M.poster,this.play())});for(a=u.l.$a.length-1;0<=a;a--)u.d(this.a,u.l.$a[a],u.bind(this.b,this.$c));this.Ua()}});t=u.l.prototype;t.D=function(){u.r.prototype.D.call(this)};
t.e=function(){var a=this.b,c=a.M,d;if(!c||this.m.movingMediaElementInDOM===l)c?(d=c.cloneNode(l),u.l.jc(c),c=d,a.M=h):c=u.e("video",{id:a.id()+"_html5_api",className:"vjs-tech"}),c.player=a,u.zb(c,a.w());d=["autoplay","preload","loop","muted"];for(var e=d.length-1;0<=e;e--){var g=d[e];a.g[g]!==h&&(c[g]=a.g[g])}return c};t.$c=function(a){this.j(a);a.stopPropagation()};t.play=function(){this.a.play()};t.pause=function(){this.a.pause()};t.paused=function(){return this.a.paused};t.currentTime=function(){return this.a.currentTime};
t.sd=function(a){try{this.a.currentTime=a}catch(c){u.log(c,"Video is not ready. (Video.js)")}};t.duration=function(){return this.a.duration||0};t.buffered=function(){return this.a.buffered};t.volume=function(){return this.a.volume};t.xd=function(a){this.a.volume=a};t.muted=function(){return this.a.muted};t.vd=function(a){this.a.muted=a};t.width=function(){return this.a.offsetWidth};t.height=function(){return this.a.offsetHeight};
t.Ta=function(){return"function"==typeof this.a.webkitEnterFullScreen&&(/Android/.test(u.F)||!/Chrome|Mac OS X 10.5/.test(u.F))?f:l};t.src=function(a){this.a.src=a};t.load=function(){this.a.load()};t.currentSrc=function(){return this.a.currentSrc};t.Qa=function(){return this.a.Qa};t.wd=function(a){this.a.Qa=a};t.autoplay=function(){return this.a.autoplay};t.rd=function(a){this.a.autoplay=a};t.controls=function(){return this.a.controls};t.loop=function(){return this.a.loop};
t.ud=function(a){this.a.loop=a};t.error=function(){return this.a.error};t.seeking=function(){return this.a.seeking};u.l.isSupported=function(){return!!u.na.canPlayType};u.l.mb=function(a){try{return!!u.na.canPlayType(a.type)}catch(c){return""}};u.l.Uc=function(){var a=u.na.volume;u.na.volume=a/2+0.1;return a!==u.na.volume};u.l.$a="loadstart suspend abort error emptied stalled loadedmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate progress play pause ratechange volumechange".split(" ");
u.l.jc=function(a){if(a){a.player=h;for(a.parentNode&&a.parentNode.removeChild(a);a.hasChildNodes();)a.removeChild(a.firstChild);a.removeAttribute("src");"function"===typeof a.load&&a.load()}};u.Oc&&(document.createElement("video").constructor.prototype.canPlayType=function(a){return a&&-1!=a.toLowerCase().indexOf("video/mp4")?"maybe":""});
u.f=u.r.extend({i:function(a,c,d){u.r.call(this,a,c,d);var e=c.source;d=c.parentEl;var g=this.a=u.e("div",{id:a.id()+"_temp_flash"}),j=a.id()+"_flash_api";a=a.g;var k=u.k.B({readyFunction:"videojs.Flash.onReady",eventProxyFunction:"videojs.Flash.onEvent",errorEventProxyFunction:"videojs.Flash.onError",autoplay:a.autoplay,preload:a.Qa,loop:a.loop,muted:a.muted},c.flashVars),q=u.k.B({wmode:"opaque",bgcolor:"#000000"},c.params),n=u.k.B({id:j,name:j,"class":"vjs-tech"},c.attributes);e&&(e.type&&u.f.ed(e.type)?
(a=u.f.Ac(e.src),k.rtmpConnection=encodeURIComponent(a.rb),k.rtmpStream=encodeURIComponent(a.Ob)):k.src=encodeURIComponent(u.mc(e.src)));u.zb(g,d);c.startTime&&this.L(function(){this.load();this.play();this.currentTime(c.startTime)});if(c.iFrameMode===f&&!u.Jc){var r=u.e("iframe",{id:j+"_iframe",name:j+"_iframe",className:"vjs-tech",scrolling:"no",marginWidth:0,marginHeight:0,frameBorder:0});k.readyFunction="ready";k.eventProxyFunction="events";k.errorEventProxyFunction="errors";u.d(r,"load",u.bind(this,
function(){var a,d=r.contentWindow;a=r.contentDocument?r.contentDocument:r.contentWindow.document;a.write(u.f.nc(c.swf,k,q,n));d.player=this.b;d.ready=u.bind(this.b,function(c){var d=this.h;d.a=a.getElementById(c);u.f.pb(d)});d.events=u.bind(this.b,function(a,c){this&&"flash"===this.ia&&this.j(c)});d.errors=u.bind(this.b,function(a,c){u.log("Flash Error",c)})}));g.parentNode.replaceChild(r,g)}else u.f.Zc(c.swf,g,k,q,n)}});t=u.f.prototype;t.D=function(){u.r.prototype.D.call(this)};t.play=function(){this.a.vjs_play()};
t.pause=function(){this.a.vjs_pause()};t.src=function(a){u.f.dd(a)?(a=u.f.Ac(a),this.Qd(a.rb),this.Rd(a.Ob)):(a=u.mc(a),this.a.vjs_src(a));if(this.b.autoplay()){var c=this;setTimeout(function(){c.play()},0)}};t.currentSrc=function(){var a=this.a.vjs_getProperty("currentSrc");if(a==h){var c=this.Od(),d=this.Pd();c&&d&&(a=u.f.yd(c,d))}return a};t.load=function(){this.a.vjs_load()};t.poster=function(){this.a.vjs_getProperty("poster")};t.buffered=function(){return u.tb(0,this.a.vjs_getProperty("buffered"))};
t.Ta=s(l);var Q=u.f.prototype,R="rtmpConnection rtmpStream preload currentTime defaultPlaybackRate playbackRate autoplay loop mediaGroup controller controls volume muted defaultMuted".split(" "),S="error currentSrc networkState readyState seeking initialTime duration startOffsetTime paused played seekable ended videoTracks audioTracks videoWidth videoHeight textTracks".split(" ");
function fa(){var a=R[T],c=a.charAt(0).toUpperCase()+a.slice(1);Q["set"+c]=function(c){return this.a.vjs_setProperty(a,c)}}function U(a){Q[a]=function(){return this.a.vjs_getProperty(a)}}var T;for(T=0;T<R.length;T++)U(R[T]),fa();for(T=0;T<S.length;T++)U(S[T]);u.f.isSupported=function(){return 10<=u.f.version()[0]};u.f.mb=function(a){if(!a.type)return"";a=a.type.replace(/;.*/,"").toLowerCase();if(a in u.f.bd||a in u.f.Bc)return"maybe"};
u.f.bd={"video/flv":"FLV","video/x-flv":"FLV","video/mp4":"MP4","video/m4v":"MP4"};u.f.Bc={"rtmp/mp4":"MP4","rtmp/flv":"FLV"};u.f.onReady=function(a){a=u.w(a);var c=a.player||a.parentNode.player,d=c.h;a.player=c;d.a=a;u.f.pb(d)};u.f.pb=function(a){a.w().vjs_getProperty?a.Ua():setTimeout(function(){u.f.pb(a)},50)};u.f.onEvent=function(a,c){u.w(a).player.j(c)};u.f.onError=function(a,c){u.w(a).player.j("error");u.log("Flash Error",c,a)};
u.f.version=function(){var a="0,0,0";try{a=(new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version").replace(/\D+/g,",").match(/^,?(.+),?$/)[1]}catch(c){try{navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin&&(a=(navigator.plugins["Shockwave Flash 2.0"]||navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g,",").match(/^,?(.+),?$/)[1])}catch(d){}}return a.split(",")};
u.f.Zc=function(a,c,d,e,g){a=u.f.nc(a,d,e,g);a=u.e("div",{innerHTML:a}).childNodes[0];d=c.parentNode;c.parentNode.replaceChild(a,c);var j=d.childNodes[0];setTimeout(function(){j.style.display="block"},1E3)};
u.f.nc=function(a,c,d,e){var g="",j="",k="";c&&u.k.ua(c,function(a,c){g+=a+"="+c+"&amp;"});d=u.k.B({movie:a,flashvars:g,allowScriptAccess:"always",allowNetworking:"all"},d);u.k.ua(d,function(a,c){j+='<param name="'+a+'" value="'+c+'" />'});e=u.k.B({data:a,width:"100%",height:"100%"},e);u.k.ua(e,function(a,c){k+=a+'="'+c+'" '});return'<object type="application/x-shockwave-flash"'+k+">"+j+"</object>"};u.f.yd=function(a,c){return a+"&"+c};
u.f.Ac=function(a){var c={rb:"",Ob:""};if(!a)return c;var d=a.indexOf("&"),e;-1!==d?e=d+1:(d=e=a.lastIndexOf("/")+1,0===d&&(d=e=a.length));c.rb=a.substring(0,d);c.Ob=a.substring(e,a.length);return c};u.f.ed=function(a){return a in u.f.Bc};u.f.Qc=/^rtmp[set]?:\/\//i;u.f.dd=function(a){return u.f.Qc.test(a)};
u.Pc=u.c.extend({i:function(a,c,d){u.c.call(this,a,c,d);if(!a.g.sources||0===a.g.sources.length){c=0;for(d=a.g.techOrder;c<d.length;c++){var e=u.$(d[c]),g=window.videojs[e];if(g&&g.isSupported()){I(a,e);break}}}else a.src(a.g.sources)}});function V(a){a.Aa=a.Aa||[];return a.Aa}function W(a,c,d){for(var e=a.Aa,g=0,j=e.length,k,q;g<j;g++)k=e[g],k.id()===c?(k.show(),q=k):d&&(k.J()==d&&0<k.mode())&&k.disable();(c=q?q.J():d?d:l)&&a.j(c+"trackchange")}
u.X=u.c.extend({i:function(a,c){u.c.call(this,a,c);this.Q=c.id||"vjs_"+c.kind+"_"+c.language+"_"+u.t++;this.xc=c.src;this.Wc=c["default"]||c.dflt;this.Ad=c.title;this.Ld=c.srclang;this.fd=c.label;this.fa=[];this.ec=[];this.ga=this.ha=0;this.b.d("fullscreenchange",u.bind(this,this.Rc))}});t=u.X.prototype;t.J=p("A");t.src=p("xc");t.ub=p("Wc");t.title=p("Ad");t.label=p("fd");t.readyState=p("ha");t.mode=p("ga");t.Rc=function(){this.a.style.fontSize=this.b.H?140*(screen.width/this.b.width())+"%":""};
t.e=function(){return u.c.prototype.e.call(this,"div",{className:"vjs-"+this.A+" vjs-text-track"})};t.show=function(){X(this);this.ga=2;u.c.prototype.show.call(this)};t.C=function(){X(this);this.ga=1;u.c.prototype.C.call(this)};t.disable=function(){2==this.ga&&this.C();this.b.o("timeupdate",u.bind(this,this.update,this.Q));this.b.o("ended",u.bind(this,this.reset,this.Q));this.reset();this.b.V.textTrackDisplay.removeChild(this);this.ga=0};
function X(a){0===a.ha&&a.load();0===a.ga&&(a.b.d("timeupdate",u.bind(a,a.update,a.Q)),a.b.d("ended",u.bind(a,a.reset,a.Q)),("captions"===a.A||"subtitles"===a.A)&&a.b.V.textTrackDisplay.Z(a))}t.load=function(){0===this.ha&&(this.ha=1,u.get(this.xc,u.bind(this,this.nd),u.bind(this,this.Gb)))};t.Gb=function(a){this.error=a;this.ha=3;this.j("error")};
t.nd=function(a){var c,d;a=a.split("\n");for(var e="",g=1,j=a.length;g<j;g++)if(e=u.trim(a[g])){-1==e.indexOf("--\x3e")?(c=e,e=u.trim(a[++g])):c=this.fa.length;c={id:c,index:this.fa.length};d=e.split(" --\x3e ");c.startTime=Y(d[0]);c.va=Y(d[1]);for(d=[];a[++g]&&(e=u.trim(a[g]));)d.push(e);c.text=d.join("<br/>");this.fa.push(c)}this.ha=2;this.j("loaded")};
function Y(a){var c=a.split(":");a=0;var d,e,g;3==c.length?(d=c[0],e=c[1],c=c[2]):(d=0,e=c[0],c=c[1]);c=c.split(/\s+/);c=c.splice(0,1)[0];c=c.split(/\.|,/);g=parseFloat(c[1]);c=c[0];a+=3600*parseFloat(d);a+=60*parseFloat(e);a+=parseFloat(c);g&&(a+=g/1E3);return a}
t.update=function(){if(0<this.fa.length){var a=this.b.currentTime();if(this.Lb===b||a<this.Lb||this.Ma<=a){var c=this.fa,d=this.b.duration(),e=0,g=l,j=[],k,q,n,r;a>=this.Ma||this.Ma===b?r=this.wb!==b?this.wb:0:(g=f,r=this.Db!==b?this.Db:c.length-1);for(;;){n=c[r];if(n.va<=a)e=Math.max(e,n.va),n.Ia&&(n.Ia=l);else if(a<n.startTime){if(d=Math.min(d,n.startTime),n.Ia&&(n.Ia=l),!g)break}else g?(j.splice(0,0,n),q===b&&(q=r),k=r):(j.push(n),k===b&&(k=r),q=r),d=Math.min(d,n.va),e=Math.max(e,n.startTime),
n.Ia=f;if(g)if(0===r)break;else r--;else if(r===c.length-1)break;else r++}this.ec=j;this.Ma=d;this.Lb=e;this.wb=k;this.Db=q;a=this.ec;c="";d=0;for(e=a.length;d<e;d++)c+='<span class="vjs-tt-cue">'+a[d].text+"</span>";this.a.innerHTML=c;this.j("cuechange")}}};t.reset=function(){this.Ma=0;this.Lb=this.b.duration();this.Db=this.wb=0};u.Ub=u.X.extend();u.Ub.prototype.A="captions";u.$b=u.X.extend();u.$b.prototype.A="subtitles";u.Vb=u.X.extend();u.Vb.prototype.A="chapters";
u.bc=u.c.extend({i:function(a,c,d){u.c.call(this,a,c,d);if(a.g.tracks&&0<a.g.tracks.length){c=this.b;a=a.g.tracks;var e;for(d=0;d<a.length;d++){e=a[d];var g=c,j=e.kind,k=e.label,q=e.language,n=e;e=g.Aa=g.Aa||[];n=n||{};n.kind=j;n.label=k;n.language=q;j=u.$(j||"subtitles");g=new window.videojs[j+"Track"](g,n);e.push(g)}}}});u.bc.prototype.e=function(){return u.c.prototype.e.call(this,"div",{className:"vjs-text-track-display"})};
u.Y=u.N.extend({i:function(a,c){var d=this.ca=c.track;c.label=d.label();c.selected=d.ub();u.N.call(this,a,c);this.b.d(d.J()+"trackchange",u.bind(this,this.update))}});u.Y.prototype.p=function(){u.N.prototype.p.call(this);W(this.b,this.ca.Q,this.ca.J())};u.Y.prototype.update=function(){this.selected(2==this.ca.mode())};u.bb=u.Y.extend({i:function(a,c){c.track={J:function(){return c.kind},K:a,label:function(){return c.kind+" off"},ub:s(l),mode:s(l)};u.Y.call(this,a,c);this.selected(f)}});
u.bb.prototype.p=function(){u.Y.prototype.p.call(this);W(this.b,this.ca.Q,this.ca.J())};u.bb.prototype.update=function(){for(var a=V(this.b),c=0,d=a.length,e,g=f;c<d;c++)e=a[c],e.J()==this.ca.J()&&2==e.mode()&&(g=l);this.selected(g)};u.S=u.R.extend({i:function(a,c){u.R.call(this,a,c);1>=this.I.length&&this.C()}});u.S.prototype.ta=function(){var a=[],c;a.push(new u.bb(this.b,{kind:this.A}));for(var d=0;d<V(this.b).length;d++)c=V(this.b)[d],c.J()===this.A&&a.push(new u.Y(this.b,{track:c}));return a};
u.Da=u.S.extend({i:function(a,c,d){u.S.call(this,a,c,d);this.a.setAttribute("aria-label","Captions Menu")}});u.Da.prototype.A="captions";u.Da.prototype.qa="Captions";u.Da.prototype.className="vjs-captions-button";u.Ha=u.S.extend({i:function(a,c,d){u.S.call(this,a,c,d);this.a.setAttribute("aria-label","Subtitles Menu")}});u.Ha.prototype.A="subtitles";u.Ha.prototype.qa="Subtitles";u.Ha.prototype.className="vjs-subtitles-button";
u.Ea=u.S.extend({i:function(a,c,d){u.S.call(this,a,c,d);this.a.setAttribute("aria-label","Chapters Menu")}});t=u.Ea.prototype;t.A="chapters";t.qa="Chapters";t.className="vjs-chapters-button";t.ta=function(){for(var a=[],c,d=0;d<V(this.b).length;d++)c=V(this.b)[d],c.J()===this.A&&a.push(new u.Y(this.b,{track:c}));return a};
t.Ka=function(){for(var a=V(this.b),c=0,d=a.length,e,g,j=this.I=[];c<d;c++)if(e=a[c],e.J()==this.A&&e.ub()){if(2>e.readyState()){this.Id=e;e.d("loaded",u.bind(this,this.Ka));return}g=e;break}a=this.wa=new u.ma(this.b);a.a.appendChild(u.e("li",{className:"vjs-menu-title",innerHTML:u.$(this.A),zd:-1}));if(g){e=g.fa;for(var k,c=0,d=e.length;c<d;c++)k=e[c],k=new u.Xa(this.b,{track:g,cue:k}),j.push(k),a.Z(k)}0<this.I.length&&this.show();return a};
u.Xa=u.N.extend({i:function(a,c){var d=this.ca=c.track,e=this.cue=c.cue,g=a.currentTime();c.label=e.text;c.selected=e.startTime<=g&&g<e.va;u.N.call(this,a,c);d.d("cuechange",u.bind(this,this.update))}});u.Xa.prototype.p=function(){u.N.prototype.p.call(this);this.b.currentTime(this.cue.startTime);this.update(this.cue.startTime)};u.Xa.prototype.update=function(){var a=this.cue,c=this.b.currentTime();this.selected(a.startTime<=c&&c<a.va)};
u.k.B(u.Fa.prototype.g.children,{subtitlesButton:{},captionsButton:{},chaptersButton:{}});
if("undefined"!==typeof window.JSON&&"function"===window.JSON.parse)u.JSON=window.JSON;else{u.JSON={};var Z=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;u.JSON.parse=function(a,c){function d(a,e){var k,q,n=a[e];if(n&&"object"===typeof n)for(k in n)Object.prototype.hasOwnProperty.call(n,k)&&(q=d(n,k),q!==b?n[k]=q:delete n[k]);return c.call(a,e,n)}var e;a=String(a);Z.lastIndex=0;Z.test(a)&&(a=a.replace(Z,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));
if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return e=eval("("+a+")"),"function"===typeof c?d({"":e},""):e;throw new SyntaxError("JSON.parse(): invalid or malformed JSON data");}}
u.fc=function(){var a,c,d=document.getElementsByTagName("video");if(d&&0<d.length)for(var e=0,g=d.length;e<g;e++)if((c=d[e])&&c.getAttribute)c.player===b&&(a=c.getAttribute("data-setup"),a!==h&&(a=u.JSON.parse(a||"{}"),v(c,a)));else{u.kb();break}else u.Ec||u.kb()};u.kb=function(){setTimeout(u.fc,1)};"complete"===document.readyState?u.Ec=f:u.U(window,"load",function(){u.Ec=f});u.kb();u.od=function(a,c){u.s.prototype[a]=c};var ga=this;ga.Ed=f;function $(a,c){var d=a.split("."),e=ga;!(d[0]in e)&&e.execScript&&e.execScript("var "+d[0]);for(var g;d.length&&(g=d.shift());)!d.length&&c!==b?e[g]=c:e=e[g]?e[g]:e[g]={}};$("videojs",u);$("_V_",u);$("videojs.options",u.options);$("videojs.players",u.xa);$("videojs.TOUCH_ENABLED",u.ac);$("videojs.cache",u.ra);$("videojs.Component",u.c);u.c.prototype.player=u.c.prototype.K;u.c.prototype.dispose=u.c.prototype.D;u.c.prototype.createEl=u.c.prototype.e;u.c.prototype.el=u.c.prototype.w;u.c.prototype.addChild=u.c.prototype.Z;u.c.prototype.children=u.c.prototype.children;u.c.prototype.on=u.c.prototype.d;u.c.prototype.off=u.c.prototype.o;u.c.prototype.one=u.c.prototype.U;
u.c.prototype.trigger=u.c.prototype.j;u.c.prototype.triggerReady=u.c.prototype.Ua;u.c.prototype.show=u.c.prototype.show;u.c.prototype.hide=u.c.prototype.C;u.c.prototype.width=u.c.prototype.width;u.c.prototype.height=u.c.prototype.height;u.c.prototype.dimensions=u.c.prototype.Xc;u.c.prototype.ready=u.c.prototype.L;u.c.prototype.addClass=u.c.prototype.n;u.c.prototype.removeClass=u.c.prototype.u;$("videojs.Player",u.s);u.s.prototype.dispose=u.s.prototype.D;u.s.prototype.requestFullScreen=u.s.prototype.ya;
u.s.prototype.cancelFullScreen=u.s.prototype.ob;u.s.prototype.bufferedPercent=u.s.prototype.Ja;u.s.prototype.usingNativeControls=u.s.prototype.Rb;u.s.prototype.reportUserActivity=u.s.prototype.Mb;u.s.prototype.userActive=u.s.prototype.ja;$("videojs.MediaLoader",u.Pc);$("videojs.TextTrackDisplay",u.bc);$("videojs.ControlBar",u.Fa);$("videojs.Button",u.q);$("videojs.PlayToggle",u.Yb);$("videojs.FullscreenToggle",u.Ga);$("videojs.BigPlayButton",u.Wa);$("videojs.LoadingSpinner",u.Wb);
$("videojs.CurrentTimeDisplay",u.Ya);$("videojs.DurationDisplay",u.Za);$("videojs.TimeDivider",u.cc);$("videojs.RemainingTimeDisplay",u.fb);$("videojs.Slider",u.O);$("videojs.ProgressControl",u.eb);$("videojs.SeekBar",u.Zb);$("videojs.LoadProgressBar",u.ab);$("videojs.PlayProgressBar",u.Xb);$("videojs.SeekHandle",u.gb);$("videojs.VolumeControl",u.ib);$("videojs.VolumeBar",u.hb);$("videojs.VolumeLevel",u.dc);$("videojs.VolumeMenuButton",u.oa);$("videojs.VolumeHandle",u.jb);$("videojs.MuteToggle",u.da);
$("videojs.PosterImage",u.cb);$("videojs.Menu",u.ma);$("videojs.MenuItem",u.N);$("videojs.MenuButton",u.R);u.R.prototype.createItems=u.R.prototype.ta;u.S.prototype.createItems=u.S.prototype.ta;u.Ea.prototype.createItems=u.Ea.prototype.ta;$("videojs.SubtitlesButton",u.Ha);$("videojs.CaptionsButton",u.Da);$("videojs.ChaptersButton",u.Ea);$("videojs.MediaTechController",u.r);u.r.prototype.features=u.r.prototype.m;u.r.prototype.m.volumeControl=u.r.prototype.m.Dc;u.r.prototype.m.fullscreenResize=u.r.prototype.m.Jd;
u.r.prototype.m.progressEvents=u.r.prototype.m.Nd;u.r.prototype.m.timeupdateEvents=u.r.prototype.m.Sd;$("videojs.Html5",u.l);u.l.Events=u.l.$a;u.l.isSupported=u.l.isSupported;u.l.canPlaySource=u.l.mb;u.l.prototype.setCurrentTime=u.l.prototype.sd;u.l.prototype.setVolume=u.l.prototype.xd;u.l.prototype.setMuted=u.l.prototype.vd;u.l.prototype.setPreload=u.l.prototype.wd;u.l.prototype.setAutoplay=u.l.prototype.rd;u.l.prototype.setLoop=u.l.prototype.ud;$("videojs.Flash",u.f);u.f.isSupported=u.f.isSupported;
u.f.canPlaySource=u.f.mb;u.f.onReady=u.f.onReady;$("videojs.TextTrack",u.X);u.X.prototype.label=u.X.prototype.label;$("videojs.CaptionsTrack",u.Ub);$("videojs.SubtitlesTrack",u.$b);$("videojs.ChaptersTrack",u.Vb);$("videojs.autoSetup",u.fc);$("videojs.plugin",u.od);$("videojs.createTimeRange",u.tb);})();

;
