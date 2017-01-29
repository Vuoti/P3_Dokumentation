
function getDefaultCalendarWidth(){return 550;}

function getDefaultCalendarHeight(){return 280;}

function spawnInputFieldCalendar(myField,months,pattern,width,height,validateCalendar,otherField){
	originalArgs=new Array();
	for(var i=0;i<arguments.length;i++){originalArgs[i]=arguments[i];}
	var fields=new Array();
	if(otherField!=null){fields=new Array(myField.name,otherField.name);}else{fields=new Array(myField.name);}
	var ds=myField.value;
	var start=parseDate(pattern,myField.value,0,0);
	if(otherField){
		if (otherField.value) {
			var diff = 0;
		} else {
			var diff = 7;
		}
		var end=parseDate(pattern,otherField.value,0,diff);
	} else {
		var end=parseDate(pattern,myField.value,0,0);
	}
	var w=width;
	var h=height;
	var numberOfMonths=14;
	if(months==12){months=14}
	if(months!=null)numberOfMonths=months;
	if(isNaN(w)||w==null)w=getDefaultCalendarWidth();
	if(isNaN(h)||h==null)h=getDefaultCalendarHeight();
	if(validateCalendar){
		generateCal(self,0,myField.form.name,fields,start,start,numberOfMonths,validateCalendar,-1,pattern,false,true,end,end);
	} else {
		generateCal(self,0,myField.form.name,fields,start,start,numberOfMonths,validateCalendar,-1,pattern,false,true,end,end);
	}
}

function calendarChooseMonth(window,mode,formname,formelements,originalChosenTime,chosenTime,numberOfMonths,validateCalendar,selectedArea,pattern,submit,chosenTime2,originalChosenTime2){
	parts=formelements.split(",");
	formelements=new Array();
	for(var i=0;i<parts.length;i++){formelements[i]=parts[i];}
	var chosen=new Date();
	var chosen2=new Date();
	var originalChosen=new Date();
	var originalChosen2=new Date();
	originalChosen.setTime(originalChosenTime);
	originalChosen2.setTime(originalChosenTime2);
	chosen.setTime(chosenTime);
	chosen2.setTime(chosenTime2);
	if(chosen2.getMonth()==myArrivalMonth){originalChosen2=new Date(myArrivalYear,myArrivalMonth,myArrivalDay);}
	if(chosen.getMonth()==myDepartureMonth){originalChosen=new Date(myDepartureYear,myDepartureMonth,myDepartureDay);}
	generateCal(window,mode,formname,formelements,originalChosen,chosen,numberOfMonths,validateCalendar,selectedArea,pattern,submit,false,chosen2,originalChosen2);
}

function formatDate(day,month,year,pattern){var dayString=day<10?'0'+day:day;var monthString=(month+1)<10?'0'+(month+1):(month+1);if(pattern=='dd.MM.yyyy'){return dayString+"."+monthString+"."+year;}else if(pattern=='dd/MM/yyyy'){return dayString+"/"+monthString+"/"+year;}else if(pattern=='MM/dd/yyyy'){return monthString+"/"+dayString+"/"+year;}
return"";}

function setDateToFreeTextField(formname,fieldName,day,month,year,pattern){
	if(fieldName!="undefined"){
		var field=document.forms[formname].elements[fieldName];
		if(typeof(field)=="undefined"){
			allFields=document.forms[formname].getElementsByTagName("input");
			for(var i=0;i<allFields.length;i++){
				if(allFields[i].name==fieldName){field=allFields[i];break;}
			}
		}
		field.value=formatDate(day,month,year,pattern);
	}
}
function comboboxContainsMonth(t,formname,comboname){var txm=""+(t.getMonth()+1);if(txm.length<2)txm="0"+txm;var txy=""+t.getFullYear();var combo=document.forms[formname].elements[comboname];for(i=0;i<combo.options.length;i++){if((txm+"."+txy)==combo.options[i].value.substring(3)){return true;}}
return false;};

function parseDate(pattern,value,allowPast,diff){
	var d=parseDateInsecure(pattern,value,allowPast);
	if(d==null)d=new Date();
	newd = new Date(parseInt(d.getTime())+(parseInt(diff)*86400000));
	return newd;
}

function parseDateInsecure(pattern,value,allowPast){
	var pattern;
	var day;
	var month;
	var year;
	if(pattern=='dd.MM.yyyy'){
		pattern=/^(([1-9]|[0-2]\d|[3][0-1])\.([1-9]|[0]\d|[1][0-2])\.[2][0]\d{2})$|^(([1-9]|[0-2]\d|[3][0-1])\.([1-9]|[0]\d|[1][0-2])\.[2][0]\d{2})$/;
		if(pattern.exec(value)!=null){
			var test=value.split(".");
			year=test[2];
			month=test[1]-1;
			day=test[0];
		}else{
			return null;
		}
	}else if(pattern=='dd/MM/yyyy'){
		pattern=/^(\d\d)\/(\d\d)\/(\d\d\d\d)$/;
		if(pattern.exec(value)!=null){
			year=RegExp.$3;
			month=RegExp.$2-1;
			day=RegExp.$1;}
		else{
			return null;
		}
	}else if(pattern=='MM/dd/yyyy'){
		pattern=/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/;
		if(pattern.exec(value)!=null){
			year=RegExp.$3;
			month=RegExp.$1-1;
			day=RegExp.$2;
		}else{
			return null;
		}
	}else{
		alert("Unsupported pattern "+pattern);
		return null;
	}
	if(!allowPast){
		var today=new Date();
		if(year<today.getFullYear()){return null;}
		if(year==today.getFullYear()){
			if(month<today.getMonth()){return null;}
			if(month==today.getMonth()){
				if(day<today.getDate()){return null;}
			}
		}
	}
	if((month>=-1)&&(month<=11)&&(day>=1)&&(day<=31)){
        console.log('999 year,month,day: ' + year + month + day);
		return new Date(year,month,day);
	}
	return null;
}

