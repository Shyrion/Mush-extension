var tableSummar = document.querySelector(".bgtablesummar");
var allUsersNode = tableSummar.querySelectorAll("ul li");

var usersId = {
	everybody: [],
	ready: [],
	notReady: [],
	inGame: [],
	unknown: []
}

function User(userNode) {

	function getState(imageUrl) {
		if (imageUrl.indexOf("in_game") != -1)
			return "inGame"
		if (imageUrl.indexOf("not_ready") != -1)
			return "notReady"
		if (imageUrl.indexOf("ready") != -1)
			return "ready"

		return "unknown";
	}

	function getId(userLink) {
		return userLink.href.split('/')[4];
	}

	function getName(userLink) {
		return userLink.href.split('/')[4];
	}

	this.state = getState(userNode.lastElementChild.src);
	this.id = getId(userNode.querySelector('a'));
	//this.name = getName(userNode.)
}


for (var i=0; i<allUsersNode.length; i++) {
	var user =  new User(allUsersNode[i]);
	sortUser(user);
}

function sortUser(user) {
	usersId[user.state].push(user.id);
	usersId.everybody.push(user.id);
}

// Holiday stuff

function getPeopleOnHoliday(onFinished) {

	
	httpRequest = new XMLHttpRequest();

	var oldResponse = ''; // Will track if we got the same response twice
	var nextPage = 2;
	var peopleCurrentlyInHoliday = [];
	
	httpRequest.onreadystatechange = function() {

		if (httpRequest.readyState==4 && httpRequest.status==200) {

			if (oldResponse == httpRequest.responseText) {
				if (onFinished && typeof(onFinished)=='function')
					onFinished(peopleCurrentlyInHoliday);
				return;
			}

			var response = oldResponse = httpRequest.responseText;

			var scriptStart = "_tid.forum.fill('right')('";
			response = response.replace(/(\n|\t)/gm, '');
			response = response.removeAll('\\r');
			response = response.removeAll('\\n');
			response = response.removeAll('&nbsp;');
			response = response.removeAll('  ');

			response = response.substring(scriptStart.length, response.length-3);


			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(response, "application/xml");

			var data = parseForumForHoliday(xmlDoc);

			var today = new Date();
			data.forEach(function(userAndDate) {
				/*if (userAndDate.date.start < today) {
					if (userAndDate.date.end && today < userAndDate.date.end) {
						userAndDate.users.forEach(function(user) {
							peopleCurrentlyInHoliday.push(user.id);
						})
					}
				}*/
				userAndDate.users.forEach(function(user) {
					peopleCurrentlyInHoliday.push(user.id);
				})
			})


			httpRequest.open("GET","http://twinoid.com/mod/forum/thread/27790688?_id=tid_forum;jsm=1;lang=fr;host=mush.vg;sid=p9vrYZ7BRNGmNPmoBlWrXd3LtuHdMjhr;p="+nextPage,true);
			httpRequest.send();
		}
	}
	
	httpRequest.open("GET","http://twinoid.com/mod/forum/thread/27790688?_id=tid_forum;jsm=1;lang=fr;host=mush.vg;sid=p9vrYZ7BRNGmNPmoBlWrXd3LtuHdMjhr;p=1",true);
	httpRequest.send();

	// TODO : deal with pages

}

