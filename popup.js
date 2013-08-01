function arrayize(nodelist) {
	return Array.prototype.slice.call(nodelist);
}

// When click on "Everybody", select all checkboxes
document.querySelector('input[value="everybody"]').onclick = function() {
	var allCheckboxes = arrayize(document.querySelectorAll('input[type="checkbox"]:not([value="everybody"])'));

	allCheckboxes.forEach(function(checkbox) {
		checkbox.checked = this.checked;
	}.bind(this));
}

// When click on checkboxes, select or deselect "Everybody" if needed
arrayize(document.querySelectorAll('input:not([value="everybody"])')).forEach(function(checkbox) {
	checkbox.onclick = function() {
		var allCheckboxes = arrayize(document.querySelectorAll('input[type="checkbox"]:not([value="everybody"])'));

		var allCheckboxeschecked = true;
		allCheckboxes.forEach(function(checkbox) {
			if (!checkbox.checked) {
				allCheckboxeschecked = false;
			}
		});

		document.querySelector('input[value="everybody"]').checked = allCheckboxeschecked;
	}
});

// When click on send, send a message to the content script
document.querySelector('#sendButton').onclick = function() {
	var allInputs = arrayize(document.querySelectorAll('.checkbox'));

	var allUserGroups = [];
	allInputs.forEach(function(input) {
		if (input.checked) {
			allUserGroups.push(input.value);
		}
	});

	chrome.tabs.query({'active': true,'currentWindow':true}, function(tab){
		chrome.tabs.sendMessage(tab[0].id, {action: 'sendMessage', userGroups: allUserGroups});
	});
}

// When click on getList, send a message to the content script
document.querySelector('#getListButton').onclick = function() {
	var allInputs = arrayize(document.querySelectorAll('.checkbox'));

	var allUserGroups = [];
	allInputs.forEach(function(input) {
		if (input.checked) {
			allUserGroups.push(input.value);
		}
	});

	chrome.tabs.query({'active': true,'currentWindow':true}, function(tab){
		chrome.tabs.sendMessage(tab[0].id, {action: 'getList'});
	});
}