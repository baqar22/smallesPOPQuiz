//Util function for converting normal integer to Roman number
function romanize(num) {
  var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
      roman = '',
      i;
  for ( i in lookup ) {
    while ( num >= lookup[i] ) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

//Util function for converting Roman number to normal integer
function deRomanize( roman ) {
  var roman = roman.toUpperCase(),
      lookup = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000},
      result = 0,
      i = roman.length;
  while (i--) {
    if ( lookup[roman[i]] < lookup[roman[i+1]] )
      result -= lookup[roman[i]];
    else
      result += lookup[roman[i]];
  }
  return result;
}

//Util function for converting integer to Upper case alphabet (1=A,2=B and so on)
function convertToCharacter(num){
return String.fromCharCode(65 + num);
}

//Util function for Converting alphabet to Integer (A=1,B=2 and so on)
function convertToNumber(str){
return (str.charCodeAt(0) -65);
}

//Null function for Converting Number to Number :)
function doNotConvert(num)
{
return num;
}

//Helper function for generating a random number between min and max including both
function randomNumberGenerator(min, max)
{
  var randomNumber = Math.floor(Math.random()*(max-min+1))+min;
  return randomNumber;
}