function parseForumForHoliday(xmlDoc) {
	var allContents = arrayize(xmlDoc.querySelectorAll('.editorContent'));

	function parseFrenchDate(dateString) {

		var dateSplit = dateString.split('/');

		var today = new Date();

		var year = (dateSplit.length > 2) ? dateSplit[2] : today.getYear();
		var month =  (dateSplit.length > 1) ? dateSplit[1] : today.getMonth();
		var day =  (dateSplit.length > 0) ? dateSplit[0] : today.getDate();

		return new Date(year, month-1, day);
	}

	function parseDates(node) {

		var date = {start: null, end: null};

		var allDates = arrayize(node.querySelectorAll('strong'));
		allDates.forEach(function(strong) {

			var parsedDate = parseFrenchDate(strong.textContent);

			if (!date.start) {
				date.start = parsedDate;
			} else {
				date.end = parsedDate;
			}
		});

		return (date.start ? date : null);

	}

	function parseUsers(node) {

		var users = [];

		var allSpans = arrayize(node.querySelectorAll('span'));

		if (!allSpans.length) return null;

		allSpans.forEach(function(span) {
			var user = {id: -1, name: ''};
			user.id = span.getAttribute('tid_id');
			if (user.id) {
				user.name = span.textContent;
				users.push(user);
			}

			return false;
		})

		return users;

	}

	allPeopleInHoliday = [];
	allContents.forEach(function(content) {
		var date = parseDates(content);
		var users = parseUsers(content);

		if (users && users.length && date)
			allPeopleInHoliday.push({date: date, users: users});
	});

	return allPeopleInHoliday;
}

/*
var absoluteElement = document.createElement("div");
absoluteElement.id = "floatingDiv";
absoluteElement.style.top = "30px";
absoluteElement.style.left = "10px";

var pElement = document.createElement("p");
pElement.innerHTML = "Envoyer un message à :";
absoluteElement.appendChild(pElement);

/*
var discussLinkAll = createDiscussLink("Tout le monde", usersId.all);
absoluteElement.appendChild(discussLinkAll);

var discussLinkReady = createDiscussLink("Membres prêts", usersId.ready);
absoluteElement.appendChild(discussLinkReady);

var discussLinkNotReady = createDiscussLink("Membres pas prêts", usersId.notReady);
absoluteElement.appendChild(discussLinkNotReady);

var discussLinkInGame = createDiscussLink("En voyage ailleurs", usersId.inGame);
absoluteElement.appendChild(discussLinkInGame);
*/

function createLinkAndClick(listPeople) {
	var discussLink = document.createElement("a");
	var discussLinkHref = "javascript: _tid.askDiscuss([";
	discussLinkHref += listPeople.toString();
	discussLinkHref += "]);"
	discussLink.href = discussLinkHref;
	discussLink.click();
}

function sendMessage(allUsers) {

	var allUsersConcerned = [];

	function addUsersForSelectedGroups(allUsers) {
		if (allUsers.onHoliday) return;

		allUsers.forEach(function(userGroup) {
			allUsersConcerned = allUsersConcerned.concat(usersId[userGroup]);
		});

    	createLinkAndClick(allUsersConcerned);
	}

	if ((allUsers.indexOf('onHoliday') != -1) && (allUsers.indexOf('everybody') == -1)) {
		getPeopleOnHoliday(function(peopleOnHoliday) {
			allUsersConcerned.push(peopleOnHoliday);
			addUsersForSelectedGroups(allUsers);
		});
	} else {
		addUsersForSelectedGroups(allUsers);
	}
}

function getList() {

	var allUsersConcerned = [];

	var floatingDiv = document.createElement('div');
	floatingDiv.id = 'floatingDiv';
	document.body.appendChild(floatingDiv);


	var pElem = document.createElement('p');
	pElem.innerHTML = "SALUT LES MUSCLES";
	floatingDiv.appendChild(pElem);
}

function onMessageListener(request, sender, sendResponse) {
	if (request.action == "sendMessage") {
		sendMessage(request.userGroups);
	} else if (request.action == "getList") {
		getList();
	}

    sendResponse({status: 'OK'});
}

chrome.runtime.onMessage.addListener(onMessageListener.bind(this));




//====================//
//== Utils function ==//
//====================//

String.prototype.removeAll = function(char) {
	var str = this;
	while (str.indexOf(char) > 0) {
		str = str.replace(char, '');
	}
	return str;
}

function arrayize(nodelist) {
	return Array.prototype.slice.call(nodelist);
}
