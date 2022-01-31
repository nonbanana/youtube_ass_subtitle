// extention의 popup 페이지에서 동작하는 스크립트로 페이지에서 실행되는 스크립트와는 분리 되어야 합니다.

// load subtitle 버튼이 클릭되면 인스턴스 생성
document.getElementById('load_sub_bt').addEventListener('click', function() {    
    chrome.tabs.executeScript({
        code: 'console.log("load subtitle")'
    });
    console.log("aaaaaaa");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "load" }, function(response){});
    });

    chrome.tabs.onUpdated.addListener(function
        (tabId, changeInfo, tab) {
          if (changeInfo.url) {

              chrome.tabs.executeScript({
                  code: 'instance.dispose();'
              });
              }
        }
    );

});

document.getElementById('subtitle').addEventListener('change', changeSub);
document.getElementById('font').addEventListener('change', appendFont);

// 유저가 자막 파일을 선택하면 options의 subUrl 변수에 꽂아줌.
function changeSub(){
    var file = document.getElementById('subtitle').files[0];
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "changeSub", objUrl: URL.createObjectURL(file)}, function(response){});
    });
    // 버튼 활성화
    document.getElementById('load_sub_bt').removeAttribute('disabled')
}

// 폰트 파일을 URL로 만들어서 url 리스트를 메세지로 보내기 (options의 fonts 애 꽂아줌)
function appendFont(){
    var files = document.getElementById('font').files;
    fileUrl = [];
    for (var i = 0; i < files.length; i++){
        fileUrl.push(URL.createObjectURL(files[i]))
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "appendFont", objUrl: fileUrl}, function(response){});
    });
}
