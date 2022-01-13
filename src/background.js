chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
    if (changeInfo.url) {

        chrome.tabs.executeScript({
            code: 'subtitle_instance.dispose();'
        });
        chrome.tabs.executeScript({
            code: 'console.log("dispose subtitle");'
        });
    }
});