// content script

// subtitles octopus 인스턴스 할당할 변수 선언
var subtitle_instance;

// subtitles octopus 옵션 변수
var options = {
    // youtube video tag
    video: document.getElementsByClassName('video-stream html5-main-video')[0],
    // subUrl: chrome.runtime.getURL('{subtitle_path}'), // will edit by popup.js
    fonts: [
        chrome.runtime.getURL('data/fonts/NotoSansCJKkr-Regular.otf')
        ],
    debug: false,
    // lossyRender: true,
    // blendRender: true,
    // subHeightRatio: 0.75,
    workerUrl: chrome.runtime.getURL('src/subtitles_octopus/subtitles-octopus-worker.js')
}

// popup으로부터의 메세지 리스너
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting === "load"){
        loadSub();
    }else if (request.greeting === "changeSub"){
        // 자막 변경하기
        options["subUrl"] = request.objUrl;
        loadSub();
    }else if (request.greeting === "appendFont"){
        // 폰트 목록 추가
        options["fonts"] = options["fonts"].concat(request.objUrl)
        loadSub();
    }
});

// inner functions
async function loadSub(){
    if (!options["subUrl"]){
        return;
    }
    if (subtitle_instance){
        subtitle_instance.freeTrack();
    }
    subtitle_instance = new SubtitlesOctopus(options);

    // ass 자막의 화면비율 측정하고 캔버스 크기 줄이기
    // TODO - 프론트 만들면서 옵션으로 지정할 수 있게 빼기
    getAssRatio(options["subUrl"]).then(subRatio => {   
        if (subRatio === 0){
            return;
        }
        // video가 그려지는 크기 얻고 자막파일의 비율과 비교  
        videoPos = subtitle_instance.getVideoPosition();
        videoRatio = videoPos.height/videoPos.width;
        subHeightRatio = subRatio/videoRatio
        if (subHeightRatio < 0.95){
            // 세로 비율이 0.95이하로 차이나면, 즉 자막의 세로 비율이 비디오보다 작은경우 
            options["subHeightRatio"] = subHeightRatio;
            subtitle_instance.freeTrack();
            subtitle_instance = new SubtitlesOctopus(options);
        }
    });

}


// ass 파일 파싱해서 읽어서 비율을 계산하자
async function getAssRatio(ass_url) {
    blob = await createBlob(ass_url);
    text = await blob.text();

    textline = text.split(/\r\n|\n/);
    var width = 0;
    var height = 0;
    
    // 100번째 줄 이내로 있을것.
    for (var i = 0; i < 100; i++){
        if (textline[i].startsWith('PlayResX')){
            width = parseInt(textline[i].split(' ')[1]);
        }
    }

    for (var i = 0; i < 100; i++){
        if (textline[i].startsWith('PlayResY')){
            height = parseInt(textline[i].split(' ')[1]);
        }                                                                                                                                                                                                                                      
    }

    // 둘중 하나라도 없으면 0 반환
    if (width === 0 || height === 0){
        return 0;
    }
    return height/width;
}

// URL to blob object
async function createBlob(file_url){
    let response = await fetch(file_url);
    let blob = await response.blob();
    return blob;
}
