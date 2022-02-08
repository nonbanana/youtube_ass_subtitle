// storage related.


// 매개변수로 제공된 key와 value에 해당하는 값을 storage에 JSON으로 변환하여 설정합니다.
function setStorage(key, value, promise) {
  const object_to_set = {};
  object_to_set[`${key}`] = JSON.stringify(value); 
  chrome.storage.local.set(object_to_set, function() {
    // console.log('Value is set to ' + value);
    promise.resolve(object_to_set);
  });
}

// storage 에서 key에 해당하는 값을 가진 js object을 반환합니다
function getStorage(key, promise) {
  chrome.storage.local.get(`${key}`, function(result) {
    // console.log('Value currently is ' + result[`${key}`]);
    const got_value = JSON.parse(result[`${key}`]);
    promise.resolve(got_value);
  });
}


// base64 문자열을 blob url로 반환합니다.
function base64ToBlobUrl(string, mimeType) {
  const raw = atob(string);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  const blob = new Blob([array], {
    type: mimeType
  });
  const url = window.URL.createObjectURL(blob)
  return url;
}

// file (input[type=file])에서 파일을 읽어 base64 문자열로 반환합니다.
function fileToBase64(file, promise) {
  const reader = new FileReader();
  reader.addEventListener('load', function (loadEvent) {
    try {
      const uint8Array = new Uint8Array(loadEvent.target.result);
      const base64string = ArrayBuffer.from(uint8Array).toString('base64');
      promise.resolve(base64string);
    } catch (e) {
      console.error(`unable to load file : fileToBase64()`, e);
      promise.reject(`unable to load file : fileToBase64()`,e);
    }
  });
  reader.readAsArrayBuffer(file);
}
