/*! 0.1.9 */var _EQPScript=_EQPScript||{};!function(a){!function(a){var b=a.Common=a.Common||{};b.mergeObjects=function(){for(var a={},b=0;b<arguments.length;b++){var c=arguments[b];for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}return a},b.cloneObject=b.mergeObjects,b.byteLength=function(a){for(var b=0,c=0;c<a.length;c++){var d=a.charCodeAt(c);b+=d<=127?1:d<=2047?2:3}return b}}(a),function(a){var b=a.Dom=a.Dom||{};b.appendScript=function(a,b,c){b="undefined"==typeof b||b;var d=document.getElementsByTagName("script")[0],e=document.createElement("script");/^(http:|https:)?\/\//.test(a)?e.src=a:e.textContent=a,e.async=b,e.onload=c,d.parentNode.insertBefore(e,d)}}(a),function(a){function b(b){a.Dom.appendScript(a.Bugsnag_Config.source,!0,function(){var c=Bugsnag.noConflict();c.apiKey=a.Bugsnag_Config.apiKey,c.appVersion=a.Bugsnag_Config.appVersion,c.releaseStage=a.Bugsnag_Config.releaseStage,c.autoNotify=a.Bugsnag_Config.autoNotify,c.metaData=a.Bugsnag_Config.metaData,c.user=a.Bugsnag_Config.user,c.beforeNotify=function(a){return!/\[unknown]$/.test(a.stacktrace)},b(c)})}var c=a.Exception=a.Exception||{},d=[];c.notifyException=function(e){a.Bugsnag?a.Bugsnag.notifyException(e):(d.push(e),d.length<=1&&b(function(b){a.Bugsnag=b;for(var e=0;e<d.length;e++){var f=d[e];c.notifyException(f)}}))}}(a),function(a){function b(){return Math.floor(1e12*Math.random())}function c(a){var b="";for(var c in a)a.hasOwnProperty(c)&&(b+=encodeURIComponent(c)+"="+encodeURIComponent(a[c])+"&");return b.substr(0,b.length-1)}function d(a){try{for(var b=window.top.document.getElementsByTagName("meta"),c=0;c<b.length;c++){var d=b[c];if(d.getAttribute("name")===a)return d.getAttribute("content")}return"Not available"}catch(e){return"Not accessible"}}function e(){var a={};return j.title&&(a.title=document.title),j.referrer&&window.document.referrer&&(a.referrer=window.document.referrer),j.hostSiteUrl&&(a.hostSiteUrl=window.location.href),j.description&&(a.description=d("description")),j.keywords&&(a.keywords=d("keywords")),a}function f(){var a={};return k.userAgent&&(a.userAgent=window.navigator.appVersion),k.userLang&&(a.userLang=navigator.language),k.color&&(a.color=window.screen.colorDepth),k.os&&(a.os=window.navigator.platform),k.timezone&&(a.timezone=(new Date).getTimezoneOffset()/60),k.screen&&(a.screen=window.screen.availHeight+"x"+window.screen.availWidth),a}function g(){var a={};return"function"==typeof DM_prepClient&&DM_prepClient("no id",{DM_addEncToLoc:function(b,c){a[b]=c},DM_setLoc:function(){}}),a}function h(){var a=window._enqAdpParam||{};return a.event_id||(a.event_id="page_view"),a}var i=a.Profiling=a.Profiling||{},j={title:!0,description:!1,keywords:!1,hostSiteUrl:!0,referrer:!0},k={userAgent:!0,userLang:!0,color:!0,os:!0,timezone:!0,screen:!0};i.sendParametersToProfilingService=function(d){var e=a.Profiling_Config,f=a.Common,g=a.Dom;d=f.cloneObject(d),d._sid=e.sourceId,d._ver=e.version,d._seg="jsonp",d._=b();var h=c(d),i=e.endpoint+"?"+h;f.byteLength(i)>4096&&(delete d.metaData,h=c(d),i=e.endpoint+"?"+h),g.appendScript(i)},i.createProfilingParameters=function(){return a.Common.mergeObjects(g(),e(),f(),h())},i.run=function(){if(!a.executed){a.executed=!0;var b=i.createProfilingParameters();i.sendParametersToProfilingService(b)}}}(a),function(a){a.Profiling_Config={version:"0.1.9",endpoint:"https://assets3.finanzen.net/lkPhD9Me8SrAY-ESCGJJA/EXF8lybjCfZxVg",sourceId:a.sourceId},a.Bugsnag_Config={source:"//assets3.finanzen.net/jGlyTvCISmCsxxro5yx_Bqwix-U5wRntMFL/P8Rxjv3ovNvCdnEa6_1hbkS4JWXbsA",apiKey:"374ce375ce0b6cbbd97f767cdac1c945",appVersion:"0.1.9",releaseStage:"production",autoNotify:!1,metaData:{request:{clientIp:"0.0.0.0"}},user:{id:"n/a",sourceId:a.Profiling_Config.sourceId}},a.main=function(){try{if(!a.Profiling_Config.sourceId)return;a.Profiling.run()}catch(b){try{a.Exception.notifyException(b)}catch(c){}}}}(a)}(_EQPScript),_EQPScript.main();