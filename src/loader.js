var options = {
    video: document.getElementsByClassName('video-stream html5-main-video')[0],
    // subUrl: chrome.runtime.getURL('revue_movie/revue_movie.ass'), // Link to subtitles
    fonts: [
        chrome.runtime.getURL('data/fonts/NotoSansCJKkr-Regular.otf')
        ],
    debug: false,
    workerUrl: chrome.runtime.getURL('src/subtitles_octopus/subtitles-octopus-worker.js')
}
