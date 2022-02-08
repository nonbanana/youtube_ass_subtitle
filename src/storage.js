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
    // console.log('Value currently is ' + result.key);
    const got_value = JSON.parse(result[`${key}`]);
    promise.resolve(got_value);
  });
}