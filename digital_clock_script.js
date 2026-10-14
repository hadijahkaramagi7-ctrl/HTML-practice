// Digital clock + stopwatch

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const swTime = document.getElementById('swTime');

// ------ Live clock ------
function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

function updateClock() {
  const now = new Date();

  timeEl.textContent =
    pad(now.getHours()) + ':' +
    pad(now.getMinutes()) + ':' +
    pad(now.getSeconds());

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  dateEl.textContent =
    days[now.getDay()] + ', ' +
    now.getDate() + ' ' +
    months[now.getMonth()] + ' ' +
    now.getFullYear();
}

setInterval(updateClock, 1000);
updateClock();

// ------ Stopwatch ------
let swSeconds = 0;
let swInterval = null;

function formatSw(s) {
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

function startStopwatch() {
  if (swInterval !== null) return;   // already running
  swInterval = setInterval(function () {
    swSeconds = swSeconds + 1;
    swTime.textContent = formatSw(swSeconds);
  }, 1000);
}

function pauseStopwatch() {
  clearInterval(swInterval);
  swInterval = null;
}

function resetStopwatch() {
  clearInterval(swInterval);
  swInterval = null;
  swSeconds = 0;
  swTime.textContent = '00:00:00';
}
