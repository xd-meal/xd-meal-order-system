function getAll() {
  return Promise.all([
    new Promise(function(resolve) {
      chrome.storage.sync.get(["YOUR_NAME"], function(value) {
        resolve(value);
      });
    }),
    new Promise(function(resolve) {
      chrome.storage.sync.get(["DEPARTMENT"], function(value) {
        resolve(value);
      });
    })
  ]).then(function(res) {
    return { ...res[0], ...res[1] };
  });
}
let d = document.querySelector("#d");
let n = document.querySelector("#n");
getAll().then(function(result) {
  let { YOUR_NAME, DEPARTMENT } = result;
  d.value = DEPARTMENT;
  n.value = YOUR_NAME;
});
d.addEventListener("input", function(event) {
  chrome.storage.sync.set({ DEPARTMENT: event.currentTarget.value }, function(
  ) {});
});
n.addEventListener("input", function(event) {
  chrome.storage.sync.set({ YOUR_NAME: event.currentTarget.value }, function(
    
  ) {});
});
