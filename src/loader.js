// content script

// subtitles octopus 인스턴스 할당할 변수 선언
var subtitle_instance;

// subtitles octopus 옵션 변수
var options = {
    // youtube video tag
    video: document.getElementsByClassName('video-stream html5-main-video')[0],
    // subUrl: chrome.runtime.getURL('{subtitle_path}'), // will edit by popup.js
    // TODO - add user's font file 
    fonts: [
        chrome.runtime.getURL('data/fonts/NotoSansCJKkr-Regular.otf')
        ],
    debug: false,
    lossyRender: true,
    // blendRender: true,
    // subHeightRatio: 0.75,
    workerUrl: chrome.runtime.getURL('src/subtitles_octopus/subtitles-octopus-worker.js')
}



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log("aaaaaaa");

    if (request.greeting === "load"){
        
        if (subtitle_instance){
            subtitle_instance.freeTrack();
        }
        subtitle_instance = new SubtitlesOctopus(options);

        getAssRatio(options["subUrl"]).then(subRatio => {
            console.log(subRatio)
            
            // 옵션으로 지정할 수 있게 빼기
            videoPos = subtitle_instance.getVideoPosition();
            videoRatio = videoPos.height/videoPos.width;
            subHeightRatio = subRatio/videoRatio
            if (subHeightRatio < 0.95){
                options["subHeightRatio"] = subHeightRatio;
                subtitle_instance.freeTrack();
                subtitle_instance = new SubtitlesOctopus(options);
            }
        });
    }
});

// inner functions


// ass 파일 파싱해서 읽어서 비율을 계산하자
async function getAssRatio(ass_url) {
    blob = await createBlob(ass_url);
    text = await blob.text();

    textline = text.split(/\r\n|\n/);
    var width = 0;
    var height = 0;
    
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
