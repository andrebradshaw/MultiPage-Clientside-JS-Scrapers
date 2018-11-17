/*/ watch the live build: 
https://youtu.be/4MVhm6vlRpQ
/*/

function checker(elm, type) {
  if (elm != undefined) {
    if (type == 'href') {
      return elm.href;
    }
    if (type == 'text') {
      return elm.innerText;
    }
    if (type == 'next') {
      return elm;
    }
  } else {
    return '';
  }
}

function reg(elm, n) {
  if (elm != null) {
    return elm[n];
  } else {
    return '';
  }
}

function getApprxLastVisit(elm){
	var oneday = 86400000;
	var str = reg(/(?<=Last visited ).+/.exec(elm),0);
	var now = new Date().getTime();
	if(/today/.test(str) === true){
		return new Date(now-(oneday));
	}
	if(/past few days/.test(str) === true){
		return new Date(now-(oneday*3));
	}
	if(/a week ago/.test(str) === true){
		return new Date(now-(oneday*7));
	}
	if(/past two weeks/.test(str) === true){
		return new Date(now-(oneday*14));
	}
	if(/over two weeks ago/.test(str) === true){
		return new Date(now-(oneday*21));
	}
	if(/over a month ago/.test(str) === true){
		return new Date(now-(oneday*40));
	}
	if(/over two months ago/.test(str) === true){
		return new Date(now-(oneday*70));
	}
	if(/over three months ago/.test(str) === true){
		return new Date(now-(oneday*100));
	}
	if(/over four months ago/.test(str) === true){
		return new Date(now-(oneday*130));
	}
	if(/over five months ago/.test(str) === true){
		return new Date(now-(oneday*160));
	}
	if(/over six months ago/.test(str) === true){
		return new Date(now-(oneday*190));
	}
	if(/over seven months ago/.test(str) === true){
		return new Date(now-(oneday*220));
	}
	if(/over seven months ago/.test(str) === true){
		return new Date(now-(oneday*220));
	}
	if(/over eight months ago/.test(str) === true){
		return new Date(now-(oneday*250));
	}
	if(/over nine months ago/.test(str) === true){
		return new Date(now-(oneday*280));
	}
	if(/over ten months ago/.test(str) === true){
		return new Date(now-(oneday*310));
	}
	if(/over eleven months ago/.test(str) === true){
		return new Date(now-(oneday*340));
	}
	if(/over a year ago/.test(str) === true){
		return new Date(now-(oneday*370));
	}
}
var pagesArray = [];
var memberLinksArray = [];
var memberDetailsArray = [];

var basePage = window.location.href.replace(/(?<=members\/).+/, '');
var numberOfMembers = parseInt(checker(document.getElementsByClassName('D_count')[0], 'text').replace(/\D+/g, ''));
var numberOfPages = Math.ceil(numberOfMembers / 20);
for (p = 0; p < numberOfPages; p++) {
  pagesArray.push(basePage + '?offset=' + (p * 20) + '&sort=social&desc=1');
}


function getMemberLinks(pageLink, n) {
  setTimeout(() => {
    var pwin = window.open(pageLink)
    setTimeout(() => {
      var containedList = pwin.document.getElementById('memberList');
      if (containedList != null) {
        var memberList = containedList.getElementsByClassName('clearfix line memberInfo');
        for (i = 0; i < memberList.length; i++) {
          var itm = checker(memberList[i].getElementsByTagName('a')[0], 'href');
		  var lastvisit = checker(memberList[i].getElementsByClassName('last')[0], 'text');

          memberLinksArray.push([itm,getApprxLastVisit(lastvisit)]);
        }
      }
    }, 4500);
    setTimeout(() => {
      pwin.close();
    }, 4950);
  }, ((n + 1) * 5000));
}

function runPages(arr) {
  for (i = 0; i < arr.length; i++) {
    getMemberLinks(arr[i], i)
  }
}

var memberScrape_waitTime = (numberOfPages * 5050);
alert('just a heads up, this is going to take ' + ((numberOfMembers * 5)/60) +' minutes to complete.');

var runfirst = new Promise(res => {
  res(runPages(pagesArray));
});

function getProfileData(links, t) {
  setTimeout(() => {
    function getProfile(link, n) {
      setTimeout(() => {
        var wnd = window.open(link[0]);
        setTimeout(() => {
          var fullname = checker(wnd.document.getElementsByClassName('memName fn')[0], 'text');
          var groupContainer = checker(wnd.document.getElementsByClassName('paddedList groupinfo-widget-root')[0], 'next');
          var profContent = wnd.document.getElementById('D_memberProfileQuestions');
          var question = profContent.getElementsByTagName('h4');
          var answer = profContent.getElementsByTagName('p');
          var keywords = reg(/(?<=meetup\.com\/).+?(?=\/)/.exec(link[0]), 0).replace(/-/g, '%20OR%20');

          function getLinkedIn(nm, mem) {
            var first = reg(/^\S+/.exec(nm), 0);
            var last = reg(/(?<!^)\S+$/.exec(nm), 0);
            return 'www.linkedin.com/search/results/people/?firstName=' + first + '&keywords=' + mem + '&lastName=' + last;
          }

          function getGroups(elm) {
            var garr = [];
            if (elm != '') {
              var groupList = elm.getElementsByClassName('D_group figureset groupinfo-widget');
              for (i = 0; i < groupList.length; i++) {
                var atag = groupList[i].getElementsByClassName('figureset-description')[0].getElementsByTagName('a')[0];
                var name = atag.innerText.trim().replace(/"/g, '');
                var url = atag.href;
                garr.push([name, url]);
              }
            }
            return garr;
          }

          function getInterests() {
            var interests = [];
            var hobb = wnd.document.getElementById('memberTopicList');
            if (hobb != null) {
              var interestLi = hobb.getElementsByTagName('a');
              for (i = 0; i < interestLi.length; i++) {
                var itm = interestLi[i].innerText;
                interests.push(itm);
              }
            }
            return interests;
          }

          function getContent(qq, aa) {
            var contArr = [];
            if (qq.length > 1) {
              for (i = 1; i < qq.length; i++) {
                let q = checker(qq[i],'text');
                let a = checker(aa[i],'text');
                contArr.push([q, a]);
              }
            }
            return contArr;
          }

          var personObj = {
            'name': fullname,
			'profile': link[0],
			'activedate': link[1],
            'geo': answer[0].innerText,
            'groups': getGroups(groupContainer),
            'interests': getInterests(),
            'details': getContent(question, answer),
            'linkedin': getLinkedIn(fullname, keywords)
          }
          memberDetailsArray.push(personObj);
        }, 4500);
		setTimeout(() => {
			wnd.close();
        }, 4950);
      }, ((n + 1) * 5000));
    }
	for(y=0; y<links.length; y++){
		getProfile(links[y], y);
	}

  }, t);
}
function dl(filename, text) {
setTimeout(()=>{
  var elmi = document.createElement('a');
  elmi.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  elmi.setAttribute('download', filename);
  elmi.style.display = 'none';
  document.body.appendChild(elmi);
  elmi.click();
  document.body.removeChild(elmi);
}, (numberOfMembers * 5050));
}
var namethis = /(?<=org\/).+?(?=\/)/.exec(window.location.href);

runfirst.then(getProfileData(memberLinksArray, memberScrape_waitTime)).then(dl(reg(/(?<=meetup\.com\/).+?(?=\/)/.exec(window.location.href), 0)+"_members.json", JSON.stringify(memberDetailsArray)));
