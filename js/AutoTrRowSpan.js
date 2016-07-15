$(function(){
	
	/**
  	��� ���� : TR üũ�� ���� TR�� ���� TD���� RowSpan�� �ʰ��� �� ������ �� 
  */
	
  /* 1. ��ü�� ���� RowSpan�� ����, TR üũ(�⺻���� ���) */
  fn_autoHtmlTrRowspan("#trg_rwspn");	
  //fn_autoHtmlTrRowspan("#trg_rwspn",null,null,"true");	
  
  /* 2. ��ü�� ���� RowSpan�� ����, TR üũ ���� */
  //fn_autoHtmlTrRowspan("#trg_rwspn",null,null,false);	
  
  /* 3. ������ TD�� RowSpan�� ����,�ϰ� TR üũ */  
	//fn_autoHtmlTrRowspanId("trg_rwspn","0,1");  
  
  /* 4. ������ TD�� RowSpan�� ����,�ϰ� TR üũ(������ TD) */  
  //fn_autoHtmlTrRowspanId("trg_rwspn","0,2,3",true,true,"0,2");  
  
  /* 5. ������ TD�� RowSpan�� ������, TR üũ */  
  //fn_autoHtmlTrRowspanId("trg_rwspn","0,1",false);
  
  /* 6. ������ TD�� RowSpan�� ������, TR üũ ���� */  
  //fn_autoHtmlTrRowspanId("trg_rwspn","0","false", false);  
  
  
});

/** 
�Ķ���� ���� 
selector �ʼ��̸�, �Ϻ� ��ɸ� ���� �Ķ���ͷ� null(default : true)�� �����ϰ�,
idxInExYn ���ÿ��� tdIdxSep �ʼ��̸�,
tdIdxCheckSep ���ÿ��� trChkYn �� true �̾�� ��.


1. selector [�ʼ�] : ��� ���̺��� class �Ǵ� id 
- fn_autoHtmlTrRowspanClass �Ǵ� fn_autoHtmlTrRowspanId ȣ���� Ŭ������ �Ǵ� ���̵�.
	ex) "trg_rwspn"
- fn_autoHtmlTrRowspan ȣ���� jQuery selector��ȣ�� ����.
	ex) "#trg_rwspn"(���̵�), ".trg_rwspan"(Ŭ����)

2. tdIdxSep [����] : Ư���� TD(column)��(����) �����ϰ� ���� ��� �����.
- idxInExYn �� ����� ���
- ���ڿ��� �����ڴ� "," ���·� �����ϰ�, ���۹�ȣ�� 0������.
	ex) "0,2"

3. idxInExYn [����] : Ư����(tdIdxSep �Ķ����) TD(column)�� RowSpan�� ���� ����.
- boolean �Ķ���ͷ� arrStr �Ķ���Ͱ� �ʿ���.
- ���ڿ� �Ǵ� ���� �� ���� 
	ex) "true" or true
- true  : arrStr�� �ε������� RowSpan�� ����(default).
- false : arrStr�� �ε������� RowSpan�� ������.

4. trChkYn [����] : TR(row) üũ ����
- ���� TR�� ���� TD���� RowSpan�� �ʰ��� �� ������ ��.
- true  : üũ�� ������(default).
- false : üũ���� �ʰ� ���� �����Ͽ� TD�� �������� RowSpan ��.

5. tdIdxCheckSep [����] : TR üũ�ÿ� ������ TD�� ����.
- trChkYn �� true �̾�� ��
- ���ڿ��� �����ڴ� "," ���·� �����ϰ�, ���۹�ȣ�� 0������.
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
        
        // this TR children TD check(low index TD RowSpan possible) : ���� td�� rowspan�� �ʰ� ����
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