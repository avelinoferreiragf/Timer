var audioWarning = null;
var alertTimes = [15, 10, 5, 3, 1];
var timerId = 0;
var warningTime = false;
var MAX_WARNING_TIME = 55;
function startTimer(duration, display, displayContainer) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        if (seconds == 0 && alertTimes.indexOf(minutes) > -1) {
            audioWarning.play();
            warningTime = true;
            displayContainer.addClass("warningTime");
        }
        if (!warningTime || (seconds > 0 && seconds < MAX_WARNING_TIME)) {
            displayContainer.removeClass("warningTime");
            warningTime = false;
        }
        if (seconds == 0 && minutes == 0) {
            audioFinish.play();
            clearInterval(timerId);
            displayContainer.addClass("timeOut");
        }
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    timerId = setInterval(timer, 1000);
}

$(document).ready(function(){
    $(".btnStart").click(lapStart);
    $(".btnStop").click(resetTimer);
    audioWarning = new Audio("sounds/Store_Door_Chime-Mike_Koenig-570742973.mp3");
    audioFinish = new Audio("sounds/Alarm.mp3");
});

var lapStart = function() {
    var lapTimer = $(this).parent().find(".lapTimer");
    var lapTime = lapTimer.val();
    var duration = 60 * lapTime;
    var display = $("#timerDisplay");
    var displayContainer = $("#timerDisplayContainer");
    displayContainer.removeClass("warningTime");
    displayContainer.removeClass("timeOut");
    resetTimer(displayContainer);
    startTimer(duration, display, displayContainer);
};

var resetTimer = function(displayContainer) {
    clearInterval(timerId);
    stopAudio(audioWarning);
    stopAudio(audioFinish);
};

var stopAudio = function(sound) {
    sound.pause();
    sound.currentTime = 0;
};