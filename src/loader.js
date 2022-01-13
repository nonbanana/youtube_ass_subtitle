// content script

// subtitles octopus 인스턴스 할당할 변수 선언
var subtitle_instance;
// subtitles octopus 옵션 변수
var options = {
    video: document.getElementsByClassName('video-stream html5-main-video')[0],
    // subUrl: chrome.runtime.getURL('{subtitle_path}'), // will edit by popup.js
    // TODO - add user's font file 
    fonts: [
        chrome.runtime.getURL('data/fonts/NotoSansCJKkr-Regular.otf')
        ],
    debug: false,
    workerUrl: chrome.runtime.getURL('src/subtitles_octopus/subtitles-octopus-worker.js')
}
