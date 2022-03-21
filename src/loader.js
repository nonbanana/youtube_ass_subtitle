// content script

// subtitles octopus 인스턴스 할당할 변수 선언
var subtitle_instance;

// 자막, 폰트 파일을 가져오기 위한 input
var input = document.createElement("input");
input.type = "file";

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
        console.log("open subtitle file dialog");
        // 자막 변경하기
        openFile(".ass, .ssa", false, function (event) {
            var file = event.target.files[0];        
            options["subUrl"] = URL.createObjectURL(file);
            loadSub();
        });
    }else if (request.greeting === "appendFont"){
        // 폰트 목록 추가
        console.log("open font file dialog");
        openFile(".ttf, .otf", true, function (event) {
            // 리눅스(fedora35/gnome)에서 폴더 추가가 가능하여 extension 체크 로직 추가
            var allowedExtensions = /(\.otf|\.ttf)$/i;
            var files = event.target.files;
            fileUrl = [];
            for (var i = 0; i < files.length; i++){
                if (!allowedExtensions.exec(files[i].name)) {
                    continue;
                } 
                fileUrl.push(URL.createObjectURL(files[i]))
            }
            options["fonts"] = options["fonts"].concat(fileUrl)
            loadSub();
        });

    }
});


// inner functions
// -------------------------------------

// file open function
// accept_ext: 확장자가 xxx, yyy 일때, ".xxx, .yyy"
// multiple: boolean
// onchange: input onchange시 실행되는 함수
async function openFile(accept_ext, multiple, onchange){
    input.accept = accept_ext;
    input.onchange = onchange;
    input.multiple = multiple;
    input.click();
}

// video 태그에 subtitle octopus 이용해 자막 로드
async function loadSub(){
    console.log("load subtitle")
    if (!options["subUrl"]){
        return;
    }
    if (subtitle_instance){
        subtitle_instance.freeTrack();
    }
    options["video"] = document.getElementsByClassName('video-stream html5-main-video')[0]
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
