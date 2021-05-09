chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    chrome.tabs.create({ url: `https://postulate.us/quick?url=${encodeURIComponent(tabs[0].url)}&isExtension=true` });
});