function increaseDay(templDate,toIncrease){var retVal;if(toIncrease==null){toIncrease=getDefaultToIncrease();}
newTimestamp=templDate.getTime()+(1000*60*60*24*toIncrease);retVal=new Date(newTimestamp);return retVal;}
function getDefaultToIncrease(){return 7;}
function getValidateVacationDateReturnOffset(){return 7;}
function setSelection(popup,selDiv){if(selDiv.parentNode.parentNode.parentNode.getAttribute("id")=="genCalPopupCalendar"){if(popup.document.getElementById("genCalPopupDayChosen")&&selDiv.getAttribute("id")!="genCalPopupDayToday"){popup.document.getElementById("genCalPopupDayChosen").setAttribute("id","");selDiv.setAttribute("id","genCalPopupDayChosen");}else if(selDiv.getAttribute("id")=="genCalPopupDayToday"){popup.document.getElementById("genCalPopupDayChosen").setAttribute("id","");selDiv.setAttribute("id","genCalPopupDayTodayChosen");}else if(popup.document.getElementById("genCalPopupDayTodayChosen")){popup.document.getElementById("genCalPopupDayTodayChosen").setAttribute("id","genCalPopupDayToday");selDiv.setAttribute("id","genCalPopupDayChosen");}else{selDiv.setAttribute("id","genCalPopupDayChosen");}}else{if(popup.document.getElementById("genCalPopupDayChosen2")&&selDiv.getAttribute("id")!="genCalPopupDayToday"){popup.document.getElementById("genCalPopupDayChosen2").setAttribute("id","");selDiv.setAttribute("id","genCalPopupDayChosen2");}else if(selDiv.getAttribute("id")=="genCalPopupDayToday"){popup.document.getElementById("genCalPopupDayChosen2").setAttribute("id","");selDiv.setAttribute("id","genCalPopupDayTodayChosen2");}else if(popup.document.getElementById("genCalPopupDayTodayChosen2")){popup.document.getElementById("genCalPopupDayTodayChosen2").setAttribute("id","genCalPopupDayToday");selDiv.setAttribute("id","genCalPopupDayChosen2");}else{selDiv.setAttribute("id","genCalPopupDayChosen2");}}}
function setDepartureDate(departureDay,departureMonth,departureYear,selDiv){myDepartureDay=departureDay;myDepartureMonth=departureMonth;myDepartureYear=departureYear;var arrivalDate=new Date(myArrivalYear,myArrivalMonth,myArrivalDay);var departureDate=new Date(myDepartureYear,myDepartureMonth,myDepartureDay);if(departureDate.getTime()>arrivalDate.getTime()){newArrivalDate=increaseDay(departureDate,7);myArrivalDay=newArrivalDate.getDate();if(myArrivalMonth!=newArrivalDate.getMonth()){a4=(originalArgs[6]!=null)?originalArgs[0].name+','+originalArgs[6].name:originalArgs[0].name;equalTimestamp=document.calForm2.monthBox2.options[document.calForm2.monthBox2.selectedIndex].value;equalDate=new Date(Number(equalTimestamp));if(newArrivalDate.getMonth()==equalDate.getMonth()){myNewMonth=document.calForm2.monthBox2.selectedIndex;}else{for(var i=0;i<document.calForm2.monthBox2.length;i++){ed=new Date(Number(document.calForm2.monthBox2.options[i].value));if(ed.getMonth()==newArrivalDate.getMonth()){myNewMonth=i;break;}}}
calendarChooseMonth(self,0,originalArgs[0].form.name,a4,new Date(myDepartureYear,myDepartureMonth,myDepartureDay,0,0,0,0).getTime(),document.calForm.monthBox.options[document.calForm.monthBox.selectedIndex].value,originalArgs[1],originalArgs[5],document.calForm2.areas.options[document.calForm2.areas.selectedIndex].value,originalArgs[2],false,document.calForm2.monthBox2.options[myNewMonth].value,new Date(myArrivalYear,myArrivalMonth,myArrivalDay,0,0,0,0).getTime());}
myArrivalMonth=newArrivalDate.getMonth();myArrivalYear=newArrivalDate.getFullYear();}
foundedDiv=findDiv('left');setSelection(self,foundedDiv);foundedDiv=findDiv('right');setSelection(self,foundedDiv);}
function setArrivalDate(arrivalDay,arrivalMonth,arrivalYear,selDiv){myArrivalDay=arrivalDay;myArrivalMonth=arrivalMonth;myArrivalYear=arrivalYear;setSelection(self,selDiv);foundedDiv=findDiv('left');setSelection(self,foundedDiv);}
function findDiv(cal){var myGlobalDiv="";if(cal=="left"){myGlobalDiv=document.getElementById('genCalPopupCalendar');equalDay=myDepartureDay;}else if(cal=="right"){myGlobalDiv=document.getElementById('genCalPopupCalendar2');equalDay=myArrivalDay;}
links=myGlobalDiv.getElementsByTagName("a");for(var i=0;i<links.length;i++){if(links[i].innerHTML.toString()==equalDay.toString()){return links[i].parentNode;}}}
function getX(elm){var x=0;if(elm&&typeof elm.offsetParent!="undefined"){while(elm&&typeof elm.offsetLeft=="number"){x+=elm.offsetLeft;elm=elm.offsetParent;}}
return x;}
function getY(elm){var y=0;if(elm&&typeof elm.offsetParent!="undefined"){while(elm&&typeof elm.offsetTop=="number"){y+=elm.offsetTop;elm=elm.offsetParent;}}
return y;}
function hideCal(){var div=document.getElementById("calDocDiv");document.getElementsByTagName("body")[0].removeChild(div);if(document.getElementById("calIframe")){var frame=document.getElementById("calIframe");document.getElementsByTagName("body")[0].removeChild(frame);}}
function checkDates(pattern,myField,otherField,formname){
	startvalue = document.forms[formname].elements[myField].value;
	start=startvalue.split(".");
	endvalue=document.forms[formname].elements[otherField].value;
	end=endvalue.split(".");
	var timestamp_start=Date.UTC(start[2],start[1],start[0]);
	var timestamp_end=Date.UTC(end[2],end[1],end[0]);
	if (timestamp_start > timestamp_end){
		document.forms[formname].elements[myField].value = endvalue;
		document.forms[formname].elements[otherField].value = startvalue;
	}
}

