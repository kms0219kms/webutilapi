// 출처: https://api.dcmys.kr/%EB%B7%81%EC%96%B4%EB%B2%88%EC%97%AD%EA%B8%B0/
var sendReq = function() {
	var q = $('[name="q"]').value;
	var e = $('[name="e"]').value;
	var t = $('[name="t"]').value;
	if(e == 'tvple') {
		if(q.substr(0,4) != 'feff' || q.substr(20,1) != '_') {
			$("body > form > textarea:nth-of-type(2)").textContent='올바른 키가 아닙니다.';
			return;
		}

		var subtbl = q.substr(69,16).split("");
		var r = HexToStr(q.substr(125).split("").reverse().join("").replace(new RegExp(subtbl[5],"g"),"g").replace(new RegExp(subtbl[4],"g"),"h").replace(new RegExp(subtbl[3],"g"),"i").replace(new RegExp(subtbl[2],"g"),"j").replace(new RegExp(subtbl[1],"g"),"k").replace(new RegExp(subtbl[6],"g"),subtbl[5]).replace(new RegExp(subtbl[7],"g"),subtbl[4]).replace(new RegExp(subtbl[8],"g"),subtbl[3]).replace(new RegExp(subtbl[9],"g"),subtbl[2]).replace(new RegExp(subtbl[10],"g"),subtbl[1]).replace(new RegExp("g","g"),subtbl[6]).replace(new RegExp("h","g"),subtbl[7]).replace(new RegExp("i","g"),subtbl[8]).replace(new RegExp("j","g"),subtbl[9]).replace(new RegExp("k","g"),subtbl[10]));
		$("body > form > textarea:nth-of-type(2)").textContent=UTF8.decode(r);
		return;
	}
	else if(e == 'unicode') {
		var r = JSON.parse('{"result":"'+q+'"}').result;
		$("body > form > textarea:nth-of-type(2)").textContent=r;
		return;
	}
	else if(e == 'monitable') {
		var r = "";
		var styleRegG = /<([^>]+)>/g;
		var styleReg  = /<([^>]+)>/;

		var htmlattr_to_css = {"bgcolor":"background-color","width":"width","color":"color"};
		var tableAlignCount = {"left":0,"center":0,"right":0};
		var tableAlign = 'left';
		var tableStyle = new Array();
		tbody = q.split("\n");

		var tableArr = new Array();
		for(i=0;i<tbody.length;i++) {

			tmp = tbody[i].substring(2,tbody[i].length-2).split('||');
			tableArr[i] = new Array();

			ltmp = tmp.length;
			if(ltmp<1)continue;
			for(j=0;j<ltmp;j++) {
				tableArr[i][j] = new Array();
				wtext = tmp[j];

				if(i == 0 && j == 0 && (whead = wtext.match(/<table([^>]+)>/))) {
					wtext = wtext.replace(/<table([^>]+)>/, '');
					whead = '<' + whead[1].replace(/(?:^\s|\s$)/, '') + '>';
					if(style = whead.match(styleRegG)) {
						for(k=0;k<style.length;k++) {
							if(htag = style[k].match(styleReg)) {
								if(htag = htag[1].match(/[a-zA-Z]+\s?=\s?(?:[^\'\"]+|\'[^\']+\'|\"[^\"]+\")/g)) {
									for(l=0;l<htag.length;l++) {
										if(htmp = htag[l].match(/([a-zA-Z]+)\s?=\s?(?:(\"[^\"]+\"|\'[^\']+\')|(.+))/)) {
											tableStyle[htmp[1]] = htmp[2]?htmp[2].substring(1,htmp[2].length-1):htmp[3];
										}
									}
								}
							}
						}
					}
				}
				if(whead = wtext.substr(0, wtext.indexOf("> ")+1)) {
					if(style = whead.match(styleRegG)) {
						for(k=0;k<style.length;k++) {
							if(htag = style[k].match(styleReg)) {
								if(htagr = htag[1].match(/[a-zA-Z]+\s?=\s?(?:[^\'\"]+|\'[^\']+\'|\"[^\"]+\")/g)) {
									htag = htagr;
									for(l=0;l<htag.length;l++) {
										if(htmp = htag[l].match(/([a-zA-Z]+)\s?=\s?(?:(\"[^\"]+\"|\'[^\']+\')|(.+))/)) {
											tableArr[i][j][htmp[1]] = htmp[2]?htmp[2].substring(1,htmp[2].length-1):htmp[3];
										}
									}
								}
								else if(htagr = htag[1].match(/\#[0-9a-fA-F]{3,6}/)) {
									tableArr[i][j]['color'] = htagr[0];
								}
							}
						}
					}
				}
				if(rowspan = wtext.match(/<\|([0-9]+)>/))
					tableArr[i][j]['rowspan'] = rowspan[1];
				else if(colspan = wtext.match(/<\-([0-9]+)>/))
					tableArr[i][j]['colspan'] = colspan[1];

				wtext = wtext.substring(0, wtext.indexOf("> ")+1).replace(styleRegG, '') + wtext.substring(wtext.indexOf("> ")+1);
				
				
				if(!tableArr[i][j]['align']) {
					if(wtext.substr(0,1)!==' ')
						tableArr[i][j]['align'] = "left";
					else if(wtext.substr(wtext.length-1)!==' ')
						tableArr[i][j]['align'] = "right";
					else
						tableArr[i][j]['align'] = "center";
				}

				wtext = wtext.replace(/(^\s+|\s+$)/g, '');
				wtext = wtext.replace(/\[\[br\]\]/g, '<br/>');
				wtext = wtext.replace(/\[\[HTML\((.*?)\)\]\]/g, '$1');
/*			좆망데스요 좆망

				wtext = wtext.replace(/\[\* ([^\]]+)\]/g, '<ref>$1</ref>');
				wtext = wtext.replace(/\[\*([^\s]+) ([^\]]+)\]/g, '<ref name="$1">$2</ref>');*/
				wtext = wtext.replace(/\[{1,2}wiki\:"([^"]+)"\s?([^\]]+)\]{1,2}/g, '[[$1|$2]]');
				wtext = wtext.replace(/(^|[^\[])\[([^\*][^\]]+)\]($|[^\]])/g, '$1[[$2]]$3');

				tableArr[i][j]['wtext'] = wtext;

				tableAlignCount[tableArr[i][j]['align']]++;
			}
		}

		var max = tableAlignCount['left'];

		if(tableAlignCount['center']>max) {
			max=tableAlignCount['center'];
			tableAlign = 'center';
		}
		if(tableAlignCount['right']>max) {
			max=tableAlignCount['right'];
			tableAlign = 'right';
		}
		
		r += '<!-- 뷁어번역기로 변환된 표입니다. -->' + "\n";
		var tablecss='';
		for(k in tableStyle){ if(htmlattr_to_css[k]) tablecss += ' ' + htmlattr_to_css[k] + ': ' + tableStyle[k] + ';'; }
		r += '{| class="wikitable" style="text-align: ' + tableAlign + '; ' + tablecss + '"' + "\n";
		for(i=0;i<tableArr.length;i++){
			spliter = i==0 ? '!' : '|';

			if(!tableArr[i])
				continue;

			r += spliter;
			for(j=0;j<tableArr[i].length;j++){
				tdhead = (tableArr[i][j]['rowspan']?' rowspan="' + tableArr[i][j]['rowspan'] + '"':'') + (tableArr[i][j]['colspan']?' colspan="' + tableArr[i][j]['colspan'] + '"':'');
				tdcss  = (tableArr[i][j]['align'] != tableAlign ? ' text-align: ' + tableArr[i][j]['align'] + ';':'');
				for(k in tableArr[i][j]){ if(htmlattr_to_css[k]) tdcss += ' ' + htmlattr_to_css[k] + ': ' + tableArr[i][j][k] + ';'; }
				tdhead+= (tdcss?' style="' + tdcss.replace(/^\s+/g, '') + '"':'');
				r += (tdhead?tdhead + ' |':'') + ' ' + tableArr[i][j]['wtext'] + ' ' + spliter + spliter;
			}
			r = r.substr(0,r.length-3);
			r += "\n|-\n";
		}
		r = r.substr(0,r.length-3);
		r+="|}";
		$("body > form > textarea:nth-of-type(2)").textContent=r;
		return;
	}
	simpleRequest(
		"./", 
		function(r) { $("body > form > textarea:nth-of-type(2)").textContent=r.responseText; },
		"POST",
		{"Content-Type":"application/x-www-form-urlencoded","X-Requested-With":"XMLHttpRequest"},
		"q="+encodeURIComponent($('[name="q"]').value)+"&e="+encodeURIComponent($('[name="e"]').value)+"&t="+encodeURIComponent($('[name="t"]').value)+"&u="+encodeURIComponent($('[name="u"]').checked?1:0)+"&r="+encodeURIComponent($('[name="r"]').checked?1:0)
	);
};

var eChanged = function() {
	var disableTypes = ['tvple','gzip','basehangul','base64','monitable','unicode','quoted-printable'];
	if(disableTypes.contains($('[name="e"]').value)) {
		$('[name="t"]').disabled="disabled";
		$('[name="t"] > option[value="utf-8"]').selected = true;
	}
	else
		$('[name="t"]').disabled=null;
	sendReq();
}

var main = function() {
	$('body > form:nth-of-type(1) [name="q"]').addEventListener("keyup", sendReq);
	$('body > form:nth-of-type(1) [name="q"]').addEventListener("change", sendReq);
	$('body > form:nth-of-type(1) [name="e"]').addEventListener("change", eChanged);
	$('body > form:nth-of-type(1) [name="t"]').addEventListener("change", sendReq);
	$('body > form:nth-of-type(1) [name="u"]').addEventListener("change", sendReq);
	$('body > form:nth-of-type(1) [name="r"]').addEventListener("change", sendReq);
	$('body > form:nth-of-type(1) input[type="submit"]').style.display="none";
};

var HexToStr = function (hex) {
	var str = '';
	for (var i = 0; i < hex.length; i += 2)
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	return str;
}

UTF8 = {
	encode: function(s){
		for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
			s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]);
		return s.join("");
  },
  decode: function(s){
		for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
			((a = s[i][c](0)) & 0x80) &&
			(s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
			o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
		);
		return s.join("");
  }
};
