var _EQLService=_EQLService||{},_EQPScript=_EQPScript||{};
(function(h,k){(function(a){var f=a.Exception=a.Exception||{},d=Math.random(),e=[],g=function(c){a.Dom.appendScript(a.Bugsnag_Config.source,!0,function(){var b=Bugsnag.noConflict();b.apiKey=a.Bugsnag_Config.apiKey;b.appVersion=a.Bugsnag_Config.appVersion;b.releaseStage=a.Bugsnag_Config.releaseStage;b.autoNotify=a.Bugsnag_Config.autoNotify;b.metaData=a.Bugsnag_Config.metaData;b.user=a.Bugsnag_Config.user;b.beforeNotify=function(a,b){var c=b.signature==d;delete b.signature;return c};c(b)})};f.notifyException=
function(c){a.Bugsnag?a.Bugsnag.notifyException(c,{signature:d}):(e.push(c),1>=e.length&&g(function(b){a.Bugsnag=b;for(b=0;b<e.length;b++)f.notifyException(e[b])}))}})(h);(function(a){(a.Dom=a.Dom||{}).appendScript=function(a,d,e){d="undefined"==typeof d||!0;var g=document.getElementsByTagName("script")[0],c=document.createElement("script");/^(http:|https:)?\/\//.test(a)?c.src=a:c.text=a;c.async=d;c.onload=e;g.parentNode.insertBefore(c,g)}})(h);(function(a){a.Bugsnag_Config={source:"//assets3.finanzen.net/t-Z_D2uuO9gPTwDGrrNyT4IOGz6bEb2oTca/426rC5E_Dh1j1TGLDfatlWTVlqWpqQ",
apiKey:"3c7eeb3fb2634285916be032b1ecf4ce",appVersion:"0.1.0",releaseStage:"prod",autoNotify:!1,metaData:{request:{clientIp:"0.0.0.0"}},user:{id:"n/a"}};a.main=function(){try{k.sourceId=49351,a.Dom.appendScript("//assets3.finanzen.net/gD3o5pGKadJQ5YRm1IMxw/N2O_8IByCwgf/limzX08KbIMwxj314vxy/jOk0iXqqFs4sIbU/wOx4APANMCVxN6I8bDg")}catch(f){try{a.Exception.notifyException(f)}catch(d){}}}})(h)})(_EQLService,_EQPScript);_EQLService.main();