// extention의 popup 페이지에서 동작하는 스크립트로 페이지에서 실행되는 스크립트와는 분리 되어야 합니다.

// load subtitle 버튼이 클릭되면 인스턴스 생성
function loadSub() {    
    chrome.tabs.executeScript({
        code: `console.log("load subtitle on executeScript@annomymous")`
    });
    console.debug(`sent executeScript load_sub_bt@click`);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "load" }, function(response){});
        console.debug(`sent sendMessage load_sub_bt@click`);
    });
    console.debug(`sent query load_sub_bt@click`);
}

// 유저가 자막 파일을 선택하면 options의 subUrl 변수에 꽂아줌.
function changeSub(){
    const file = document.getElementById('subtitle').files[0];
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "changeSub", objUrl: URL.createObjectURL(file)}, function(response){});
    });
    // 버튼 활성화
    document.getElementById('load_sub_bt').removeAttribute('disabled')
}

// options page 열기
function openOptions() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
}

// attach listener
try {
    document.getElementById('load_sub_bt').addEventListener('click', loadSub);
    document.getElementById('subtitle').addEventListener('change', changeSub);
    document.getElementById('open_options_bt').addEventListener('click', openOptions);
} catch (e) {
    console.debug(`caught exception attaching event listener : popup.js`, JSON.stringify(e));
}