function checker(elm, type) {  if (elm != undefined) {    if (type == 'href') {      return elm.href;    }    if (type == 'text') {      return elm.innerText;    }    if (type == 'next') {      return elm;    }  } else {    return '';  }}

function reg(elm, n) {  if (elm != null) {    return elm[n];  } else {    return '';  }}


//var profileContainArr = [];
var userContainArr = [];

var baseUrl = window.location.href.replace(/&p=\d*/, '');

var flexHeader = checker(document.getElementsByClassName('d-flex flex-column flex-md-row flex-justify-between border-bottom pb-3 position-relative')[0], 'next');

var numUsers = parseInt(checker(flexHeader.getElementsByTagName('h3')[0], 'text').replace(/\D+/g, ''));



function getNumPages(num){
	var mp = Math.floor(num/10);
	if(mp>99){return 100;}else{return mp;}
}

function descLoopPages(totalNum, n){
	setTimeout(()=>{
		var pwnd = window.open(baseUrl+'&p='+(n+1));
		setTimeout(()=>{
			var userList = pwnd.document.getElementsByClassName('user-list-info');
			getUserList(userList);
		},3300);
		setTimeout(()=>{
			pwnd.close();
		},3700);
	},((n+1)*3800));
}

function ascLoopPages(totalNum, n){0
	setTimeout(()=>{
		var pwnd = window.open(baseUrl.replace(/=desc/, '=asc')+'&p='+(n+1));
		setTimeout(()=>{
			var userList = pwnd.document.getElementsByClassName('user-list-info');
			getUserList(userList);
		},3300);
		setTimeout(()=>{
			pwnd.close();
		},3700);
	},((n+1)*3800));
}

function getUserList(arr){
	for(i=0; i<arr.length; i++){
		var link = checker(arr[i].getElementsByTagName('a')[0], 'href');
		userContainArr.push(link);
	}
}

function runPageRUNdesc(){
	setTimeout(()=>{
	var pag = getNumPages(numUsers);
    	for(r=0; r<pag; r++){
			descLoopPages(pag, r);
		}
	}, 333);
}
function runPageRUNasc(){
	setTimeout(()=>{ //this timeout is just to ensure the initial calculations have completed
		var pag = getNumPages(numUsers);
		setTimeout(()=>{ //this timeout should probably be moved. oops. 
			if(pag == 100){	
    			for(r=0; r<pag; r++){
					ascLoopPages(pag, r);
				}
    		}
		}, (100*3833));
	}, 333);
}
runPageRUNasc()
runPageRUNdesc()

