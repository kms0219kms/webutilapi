// 출처: http://www.kidols.net/
function count()
{
	var spacenum=0, total=0, linenum=0, minusnum=0, multibyte=0, singlebyte=0;
	
	for(i=0;i<document.textCounterForm.content.value.length;i++){
	
		if(document.textCounterForm.content.value.charAt(i)==' '){
			spacenum++;
		}
		if(document.textCounterForm.content.value.charCodeAt(i)==13 || document.textCounterForm.content.value.charCodeAt(i)==10){
			minusnum++;
		}
		if(document.textCounterForm.content.value.charCodeAt(i)==10){
			linenum++;
		
		}
		if(document.textCounterForm.content.value.charCodeAt(i)>255){
			multibyte++;
		}else{
			singlebyte++;
		}
		
	}

	if(document.textCounterForm.options.value=='1'){
		total = multibyte + singlebyte - minusnum;
		if(document.textCounterForm.lines.value=='1') total = total + linenum;
		else if(document.textCounterForm.lines.value=='2') total = total + (linenum*2);
		if(document.textCounterForm.space.checked) total = total-spacenum;

		
	}else if(document.textCounterForm.options.value=='2'){
		total = multibyte + (singlebyte - minusnum)*0.5;
		if(document.textCounterForm.lines.value=='1') total = total + (linenum*0.5);
		else if(document.textCounterForm.lines.value=='2') total = total + linenum;
		if(document.textCounterForm.space.checked) total = total-spacenum;
		
	} else if(document.textCounterForm.options.value=='3'){
		total = (multibyte*2) + singlebyte - minusnum;
		if(document.textCounterForm.lines.value=='1') total = total + linenum;
		else if(document.textCounterForm.lines.value=='2') total = total + (linenum*2);
		if(document.textCounterForm.space.checked) total = total-spacenum;
		
	} else {
		total = (multibyte*3) + singlebyte - minusnum;
		if(document.textCounterForm.lines.value=='1') total = total + linenum;
		else if(document.textCounterForm.lines.value=='2') total = total + (linenum*2);
		if(document.textCounterForm.space.checked) total = total-spacenum;

	}
	
	document.textCounterForm.length.value = total+" 자";
}
