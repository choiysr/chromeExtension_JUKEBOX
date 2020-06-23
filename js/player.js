var player;

$(document).ready(() => {
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    onPlay();
})


function onPlay(targetIdx) {
    console.log("확인")
    if (player == null) {
        console.log("플레이어 객체 생성");
        setTimeout(() => {
            player = new YT.Player('player', {
                height: '217',
                width: '290',
                videoId: '3yST4DBZ8aE',
                host: 'https://www.youtube.com',
                playerVars: {
                    'controls': 1, //플레이어 컨드롤러 표시여부
                    'playsinline': 1, //ios환경에서 전체화면으로 재생하지 않게하는 옵션
                    'autoplay': 1, //자동재생 여부
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }, 1000);

    } else {
        player.loadVideoById(youtubeId);
    }
}
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    console.log("영상 시작");
    event.target.playVideo();
}

function onPlayerStateChange(event) {

    let isFinished = player.getPlayerState() == 0;
    // 한곡반복일 경우
    if (isFinished && $('#repeatOneSong').attr('data-isChecked') === 'true') {
        onPlay(currentPlayingIdx);
    } // 마지막 곡 재생이 끝났는데 전곡반복일 경우, 첫번째 곡을 다시 재생한다
    else if (isFinished && $(".listCount").length == currentPlayingIdx && $('#repeatAll').attr('data-isChecked') === 'true') {
        onPlay(1);
    } // 재생이 종료됐으면 다음 영상을 재생한다.
    else if (isFinished) {
        console.log("영상종료");
        playNext();
    }
}

function playNext(idx) {
    //플레이리스트 idx 로 이어서 재생.
    let nextPage;
    if (idx != undefined) {
        nextPage = currentPlayingIdx;
    } else {
        nextPage = ++currentPlayingIdx;
    }

    onPlay(nextPage);
}

function stopVideo() {
    player.stopVideo();
}