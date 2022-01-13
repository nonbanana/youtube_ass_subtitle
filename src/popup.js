// extention의 popup 페이지에서 동작하는 스크립트로 페이지에서 실행되는 스크립트와는 분리 되어야 합니다.

// load subtitle 버튼이 클릭되면 인스턴스 생성
document.getElementById('load_sub_bt').addEventListener('click', function() {    
    chrome.tabs.executeScript({
        code: 'console.log("load subtitle")'
    });
    chrome.tabs.executeScript({
        code: 'subtitle_instance = new SubtitlesOctopus(options);'
    });
});

const input = document.getElementById('subtitle');
document.getElementById('subtitle').addEventListener('change', changeSub);
document.getElementById('font').addEventListener('change', appendFont);
// 유저가 자막 파일을 선택하면 options의 subUrl 변수에 꽂아줌.
function changeSub(){
    var file = document.getElementById('subtitle').files[0];
    chrome.tabs.executeScript({
        code: 'console.log("subtitle file changed")'
    });
    // FIXME - chrome.tabs.executeScript 대신 message로 통신하는게 나아보임  
    chrome.tabs.executeScript({
        code: 'options["subUrl"] = "' + URL.createObjectURL(file) + '";'
    });
    // 버튼 활성화
    document.getElementById('load_sub_bt').removeAttribute('disabled')
}

function appendFont(){
    var files = document.getElementById('font').files;
    chrome.tabs.executeScript({
        code: 'console.log("font file appended")'
    });
    for (var i = 0; i < files.length; i++){
        chrome.tabs.executeScript({
            code: 'console.log("' + files[i] + '");'
        });
        // FIXME - chrome.tabs.executeScript 대신 message로 통신하는게 나아보임  
        chrome.tabs.executeScript({
            code: 'options["fonts"].push("' + URL.createObjectURL(files[i]) + '");'
        });
    }
    chrome.tabs.executeScript({
        code: 'console.log(options["fonts"]);'
    });
    // 버튼 활성화
    document.getElementById('load_sub_bt').removeAttribute('disabled')
}