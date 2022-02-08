// storage related.


// 매개변수로 제공된 key와 valueString에 해당하는 string을 storage에 설정합니다.
function setStorageString(key, valueString, promise) {
  const object_to_set = {};
  object_to_set[`${key}`] = valueString; 
  chrome.storage.local.set(object_to_set, function() {
    // console.log(`${key} is set to ${valueString}`);
    promise.resolve(valueString);
  });
}

// storage 에서 key에 해당하는 값을 가진 string을 반환합니다
function getStorageString(key, promise) {
  chrome.storage.local.get(`${key}`, function(result) {
    // console.log(`${key} currently is ` + result[`${key}`]);
    const valueString = result[`${key}`];
    promise.resolve(valueString);
  });
}


// base64 문자열을 blob url로 반환합니다.
function base64ToBlobUrl(valueString, mimeType) {
  const raw = atob(valueString);
  const rawLength = raw.length;
  const uint8Array = new Uint8Array(new ArrayBuffer(rawLength));
  for (let i = 0; i < rawLength; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  const blobObj = new Blob([uint8Array], {
    type: mimeType
  });
  const blobUrl = window.URL.createObjectURL(blobObj)
  return blobUrl;
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
      promise.reject(`unable to load file : fileToBase64()`, e);
    }
  });
  reader.readAsArrayBuffer(file);
}
