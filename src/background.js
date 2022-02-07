//페이지 변경 시 자막 해제
chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
    if (changeInfo.url) {
        chrome.tabs.executeScript({
            code: 'subtitle_instance.dispose();'
        });
    }
});