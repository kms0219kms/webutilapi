// 출처: https://www.minzkn.com/random.html

window.addEventListener('load', init, false);

function init(){
	document.getElementById("calcButton").addEventListener("click", drawing, false);
	
    function drawing(event) {
		event.preventDefault();
		
		var startNUM = parseInt(document.getElementById("startNUM").value);
		var endNUM = parseInt(document.getElementById("endNUM").value);
		var selectNum = parseInt(document.getElementById("selectNum").value);
		
        var numArray = new Array;
        var randomNum;
		
        var overlappingFlag;
		
		if(startNUM > endNUM) {
			alert("숫자 범위가 뒤바뀐 듯 합니다.");
			
			var tempNum = startNUM;
			startNUM = endNUM;
			endNUM = tempNum;
		}
		
		var rangeNum = endNUM + 1 - startNUM;
		if(rangeNum < selectNum) {
			alert("입력된 숫자범위의 경우의 수보다 추출 숫자의 갯수가 커서 추출 숫자의 갯수를 " + rangeNum + "(으)로 제한합니다.");
			selectNum = rangeNum;
		}
		
		while(selectNum) {
 			randomNum = Math.floor(Math.random(1) * (endNUM + 1 - startNUM)) + startNUM;			

            overlappingFlag = false;
            for(var a in numArray) {
                if(numArray[a] == randomNum) {
                    overlappingFlag = true;
                    break;
                }
            }
            if(!overlappingFlag) {
                numArray.push(randomNum);
                selectNum--;
            }
        }

 		numArray.sort(function (left, right) {
			return left - right;
		});

 		document.getElementById("console").innerHTML = "&gt; 행운의 숫자:<br/>" + numArray.join(", ");
    }
}
