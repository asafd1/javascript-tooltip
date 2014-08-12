function parseSignedInt(h){
  var bytes = h.length * 4;
  var maxUnsigned = Math.pow(2, bytes);
  var n = parseInt(h,16);
  if (n < (maxUnsigned/2))
  {
    return n;
  }

  return n - maxUnsigned;
}
function getSpecialChar(bint){
  switch(bint) {
    case 9:
        return "."; /* \t */
    case 10:
        return "."; /* \n */
    case 13:
        return "."; /* \cr */
    default:
        return null;
  }
}
// get a hex byte array and return in in the format of string, int or unsigned int (according to the content of the bytes and length of the sequence)
function parseHex(h){
  var text = "";
  var l = h.length;
  var num = "";
  if (l % 2 != 0)
  {
    return "n/a";
  }

  var strFromHex = "";
  var strType = "S";
  for (i = l - 2; i >= 0; i -= 2)
  {
    var b = h.substr(i,2);
    num += b;

    if (strType == "S")
    {
      var bint = parseInt(b,16);
      var specialChar = getSpecialChar(bint);
      if ((bint >= 32 && bint < 127) || specialChar != null)
      {
        // a valid ascii character or a supported whitespace 
        strFromHex = (specialChar != null ? specialChar : String.fromCharCode(bint)) + strFromHex;
      } else {
        strType = "N";
        strFromHex = "";
      }
    }
  }

  var isValidNumber = false;
  var unsigned;
  if (h.length == 2 || h.length == 4 || h.length == 8)
  {
    isValidNumber = true;
    unsigned = parseInt(num,16);
  }

  if (strType == "S")
  {
    if (isValidNumber)
    {
      text = unsigned + ", String: ";
    }
    text += "'" + strFromHex + "'";
  } else {
    if (isValidNumber)
    {
      var unsigned = parseInt(num,16);
      var signed = parseSignedInt(num);
      if (signed == unsigned)
      {
        text = unsigned;
      } else {
        text = "Unsigned: " + unsigned;
        text += ", Signed: " + signed;
      }
    } else {
      text = "N/A";
    }
  }
  return text;
}
function hex2dec(h){
  var text;
  var unsigned = parseInt(h,16);
  var signed = parseSignedInt(h);
  if (signed == unsigned)
  {
    text = unsigned;
  } else {
    text = "Unsigned: " + unsigned;
    text += ", Signed: " + signed;
  }
  return text;
}
function setToolTip(self, h){
  // remove ALL spaces
  var re = new RegExp(String.fromCharCode(160), "g"); // 160 is &nbsp;
  h = h.replace(/ /g,'');
  h = h.replace(re,'');

  var text = parseHex(h);

  $(self).addClass("tooltip");
  $(self).append("<span>"+text+"</span>");
  var left = $(self).position().left;
  var topVisible = $(window).scrollTop();
  var top = $(self).position().top - 30 > topVisible ? $(self).position().top - 30 : $(self).position().top + 30;
  $(self).find("span").offset({ top: top, left: left + 20});
  $(self).find("span").css("display", "inline");
}
function removeToolTip(){
  $("z").find("span").remove();
  $("z").removeClass("tooltip");
}
function hasSelection(){
  return !window.getSelection().toString().length == 0;
}
$(document).ready(function(){
  $("z").on("mouseover", function(){
    if (hasSelection())
    {
      return;
    }

    var h = $(this).text();
  
    removeToolTip();
    setToolTip(this, h);
  });
  $("z").on("mouseout", function(){
    if (hasSelection())
    {
      return;
    }
    removeToolTip();
  });
  $("code").on("mouseup", function(){
    if (!hasSelection())
    {
      return;
    }
    
    var s = window.getSelection();
    var f = s.focusNode;
    var e = f.parentElement;
    
    removeToolTip();

    if ($(e).is("z"))
    {
      setToolTip(e, s.toString());
    }
  });
  $("code").on("mousedown", function(){
    removeToolTip();
  });
});