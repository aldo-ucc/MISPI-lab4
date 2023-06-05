var clockSeconds = document.getElementById('clock-seconds'),
    clockMinutes = document.getElementById('clock-minutes'),
    clockHours = document.getElementById('clock-hours');

function getTime() {
    var date = new Date(),
        seconds = date.getSeconds(),
        minutes = date.getMinutes(),
        hours = date.getHours(),

        degSeconds = seconds * 360 / 60,
        degMinutes = (minutes + seconds / 60) * 360 / 60,
        degHours = (hours + minutes / 60 + seconds / 60 / 60) * 360 / 12;

    clockSeconds.setAttribute('style', '-webkit-transform: rotate(' + degSeconds + 'deg); -moz-transform: rotate(' + degSeconds + 'deg); -ms-transform: rotate(' + degSeconds + 'deg); -o-transform: rotate(' + degSeconds + 'deg); transform: rotate(' + degSeconds + 'deg);');
    clockMinutes.setAttribute('style', '-webkit-transform: rotate(' + degMinutes + 'deg); -moz-transform: rotate(' + degMinutes + 'deg); -ms-transform: rotate(' + degMinutes + 'deg); -o-transform: rotate(' + degMinutes + 'deg); transform: rotate(' + degMinutes + 'deg);');
    clockHours.setAttribute('style', '-webkit-transform: rotate(' + degHours + 'deg); -moz-transform: rotate(' + degHours + 'deg); -ms-transform: rotate(' + degHours + 'deg); -o-transform: rotate(' + degHours + 'deg); transform: rotate(' + degHours + 'deg);');
}

setInterval(getTime, 11000);
getTime();