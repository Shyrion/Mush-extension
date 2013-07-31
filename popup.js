function createLinkClick(people) {
	document.getElementById(people).onclick = function () {
		chrome.tabs.query({'active': true,'currentWindow':true}, function(tab){
			chrome.tabs.sendMessage(tab[0].id, {users: people});
		});
	}
}

createLinkClick("everybody");
createLinkClick("ready");
createLinkClick("notReady");
createLinkClick("inGame");

chrome.pageAction.onClicked.addListener(function() {
	console.log("clicked popup");
	document.getElementById("everybody").blur();
});