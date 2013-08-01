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

	allUsers.forEach(function(userGroup) {
		allUsersConcerned = allUsersConcerned.concat(usersId[userGroup]);
	});

    createLinkAndClick(allUsersConcerned);
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