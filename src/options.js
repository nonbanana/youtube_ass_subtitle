// extention의 options 페이지에서 동작하는 스크립트로 페이지에서 실행되는 스크립트와는 분리 되어야 합니다.


// 폰트 파일을 URL로 만들어서 url 리스트를 메세지로 보내기 (options의 fonts 애 꽂아줌)
function appendFont(){
    var files = document.getElementById('font').files;
    fileUrl = [];
    for (var i = 0; i < files.length; i++){
        fileUrl.push(URL.createObjectURL(files[i]))
    }

    // FIXME: appendFont 했을 때 따로　key-value storage 에 넣고 페이지 로드 때, 또는 subtitle 로드 때 불러오도록 하는 것이 좋을 것 같다. 
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "appendFont", objUrl: fileUrl}, function(response){});
        console.debug(`sent sendMessage appendFont@invoke`);
    });
    console.debug(`sent query appendFont@invoke`);
}

// attach listener
document.getElementById('font').addEventListener('change', appendFont);
