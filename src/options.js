// extention의 options 페이지에서 동작하는 스크립트로 페이지에서 실행되는 스크립트와는 분리 되어야 합니다.

// 폰트 파일을 URL로 만들어서 url 리스트를 메세지로 보내기 (options의 fonts 애 꽂아줌)
function appendFont(){
    const files = document.getElementById('font').files;
    const fileUrl = [];
    for (let i = 0; i < files.length; i++){
        fileUrl.push(URL.createObjectURL(files[i]))
    }


    // appendFont 했을 때 따로　key-value storage 에 넣기

    const combinedFontList = [];

    getStorage('font_list', new Promise((got_value) => {
        // got font list successfully
        console.info(`got font_list succesfully`, got_value);
        combinedFontList.push(...got_value);
    }, (reason) => {
        // failed to get font list
        console.error(`failed to get font_list`, reason);
    }));

    combinedFontList.push(...fileUrl);

    setStorage('font_list', combinedFontList, new Promise(() => {
        // set font list successfully
        console.info(`set font_list succesfully`);
    }, (reason) => {
        // failed to set font list
        console.error(`failed to set font_list`, reason);
    }));


    // // 2022-02-02 by LaruYan : subtitle/page 로드 때 불러오도록 하는 것이 좋을 것 같아서 이 부분 deprecate 처리
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "appendFont", objUrl: combinedFontList}, function(response){});
    //     console.debug(`sent sendMessage appendFont@invoke`);
    // });
    // console.debug(`sent query appendFont@invoke`);
}

// attach listener
try {
    document.getElementById('font').addEventListener('change', appendFont);
} catch (e) {
    console.debug(`caught exception attaching event listener : options.js`, JSON.stringify(e));
}