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


var profileContainArr = [];
var userContainArr = [];

var baseUrl = window.location.href.replace(/&p=\d*/, '');

var flexHeader = checker(document.getElementsByClassName('d-flex flex-column flex-md-row flex-justify-between border-bottom pb-3 position-relative')[0], 'next');

var numUsers = parseInt(checker(flexHeader.getElementsByTagName('h3')[0], 'text').replace(/\D+/g, ''));

function getNumPages(num) {
  var mp = Math.floor(num / 10);
  if (mp > 99) {
    return 100;
  } else {
    return mp;
  }
}

function descLoopPages(totalNum, n) {
  setTimeout(() => {
    var pwnd = window.open(baseUrl + '&p=' + (n + 1));
    setTimeout(() => {
      var userList = pwnd.document.getElementsByClassName('user-list-info');
      getUserList(userList);
    }, 3300);
    setTimeout(() => {
      pwnd.close();
    }, 3700);
  }, ((n + 1) * 3800));
}

function ascLoopPages(totalNum, n) {
  0
  setTimeout(() => {
    var pwnd = window.open(baseUrl.replace(/=desc/, '=asc') + '&p=' + (n + 1));
    setTimeout(() => {
      var userList = pwnd.document.getElementsByClassName('user-list-info');
      getUserList(userList);
    }, 3300);
    setTimeout(() => {
      pwnd.close();
    }, 3700);
  }, ((n + 1) * 3800));
}

function getUserList(arr) {
  for (i = 0; i < arr.length; i++) {
    var link = checker(arr[i].getElementsByTagName('a')[0], 'href');
    userContainArr.push(link);
  }
}

function runPageRUNdesc() {
  setTimeout(() => {
    var pag = getNumPages(numUsers);
    for (r = 0; r < pag; r++) {
      descLoopPages(pag, r);
    }
  }, 333);
}

function runPageRUNasc() {
  setTimeout(() => {
    var pag = getNumPages(numUsers);
    setTimeout(() => {
      if (pag == 100) {
        for (r = 0; r < pag; r++) {
          ascLoopPages(pag, r);
        }
      }
    }, (100 * 3833));
  }, 333);
}


function getProfileDataJSON(lnk, nn) {
  setTimeout(() => {
    var pfw = window.open(lnk);
    setTimeout(() => {
      var fullname = checker(checker(pfw.document.getElementsByClassName('vcard-names')[0], 'next').getElementsByTagName('span')[0], 'text')

      var summary = checker(pfw.document.getElementsByClassName('p-note user-profile-bio')[0], 'text').trim();

      var vcard = checker(pfw.document.getElementsByClassName('vcard-details')[0], 'next');

      var empl = checker(vcard.getElementsByClassName('p-org')[0], 'text');
      var geo = checker(vcard.getElementsByClassName('p-label')[0], 'text');
      var email = checker(vcard.getElementsByClassName('u-email')[0], 'text');
      var web = checker(vcard.getElementsByClassName('u-url')[0], 'text');

      function getCommitsData(html) {
        var regXc = 'data-count="(\\d+)" data-date="(\\d+-\\d+-\\d+)';
        var regXcells_g = new RegExp(regXc, "g");
        var regXcells = new RegExp(regXc);
        var commitCells = html.match(regXcells_g);
        var commitsArr = [];
        for (m = 0; m < commitCells.length; m++) {
          var numCommit = regXcells.exec(commitCells[m])[1];
          var date = new Date(regXcells.exec(commitCells[m])[2]).getTime();
          if (numCommit > 0) {
            commitsArr.push('{"num":' + numCommit + ',"date":' + date + '}');
          }
        }
        return '[' + commitsArr.toString() + ']';
      }

      function getPinnedRepos() {
        var arr = [];
        var pinnedContainer = checker(pfw.document.getElementsByClassName('js-pinned-repos-reorder-container')[0], 'next');
        var list = pinnedContainer.getElementsByTagName('li');
        for (i = 0; i < list.length; i++) {
          var attr = list[i].getAttribute('class');
          var name = checker(list[i].getElementsByTagName('a')[0], 'text');
          var link = checker(list[i].getElementsByTagName('a')[0], 'href');
          var lang = checker(list[i].getElementsByClassName('mb-0 f6 text-gray')[0], 'text').trim();
          if (/public fork/.test(attr) === true) {
            var forked = 1;
          } else {
            var forked = 0;
          }
          arr.push({
            'name': name,
            'link': link,
            'fork': forked,
            'lang': lang
          });
        }
        return arr;
      }

      var commitsData = getCommitsData(pfw.document.getElementsByClassName('border border-gray-dark py-2 graph-before-activity-overview')[0].innerHTML);

      var repos = getPinnedRepos();

      var profileObj = {
        'fullname': fullname,
        'employer': empl,
        'geo': geo,
        'email': email,
        'web': web,
        'repos': repos,
        'commits': commitsData
      };
      profileContainArr.push(profileObj);
    }, 3100);
    setTimeout(() => {
      pfw.close();
    }, 3780);
  }, ((nn * 3800)));
}

function unq(arrg) {
  return arrg.filter((arr, pos, elm) => {
    return arr.indexOf(elm) == pos;
  });
}


var runFirst = new Promise(res => {
  res(runPageRUNdesc());
});

function runTheProfileLoop() {

  var numUs = getNumPages(numUsers);
  if (numUs > 99) {
    var n = 200;
  } else {
    var n = Math.ceil(numUs / 10);
  }
  setTimeout(() => {
    var profileArr = unq(userContainArr);
    for (i = 0; i < profileArr.length; i++) {
      getProfileDataJSON(profileArr[i], i);
    }
  }, (n * 3833));

}
runFirst.then(runPageRUNasc())
  .then(runTheProfileLoop());
