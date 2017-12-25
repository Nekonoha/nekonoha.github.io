$(function() {
    var h = $(window).height();
    $('#loader-bg ,#loader').height(h).css('display', 'block');
});

$(window).on("load", function() { //全ての読み込みが完了したら実行
    $('#wrap').css('display', 'block');
    $('#loader-bg').delay(900).fadeOut(800);
    console.log("LOADED");
    stopload();
});

//10秒たったら強制的にロード画面を非表示
$(function() {
    setTimeout('stopload()', 5000);
});

function stopload() {
    $('#wrap').css('display', 'block');
    $('#loader-bg').delay(900).fadeOut(800);
}