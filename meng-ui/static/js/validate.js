function trim(s) {
	if (s == null) {
		return "";
	}
	return s.replace( /^\s*/, "" ).replace( /\s*$/, "" );
}

function validateRequired(form) {
  var isValid = true;
  var focusField = null;
  var i = 0;
  var fields = [];
  oRequired = new required();
  for (x in oRequired) {
    var field = form[oRequired[x][0]];
	if(typeof field =="undefined")
		 continue;
    if (field.type == 'text' ||field.type == 'textarea' ||
        field.type == 'file' ||field.type == 'checkbox' ||
        field.type == 'select-one' ||field.type == 'password') {
        var value = '';
        // get field's value
        if (field.type == "select-one") {
           var si = field.selectedIndex;
           if (si >= 0) {
             value = field.options[si].value;
            }
        } else if (field.type == 'checkbox') {
		   if (field.checked) {
			 value = field.value;
	       }
	    } else {
		  if(field.className=="comboBhv")
				value = field.hiddenValue;
		  else
				value = field.value;
        }

        if (trim(value).length == 0) {

           if (i == 0) {
              focusField = field;
           }
           fields[i++] = oRequired[x][1];
           isValid = false;
        }
      } else if (field.type == "select-multiple") {
         var numOptions = field.options.length;
         lastSelected=-1;
         for(loop=numOptions-1;loop>=0;loop--) {
            if(field.options[loop].selected) {
               lastSelected = loop;
               value = field.options[loop].value;
               break;
            }
         }
      if(lastSelected < 0 || trim(value).length == 0) {
         if(i == 0) {
           focusField = field;
         }
        fields[i++] = oRequired[x][1];
        isValid=false;
      }
    } else if ((field.length > 0) && (field[0].type == 'radio' || field[0].type == 'checkbox')) {
       isChecked=-1;
       for (loop=0;loop < field.length;loop++) {
          if (field[loop].checked) {
            isChecked=loop;
            break; // only one needs to be checked
           }
       }
       if (isChecked < 0) {
          if (i == 0) {
             focusField = field[0];
       }
       fields[i++] = oRequired[x][1];
       isValid=false;
     }
    }
  }
  if (fields.length > 0) {
    focusField.focus();
    alert(fields.join('\n'));
  }
  return isValid;
}

//计算汉字和字符的长度，UTF8汉字按照3个字符计算
function strLen(value){
 var str,Num = 0;
 for (var i=0;i<value.length;i++){
  str = value.substring(i,i+1);
  if (str<="~")  //判断是否双字节
    Num+=1;
  else
   Num+=3;
 }
 return Num;
 }

function validateMaxLength(form) {
    var isValid = true;
    var focusField = null;
    var i = 0;
    var fields = [];
    var formName = form.getAttributeNode("name"); 

    oMaxLength = eval('new MaxlengthValidations()');        
    for (x in oMaxLength) {
      var field = form[oMaxLength[x][0]];
      if(typeof field =="undefined")
		 continue;
      if ((field.type == 'text' ||field.type == 'textarea') &&field.disabled == false) {

         var iMax = parseInt(oMaxLength[x][2]("maxlength"));
         var fieldlen = strLen(trim(field.value));
         if (fieldlen > iMax) {
            if (i == 0) {
               focusField = field;
            }
            fields[i++] = oMaxLength[x][1];
            isValid = false;
          }
      }
    }
    if (fields.length > 0) {
       focusField.focus();
       alert(fields.join('\n'));
    }
    return isValid;
}

