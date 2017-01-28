var epoq_versionMarker = "2.6.1-29.08.2016";
var epoq_host = 'http://rs1.epoq.de/inbound-servletapi/';
var epoq_secureHost = 'https://rs1.epoq.de/inbound-servletapi/';
if (window.location.protocol == "https:"){epoq_host = epoq_secureHost; epoq_secure=1};

var epoq_functionParams = '';
var epoq_itemParams = '';
var epoq_cs='';
var epoq_blockCatalogUpdate = false;
if(typeof window.eqrecqidAlreadyUsed === "undefined" ) window.eqrecqidAlreadyUsed = false;

var epoq_productIds = new Array();
var epoq_quantities = new Array();
var epoq_unitPrices = new Array();
var epoq_sizes = new Array();
var epoq_variantOfList = new Array();
var lastCart = null;

var epoq_filter = new Array();

var epoq_insertElements = new Array();
var epoq_insertElementsMarker = new Array();

var epoq_attributes = new Object();
var epoq_restParameter = new Object();
var epoq_viewItemTriggered = null;


//var epoq_localhistory=true;epoq_tag=true;

function epoq_executeFunction()
{
	
	if(epoq_getcl("no-epoq").length > 0)
	{
		//do not send
		return;
	}
	
	if (window.location.protocol == "https:"){epoq_host = epoq_secureHost; epoq_secure=1}
	
	if(typeof(epoq_tag) != "undefined" && epoq_tag){epoq_host=epoq_host.replace("rs1", epoq_tenantId + ".arc");}
	
	var host = epoq_host;
	if(epoq_function.indexOf("http")==0)host="";

	var head = document.getElementsByTagName('head')[0];
	script = document.createElement('script');
	script.className = 'epoq_ExecutorScript_'+epoq_function; 
	script.type = 'text/javascript';
	script.src = host + epoq_function + '?' + epoq_functionParams;
	head.appendChild(script);
	//script.parentNode.removeChild(script)
}

