$(function(){
    websis.setup({key: 'default'});
});

var SbWebsis = function(divId,flexWrapper,data)
{
  var validCtrls   = [ "navigation", "content", "scalebar", "resize", "copyright","objects","adresss" ];
  var websisCtrls  = [ "navigation", "content", "scalebar", "resize", "copyright" ];

  // marker hinzufuegen
  var addMarker = function(options)
  {
    var marker = new websis.graphic.Marker({
       id: options.id
      ,name: typeof(options.info) != 'undefined' && typeof(options.info.header)  != 'undefined' ? options.info.header  : options.name
      ,style: {
         width:  32
        ,height: 32
        ,cursor: 'pointer'
        ,src: options.src
      }
      ,shape: {
         x: options.pos.x
        ,y: options.pos.y
      }
      ,visible:true
      ,events: {
         click: function(e, it) {
           var markerTip = new websis.info.Window({
             id:'Info_'+options.id
            ,header:  typeof(options.info) != 'undefined' && typeof(options.info.header)  != 'undefined' ? options.info.header  : options.name
            ,content: typeof(options.info) != 'undefined' && typeof(options.info.longText) != 'undefined' ? options.info.longText : ''
            ,opacity:0.8
            ,position: {x:'middle',y:'middle'}
          });
          map.addInfo(markerTip);

          e.stopPropagation();
        }


      }
    });
    map.addGraphic(marker);
  }



  var options = {
     id: divId
    ,events: {
      loaded: function(e,it){

        // marker setzen
        if(data.markers.length>0) {
          $.each(data.markers, function(i,m){
            addMarker(m);
          });
        }



        //services (Karten) inititalisieren
        it.services.each(function(id, s) {
          s.events.show = null;
          //s.events.hide = null;
          if(data.services && id!='default' && data.services[id] && s.map) {
              s.show();
          }
        });


        // Adress-Suche anzeigen // FIXME: prefs-checkbox ist auskommentiert.
        // Schaltflaeche und Suchformular muessen von hand gebaut werden!?
        if($.inArray('address',data.controls)>-1) {
          var Search = new SbWebsis.AddressSearch(it,flexWrapper);
          Search.add();
        }

      }
    }
  }

  try {
    // position und zoomlevel
    options.level  = data.map.level
    options.center = {
       x: data.map.center.x
      ,y: data.map.center.y
    }
    // controls einblenden
    if(data.controls.length>0) {
      options.controls = [];
      $.each(data.controls,function(i,v){
        $.inArray(v,websisCtrls)>-1 ? options.controls.push(v) : null;
      });
    }

  } catch(e){
    //alert('keine MapDaten geladen').
  }

  var map = new websis.map.Map(options);
}



SbWebsis.AddressSearch = function(map,flexWrapper)
{
  var jFlexWrapper  = $(flexWrapper);
  var jMapTemplates = $('#SbWebsisMapResources');
  var jButton, searchWin;
  var that = this;

  this.map = map;

  this.add = function(){

    $('.ws_map_controls',jFlexWrapper).append($('.addressSearch .button',jMapTemplates).html());
    jButton = $( '.ws_adresssearch_content',$('.ws_map_controls',jFlexWrapper));

    //init button
    jButton.bind('click',function(){

      if(typeof(searchWin)!='undefined'){
        isVisible = $(searchWin.div).parent().is(':visible');
        searchWin.remove();
        searchWin = undefined; //FIXME

        if(!isVisible) {
          newWin();
        }

      } else {
          newWin();
      }
    });

    var newWin = function()
    {
      // Searchwindow
      searchWin = new websis.info.Window({
         header: 'Strassensuche'
        ,content: $('.addressSearch div.searchForm',jMapTemplates).html()
        ,opacity:0.8
        ,position: {x:'middle',y:'middle'}
      });
      that.map.addInfo(searchWin);

      // button suche abschicken
      var jForm = $('.searchForm',searchWin.div[0]);
      $('input.searchSubmit',jForm).bind('click', function(e){
        e.stopPropagation();
        that.search($('.searchKw',jForm).val());
        return false;
      });
    }
  }

  this.remove = function(){
    var jLayerControls = $('.ws_map_controls',jFlexWrapper);
    $('.ws_adresssearch_content',jLayerControls).remove();
    searchWin.remove();
    searchWin = undefined; //FIXME
  }



  // Adresssuche
  // ----------------------------------------------
  this.search = function(kw)
  {
    // Suchobject
    var a = new websis.address.Address({
      i18n: 'de'
    });

    //Beispiel: Suche nach Strassennamen abschicken
    a.findStreets({name:kw,success:function(result,size){

      // eindeutiges ergebnis direkt anzeigen
      if(size==1) {
       that.showResult(result[0]);

      // mehrere ergebnisse auflisten
      } else if(size>1) {
        var jList = $('ul.searchResult',searchWin.div[0]);
        var lis = '';
        var i=0;
        $.each(result,function(i,v){
          lis += '<li><a class="resultItem" data-count="'+i+'">'+v.name+'</a></li>';
        });
        jList.html(lis);
        jList.fadeIn();
        $('.resultItem',jList).bind('click',function() {
          that.showResult(result[$(this).attr('data-count')]);
        });

      // nichts gefunden
      } else {
          $('p.noResultMsg',searchWin.div[0]).show();
      }

    }});

  }

  this.showResult = function (result)
  {
    // gefundene Strasse markieren
    //map.addAddress(result);

    var m = new websis.graphic.Image({
       id:'Str'+ new Date().getTime()
      ,name: result.name
      ,style: {
         width:  50
        ,height: 50
        ,cursor: 'pointer'
        ,src: result.style.src
      }
      ,shape: result.shape
      ,events: result.events

    });
    that.map.addGraphic(m);

    that.map.zoomTo({
       x: result.shape.x
      ,y: result.shape.y
      ,level:5
    });

    // Fenster schliessen
    searchWin.remove()
    searchWin = undefined;
  }

}