function validateDate(form) {
  var bValid = true;
  var focusField = null;
  var i = 0;
  var fields = [];
  var formName = form.getAttributeNode("name"); 

  oDate = eval('new DateValidations()');

  for (x in oDate) {
    var field = form[oDate[x][0]];
	if(typeof field =="undefined")
		 continue;
    var value = field.value;
	var ind = value.indexOf(" ");
    if(ind!=-1)
        value = value.substring(0,ind);
    var datePattern = oDate[x][2]("datePatternStrict");
    // try loose pattern
    if (datePattern == null)
       datePattern = oDate[x][2]("datePattern");
       if ((field.type == 'text') &&(value.length > 0) && (datePattern.length > 0) &&
          field.disabled == false) {
          var MONTH = "MM";
          var DAY = "dd";
          var YEAR = "yyyy";
          var orderMonth = datePattern.indexOf(MONTH);
          var orderDay = datePattern.indexOf(DAY);
          var orderYear = datePattern.indexOf(YEAR);
          if ((orderDay < orderYear && orderDay > orderMonth)) {
            var iDelim1 = orderMonth + MONTH.length;
            var iDelim2 = orderDay + DAY.length;
            var delim1 = datePattern.substring(iDelim1, iDelim1 + 1);
            var delim2 = datePattern.substring(iDelim2, iDelim2 + 1);
            if (iDelim1 == orderDay && iDelim2 == orderYear) {
              dateRegexp = new RegExp("^(\\d{2})(\\d{2})(\\d{4})$");
            } else if (iDelim1 == orderDay) {
               dateRegexp = new RegExp("^(\\d{2})(\\d{2})[" + delim2 + "](\\d{4})$");
            } else if (iDelim2 == orderYear) {
               dateRegexp = new RegExp("^(\\d{2})[" + delim1 + "](\\d{2})(\\d{4})$");
            } else {
               dateRegexp = new RegExp("^(\\d{2})[" + delim1 + "](\\d{2})[" + delim2 + "](\\d{4})$");
            }
          var matched = dateRegexp.exec(value);
          if(matched != null) {
             if (!isValidDate(matched[2], matched[1], matched[3])) {
               if (i == 0) {
                  focusField = field;
               }
               fields[i++] = oDate[x][1];
               bValid =  false;
              }
           } else {
              if (i == 0) {
                focusField = field;
               }
              fields[i++] = oDate[x][1];
              bValid =  false;
           }
         } else if ((orderMonth < orderYear && orderMonth > orderDay)) {
           var iDelim1 = orderDay + DAY.length;
           var iDelim2 = orderMonth + MONTH.length;
           var delim1 = datePattern.substring(iDelim1, iDelim1 + 1);
           var delim2 = datePattern.substring(iDelim2, iDelim2 + 1);
           if (iDelim1 == orderMonth && iDelim2 == orderYear) {
              dateRegexp = new RegExp("^(\\d{2})(\\d{2})(\\d{4})$");
           } else if (iDelim1 == orderMonth) {
               dateRegexp = new RegExp("^(\\d{2})(\\d{2})[" + delim2 + "](\\d{4})$");
           } else if (iDelim2 == orderYear) {
              dateRegexp = new RegExp("^(\\d{2})[" + delim1 + "](\\d{2})(\\d{4})$");
           } else {
              dateRegexp = new RegExp("^(\\d{2})[" + delim1 + "](\\d{2})[" + delim2 + "](\\d{4})$");
           }
           var matched = dateRegexp.exec(value);
           if(matched != null) {
              if (!isValidDate(matched[1], matched[2], matched[3])) {
                 if (i == 0) {
                    focusField = field;
                 }
                 fields[i++] = oDate[x][1];
                 bValid =  false;
              }
           } else {
              if (i == 0) {
                focusField = field;
              }
             fields[i++] = oDate[x][1];
             bValid =  false;
           }
         } else if ((orderMonth > orderYear && orderMonth < orderDay)) {
            var iDelim1 = orderYear + YEAR.length;
            var iDelim2 = orderMonth + MONTH.length;
            var delim1 = datePattern.substring(iDelim1, iDelim1 + 1);
            var delim2 = datePattern.substring(iDelim2, iDelim2 + 1);
            if (iDelim1 == orderMonth && iDelim2 == orderDay) {
               dateRegexp = new RegExp("^(\\d{4})(\\d{2})(\\d{2})$");
            } else if (iDelim1 == orderMonth) {
               dateRegexp = new RegExp("^(\\d{4})(\\d{2})[" + delim2 + "](\\d{2})$");
            } else if (iDelim2 == orderDay) {
               dateRegexp = new RegExp("^(\\d{4})[" + delim1 + "](\\d{2})(\\d{2})$");
            } else {
               dateRegexp = new RegExp("^(\\d{4})[" + delim1 + "](\\d{2})[" + delim2 + "](\\d{2})$");
            }
            var matched = dateRegexp.exec(value);
            if(matched != null) {
              if (!isValidDate(matched[3], matched[2], matched[1])) {
                if (i == 0) {
                  focusField = field;
                }
                fields[i++] = oDate[x][1];
                bValid =  false;
              }
            } else {
               if (i == 0) {
                 focusField = field;
               }
               fields[i++] = oDate[x][1];
               bValid =  false;
             }
           } else {
             if (i == 0) {
               focusField = field;
             }
             fields[i++] = oDate[x][1];
             bValid =  false;
           }
         }
       }
  if (fields.length > 0) {
     focusField.focus();
     alert(fields.join('\n'));
   }
  return bValid;
}
    
