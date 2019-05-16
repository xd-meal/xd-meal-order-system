chrome.runtime.onInstalled.addListener(function() {});
const SERVER = "http://localhost:8888/";
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "http") {
    let data = message.data;
    let url = message.url;
    axios[message.method](SERVER + url).then(
      function(response) {
        console.log(SERVER);
        sendResponse({ status: 200, data: response.data });
      },
      function(response) {
        console.log(SERVER);
        sendResponse({ status: 500, response });
      }
    );
  }
});
