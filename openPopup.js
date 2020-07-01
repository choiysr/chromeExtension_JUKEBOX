chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      height: 640,
      width : 630 
    }, function(win) {
      console.log("--!!!SUCCESS!")
      // win represents the Window object from windows API
      // Do something after opening
    });
});

// $(document).ready(() => {
//     window.open(
//         chrome.runtime.getURL("popup.html"),
//         "exampleName",
//         "width=630,height=640"
//     );
//     //close시 Document popup창도 닫히는 문제 수정 
//     //window.close();
// })
