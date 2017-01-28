/**
 * 
 */
function epoq(params)
{	
	this.setcl = function ( name, value, expires, path, domain, secure )
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
	
	
	this.getcl = function ( check_name ) 
	{
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
	
	this.go=function(parameter)
	{
		if(typeof(parameter)==="object")
		{
			var cartData = "";
			if(typeof(epoq_productIds)!= "undefined")
			{
				if(epoq_productIds.length==0 && typeof(lastCart)!= "undefined" && lastCart!=null)
				{
					epoq_productIds=lastCart.productIds;
					epoq_quantities=lastCart.quantities;
					epoq_unitPrices=lastCart.unitPrices;
					epoq_sizes=lastCart.sizes;
					epoq_variantOfList=lastCart.variantOfList;
				}
				
				var cartData = "&";
				for ( var i=0, len=epoq_productIds.length; i<len; ++i )
				{
					cartData += 'productId=' + encodeURIComponent(epoq_productIds[i]) + '&';
					cartData += 'quantity=' + (typeof(epoq_quantities[i]) != "undefined" ? encodeURIComponent(epoq_quantities[i]) : "") + '&';
					cartData += 'unitPrice=' + (typeof(epoq_unitPrices[i]) != "undefined" ? encodeURIComponent(epoq_unitPrices[i]) : "")+ '&';
					cartData += 'variantOf=' + (typeof(epoq_variantOfList[i]) != "undefined" ? encodeURIComponent(epoq_variantOfList[i]) : "")+ '&';
				}
				cartData += 'updateCart&';
				
			}
			
			if (typeof(parameter.sessionId) == "undefined" || parameter.sessionId ==null || parameter.sessionId.length ==0)
			{
				parameter.sessionId = this.getcl("eqsid_");
				if(parameter.sessionId.length > 0)
				{
					parameter.sessionId = this.getcl("eqsid_")[0].value;
				}
				else
				{
					parameter.sessionId = "eqsid_" + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
						var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
						return v.toString(16);
					});
				}
			}
			this.setcl("eqsid_", parameter.sessionId, 0, "/");
			
			var getData = "tenantId=" + parameter.tenantId + "&sessionId=" + parameter.sessionId + "&rules=" + encodeURIComponent(parameter.rules) + "&widgetTheme=json2" + cartData; //&pretty=true       
			if(typeof(parameter.productId)!= "undefined")getData += "&productId=" + parameter.productId;
			if(typeof(parameter.demo)!= "undefined")getData += "&demo=" + parameter.demo;
			if(typeof(parameter.fields)!= "undefined")getData += "&fields=" + parameter.fields;
			if(typeof(parameter.locakey)!= "undefined")getData += "&locakey=" + parameter.locakey;
			var host = parameter.tenantId  + ".arc.epoq.de";
			if(typeof(parameter.host)!= "undefined")host=parameter.host;
			var protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
			
			jQuery.ajax({
				  url: protocol + host + "/inbound-servletapi/getRecommendations", 
				  data:  getData,
				  dataType: "jsonp",
				  success: function (data) 
				  {  
					  var needsdefault = true;
					  if(typeof(data) != "undefined" && typeof(data.recommendations)!= "undefined" && typeof(data.recommendations.domain)!= "undefined")
					  {
						//check one domain || multiple domain [0]
						if( (typeof(data.recommendations.domain.items)!= "undefined" && typeof(data.recommendations.domain.items.item)!= "undefined") || (typeof(data.recommendations.domain[0])!= "undefined" && typeof(data.recommendations.domain[0].items)!= "undefined" && typeof(data.recommendations.domain[0].items.item)!= "undefined"))
						{
						  if(typeof(parameter.success)!= "undefined") //if a success function is defined
						  {
							needsdefault = false;
							parameter.success(data);
						  }
						  else //for commands
						  {
							  if(typeof(data.recommendations.domain.items.item.length) != "undefined") //check if many items
							  {
							    for(var i=0; i <data.recommendations.domain.items.item.length; i++)
							    {
								id = data.recommendations.domain.items.item[i]['@id'];
								if(typeof(parameter.reccommands[id])!= "undefined")
								{
								    needsdefault = false;
								    parameter.reccommands[id].ex(data.recommendations.domain.items.item[i]); //in case of a forward the loop appears only once
								}
							    }
							  }
							  else //one item
							  {
								id = data.recommendations.domain.items.item['@id']; // no [i]
								if(typeof(parameter.reccommands[id])!= "undefined")
								{
								    needsdefault = false;
								    parameter.reccommands[id].ex(data.recommendations.domain.items.item); // no [i]
								}
							  }
						  }
						}
					  }
					  if(needsdefault && typeof(parameter)!= "undefined" && typeof(parameter.reccommands) != "undefined" && typeof(parameter.reccommands['default'])!= "undefined") parameter.reccommands['default'].ex();		  
				  },
				  error: function () {
					if(typeof(parameter.error)!= "undefined") //if a success function is defined
					{
						parameter.error();
					}
					//alert ("Timeout");
					if(typeof(parameter.reccommands)!= "undefined" && typeof(parameter.reccommands['default'])!= "undefined")parameter.reccommands['default'].ex();
				  },
				  timeout: 10000,
				  cache: false
			});
		}
	}
}

if(typeof(epoq) != "object")epoq = new epoq();