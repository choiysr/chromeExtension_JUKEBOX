<<<<<<< HEAD
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      height: 640,
      width : 630 
    }, function(win) {
      // win represents the Window object from windows API
      // Do something after opening
    });
=======
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    height: 640,
    width: 630
  });
>>>>>>> 0a1a5b83b3e28201aca35d53660267c9ec023a15
});

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message === "hi")
      sendResponse({message: "hi to you"});
  });
// chrome.runtime.onConnect.addListener(function (port) {
//   port.onMessage.addListener(function (msg, request, sendResponse) {
//     port.postMessage({ message: "hi to you" });
//   });
// });

// $(document).ready(() => {
//     window.open(
//         chrome.runtime.getURL("popup.html"),
//         "exampleName",
//         "width=630,height=640"
//     );
//     //close시 Document popup창도 닫히는 문제 수정 
//     //window.close();
// })
