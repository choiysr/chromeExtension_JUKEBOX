var player;
var currentPlayingIdx;
const API_Server = new URL('http://localhost:8080/');

// TYPE별 음악 차트를 ajax로 가져오고, 화면에 태그를 뿌려주는 function 
function getMusicChartList(type, page) {
    console.log("type체크")
    console.log(type)
    $('html').scrollTop(0);

    function success(result) {
        let $musicChartDiv = $('.bottom');
        $musicChartDiv.html(makeMusicChartListTag(result.content));

        $('.chartType').each(function (index, item) {
            if (item.dataset.id != type) {
                $('[data-id="' + item.dataset.id + '"]').removeClass('clicked');
            } else {
                $('[data-id="' + item.dataset.id + '"]').addClass('clicked');
            }
        })
    }

    ajaxService.getAjax(API_Server.commonURL + 'musicChartList/' + type + '/' + page, success);

}


// 음악 차트 리스트 태그를 만들어서 문자열 형태로 반환하는 function
function makeMusicChartListTag(song) {
    let listStr = '';
    song.forEach((song, index) => {
        listStr += '<ul><li class="w20">' + song.ranking + '</li>'
            + '<li class="w50 rd"><img src="' + song.thumbnail + '" width="40px" alt="album art"></li>'
            + '<li class="w140 lf">' + song.title + '<div class="artist">' + song.singer + '</div></li>'
            + '<li class="w28 click" data-sid="' + song.sid + '"><img src="play_list.png" alt="재생" width="12px"></li>'
            + '<li class="w28 click" data-sid="' + song.sid + '"><img src="plus_list.png" alt="추가" width="12px"></li></ul>'
    })
    return listStr;
}

$(document).ready(() => {
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    getMusicChartList('realtime',1);
    onPlay();

    $('#chartTypes').on('click', 'li', function (e) {
        // 로고 and 로그인 버튼 클릭 이벤트 설정하기
        e.preventDefault;
        let type = this.dataset.id;
        let $chartText = $("#chartText");
        if (type != null) {
            console.log('null이 아님')
            if (type == 'realtime') {
                $chartText.text('실시간차트')
            } else if (type == 'daily') {
                $chartText.text('일간차트')
            } else if (type == 'weekly') {
                $chartText.text('주간차트')
            } else {
                $chartText.text('월간차트')
            }
            getMusicChartList(type, 1);
        }
    })


}) // end of onready 



function onPlay(targetIdx) {
    console.log("확인")
    if (player == null) {
        console.log("플레이어 객체 생성");
        setTimeout(() => {
            player = new YT.Player('player', {
                height: '187',
                width: '285',
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