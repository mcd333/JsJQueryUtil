$(function(){
	
	/**
  	사용 예시 : TR 체크는 현재 TR의 이전 TD들의 RowSpan을 초과할 수 없도록 함 
  */
	
  /* 1. 전체에 대해 RowSpan을 적용, TR 체크(기본적인 사용) */
  fn_autoHtmlTrRowspan("#trg_rwspn");	
  //fn_autoHtmlTrRowspan("#trg_rwspn",null,null,"true");	
  
  /* 2. 전체에 대해 RowSpan을 적용, TR 체크 안함 */
  //fn_autoHtmlTrRowspan("#trg_rwspn",null,null,false);	
  
  /* 3. 선택한 TD만 RowSpan을 적용,하고 TR 체크 */  
	//fn_autoHtmlTrRowspanId("trg_rwspn","0,1");  
  
  /* 4. 선택한 TD만 RowSpan을 적용,하고 TR 체크(선택한 TD) */  
  //fn_autoHtmlTrRowspanId("trg_rwspn","0,2,3",true,true,"0,2");  
  
  /* 5. 선택한 TD만 RowSpan을 미적용, TR 체크 */  
  //fn_autoHtmlTrRowspanId("trg_rwspn","0,1",false);
  
  /* 6. 선택한 TD만 RowSpan을 미적용, TR 체크 안함 */  
  //fn_autoHtmlTrRowspanId("trg_rwspn","0","false", false);  
  
  
});

/** 
파라미터 정보 
selector 필수이며, 일부 기능만 사용시 파라미터로 null(default : true)을 전달하고,
idxInExYn 사용시에는 tdIdxSep 필수이며,
tdIdxCheckSep 사용시에는 trChkYn 가 true 이어야 함.


1. selector [필수] : 대상 테이블의 class 또는 id 
- fn_autoHtmlTrRowspanClass 또는 fn_autoHtmlTrRowspanId 호출은 클래스명 또는 아이디값.
	ex) "trg_rwspn"
- fn_autoHtmlTrRowspan 호출은 jQuery selector기호를 붙임.
	ex) "#trg_rwspn"(아이디), ".trg_rwspan"(클래스)

2. tdIdxSep [선택] : 특정한 TD(column)를(복수) 지정하고 싶은 경우 사용함.
- idxInExYn 을 사용할 경우
- 문자열로 구분자는 "," 형태로 전달하고, 시작번호는 0부터임.
	ex) "0,2"

3. idxInExYn [선택] : 특정한(tdIdxSep 파라미터) TD(column)의 RowSpan을 적용 여부.
- boolean 파라미터로 arrStr 파라미터가 필요함.
- 문자열 또는 직접 값 가능 
	ex) "true" or true
- true  : arrStr의 인덱스에만 RowSpan을 적용(default).
- false : arrStr의 인덱스에만 RowSpan을 미적용.

4. trChkYn [선택] : TR(row) 체크 여부
- 현재 TR의 이전 TD들의 RowSpan을 초과할 수 없도록 함.
- true  : 체크를 진행함(default).
- false : 체크하지 않고 행을 무시하여 TD만 기준으로 RowSpan 함.

5. tdIdxCheckSep [선택] : TR 체크시에 선택한 TD만 적용.
- trChkYn 가 true 이어야 함
- 문자열로 구분자는 "," 형태로 전달하고, 시작번호는 0부터임.
*/


// jquery selector class add
function fn_autoHtmlTrRowspanClass(selector, tdIdxSep, idxInExYn, trChkYn, tdIdxChkSep){

	var selectorStr = "." + selector;
	fn_autoHtmlTrRowspan(selectorStr, tdIdxSep, idxInExYn, trChkYn, tdIdxChkSep);
}

// jquery selector id add
function fn_autoHtmlTrRowspanId(selector, tdIdxSep, idxInExYn, trChkYn, tdIdxChkSep){

	var selectorStr = "#" + selector;
	fn_autoHtmlTrRowspan(selectorStr, tdIdxSep, idxInExYn, trChkYn, tdIdxChkSep);
}


