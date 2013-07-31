function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url == 'http://mush.vg/g/anonymush' ||
		tab.url == 'http://mush.vg/g/anonymush/center' ||
		tab.url == 'mush.vg/g/anonymush' ||
		tab.url == 'mush.vg/g/anonymush/center') {
		// ... show the page action.
		chrome.pageAction.show(tabId);

		
		chrome.pageAction.onClicked.addListener(function() {
			console.log("clicked bg");
			document.getElementById("everybody").blur();
		});
	}
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onUpdated.addListener(function() { console.log("update")});