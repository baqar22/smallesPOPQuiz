//This function will be invoke on page load. It's entry point for quiz start
function startQuiz()
{
	var myPrivateScope = new MyPrivateScope();
	myPrivateScope.init();
}

//All the functionality inside private scope. Not accessable outside
var MyPrivateScope = function(){
	//Configurable for number of random choices
	var TOTAL_QUIZ_NUMBERS = 7;
	//Configurable quiz time in seconds.
	var QUIZ_TIME_IN_SECONDS = 60;
	
	var MIN_RANDOM_VALUE;
	var MAX_RANDOM_VALUE;
	//Custom timer will be instantiated and set in init function
	var timer;
	//Current quiz score
	var score;
	//Array for storing sorted values of current quiz
	var sortedQuizValues = [];
	//Array of random choices
	var randomValuesToDisplay = [];
	//Storing quiz type i.e. if it's number quiz, roman number quiz or alphabet quiz
	var quizType;

	this.init = function()
	{
	   //Reset intial score value, highest score and timer
		resetUI();
		//First select which quiz type should be display(number,roman or alphabet)
		//It will also set min and max random number for each category
	   generateQuizType();
	   //Generate Random number based on quiz type
	   generateRandomNumbers();
	   /*
	    * Dynamically create buttons with randome values on them as text.
	    * Add event listeneres. 
	    * This is one time process. Button will be reuse for next quiz.
	    */
	   generateDynamicButtonsAndAddEventListeners();
	   	   
	   //intialize timer with quiz time, callback method when timer is over and text field for displaying remaing seconds
	   timer = new PrivateTimer();
	   timer.init(QUIZ_TIME_IN_SECONDS,quizTimerComplete_handler, timerDisplayText);
	   timer.startTimer();
	}
	
	function resetUI()
	{
		score = 0;
		newQuizButton.disabled = true;
		timerDisplayText.innerHTML = QUIZ_TIME_IN_SECONDS;
		scoreContainer.innerHTML = score;
		updateHighestScore();
	}

	//When Timer is complete disable all remaining choices and enable new quiz generator button
	function quizTimerComplete_handler()
	{
		disableQuizButtons(true);
		newQuizButton.disabled = false;
		//Update highest score
		updateHighestScore();
	}

	function generateDynamicButtonsAndAddEventListeners()
	{
		for(var i=0;i<randomValuesToDisplay.length;i++)
		{
		   randomValuesContainer.innerHTML = randomValuesContainer.innerHTML + "<button id='button_"+i+"' class='quizOptions'>"+randomValuesToDisplay[i]+"</button>";
		}
		/*
		  *Event Listeners are added after creation of buttons.
		  *We need to make sure buttons are initialize properly before adding event listeners. 
		  *Otherwise eventlistners might not added properly. 
		*/
		for(var i=0;i<randomValuesToDisplay.length;i++)
		{
			eval("button_"+i).addEventListener('click', quizOptionClick_handler);
		}
		
		//Add event listenre to new quiz generator button too. This will be disabled when quiz start
		newQuizButton.addEventListener('click', newQuizButtonClick_handler);
	}
    
	//When new quiz button is clicked. It will restart timer and generate new quiz.
	function newQuizButtonClick_handler()
	{
		resetUI();
		timer.clearTimer();
		generateNewQuiz();
		timer.startTimer();
	}

	//It will generate new quiz type, generate random numbers and reset quiz fields
	function generateNewQuiz()
	{
		generateQuizType();
		generateRandomNumbers();
		resetQuizValues();
		disableQuizButtons(false);
		newQuizButton.disabled = true;
	}

	//It will make sure that all buttons are displayed on stage. It's needed for starting new quiz.
	function resetQuizValues()
	{
		for(var i=0;i<randomValuesToDisplay.length;i++)
		{
			eval("button_"+i).innerText = randomValuesToDisplay[i];
			eval("button_"+i).style.display = "inline";
		}
	}

	//It's utility function for enabling and disabling quiz choices. Specially when timer is complete.
	function disableQuizButtons(value)
	{
		for(var i=0;i<randomValuesToDisplay.length;i++)
		{
			eval("button_"+i).disabled = value;
		}
	}
	
	//It determine which quiz button is clicked.
	//That button will be use for updating score and hiding button for correct choice
	function quizOptionClick_handler(event)
	{
		 event.target.style.display = "none"
		 var selectedNumber = event.target.innerText;
		 if(quizType === "roman")
		 {
		   selectedNumber = deRomanize(selectedNumber);
		 }
		 else if(quizType === "alphabet")
		 {
		   selectedNumber = convertToNumber(selectedNumber);
		 }
		 updateScore(Number(selectedNumber));
	}

	/*
	*This function will update score.
	*It will also hide the button if selected button is smallest. 
	*It will generate new quiz for wrong choice and when all choices are complete.
	*/
	function updateScore(value)
	{
		var index = sortedQuizValues.indexOf(value);
		sortedQuizValues.splice(index, 1);
		if(index == 0)
		{
			score += 5;
		}
		if(sortedQuizValues.length == 0)
		{
			score += 8;
		}
		//Generate new quiz for wrong choice or for the last choice
		if(index != 0 || sortedQuizValues.length == 0)
		{
			generateNewQuiz();
		}
		
		scoreContainer.innerHTML = score;
	}

	//This function finds a random number between 1-3
	//Based on the random number it sets quiz type, min and max values
	function generateQuizType()
	{
	  switch(randomNumberGenerator(1, 3))
	  {
		case 1:
		quizType = "number";
		MIN_RANDOM_VALUE = -100;
		MAX_RANDOM_VALUE = 100;
		break;
		case 2:
		quizType = "roman";
		MIN_RANDOM_VALUE = 1;
		MAX_RANDOM_VALUE = 12;
		break;
		case 3:
		quizType = "alphabet";
		MIN_RANDOM_VALUE = 0;
		MAX_RANDOM_VALUE = 25;
		break;
		default:
		console.log("Error, Random function failed");
	  }
	}
	
	//This function will use Random Factory to generate random numbers for each type(number, roman or alphabet)
	function generateRandomNumbers()
	{
		var randomArrayFactory = new RandomArrayFactory();
		var randomArrays = randomArrayFactory.createRandomArray(MIN_RANDOM_VALUE,MAX_RANDOM_VALUE,TOTAL_QUIZ_NUMBERS,quizType);
		sortedQuizValues = randomArrays.randomArray;
		randomValuesToDisplay = randomArrays.randomArrayConverted;
		sortedQuizValues.sort(function sortNumber(a,b){return a - b;});
	}
	
	//It will store highest score in local shared objects. It's get updated at the end of quiz.
	function updateHighestScore()
	{
		//Some old browser might not support local storage
		try{
			if(typeof(Storage) !== "undefined") 
			{
				if (localStorage && localStorage.highestScore) 
				{
					if(score > Number(localStorage.highestScore))
					{
						localStorage.highestScore = score;
					}
				} 
				else 
				{
					localStorage.highestScore = score;
				}
				highestScoreContainer.innerHTML = localStorage.highestScore;
			}
		}
		catch (e) {
			return false;
		}
	}
};
