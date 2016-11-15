// Based on : https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/

var timeInMinutes = 10;
var currentTime = Date.parse(new Date());
var deadline = new Date(currentTime + timeInMinutes * 60 * 1000);


/********* Calculate remaining time *********/

function getTimeRemaining(endTime) {
    var remainingMilliseconds = new Date(endTime) - new Date();

    var centiseconds = Math.floor(remainingMilliseconds / 10 % 100);
    var seconds = Math.floor((remainingMilliseconds / 1000) % 60);
    var minutes = Math.floor((remainingMilliseconds / (1000 * 60) % 60));
    var hours = Math.floor((remainingMilliseconds / (1000 * 60 * 60) % 24));
    var days = Math.floor((remainingMilliseconds / (1000 * 60 * 60 * 24)));

    return {
        'total': remainingMilliseconds,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds,
        'centiseconds': centiseconds
    };
}


function initializeClock(id, endTime) {
    var clock = document.getElementById(id);

    var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');
    var centisecondSpan = clock.querySelector('.centiseconds');

    function updateClock() {

        var remainingTime = getTimeRemaining(endTime);

        daysSpan.innerHTML = remainingTime.days;
        hoursSpan.innerHTML = ('0' + remainingTime.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + remainingTime.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + remainingTime.seconds).slice(-2);
        centisecondSpan.innerHTML = ('0' + remainingTime.centiseconds).slice(-2);

        if (remainingTime.total <= 0) {
            clearInterval(time_interval);
            clock.innerHTML = "Countdown complete";

            var finalCountDown = document.getElementById("final");
            finalCountDown.pause();
            var happyBirthday = document.getElementById("happy");
            happyBirthday.play()
        }
    }

    updateClock();
    var time_interval = setInterval(updateClock, 10);

}


initializeClock('clockdiv', deadline);