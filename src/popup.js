// extention의 popup 페이지에서 동작하는 스크립트로 페이지에서 실행되는 스크립트와는 분리 되어야 합니다.

document.getElementById('subtitle').addEventListener('click', changeSub);
document.getElementById('font').addEventListener('click', appendFont);

function changeSub(){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "changeSub"}, function(response){});
    });
}

function appendFont(){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "appendFont"}, function(response){});
    });
}
