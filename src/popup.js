
document.getElementById('load_sub_bt').addEventListener('click', function() {
    
    chrome.tabs.executeScript({
        code: 'console.log("load subtitle")'
    });
    chrome.tabs.executeScript({
        code: 'var instance = new SubtitlesOctopus(options);'
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

const input = document.getElementById('subtitle');
input.addEventListener('change', fileChange);
function fileChange(){
    var file = input.files[0];
    chrome.tabs.executeScript({
        code: 'console.log("subtitle file changed")'
    });
    chrome.tabs.executeScript({
        code: 'options["subUrl"] = "' + URL.createObjectURL(file) + '";'
    });
    document.getElementById('load_sub_bt').removeAttribute('disabled')
}