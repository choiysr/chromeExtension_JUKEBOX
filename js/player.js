var player;
var currentPlayingIdx;
var REALTIME_TXT = "";
var DAILY_TXT = "";
var WEEKLY_TXT = "";
var MONTHLY_TXT = "";
var currentTime = "";
var today = "";


const API_Server = new URL('http://localhost:8080/');




// 영상 재생 function 
function onPlay(targetIdx) {
    currentPlayingIdx = targetIdx;
    let youtubeId = $('[data-idx="' + targetIdx + '"]').data('youtubeid');
    if (player == null) {
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
    currSongColorChange(targetIdx)
}

// 영상이 준비되면 플레이 시키는 function 
function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    let isFinished = player.getPlayerState() == 0;
    // 한곡반복일 경우
    if (isFinished && $('#repeatOne').data('ischecked') === true) {
        onPlay(currentPlayingIdx);
    } // 마지막 곡 재생이 끝났는데 전곡반복일 경우, 첫번째 곡을 다시 재생한다
    else if (isFinished && $(".listCount").length == currentPlayingIdx && $('#repeatAll').data('ischecked') === true) {
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


// 플레이리스트 영역 나타내기 
function showPlayList() {
    $('.no_right').css('display', 'none');
    $('.right').css('display', 'inline-block');
}

// 플레이리스트 영역 숨기기
function hidePlayList() {
    $('.right').css('display', 'none');
    $('.no_right').css('display', 'inline-block');
}


// 음악차트 리스트 태그를 만들어서 문자열 형태로 반환하는 function
function makeMusicChartListTag(song) {
    let listStr = '';
    song.forEach((song, index) => {
        listStr += '<ul class="eachSong"><li class="w20">' + song.ranking + '</li>'
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
        listStr += '<ul><li class="w20 listCount"><input type="checkbox" class="listCheckbox" id="chk_' + song.sid + '" value="' + (listCount + 1) + '" data-idx="' + (listCount + 1) + '" data-sid="' + song.sid + '" data-youtubeId="' + song.youtubeId + '" data-pid="' + song.pid + '">'
            + '<label for="chk_' + song.sid + '"></label></li>'
            + '<li class="w200 lf click playThis"><span class="songInfo">' + song.title + '</span><div class="artist"><span class="songInfo">' + song.singer + '</span></div></li>'
            + '<li class="w28 click"><img src="close.png" class="deleteOne" alt="삭제" width="9px"></li></ul>';
        ++listCount;
    })
    return listStr;
}

// TYPE별 음악 차트를 가져오고, 화면에 태그를 뿌려주는 function 
function getMusicChartList(type, page, isFirst) {
    $('.left').scrollTop(0);
    console.log(new Date().getHours())
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
    console.log("--func실행")
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
    songArr.push(song);
    $listDiv.append(makeMyListTag(songArr));

    // 리스트에 아무곡도 들어있지 않았던 경우 리스트영역을 띄우고 리스트에 들어온 가장 첫곡을 재생시킨다. 
    // undefine 고려해서 조건문 수정할것!!!! 
    if (currentListCount == 0) {
        showPlayList();
        onPlay(1);
    }
    else if (currentListCount != 0 && play == 'play') {
        onPlay(currentListCount + 1);
    }
}


// 플레이리스트에 노래 전체 추가시키는 function 
function addAllMusicIntoPlayList(play) {
    let $myListDiv = $('.myPlaylist');
    let $chartList = $(".bottom > ul");
    let currentListCount = $('.listCount').length;
    let sids = [];
    let songArr = [];
    let isFirstPlay = $('.listCount').length == 0;

    // 로그인 조건문 추가
    $chartList.each(function (index, item) {
        let $item = $(item);
        console.log("1")
        song = {
            'sid': $item.find('li').last().data('sid'),
            'youtubeId': $item.find('li').last().data('youtubeid'),
            'title': $item.children().find('.title-span').text(),
            'singer': $item.children().find('.singer-span').text()
        }
        songArr.push(song);
    })
    $myListDiv.append(makeMyListTag(songArr))

    if (currentListCount == 0) {
        showPlayList();
        onPlay(1);
    } else if (currentListCount != 0 && play == 'play') {
        onPlay(currentListCount + 1);
    }
}

// 현재 재생중인 곡 CSS 변경 
function currSongColorChange(idx) {
    let $lists = $(":checkbox");
    $('.songInfo').removeClass('currPlaying');
    $lists.each(function (index, item) {
        $item = $(item);
        if (idx == $item.attr('data-idx')) {
            $item.parent().parent().find('.songInfo').addClass('currPlaying');
        }
    })
    fnMove()
}

// 전체반복/한곡반복 설정 
function setRepeatUp(allorOne) {
    let $target = "";
    let $another = "";

    if (allorOne == 'all') {
        $target = $('#repeatAll');
        $another = $('#repeatOne');
    } else {
        $target = $('#repeatOne');
        $another = $('#repeatAll');
    }
    // 기존 반복설정 해제
    $another.data('ischecked', false);
    $another.removeClass('setRepeat');
    let checkTF = ($target.data('ischecked') === true);
    $target.data('ischecked', !checkTF);
    // 반복설정여부에 따라 클래스(for css) 변경
    if (!checkTF) {
        $target.addClass('setRepeat');
    } else {
        $target.removeClass('setRepeat');
    }
}


// 스크롤 테스트 
function fnMove() {
    var position = $('.currPlaying').position();
    console.log("포지션 : "+$('.currPlaying').position())
    $('.list_box').animate({ scrollTop: position.top }, 400);
}


// 삭제 대상 곡의 객체를 반환하는 function 
function getSongObjArr($targetSong) {
    let $songObjArr = [];
    if ($targetSong == undefined || $targetSong == '') {
        $('.listCheckbox:checked').each(function () {
            let $targetSong = $('[data-idx="' + $(this).val() + '"]');
            $songObjArr.push($targetSong);
        })
    } else {
        $songObjArr.push($targetSong);
    }
    return $songObjArr;
}

function removeSongInMyList($targetSong) {

    function removeTags(targetObjs) {
        targetObjs.forEach((item, index) => {
            $(item).parent().parent().remove();
        })
    }

    let targetObjs = getSongObjArr($targetSong);
    let pids = [];
    let removeIdx = [];
    let curIdx = 0;
    let compareIdx = currentPlayingIdx;

    targetObjs.forEach((item, index) => {
        pids.push(item.data('pid'));
        if (item.data('idx') < currentPlayingIdx) {
            curIdx++;
        }
        removeIdx.push(item.data('idx'));
    });

    // 로그인 구분 조건 추가 !!!!!!!!!!
    removeTags(targetObjs);

    let $allMySongs = $('.listCheckbox');

    $allMySongs.each(function (index, item) {
        let $myMusic = $(item);
        $myMusic.attr('data-idx', index+1);
        $myMusic.val(index + 1);
    })

    //삭제한 동영상 중지후 다음곡 재생
    var containsIdx = removeIdx.includes(currentPlayingIdx);

    if ($targetSong == undefined || $targetSong == '') {
        currentPlayingIdx -= curIdx;
    } else if ($targetSong.data('idx') < currentPlayingIdx) {
        currentPlayingIdx--;
    }

    if ((containsIdx || compareIdx == $targetSong.data('idx'))) {
        stopVideo();
        playNext(currentPlayingIdx);
    }

    if ($allMySongs.length == 0) {
        // hidePlayerArea();
    }
}






$(document).ready(() => {
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    getMusicChartList('realtime', 1);
    // ajax 호출해서 플레이리스트 불러오는 코드 삽입 !!!!!!!!!!
    let currentListCount = $('.listCount').length;
    if (currentListCount != 0) {
        // 리스트 영역을 띄운후 제일 첫곡 재생
    }

    // 상단 차트타입 선택시 이벤트 
    // function 따로 뺄것 
    $('#chartTypes').on('click', 'li', function (e) {
        // 로고 and 로그인 버튼 클릭 이벤트 설정하기!!!!!!!!!!!!!!!!!!!
        $('.left').scrollTop(0);
        e.preventDefault();
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
    $('.add-only').on('click', function (e) {
        e.preventDefault;
        addMusicIntoPlayList(this);
    })

    // 차트에서 각 노래 재생 버튼 이벤트
    $('.play-now').on('click', function (e) {
        e.preventDefault();
        addMusicIntoPlayList(this, 'play');
    });

    // 차트에서 전체듣기 버튼 눌렀을 때
    $('#playAll').on('click', (e) => {
        e.preventDefault();
        addAllMusicIntoPlayList('play');
    })

    // 차트에서 전체추가 버튼 눌렀을 때
    $('#addAll').on('click', (e) => {
        e.preventDefault();
        addAllMusicIntoPlayList();
    })

    // 플레이리스트에서 곡 제목+가수영역 눌렀을 때 > 재생 
    $(document).on('click', '.playThis', function () {
        onPlay($(this).parent().find('input').data('idx'));
    });

    // 플레이리스트에서 X버튼 눌렀을 때
    $(document).on('click', '.deleteOne', function () {
        removeSongInMyList($(this).parent().prev().prev().children('input'))
    });

    // Delete All 버튼을 눌렀을 때
    $("#deleteAll").on('click', (e) => {
        e.preventDefault();
        removeSongInMyList();
    })


    // Select All 버튼을 눌렀을 때 모든 곡을 체크/체크해제
    $("#selectAll").on('click', (e) => {
        e.preventDefault();
        let selectTF = ($('#selectAll').data('isselected') === true);
        $('#selectAll').data('isselected', !selectTF)
        $('.listCheckbox').prop('checked', !selectTF);
    })

    // Repeat All 버튼을 눌렀을 때 
    $('#repeatAll').on('click', function (e) {
        e.preventDefault();
        setRepeatUp('all');
    })

    // Repeat One 버튼을 눌렀을 때 
    $('#repeatOne').on('click', function (e) {
        e.preventDefault();
        setRepeatUp('one');
    })










}) // end of onready 

