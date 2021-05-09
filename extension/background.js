window.onload = () => {
    chrome.contextMenus.create({ title: "Save to Postulate", onclick: onContextMenuSave, contexts: ["selection"] });

    chrome.commands.onCommand.addListener(function(command) {
        if (command === "keyboard_save") {
            onContextMenuSave();
        }
    });
}

function onContextMenuSave() {
    chrome.tabs.executeScript({file: "contextMenuSave.js"});
}