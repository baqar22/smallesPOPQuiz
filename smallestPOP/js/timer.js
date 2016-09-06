function PrivateTimer() {
var _timeInSeconds;
var _timerCompleteHandler;
var _timerDisplayArea;
var _privateTimer;
var remainingTime;

//Initializr timer with time, complete handler and display area
this.init = function (timeInSeconds, timerComplete_handler, timerDisplayArea)
{
	_timerDisplayArea = timerDisplayArea;
	_timerCompleteHandler = timerComplete_handler;
	_timeInSeconds = timeInSeconds;
}

//Update values every second on each timer 
function timerEvent_handler()
{
  remainingTime--;
  _timerDisplayArea.innerHTML = remainingTime;
  if(remainingTime <= 0)
  {
	clearTimeout(_privateTimer);
	_timerCompleteHandler();
  }
}

//Start timer from begining
this.startTimer = function()
{
	remainingTime = _timeInSeconds;
	_privateTimer = setInterval(timerEvent_handler, 1000);
}

//Clear timer
this.clearTimer = function()
{
	clearTimeout(_privateTimer);
}

}