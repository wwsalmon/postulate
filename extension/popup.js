chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log(tabs[0].url);
    chrome.tabs.create({ url: `https://postulate.us/quick?url=${encodeURIComponent(tabs[0].url)}&isExtension=true` });
});