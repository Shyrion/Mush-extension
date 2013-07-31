var tableSummar = document.querySelector(".bgtablesummar");
var allUsersNode = tableSummar.querySelectorAll("ul li");

var usersId = {
	all: [],
	ready: [],
	notReady: [],
	inGame: [],
	unknown: []
}

function createUser(userNode) {
	var user = {};
	user.state = getUserState(userNode.lastElementChild.src);
	user.id = getUserId(userNode.querySelector('a'));
	return user;
}

function getUserState(imageUrl) {
	if (imageUrl.indexOf("in_game") != -1)
		return "inGame"
	if (imageUrl.indexOf("not_ready") != -1)
		return "notReady"
	if (imageUrl.indexOf("ready") != -1)
		return "ready"

	return "unknown";
}

function getUserId(userLink) {
	return userLink.href.split('/')[4];
}

for (var i=0; i<allUsersNode.length; i++) {
	var user = createUser(allUsersNode[i]);
	sortUser(user);
}

function sortUser(user) {
	usersId[user.state].push(user.id);
	usersId.all.push(user.id);
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

	for (var i=0; i<listPeople.length-1; i++) {
		discussLinkHref += listPeople[i] + ',';
	}
	discussLinkHref += listPeople[listPeople.length-1];

	discussLinkHref += "]);"
	discussLink.href = discussLinkHref;
	discussLink.click();
}

function onMessageListener(request, sender, sendResponse) {
    if (request.users == 'everybody')
        createLinkAndClick(usersId.all);
    if (request.users == 'ready')
        createLinkAndClick(usersId.ready);
    if (request.users == 'notReady')
        createLinkAndClick(usersId.notReady);
    if (request.users == 'inGame')
        createLinkAndClick(usersId.inGame);

    sendResponse({});
}

chrome.runtime.onMessage.addListener(onMessageListener.bind(this));