function epoq_executeFunctionInPlace()
{
	epoq_functionParams = epoq_functionParams.replace(/'/g,"%5C%27"); 
	//epoq_functionParams = epoq_functionParams.replace("/%20d/g","");

	document.write("" + "<script type='text/javascript' src = '" + epoq_host + epoq_function + "?" + epoq_functionParams + "'></script>" + "");
}

function getEpoq_sessionId()
{
	if((urlparam = epoq_getURLParam('epq_sid')).length > 0)
	{
		epoq_sessionId=urlparam; //url overrides value +vw
	}
	
	if (typeof(epoq_sessionId) == "undefined" || epoq_sessionId ==null || epoq_sessionId.length ==0)
	{
		epoq_sessionId = epoq_getcl("eqsid_");
		if(epoq_sessionId.length > 0)
		{
			epoq_sessionId = epoq_getcl("eqsid_")[0].value;
		}
		else
		{
			epoq_sessionId = "eqsid_" + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}
	}
	epoq_setcl("eqsid_", epoq_sessionId, 0, "/");
	
	return epoq_sessionId;
}


function epoq_readAllParams()
{
	epoq_functionParams = '';
	
	epoq_sessionId = getEpoq_sessionId();
	
	

	if (typeof(epoq_tenantId) != "undefined")epoq_functionParams += "tenantId=" + encodeURIComponent(epoq_tenantId) + "&";
	if (typeof(epoq_customerId) != "undefined")epoq_functionParams += "customerId=" + encodeURIComponent(epoq_customerId) + "&";
	if (typeof(epoq_sessionId) != "undefined")epoq_functionParams += "sessionId=" + encodeURIComponent(epoq_sessionId) + "&";
	if (typeof(epoq_demo) != "undefined")epoq_functionParams += "demo=" + encodeURIComponent(epoq_demo) + "&";
	if (typeof(epoq_testcall) != "undefined")epoq_functionParams += "testcall="  + encodeURIComponent(epoq_testcall) + "&";
	if (typeof(epoq_orderId) != "undefined")epoq_functionParams += "orderId="  + encodeURIComponent(epoq_orderId) + "&";
	if (typeof(epoq_orderid) != "undefined")epoq_functionParams += "orderId="  + encodeURIComponent(epoq_orderid) + "&";
	



	//item
	if(epoq_function != 'updateCart' && epoq_function != 'processCart') //exclude mixed pages
	{
		if (typeof(epoq_productId) != "undefined")epoq_functionParams += "productId=" + encodeURIComponent(epoq_productId) + "&";
		if (typeof(epoq_quantity) != "undefined")epoq_functionParams += "quantity=" + encodeURIComponent(epoq_quantity) + "&";
		if (typeof(epoq_unitPrice) != "undefined")epoq_functionParams += "unitPrice=" + encodeURIComponent(epoq_unitPrice) + "&";
		if (typeof(epoq_variantOf) != "undefined")epoq_functionParams += "variantOf=" + encodeURIComponent(epoq_variantOf) + "&";
		if (typeof(epoq_size) != "undefined")epoq_functionParams += "size=" + encodeURIComponent(epoq_size) + "&";
	}


	//if (typeof(epoq_title) != "undefined")epoq_functionParams += "title=" + encodeURIComponent(epoq_title) + "&";

	if (typeof(epoq_params) != "undefined")epoq_functionParams += "params=" + encodeURIComponent(epoq_params) + "&";
	
	//items
	for ( var i=0, len=epoq_productIds.length; i<len; ++i )
	{
		epoq_functionParams += 'productId=' + encodeURIComponent(epoq_productIds[i]) + '&';
	}
	for ( var i=0, len=epoq_productIds.length; i<len; ++i )
	{
		epoq_functionParams += 'quantity=' + encodeURIComponent(epoq_quantities[i]) + '&';
	}
	for ( var i=0, len=epoq_productIds.length; i<len; ++i )
	{
		epoq_functionParams += 'unitPrice=' + encodeURIComponent(epoq_unitPrices[i]) + '&';
	}
	for ( var i=0, len=epoq_filter.length; i<len; ++i )
	{
		epoq_functionParams += 'filter=' + encodeURIComponent(epoq_filter[i]) + '&';
	}
	for ( var i=0, len=epoq_productIds.length; i<len; ++i )
	{
		if (typeof(epoq_variantOfList[i]) != "undefined")
		{
			epoq_functionParams += 'variantOf=' + encodeURIComponent(epoq_variantOfList[i]+'') + '&';
		}	
		else
		{
			epoq_functionParams += 'variantOf&';
		}
	}
	for ( var i=0, len=epoq_productIds.length; i<len; ++i )
	{
		if (typeof(epoq_sizes[i]) != "undefined")
		{
			epoq_functionParams += 'size=' + encodeURIComponent(epoq_sizes[i]+'') + '&';
		}	
		else
		{
			epoq_functionParams += 'size&';
		}
	}

	if (typeof(epoq_widgetRows) != "undefined")epoq_functionParams += "widgetRows=" + encodeURIComponent(epoq_widgetRows) + "&";
	if (typeof(epoq_widgetTheme) != "undefined")epoq_functionParams += "widgetTheme=" + encodeURIComponent(epoq_widgetTheme) + "&"
	if (typeof(epoq_widgetHeadline) != "undefined")epoq_functionParams += "widgetHeadline=" + encodeURIComponent(epoq_widgetHeadline) + "&";
	if (typeof(epoq_widgetCols) != "undefined")epoq_functionParams += "widgetCols=" + encodeURIComponent(epoq_widgetCols) + "&";

	//this is flagged for removing 30.1.2015 by sk
/*

	if (typeof(epoq_widgetWidth) != "undefined")epoq_functionParams += "widgetWidth=" + encodeURIComponent(epoq_widgetWidth) + "&";
	if (typeof(epoq_widgetCurrency) != "undefined")epoq_functionParams += "widgetCurrency=" + encodeURIComponent(epoq_widgetCurrency) + "&";
	if (typeof(epoq_widgetCurrencyPosition) != "undefined")epoq_functionParams += "widgetCurrencyPosition=" + encodeURIComponent(epoq_widgetCurrencyPosition) + "&";
	if (typeof(epoq_widgetSmallImageMaxHeight) != "undefined")epoq_functionParams += "widgetSmallImageMaxHeight=" + encodeURIComponent(epoq_widgetSmallImageMaxHeight) + "&";
	*/
	//flaged for removal 2016-01-25
	if (typeof(epoq_rules) != "undefined")epoq_functionParams += "rules=" + encodeURIComponent(epoq_rules) + "&";

	if (typeof(epoq_secure) != "undefined")epoq_functionParams += "secure=" + encodeURIComponent(epoq_secure) + "&";
	if (typeof(epoq_writeToDocument) != "undefined")epoq_functionParams += "writeToDocument=" + encodeURIComponent(epoq_writeToDocument) + "&";
	
	for(restParameter in epoq_restParameter)
	{
		epoq_functionParams +=encodeURIComponent('__era' + restParameter) + '=' + encodeURIComponent(epoq_restParameter[restParameter]) +  '&';
	}
	
	if (typeof(epoq_locakey) != "undefined")epoq_functionParams += "locakey=" + encodeURIComponent(epoq_locakey) + "&";
	if (typeof(epoq_recommendationId) 	!= "undefined"){epoq_functionParams += "recommendationId=" + encodeURIComponent(epoq_recommendationId) + "&";}
	
	var urlparam;
	if ((urlparam = epoq_getURLParam('eRecommendationId')).length > 0) epoq_functionParams += "eRecommendationId=" + encodeURIComponent(urlparam) + "&"; //manakin
	if ((urlparam = epoq_getURLParam('eqrecqid')).length > 0 && !eqrecqidAlreadyUsed) 
	{
		eqrecqidAlreadyUsed = true;
		epoq_functionParams += "recommendationId=" + encodeURIComponent(urlparam) + "&"; //directfromurl
	}
	if ((urlparam = epoq_getURLParam('eqd')).length > 0) epoq_functionParams += "eqd=" + urlparam + "&"; //add.data
	if ((urlparam = epoq_getURLParam('eqrule')).length > 0) epoq_functionParams += "eqrule=" + urlparam + "&"; 
	
	
	if ((urlparam = epoq_getURLParam('utm_term')).length > 0 && urlparam=="empfehlungen") //xlcl
	{
		epoq_functionParams += "eRecommendationExId=" + urlparam + "&";
	}
	
	if ((urlparam = epoq_getURLParam('bm_rid')).length > 0)  //optivo
	{
		epoq_functionParams += "eRecommendationExId=" + urlparam + "&";
	}
	
	if ((urlparam = epoq_getURLParam('emst')).length > 0) //emarsys
	{
		urlparam = urlparam.split("_",1);
		epoq_functionParams += "eqmi=" + urlparam + "&";
	}else if ((urlparam = epoq_getURLParam('eqmi')).length > 0) 
	{
		epoq_functionParams += "eqmi=" + urlparam + "&";
	}
	//else if ((urlparam = epoq_getURLParam('bm_mid')).length > 0) //optivo
	//{
	//	epoq_functionParams += "eqmi=" + urlparam + "&";
	//}
	else if ((urlparam = epoq_getURLParam('o_cid')).length > 0) //optivo sp
	{
		epoq_functionParams += "eqmi=" + urlparam + "&";
	}
	
	
	if(document.referrer.length > 0)epoq_functionParams += "referrer=" + encodeURIComponent(document.referrer) + "&";
	
	lastCart = {productIds: epoq_productIds, quantities:epoq_quantities, unitPrices:epoq_unitPrices, sizes:epoq_sizes, variantOfList:epoq_variantOfList};
	//reset for possible second call
	epoq_productIds = new Array();
	epoq_quantities = new Array();
	epoq_unitPrices = new Array();
	epoq_sizes = new Array();
	epoq_variantOfList = new Array();
	
}

	
function epoq_getRecommendationsForCart()
{
	epoq_function ='getRecommendationsForCart';
	epoq_readAllParams();
	epoq_executeFunctionInPlace();;
}

function epoq_getRecommendationsForCustomer()
{
	epoq_function ='getRecommendationsForCustomer';
	epoq_readAllParams();
	epoq_executeFunctionInPlace();
}

function epoq_getRecommendationsForItem()
{
	epoq_function ='getRecommendationsForItem';
	epoq_readAllParams();
	if (typeof(epoq_writeToDocument) == "undefined")epoq_executeFunctionInPlace();
	else epoq_executeFunction();
}

function epoq_processCart()
{
	epoq_function ='processCart';
	epoq_readAllParams();
	epoq_getc();
	epoq_executeFunction();
}

function epoq_removeItem()
{
	epoq_function ='removeItem';
	epoq_readAllParams();
	epoq_executeFunction();
}

function epoq_updateCart()
{
	epoq_function ='updateCart';
	epoq_readAllParams();
	epoq_getc();
	epoq_executeFunction();
}


function epoq_readCatalogParams()
{
	//this should not be called!
}

function epoq_viewItem()
{
	epoq_viewItemTriggered = true;
	epoq_function ='viewItem';
	//epoq_readCatalogParams();
	epoq_readAllParams();	
	epoq_getc();
	epoq_functionParams += 'c=' + epoq_c(epoq_cs) + '&';
	epoq_executeFunction();

}

function epoq_insertItem()
{
	epoq_function ='insertItem';
	epoq_readAllParams();
	epoq_executeFunction();
}




function epoq_search()
{
	epoq_function = 'search';
	epoq_readAllParams();
	epoq_executeFunction();
}

function epoq_updateCatalog()
{
	if(epoq_blockCatalogUpdate)return;
	
	epoq_function ='updateCatalog';
	epoq_functionParams = epoq_itemParams;
	if (typeof(epoq_locakey) != "undefined")epoq_functionParams += "locakey=" + encodeURIComponent(epoq_locakey) + "&";
	epoq_functionParams += 'c=' + epoq_c(epoq_cs) + '&';
	
	
	epoq_executeFunction();

}


function epoq_indexInArray(arr,val)
{
	for(var i=0;i<arr.length;i++) if(arr[i]==val) return i;
	return -1;
}


function  epoq_onImgErrorSmall(source)
{
	if(source!=null)
	{
		source.style.display = 'none';
		// disable onerror to prevent endless loop
		source.onerror = '';
	}
	return true;
}






(function() { 
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";     
 
    /* Number */ 
    epoq_c = function( /* String */ str, /* Number */ crc ) { 
        if( crc == window.undefined ) crc = 0; 
        var n = 0; //a number between 0 and 255 
        var x = 0; //an hex number 
 
        crc = crc ^ (-1); 
        for( var i = 0, iTop = str.length; i < iTop; i++ ) { 
            n = ( crc ^ str.charCodeAt( i ) ) & 0xFF; 
            x = "0x" + table.substr( n * 9, 8 ); 
            crc = ( crc >>> 8 ) ^ x; 
        } 
        return crc ^ (-1); 
    }; 
})();




function epoq_iii()
{
}

function epoq_iiiV2()
{
	if(typeof(epoq_tenantId) 	== "undefined")return;
	epoq_function = 'resources/iii.js';
	epoq_functionParams='tenantId='+epoq_tenantId+'&';
	//optional epoq_sessionId = getEpoq_sessionId(); for slb
	epoq_executeFunction();
}


function epoq_getRecommendationsForItemWithCallback()
{
	epoq_writeToDocument = 0;
	epoq_getRecommendationsForItem();
}

function epoq_genericEvent(parameter)
{
	if(typeof(parameter)==="object")
	{
		epoq_function = 'event';
		
		if(typeof(parameter.eventType)!="undefined" && parameter.eventType === 'userId')
		{
			epoq_readAllParams();
			epoq_functionParams += 'type=userId&';
			epoq_executeFunction();
		}
	
	}
}

function epoq_getURLParam(strParamName) {
	var strReturn = "";
	var strHref = ""
	try {
		try {
			strHref = parent.location.href;
		} catch (e) {
			
		}
		
		if(strHref.length==0)
		{
			try {
				strHref = location.href;
			} catch (e) {
	
			}
		}
		
		if (strHref.indexOf("?") > -1) {
			var strQueryString = strHref.substr(strHref.indexOf("?"));
			var aQueryString = strQueryString.split("&");
			for ( var iParam = 0; iParam < aQueryString.length; iParam++) {
				if (aQueryString[iParam].indexOf(strParamName + "=") > -1) {
					var aParam = aQueryString[iParam].split("=");
					strReturn = aParam[1];
					break;
				}
			}
		} else { // small hack for wrong urls in some shops
			var aQueryString = strHref.split("&");
			for ( var iParam = 0; iParam < aQueryString.length; iParam++) {
				if (aQueryString[iParam].indexOf(strParamName + "=") > -1) {
					var aParam = aQueryString[iParam].split("=");
					strReturn = aParam[1];
					break;
				}
			}
		}
	} catch (e) {

	}
	return unescape(strReturn);
}

function epoq_setc(data)
{
	if(typeof(epoq_localhistory) != "undefined" && epoq_localhistory)
	{
		for(d in data)
		{
			epoq_setcl("eqc_" + d,data[d], 60, "/");
		}
	}
		
}

function epoq_getc()
{
	if(typeof(epoq_localhistory) != "undefined" && epoq_localhistory)
	{
		var cookies = epoq_getcl("eqc_");
		for(var i=0; i<cookies.length; i++)
		{
			cookie = cookies[i];
			if( cookie.name.indexOf("eqc_") != -1 )epoq_functionParams += cookie.name + "=" + encodeURIComponent(cookie.value) + "&";
		}
		if(cookies.length==0)
			epoq_functionParams += "localhistory&";
	}
}

function epoq_setcl( name, value, expires, path, domain, secure )
{
	var today = new Date();
	today.setTime( today.getTime() );
	
	if ( expires )
	{
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );
	//window.location.host.match( /[^\.]+\.[^\.]+$/g )[0]
	document.cookie = name + "=" +escape( value ) +
	( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
	( ( path ) ? ";path=" + path : "" ) +
	( ( domain ) ? ";domain=" + domain : "" ) +
	( ( secure ) ? ";secure" : "" );
}


function epoq_getcl( check_name ) {
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false;
	
	var cookies = new Array();
	var cookieCount = 0;

	for (var i = 0; i < a_all_cookies.length; i++ )
	{
		a_temp_cookie = a_all_cookies[i].split( '=' );
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
		if ( cookie_name.indexOf(check_name) != -1 )
		{
			b_cookie_found = true;
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			cookies[cookieCount] = {'name': cookie_name, 'value': cookie_value};
			cookieCount++;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
		
	return cookies;
}

function checkJQuery()
{
	if(window.jQuery) {
		jQuery(document).ready(function($) {
			epoq_onReady();
		});
	}
	else
	{
		setTimeout(function(){
			checkJQuery();
		}, 250);
	}
}
checkJQuery();

function epoq_onReady()
{
	if(typeof(epoq_tenantId) == "undefined")
	{
		setTimeout(function(){
			epoq_onReady();
		}, 250);
	}
	else
	{
		var eq_partName;
		if((eq_partName = epoq_getURLParam('eq_partName')).length > 0)
		{
			jQuery.ajax({
				method: "GET",
				dataType: "jsonp",
				url: epoq_host + "forcePart",
				data: { sessionId: getEpoq_sessionId(), tenantId: epoq_tenantId, part: eq_partName}
			})
			.done(function( msg ) {
				if(msg && msg.data && msg.data.needsReload)
				{	
					console.log("epoq: set test part to: " + eq_partName)
					//location.reload();
				}
				else if(msg && msg.data && msg.data.hasOwnProperty('needsReload')) // must be false
				{
					console.log("epoq: already in correct part: " + eq_partName)
				}
				
			});
		}
		epoq_iiiV2();
	}
}



try{if(window.epoq_ready){window.epoq_ready();}}catch(e){}
