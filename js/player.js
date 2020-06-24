var player;
var currentPlayingIdx;
const API_Server = new URL('http://localhost:8080/');


// 음악차트 리스트 태그를 만들어서 문자열 형태로 반환하는 function
function makeMusicChartListTag(song) {
    let listStr = '';
    song.forEach((song, index) => {
        listStr += '<ul><li class="w20">' + song.ranking + '</li>'
            + '<li class="w50 rd"><img src="' + song.thumbnail + '" width="40px" alt="album art"></li>'
            + '<li class="w135 lf"><span class="title-span">' + song.title + '</span><div class="artist"><span class="singer-span">' + song.singer + '</span></div></li>'
            + '<li class="w28 click play-now" data-sid="' + song.sid + '" data-youtubeId="' + song.youtubeId + '"><img src="play_list.png" alt="재생" width="12px"></li>'
            + '<li class="w28 click add-only" data-sid="' + song.sid + '" data-youtubeId="' + song.youtubeId + '"><img src="plus_list.png" alt="추가" width="12px"></li></ul>'
    })
    return listStr;
}

// 플레이리스트 태그를 만들어서 문자열 형태로 반환하는 function
function makeMyListTag(song) {
    let listStr = '';
    let listCount = $('.listCount').length;
    song.forEach((song, index) => {
        listStr += '<ul><li class="w20 listCount"><input type="checkbox" id="chk_' + song.sid + '" value="' + (listCount + 1) + '" data-idx="' + (listCount + 1) + '" data-sid="' + song.sid + '" data-youtubeId="' + song.youtubeId + '" data-pid="' + song.pid + '">'
            + '<label for="chk_' + song.sid + '"></label></li>'
            + '<li class="w200 lf"><span>' + song.title + '</span><div class="artist"><span>' + song.singer + '</span></div></li>'
            + '<li class="w28 click"><img src="close.png" alt="삭제" width="9px"></li></ul>';
        ++listCount;
    })
    return listStr;
}

// TYPE별 음악 차트를 ajax로 가져오고, 화면에 태그를 뿌려주는 function 
function getMusicChartList(type, page) {
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

// Chart 리스트의 곡 추가 버튼을 눌렀을때 Player에 추가해주는 function
function addMusicIntoPlayList(target, play) {
    let $target = $(target);
    let $listDiv = $(".myPlaylist");
    let currentListCount = $('.listCount').length;
    let songArr = [];
    // 로그인정보 삽입시 pid 수정 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    let pid = '';
    song = {
        'pid': pid,
        'sid': $target.data('sid'),
        // data속성은 소문자로 조회해야한다(?)
        'youtubeId': $target.data('youtubeid'),
        'title': $target.parent().find('.title-span').text(),
        'singer': $target.parent().find('.singer-span').text()
    };
    console.log($target)
    console.log(song)
    songArr.push(song);
    $listDiv.append(makeMyListTag(songArr));

    // 리스트에 아무곡도 들어있지 않았던 경우 리스트영역을 띄우고 리스트에 들어온 가장 첫곡을 재생시킨다. 
    // undefine 고려해서 조건문 수정할것!!!! 
    if (currentListCount == 0) {
        // 리스트 영역을 띄운후
        onPlay(1);
    }
    else if (currentListCount != 0 && play == 'play') {
        onPlay(currentListCount + 1);
    }
}


$(document).ready(() => {
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    getMusicChartList('realtime', 1);
    onPlay();

    // 상단 차트타입 선택시 이벤트 
    $('#chartTypes').on('click', 'li', function (e) {
        // 로고 and 로그인 버튼 클릭 이벤트 설정하기!!!!!!!!!!!!!!!!!!!
        $('.left').scrollTop(0);
        e.preventDefault;
        let type = this.dataset.id;
        let $chartText = $("#chartText");
        if (type != null) {
            if (type == 'realtime') {
                $chartText.text('REALTIME CHART')
            } else if (type == 'daily') {
                $chartText.text('DAILY CHART')
            } else if (type == 'weekly') {
                $chartText.text('WEEKLY CHART')
            } else {
                $chartText.text('MONTHLY CHART')
            }
            getMusicChartList(type, 1);
        }
    })

    // 차트에서 각 노래 추가 버튼 이벤트
    $(".add-only").on('click', function (e) {
        e.preventDefault;
        addMusicIntoPlayList(this);
    })

    // 차트에서 각 노래 재생 버튼 이벤트
    $('.play-now').on('click', function (e) {
        e.preventDefault;
        addMusicIntoPlayList(this, 'play');

    });



}) // end of onready 



function onPlay(targetIdx) {
    currentPlayingIdx = targetIdx;
    let youtubeId = $('[data-idx="' + targetIdx + '"]').data('youtubeid');
    if (player == null) {
        console.log("플레이어 객체 생성");
        setTimeout(() => {
            player = new YT.Player('player', {
                height: '187',
                width: '285',
                videoId: youtubeId,
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