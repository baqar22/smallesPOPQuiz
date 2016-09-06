/*
* This factory will return an object that will contain two arrays.
* randomArray will contain random values.
* randomAndConvertedArray will contain their corresponding converted symbols for roman and alphabet.
* For number type it will return both arrays conatining same values
*/
function RandomArrayFactory() {
    var randomArray= [];
	var randomArrayConverted = [];
	var randomAndConvertedArray = new Object();
	var converterFunction;
    
	this.createRandomArray = function (min,max,count,type) {
        //Chose converter function based on the type
		if (type === "number") {
            converterFunction = doNotConvert;
        } 
		else if (type === "alphabet") {
            converterFunction = convertToCharacter;
        } 
		else if (type === "roman") {
            converterFunction = romanize;
		}
        
		//Generate random values. Values will be converted to corrosponding symbols same time
		generateRandomValues(min, max,count, converterFunction);
		
		randomAndConvertedArray.randomArray = randomArray;
		randomAndConvertedArray.randomArrayConverted = randomArrayConverted;
        return randomAndConvertedArray;
    }
	
	function generateRandomValues(min, max,count, converterFunction)
	{
	  for(var i=0;i<count;i++)
	  {
	    //randomNumberGenerator function of util class is called 
		randomArray[i] = Number(randomNumberGenerator(min, max));
		//converting each random value to roman/alphaber/number
		randomArrayConverted[i] = converterFunction(randomArray[i]);
	  }
	}
}