/*
 * Neue Unterkunftssuche fuer Tosc4
 * Das Format des Datums fuer die Uebergabe an die URL anpassen und als Inhalt den versteckten Feldern 'selArrivalDate' und 'selNights' hinzufügen.
 */
function setDateForSending(startDate, endDate) {

    if (startDate) { /*wenn ein Datum ausgewählt wurde....*/
        from = (startDate).split(".");
        date = new Date(from[2], from[1] - 1, from[0]);
        fromEndDate = (endDate).split(".");
        dateEndDate = new Date(fromEndDate[2], fromEndDate[1] - 1, fromEndDate[0]);

    } else {/*wenn kein Datum ausgewählt wurde, eines generieren und verwenden*/
        date = new Date();
        dateEndDate = new Date();
        dateEndDate.setDate(dateEndDate.getDate() + 2);
    }
    year = date.getFullYear();
    month = '0' + (date.getMonth() + 1);
    month = month.slice(-2, (month.length - 2) + 3);
    day = '0' + date.getDate();
    day = day.slice(-2, (day.length - 2) + 3);
    document.getElementById('uksuche-arrivalDate').value = year + month + day;

    /*
    Es kann kein Abfahrtsdatum sondern nur die Anzahl der Übernachtungen übermittelt und verarbeitet werden.
    Deshalb werden diese aus den angegebenen Terminen berechnet.
     */

    millisecs =  dateEndDate - date;
    document.getElementById('uksuche-departureDate').value = Math.round(millisecs/(1000*60*60*24));
}
function generateCal(window,mode,formname,formelements,originalChosen,chosen,numberOfMonths,validateCalendar,selectedArea,pattern,submit,alwaysOnTop,chosen2,originalChosen2){
if(!document.getElementById("calDocDiv")){calDoc=document.createElement("div");}else{calDoc=document.getElementById("calDocDiv");}
myX=getX(document.getElementsByName(formelements[0])[0])-20;myY=getY(document.getElementsByName(formelements[0])[0])-260;if((myX<0)||(myY<0)){var f=document.forms[formname];var fe=null;for(var i=0;i<f.elements.length;i++){if(f.elements[i].name==formelements[0]){fe=f.elements[i];break;}}
if(fe){myX=getX(fe)-20;myY=getY(fe)-260;}}
isMSIE6=(navigator.appName=="Microsoft Internet Explorer"&&navigator.appVersion.indexOf('MSIE 6.0')!=-1)?true:false;if(isMSIE6){iframe=document.getElementById("calIframe");if(!iframe){iframe=document.createElement("iframe");}
iframe.setAttribute("id","calIframe");iframe.setAttribute("frameborder","0");iframe.style.visiblity="hidden";iframe.style.zIndex='4999';iframe.style.border="0";iframe.style.position='absolute';iframe.style.top=myY+'px';iframe.style.left=myX+'px';iframe.style.width='500px'
iframe.style.height='300px';document.getElementsByTagName('body')[0].appendChild(iframe);calDoc.style.padding="0";calDoc.style.border="1px solid #c0c0c0";}
calDoc.setAttribute("id","calDocDiv");calDoc.style.position='absolute';calDoc.style.zIndex='5000';calDoc.style.top=myY+'px';calDoc.style.left=myX+'px';calDoc.style.width="500px";calDoc.style.height="300px";calDoc.style.display='none';if(!isMSIE6){calDoc.style.padding="8px 13px 17px 13px";}
calDoc.setAttribute("class","calDocShadow");calDoc.setAttribute("className","calDocShadow");document.getElementsByTagName('body')[0].appendChild(calDoc);var calContent="";calDoc.writeln=function(code){calContent+=code;}
calDoc.write=function(code){calContent+=code;}
var selectedMonth;var selectedYear;var elements=formelements;var vacationArray=new Array();if(document.cookie&&selectedArea<0){selectedArea=document.cookie;if(isNaN(selectedArea)){parts=selectedArea.split(";");if(!isNaN(parts[0])){selectedArea=parts[0];}}}
if(selectedArea>-1){if(navigator.cookieEnabled){document.cookie=selectedArea;}
for(var i=1;i<vacations[selectedArea].length;i++){var vacationDate=new String(vacations[selectedArea][i]);var vacationDay=vacationDate.substring(0,vacationDate.indexOf('.'));var vacationMonth=vacationDate.substring(vacationDate.indexOf('.')+1,vacationDate.lastIndexOf('.'));var vacationYear=vacationDate.substring(vacationDate.lastIndexOf('.')+1);if(vacationYear<100){vacationYear="20"+vacationYear;}
vacationArray[i-1]=new Date(vacationYear,vacationMonth-1,vacationDay);}}
var today=new Date();myArrivalDay=originalChosen2.getDate();myArrivalMonth=originalChosen2.getMonth();myArrivalYear=originalChosen2.getFullYear();myDepartureDay=originalChosen.getDate();myDepartureMonth=originalChosen.getMonth();myDepartureYear=originalChosen.getFullYear();calDoc.writeln('<div id="genCalCloseCal" onclick="hideCal()"></div>');calDoc.writeln('</div>');calDoc.writeln('<form name="calForm" id="calForm" style="float: left; width: 250px;">');calDoc.writeln('<div id="genCalPopup" class="departure">');calDoc.writeln('<div id="genCalPopupHeadline">'+calendarTitle+'</div>');calDoc.writeln('<div id="genCalPopupMonthSelCellHeader">'+calendarDeparture+'</div>');calDoc.writeln('<div id="genCalPopupMonthSelCell"><div id="genCalPopupMonthPrev" title="'+calendarMonthPrevTitle+'" onclick="select = document.getElementById(\'genCalPopupMonthSel\'); if (select.selectedIndex > 0) { select.selectedIndex= select.selectedIndex-1;');calDoc.writeln('calendarChooseMonth(self,'+mode+',\''+formname+'\', \''+formelements+'\' , new Date('+myDepartureYear+','+myDepartureMonth+','+myDepartureDay+',0,0,0,0).getTime(),document.calForm.monthBox.options[document.calForm.monthBox.selectedIndex].value,'+numberOfMonths+','+validateCalendar+',document.calForm2.areas.options[document.calForm2.areas.selectedIndex].value,\''+pattern+'\','+submit+', document.calForm2.monthBox2.options[document.calForm2.monthBox2.selectedIndex].value, new Date('+myArrivalYear+','+myArrivalMonth+','+myArrivalDay+',0,0,0,0).getTime());};');calDoc.writeln('"></div>');calDoc.writeln('<select name="monthBox" onchange="');calDoc.writeln('calendarChooseMonth(self,'+mode+',\''+formname+'\', \''+formelements+'\' , new Date('+myDepartureYear+','+myDepartureMonth+','+myDepartureDay+',0,0,0,0).getTime(),document.calForm.monthBox.options[document.calForm.monthBox.selectedIndex].value,'+numberOfMonths+','+validateCalendar+',document.calForm2.areas.options[document.calForm2.areas.selectedIndex].value,\''+pattern+'\','+submit+', document.calForm2.monthBox2.options[document.calForm2.monthBox2.selectedIndex].value, new Date('+myArrivalYear+','+myArrivalMonth+','+myArrivalDay+',0,0,0,0).getTime());');calDoc.writeln('" id="genCalPopupMonthSel" class="genCalPopupSel">');var optionDate=new Date();optionDate.setDate(1);for(i=0;i<numberOfMonths;i++){selectedMonth=(today.getMonth()+i)%12;optionDate.setMonth(selectedMonth);selectedYear=today.getFullYear()+(today.getMonth()+i)/12;optionDate.setYear(selectedYear);var optionDateString=""+calendarMonths[optionDate.getMonth()]+" "+optionDate.getFullYear();calDoc.write('<option value = "'+optionDate.getTime()+'"');if((optionDate.getMonth()==chosen.getMonth())&&(optionDate.getFullYear()==chosen.getFullYear())){calDoc.write(' selected');}
calDoc.writeln('>'+optionDateString+'</option>');}
calDoc.writeln('</select>');calDoc.writeln('<div id="genCalPopupMonthNext" title="'+calendarMonthNextTitle+'" onclick="select = document.getElementById(\'genCalPopupMonthSel\'); if (select.selectedIndex < select.length-1) { select.selectedIndex=select.selectedIndex+1; ');calDoc.writeln('calendarChooseMonth(self,'+mode+',\''+formname+'\', \''+formelements+'\' , new Date('+myDepartureYear+','+myDepartureMonth+','+myDepartureDay+',0,0,0,0).getTime(),document.calForm.monthBox.options[document.calForm.monthBox.selectedIndex].value,'+numberOfMonths+','+validateCalendar+',document.calForm2.areas.options[document.calForm2.areas.selectedIndex].value,\''+pattern+'\','+submit+', document.calForm2.monthBox2.options[document.calForm2.monthBox2.selectedIndex].value, new Date('+myArrivalYear+','+myArrivalMonth+','+myArrivalDay+',0,0,0,0).getTime());};');calDoc.writeln('"></div></div>');calDoc.writeln('<div id="genCalPopupCalendar">');calDoc.writeln('<div id="genCalPopupDayNames">');for(i=0;i<calendarDays.length;i++){calDoc.writeln('<div class="genCalPopupDayName">'+calendarDays[i]+'</div>');}
calDoc.writeln('</div>');calDoc.writeln('<div id="genCalPopupDays"><div class="genCalPopupWeek">');var iter=new Date(chosen.getFullYear(),chosen.getMonth(),1);var diff=iter.getDay();if(diff>0)
iter=new Date(iter.getTime()-86400000*(diff-1));else
iter=new Date(iter.getTime()-86400000*(diff+6));for(i=0;i<42;i++){var bgc="genCalPopupDay";if(selectedArea>-1){for(var j=0;j<vacationArray.length;j=j+2){if((iter.getTime()>=vacationArray[j].getTime())&&(iter.getTime()<(vacationArray[j+1].getTime()+86400000))){bgc="genCalPopupVacationDay";}}}
var isChosen=false;if((originalChosen!=null)&&(iter.getFullYear()==originalChosen.getFullYear())&&(iter.getMonth()==originalChosen.getMonth())&&(iter.getDate()==originalChosen.getDate())){isChosen=true;}
var isToday=false;if((iter.getFullYear()==today.getFullYear())&&(iter.getMonth()==today.getMonth())&&(iter.getDate()==today.getDate())){isToday=true;}
var id='';if(isToday&&isChosen){id=' id="genCalPopupDayTodayChosen"';}else if(isToday){id=' id="genCalPopupDayToday"';}else if(isChosen){id=' id="genCalPopupDayChosen"';}
calDoc.writeln('<div class="'+bgc+'"'+id+'>');var call=null;var isInThePast=false;if((iter.getFullYear()==today.getFullYear())&&(iter.getMonth()==today.getMonth())&&(iter.getDate()<today.getDate())){isInThePast=true;}
if(!isInThePast){if(iter.getMonth()==chosen.getMonth()){var element=formelements[0];call='setDepartureDate('+iter.getDate()+','+iter.getMonth()+','+iter.getFullYear()+', this.parentNode); return false;';}}
if(call!=null){calDoc.write('<a class="genCalPopupDayLink" href="#" onClick="'+call);if(submit){calDoc.write('document.forms[\''+formname+'\'].submit();');}
calDoc.write('">');}
calDoc.write(iter.getDate());if(call!=null){calDoc.writeln('</a>');}
calDoc.write('</div>');if(i%7==6){calDoc.writeln('</div><div class="genCalPopupWeek">');}
iter.setDate(iter.getDate()+1);}
calDoc.writeln('</div></div></div>');calDoc.writeln('<div id="genCalPopupInstruction">'+calendarInstruction+'.</div>');calDoc.writeln('</div>');calDoc.writeln('</form>');var selectedMonth2;var selectedYear2;calDoc.writeln('<form name="calForm2" id="calForm2" style="float: left; width: 250px;">');calDoc.writeln('<div id="genCalPopup">');calDoc.writeln('<div id="genCalPopupHeadline">'+calendarTitle+'</div>');calDoc.writeln('<div id="genCalPopupMonthSelCellHeader">'+calendarArrival+'</div>');calDoc.writeln('<div id="genCalPopupMonthSelCell"><div id="genCalPopupMonthPrev" title="'+calendarMonthPrevTitle+'" onclick="select = document.getElementById(\'genCalPopupMonthSel2\'); if (select.selectedIndex > 0){select.selectedIndex= select.selectedIndex-1;');calDoc.writeln('calendarChooseMonth(self,'+mode+',\''+formname+'\', \''+formelements+'\' , new Date('+myDepartureYear+','+myDepartureMonth+','+myDepartureDay+',0,0,0,0).getTime(),document.calForm.monthBox.options[document.calForm.monthBox.selectedIndex].value,'+numberOfMonths+','+validateCalendar+',document.calForm2.areas.options[document.calForm2.areas.selectedIndex].value,\''+pattern+'\','+submit+', document.calForm2.monthBox2.options[document.calForm2.monthBox2.selectedIndex].value, new Date('+myArrivalYear+','+myArrivalMonth+','+myArrivalDay+',0,0,0,0).getTime());};');calDoc.writeln('"></div>');calDoc.writeln('<select name="monthBox2" onchange="');calDoc.writeln('calendarChooseMonth(self,'+mode+',\''+formname+'\', \''+formelements+'\' , new Date('+myDepartureYear+','+myDepartureMonth+','+myDepartureDay+',0,0,0,0).getTime(),document.calForm.monthBox.options[document.calForm.monthBox.selectedIndex].value,'+numberOfMonths+','+validateCalendar+',document.calForm2.areas.options[document.calForm2.areas.selectedIndex].value,\''+pattern+'\','+submit+', document.calForm2.monthBox2.options[document.calForm2.monthBox2.selectedIndex].value, new Date('+myArrivalYear+','+myArrivalMonth+','+myArrivalDay+',0,0,0,0).getTime());');calDoc.writeln('" id="genCalPopupMonthSel2" class="genCalPopupSel">');var optionDate2=new Date();optionDate2.setDate(1);for(i=0;i<numberOfMonths;i++){selectedMonth2=(today.getMonth()+i)%12;optionDate2.setMonth(selectedMonth2);selectedYear2=today.getFullYear()+(today.getMonth()+i)/12;optionDate2.setYear(selectedYear2);var optionDateString=""+calendarMonths[optionDate2.getMonth()]+" "+optionDate2.getFullYear();calDoc.write('<option value = "'+optionDate2.getTime()+'"');if((optionDate2.getMonth()==chosen2.getMonth())&&(optionDate2.getFullYear()==chosen2.getFullYear())){calDoc.write(' selected');}
calDoc.writeln('>'+optionDateString+'</option>');}
calDoc.writeln('</select>');calDoc.writeln('<div id="genCalPopupMonthNext" title="'+calendarMonthNextTitle+'" onclick="select = document.getElementById(\'genCalPopupMonthSel2\'); if (select.selectedIndex < select.length-1) { select.selectedIndex=select.selectedIndex+1; calendarChooseMonth(self,'+mode+',\''+formname+'\', \''+formelements+'\' , new Date('+myDepartureYear+','+myDepartureMonth+','+myDepartureDay+',0,0,0,0).getTime(),document.calForm.monthBox.options[document.calForm.monthBox.selectedIndex].value,'+numberOfMonths+','+validateCalendar+',document.calForm2.areas.options[document.calForm2.areas.selectedIndex].value,\''+pattern+'\','+submit+', document.calForm2.monthBox2.options[document.calForm2.monthBox2.selectedIndex].value, new Date('+myArrivalYear+','+myArrivalMonth+','+myArrivalDay+',0,0,0,0).getTime());}; ');calDoc.writeln('"></div></div>');calDoc.writeln('<div id="genCalPopupCalendar2">');calDoc.writeln('<div id="genCalPopupDayNames">');for(i=0;i<calendarDays.length;i++){calDoc.writeln('<div class="genCalPopupDayName">'+calendarDays[i]+'</div>');}
calDoc.writeln('</div>');calDoc.writeln('<div id="genCalPopupDays"><div class="genCalPopupWeek">');var iter=new Date(chosen2.getFullYear(),chosen2.getMonth(),1);var diff=iter.getDay();if(diff>0)
iter=new Date(iter.getTime()-86400000*(diff-1));else
iter=new Date(iter.getTime()-86400000*(diff+6));for(i=0;i<42;i++){var bgc="genCalPopupDay";if(selectedArea>-1){for(var j=0;j<vacationArray.length;j=j+2){if((iter.getTime()>=vacationArray[j].getTime())&&(iter.getTime()<(vacationArray[j+1].getTime()+86400000))){bgc="genCalPopupVacationDay";}}}
var isChosen=false;if((originalChosen2!=null)&&(iter.getFullYear()==originalChosen2.getFullYear())&&(iter.getMonth()==originalChosen2.getMonth())&&(iter.getDate()==originalChosen2.getDate())){isChosen=true;}
var isToday=false;if((iter.getFullYear()==today.getFullYear())&&(iter.getMonth()==today.getMonth())&&(iter.getDate()==today.getDate())){isToday=true;}
var id='';if(isToday&&isChosen){id=' id="genCalPopupDayTodayChosen2"';}else if(isToday){id=' id="genCalPopupDayToday"';}else if(isChosen){id=' id="genCalPopupDayChosen2"';}
calDoc.writeln('<div class="'+bgc+'"'+id+'>');var call=null;var isInThePast=false;if((iter.getFullYear()==today.getFullYear())&&(iter.getMonth()==today.getMonth())&&(iter.getDate()<today.getDate())){isInThePast=true;}
if(!isInThePast){if(iter.getMonth()==chosen2.getMonth()){var element=formelements[0];call='setArrivalDate('+iter.getDate()+','+iter.getMonth()+','+iter.getFullYear()+', this.parentNode); return false;';}}
if(call!=null){calDoc.write('<a class="genCalPopupDayLink" href="#" onClick="'+call);if(submit){calDoc.write('document.forms[\''+formname+'\'].submit();');}
calDoc.write('">');}
calDoc.write(iter.getDate());if(call!=null){calDoc.writeln('</a>');}
calDoc.write('</div>');if(i%7==6){calDoc.writeln('</div><div class="genCalPopupWeek">');}
iter.setDate(iter.getDate()+1);}
calDoc.writeln('</div></div></div>');calDoc.writeln('<div id="genCalPopupInstruction">'+calendarInstruction+'.</div>');calDoc.writeln('</div>');calDoc.writeln('<div id="genCalPopupVacationCell" style="position: absolute; margin-left: -250px;">');calDoc.writeln('<div id="genCalPopupVacationLabel">'+calendarHolidays+':</div>');calDoc.writeln('<select name="areas" onChange="');calDoc.writeln('calendarChooseMonth(self,'+mode+',\''+formname+'\', \''+formelements+'\' , new Date('+myDepartureYear+','+myDepartureMonth+','+myDepartureDay+',0,0,0,0).getTime(),document.calForm.monthBox.options[document.calForm.monthBox.selectedIndex].value,'+numberOfMonths+','+validateCalendar+',document.calForm2.areas.options[document.calForm2.areas.selectedIndex].value,\''+pattern+'\','+submit+', document.calForm2.monthBox2.options[document.calForm2.monthBox2.selectedIndex].value, new Date('+myArrivalYear+','+myArrivalMonth+','+myArrivalDay+',0,0,0,0).getTime());');calDoc.writeln('" id="genCalPopupStateSel" class="genCalPopupSel">');calDoc.writeln('<option value = "-1">'+calendarChooseArea);savedValue="";if(navigator.cookieEnabled&&document.cookie){parts=document.cookie.split(";");savedValue=parts[0];}
if(!savedValue){savedValue=selectedArea;}
if(isNaN(savedValue)){parts=savedValue.split(";");savedValue=parts[0];}
for(var i=0;i<vacations.length;i++){calDoc.write('<option ');if(i==savedValue){calDoc.write('selected ');}
calDoc.writeln('value = "'+i+'"> '+vacations[i][0]);}
calDoc.writeln('</select>');calDoc.writeln('<input type="button" name="SelectValues" id="dateButton" value="'+calendarSelectValues+'" onClick="javascript:setDateToFreeTextField(\''+formname+'\',\''+formelements[1]+'\',myArrivalDay , myArrivalMonth, myArrivalYear,\''+pattern+'\');setDateToFreeTextField(\''+formname+'\',\''+formelements[0]+'\',myDepartureDay , myDepartureMonth, myDepartureYear,\''+pattern+'\'); hideCal(); checkDates(\''+pattern+'\',\''+formelements[0]+'\',\''+formelements[1]+'\',\''+formname+'\');">');calDoc.writeln('</form>');calDoc.innerHTML=calContent;calDoc.style.display='block';};calendarDays=new Array("Mo","Di","Mi","Do","Fr","Sa","So");
calendarMonths=new Array("Januar","Februar","M&auml;rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember");
calendarMonthPrevTitle="vorheriger Monat";calendarMonthNextTitle="n&auml;chster Monat"
calendarTitle="Kalender";
calendarHolidays="Schulferien";
calendarChooseArea="Bundesland w&auml;hlen";
calendarInstruction="Bitte klicken Sie auf das gew&uuml;nschte Datum";
calendarClose="Fenster schlie�en";
calendarCss="calendar.css";
calendarDeparture="Anreise:";
calendarArrival="Abreise:";
calendarSelectValues="&uuml;bernehmen";vacations = new Array();
vacations[0] = new Array("Baden-W&uuml;rttemberg", 
"09.04.2009","09.04.2009","14.04.2009","17.04.2009","25.05.2009","06.06.2009","30.07.2009","12.09.2009","26.10.2009","31.10.2009","23.12.2009","09.01.2010","01.04.2010","10.04.2010","25.05.2010","05.06.2010","29.07.2010","10.9.2010","02.11.2010","06.11.2010","23.12.2010","08.01.2011"			 		 		
);
vacations[1] = new Array("Bayern",
"06.04.2009","18.04.2009","02.06.2009","13.06.2009","03.08.2009","14.09.2009","02.11.2009","07.11.2009","24.12.2009","05.01.2010","29.03.2010","10.04.2010","25.05.2010","05.06.2010","02.08.2010","13.09.2010","02.11.2010","05.11.2010","27.12.2010","07.01.2011"
);
vacations[2] = new Array("Berlin",
"06.04.2009","18.04.2009","22.05.2009","22.05.2009","15.07.2009","28.08.2009","19.10.2009","30.10.2009","21.12.2009","02.01.2010","31.03.2010","10.04.2010","14.05.2010","14.05.2010","25.05.2010","25.05.2010","08.07.2010","21.08.2010","11.10.2010","23.10.2010","23.12.2010","01.01.2011"
);
vacations[3] = new Array("Brandenburg",
"08.04.2009","17.04.2009","22.05.2009","22.05.2009","16.07.2009","29.08.2009","19.10.2009","30.10.2009","21.12.2009","02.01.2010","31.03.2010","10.04.2010","14.05.2010","14.05.2010","08.07.2010","21.08.2010","11.10.2010","23.10.2010","23.12.2010","01.01.2011"
);
vacations[4] = new Array("Bremen",
"30.03.2009","14.04.2009","20.05.2009","22.05.2009","02.06.2009","02.06.2009","25.06.2009","05.08.2009","05.10.2009","17.10.2009","23.12.2009","06.01.2010","19.03.2010","06.04.2010","25.05.2010","25.05.2010","24.06.2010","04.08.2010"
);
vacations[5] = new Array("Hamburg", 
"09.03.2009","21.03.2009","18.05.2009","23.05.2009","16.07.2009","26.08.2009","12.10.2009","24.10.2009","21.12.2009","31.12.2009","08.03.2010","20.03.2010","14.05.2010","22.05.2010","08.07.2010","18.08.2010","04.10.2010","15.10.2010","23.12.2010","03.01.2011"
);
vacations[6] = new Array("Hessen",
"06.04.2009","18.04.2009","13.07.2009","21.08.2009","12.10.2009","24.10.2009","21.12.2009","09.01.2010","29.03.2010","10.04.2010","05.07.2010","14.08.2010","11.10.2010","22.10.2010","20.12.2010","07.01.2011"
);
vacations[7] = new Array("Mecklenburg-Vorpommern",
"06.04.2009","14.04.2009","02.06.2009","06.06.2009","20.07.2009","29.08.2009","26.10.2009","30.10.2009","21.12.2009","02.01.2010","29.03.2010","07.04.2010","21.05.2010","22.05.2010","12.07.2010","21.08.2010","18.10.2010","23.10.2010","23.12.2010","31.12.2010"
);
vacations[8] = new Array("Niedersachsen", 
"30.03.2009","15.04.2009","22.05.2009","02.06.2009","25.06.2009","05.08.2009","05.10.2009","17.10.2009","23.12.2009","06.01.2010","19.03.2010","06.04.2010","14.05.2010","14.05.2010","25.05.2010","25.05.2010","24.06.2010","04.08.2010"
);
vacations[9] = new Array("Nordrhein-Westfalen",
"06.04.2009","18.04.2009","02.06.2009","02.06.2009","02.07.2009","14.08.2009","12.10.2009","24.10.2009","24.12.2009","06.01.2010","27.03.2010","10.04.2010","25.05.2010","25.05.2010","15.07.2010","27.08.2010","11.10.2010","23.10.2010","24.12.2010","08.01.2011"
);
vacations[10] = new Array("Rheinland-Pfalz", 
"01.04.2009","17.04.2009","13.07.2009","21.08.2009","12.10.2009","23.10.2009","21.12.2009","05.01.2010","26.03.2010","09.04.2010","05.07.2010","13.08.2010","11.10.2010","22.10.2010","23.12.2010","07.01.2011"
);
vacations[11] = new Array("Saarland", 
"06.04.2009","18.04.2009","13.07.2009","22.08.2009","19.10.2009","31.10.2009","18.12.2009","02.01.2010","29.03.2010","10.04.2010","05.07.2010","14.08.2010","11.10.2010","23.10.2010","20.12.2010","31.12.2010"
);
vacations[12] = new Array("Sachsen", 
"09.04.2009 - 18.04.2009","","22.05.2009","22.05.2009","","29.06.2009","07.08.2009","12.10.2009","24.10.2009","23.12.2009","02.01.2010","01.04.2010","10.04.2010","14.05.2010","14.05.2010","28.06.2010","06.08.2010","04.10.2010","16.10.2010","23.12.2010","01.01.2011"
);
vacations[13] = new Array("Sachsen-Anhalt",
"06.04.2009","18.04.2009","22.05.2009","29.05.2009","25.06.2009","05.08.2009","12.10.2009","17.10.2009","21.12.2009","05.01.2010","29.03.2010","09.04.2010","14.05.2010","22.05.2010","24.06.2010","04.08.2010","18.10.2010","23.10.2010","22.12.2010","05.01.2011"
);
vacations[14] = new Array("Schleswig-Holstein", 
"06.04.2009","18.04.2009","22.05.2009","29.05.2009","25.06.2009","05.08.2009","12.10.2009","17.10.2009","21.12.2009","05.01.2010","03.04.2010","17.04.2010","12.07.2010","21.08.2010","11.10.2010","23.10.2010","23.12.2010","07.01.2011"
);
vacations[15] = new Array("Th&uuml;ringen", 
"06.04.2009","17.04.2009","25.06.2009","05.08.2009","12.10.2009","24.10.2009","19.12.2009","02.01.2010","29.03.2010","09.04.2010","24.06.2010","04.08.2010","09.10.2010","23.10.2010","23.12.2010","31.12.2010"
);	var test = 0;
							function showCalendar(){							
								var f = document.getElementById("dateform");
								var target = "anreise";
								var sync= "abreise";
								var f1 = f.elements[target];
								var f2 = f.elements[sync];
								if (!f1) {
									f1 = document.getElementById(target);
								}
								if (!f2) {
									f2 = document.getElementById(sync);
								}
								spawnInputFieldCalendar(f1, 24, 'dd.MM.yyyy', null, null, f2 != null, f2);
							}	function showfields(id){		
								if ($("quicksearchcontent")) {
									var search = $("quicksearchcontent");
									//var insertContainer = $("subfields");
								}
								else {
									var search = $("extendedsearch");
									//var insertContainer = $("gruppe"+id);
								}
								search.getElements("div[id^=gruppe]").each(function(item, index){
									item.empty();
								});
								search.getElements("div[id^=gruppe]").setStyle('height', '0');
								search.getElements("div[id^=gruppe]").setStyle('display', 'none'); 
								var url = "http://www.konstanz-tourismus.de/index.php?eID=search&language=de&gruppe="+id;								
								new Request({
									method: "get",
									url: url,
									onComplete: function showResponse(response, responseXML){										
										//insertContainer.setStyle('height', 'auto');
										//insertContainer.setStyle('display', 'block');
										//insertContainer.innerHTML = response;	
										$("gruppe"+id).setStyle('height', 'auto');
										$("gruppe"+id).setStyle('display', 'block');
										$("gruppe"+id).innerHTML = response;										
									}
								}).send();
							}
							
							function hideClose(){
								$("shadowbox_nav_close").setStyle('visibility', 'hidden');
							}
							
							function testDate(){
								value = $("anreise").value;
								match = value.match(/\d+\.\d+\.\d+/);
								if ($("dauer").options[$("dauer").selectedIndex].value == -1 && !match){
									alert("Bitte geben Sie An- und Abreisedatum ein.");
									return false;
								}

							}
							
							function showWaiting(){
								Shadowbox.open({
									player:     'html',
									displayNav: false,
									content:    '<div style="width: 100%; height: 100%; text-align: center; font-weight: bold; color: #255075; background: #ffffff;"><img style="padding-top: 15px;" src="typo3conf/ext/ic_unterkuenfte/res/ajax-loader-1.gif" alt="Lade" /><div style="padding: 20px">Bitte haben Sie einen Augenblick Geduld. Wir suchen bei den Anbietern DIRS21, Tomec, HRS und hotel.de die passenden Unterkünfte in Konstanz für Sie.</div></div>',
									height:     300,
									width:      400
								}, {
									onOpen: function() { 
										hideClose(); 
									},
									overlayColor: '#00c3ff',
									overlayOpacity: '0.5'
								});
							}
							
							function showDurationText(id){
								var url = "http://www.konstanz-tourismus.de/index.php?eID=durationtext&language=de&gruppe="+id;	
								new Request({
									method: "get",
									url: url,
									onComplete: function showResponse(response, responseXML){	
										$("durationtext").set('html',response);										
									}
								}).send();
							}
							function showDescriptionText(id){
								if ($('descriptiontext')) {
									var url = "http://www.konstanz-tourismus.de/index.php?eID=descriptiontext&language=de&gruppe="+id;									
									new Request({
										method: "get",
										url: url,									
										onComplete: function showResponse(response, responseXML){	
											$("descriptiontext").set('html',response);										
												
										}
									}).send();
								}
							}
							
							function showUkProperties(id){
								if ($("ukproperties")) {
									$("ukproperties").innerHTML = '';
									var url = "http://www.konstanz-tourismus.de/index.php?eID=ukproperties&language=de&gruppe="+id;
									new Request({
										method: "get",
										url: url,									
										onComplete: function showResponse(response, responseXML){											
											$("ukproperties").set('html',response);									
										}
									}).send();
								}
								
							}
							function showCities(id) {							
								if ($("cities")) {
									$("cities").innerHTML = '';								
									var url = "http://www.konstanz-tourismus.de/index.php?eID=cities&language=de&gruppe="+id;																									
									new Request({
										method: "get",
										url: url,									
										onComplete: function showResponse(response, responseXML){											
											$("cities").set('html',response);									
										}
									}).send();
								}
							}
							
							function callExtSearch() {
								$('dateform').setProperty('action', 'erweiterte-suche.html');
								$('dateform').submit();
							}
							/*
							Mit neuem Tosc 4 Formular nicht mehr notwendig, deshalb auskommentiert.
							window.addEvent('domready', function() {
								if ($('quicksearch')) {
									var ukart = $$('input.radio');
									ukart[0].setProperty('checked', 'checked');
								}
							});
							*/
							
						