function isValidDate(day, month, year) {
	    if (month < 1 || month > 12) {
            return false;
        }
        if (day < 1 || day > 31) {
            return false;
        }
        if ((month == 4 || month == 6 || month == 9 || month == 11) &&
            (day == 31)) {
            return false;
        }
        if (month == 2) {
            var leap = (year % 4 == 0 &&
               (year % 100 != 0 || year % 400 == 0));
            if (day>29 || (day == 29 && !leap)) {
                return false;
            }
        }
        return true;
}


function validateInteger(form) {
        var bValid = true;
        var focusField = null;
        var i = 0;
        var fields = [];
        var formName = form.getAttributeNode("name"); 

        oInteger = eval('new IntegerValidations()');
        for (x in oInteger) {
            var field = form[oInteger[x][0]];
             if(typeof field =="undefined")
		        continue;
            if ((field.type == 'text' ||
                field.type == 'textarea') &&
                field.disabled == false) {

                var value = trim(field.value);

                if (value.length > 0) {

                    if (!isAllDigits(value)) {
                        bValid = false;
                        if (i == 0) {
                            focusField = field;
                        }
                        fields[i++] = oInteger[x][1];

                    } else {
                        var iValue = parseInt(value);
                        if (isNaN(iValue) || !(iValue >= -2147483648 && iValue <= 2147483647)) {
                            if (i == 0) {
                                focusField = field;
                            }
                            fields[i++] = oInteger[x][1];
                            bValid = false;
                       }
                   }
               }
            }
        }
        if (fields.length > 0) {
           focusField.focus();
           alert(fields.join('\n'));
        }
        return bValid;
}

function isAllDigits(argvalue) {
        argvalue = argvalue.toString();
        var validChars = "0123456789";
        var startFrom = 0;
        if (argvalue.substring(0, 2) == "0x") {
           validChars = "0123456789abcdefABCDEF";
           startFrom = 2;
        } else if (argvalue.charAt(0) == "0") {
           validChars = "01234567";
           startFrom = 1;
        } else if (argvalue.charAt(0) == "-") {
            startFrom = 1;
        }

        for (var n = startFrom; n < argvalue.length; n++) {
            if (validChars.indexOf(argvalue.substring(n, n+1)) == -1) return false;
        }
        return true;
    }
    
    
function validateFloat(form) {
        var bValid = true;
        var focusField = null;
        var i = 0;
        var fields = [];
         var formName = form.getAttributeNode("name");

        oFloat = eval('new FloatValidations()');
        for (x in oFloat) {
        	var field = form[oFloat[x][0]];
        	if(typeof field =="undefined")
		         continue;
            if ((field.type == 'text' ||
                field.type == 'textarea') &&
                field.disabled == false) {
        
            	var value = trim(field.value);
        
                if (value.length > 0) {
                    // remove '.' before checking digits
                    var tempArray = value.split('.');
                    //Strip off leading '0'
                    var zeroIndex = 0;
                    var joinedString= tempArray.join('');
                    while (joinedString.charAt(zeroIndex) == '0') {
                        zeroIndex++;
                    }
                    var noZeroString = joinedString.substring(zeroIndex,joinedString.length);

                    if (!isAllDigits(noZeroString)) {
                        bValid = false;
                        if (i == 0) {
                            focusField = field;
                        }
                        fields[i++] = oFloat[x][1];

                    } else {
	                var iValue = parseFloat(value);
	                if (isNaN(iValue)) {
	                    if (i == 0) {
	                        focusField = field;
	                    }
	                    fields[i++] = oFloat[x][1];
	                    bValid = false;
	                }
	                /**
                    * 验证整数和小数位数
                    */
	                 var fMin = parseFloat(oFloat[x][2]("min"));
                     var fMax = parseFloat(oFloat[x][2]("max"));
                     var intValue = '';
                     var fragValue = '';
                     //查看是否存在小数
                     var index = value.indexOf(".");
                     if(index==-1){//不存在小数
                        intValue = value;
                     }else{
                        intValue = value.substring(0,index);
                        fragValue = value.substring(index+1);
                     }
                     
                      if (!(intValue.length <= fMax && fragValue.length <= fMin)) {
                         if (i == 0) {
                          focusField = field;
                         }
                        fields[i++] = oFloat[x][1];
                        bValid = false;
                      }
                    }
                }
            }
        }
        if (fields.length > 0) {
           focusField.focus();
           alert(fields.join('\n'));
        }
        return bValid;
    }