function fn_autoHtmlTrRowspan(selector, tdIdxSep, idxInExYn, trChkYn, tdIdxChkSep){
	
	/* Parameter
	selector : define String include "."(class) or "#"(id) , necessary
	tdIdxSep : define String separator "," , not necessary
	idxInExYn : define String or Boolean, not necessary
  trChkYn : define String or Boolean, not necessary
  tdIdxChkSep : define String separator "," , not necessary
	*/
	
	var trObj;							// TBODY TR object
	var trIdx;							// TR index
	var tdObj;							// TBODY TD object
	var tdIdx;							// TD index
	var tdTxt;							// TD text
	var nextRwTdObj;				// next row TD Object
	var nextRwTdTxt;				// next row TD text
	var rwspNum;						// RowSpan number
	var tempTdObj;					// set RowSpan target TD object				
  
  var chkBoolean = true;	// check use Flag
	var compChildTdObj;			// compare TR children TD Object Array
	var compCurrTdObjTxt;		// compare TR children Current Row TD text(Array Index)
	var compNextTdObjTxt;		// compare TR children Next Row TD text(Array Index)
	var flagCnt = 0;				// Not RowSpan count
	
	var idxArr;
	var idxBoolean = true;			// default(true) : idxArr only rowspan, false : idxArr not rowspan
  
  var idxNonChkArr;						// choice compare TR children TD Array
	
	// parameter check
	if (tdIdxSep != undefined) {
		idxArr = tdIdxSep.split(",",-1);   
	}
  
	// parameter check
	if (idxInExYn != undefined) {
		idxBoolean = eval(idxInExYn);   
  }    

	// parameter check
	if (trChkYn != undefined) {
  	chkBoolean = eval(trChkYn);
	}

	// parameter check
	if (tdIdxChkSep != undefined) {
		idxNonChkArr = tdIdxChkSep.split(",",-1);   
	}

	$(selector).find("tr").each(function(i){
		
		trObj = $(this);
		trIdx = $(trObj).index();
		
		$(trObj).find("td").each(function(j){
      
			tdObj = $(this);
			tdIdx = $(tdObj).index();
			tdTxt = $.trim($(tdObj).text());
			nextRwTdObj = $(trObj).next().find("td:eq("+tdIdx+")");
			nextRwTdTxt = $.trim($(nextRwTdObj).text());
			
			if ($(tdObj).css("visibility") == "hidden") {
      
				// current prevAll only visibility TD Array
				tempTdObj = $(trObj).prevAll("tr").find("td:eq("+tdIdx+")").filter(":visible");		
				tempTdObj = $(tempTdObj)[$(tempTdObj).size()-1];	// array last is closest				
				rwspNum = $(tempTdObj).prop("rowspan")+1;
				
				/* rowspan and display:none */
				$(tempTdObj).prop("rowspan",rwspNum);
				$(tdObj).hide();
					
			}		
			
			flagCnt = 0;	// initialization           
      
			if (chkBoolean && tdIdx != 0) {
        
        compChildTdObj = new Array();
        
        var tempIdx;
        var ifStr = "";
        var idxStr = "";
        
        // tr in td All or td choice
        if (idxNonChkArr != undefined) {
          
          // make tr in td array for check
          $.each(idxNonChkArr, function(x){     // choice td     	
            tempIdx = Number(idxNonChkArr[x]);            
          	compChildTdObj[x] = $(trObj).find("td:eq("+tempIdx+")");            
            //console.log($(compChildTdObj[x]).prop("outerHTML"));          
          });
          
          ifStr = "tempIdx < tdIdx";
          idxStr = "tempIdx";
          
        } else {
        
        	// make tr in td array for check
        	compChildTdObj = $(trObj).children("td");  // all td         
          
          ifStr = "m < tdIdx";
          idxStr = "m";
          
        }
        
        // this TR children TD check(low index TD RowSpan possible) : 앞쪽 td의 rowspan을 초과 못함
        $.each(compChildTdObj,function(m){        
          
          tempIdx = $(compChildTdObj[m]).index();          
          
          if (eval(ifStr)) {          

            compCurrTdObjTxt = $(trObj).find("td:eq("+eval(idxStr)+")").text();
            compNextTdObjTxt = $(trObj).next().find("td:eq("+eval(idxStr)+")").text();

            // not RowSpan
            if (compCurrTdObjTxt != compNextTdObjTxt){              
              flagCnt++;               
            }					
          }

        });	// TD check each end  
        
			}
			
			if (tdTxt == nextRwTdTxt && flagCnt == 0){      
				$(nextRwTdObj).css("visibility","hidden");	// not equal display:none
			}

			
			if (idxArr != undefined) {
			      	
				if (idxBoolean) {
			
					// idxArr only rowspan
					if (idxArr.indexOf(tdIdx.toString()) == -1) {
						$(nextRwTdObj).css("visibility","");	// remove style visibility, not RowSpan
					}
					
				} else {
					
					// idxArr not rowspan
					if (idxArr.indexOf(tdIdx.toString()) > -1) {
						$(nextRwTdObj).css("visibility","");	// remove style visibility, not RowSpan
					}
					
				}
				
			}
			
		});	// TD each end
		
	});	// TR each end
	
}