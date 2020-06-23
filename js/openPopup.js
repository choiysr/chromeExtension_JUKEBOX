$(document).ready(() => {
    window.open(
        chrome.runtime.getURL("popup.html"),
        "exampleName",
        "width=630,height=640"
    );
    //close시 Document popup창도 닫히는 문제 수정 
    //window.close();
})
