var profileDataDB = new Mongo.Collection("profileData");
var CconversationLogDB = new Mongo.Collection("CconversationLog");
//		let APIKey = "90d8c21613fef55fbac74990281f6047";

var regex = /(weather|temperature).* in (\w+)/i;

var weatherInfo = function(msg) {
	let wtData;
	let weatherRegex = /(weather|temperature).* in (\w+)/i;
	let weatherRequest = msg.match(weatherRegex);
	if(weatherRequest === null) {
		return "";
	}
	else {
		let lastPos = weatherRequest.length-1;
		let cityName = weatherRequest[lastPos];
		let APIKey = "90d8c21613fef55fbac74990281f6047";
		let wtInfoURL = 
			"http://api.openweathermap.org/data/2.5/weather?APPID="+APIKey+
			"&q="+cityName+"&units=metric";
		let wtInfoURL2 = 
			"http://api.openweathermap.org/data/2.5/forecast?APPID="+APIKey+
			"&q="+cityName+"&units=metric&cnt=24";
		let wtData2 = HTTP.get(wtInfoURL2);
		console.log(wtData2.data.list[0]);
		try {
			wtData = HTTP.get(wtInfoURL);
			let wtDescription = wtData.data.weather[0];
			//console.log(wtData);
			let wtMain = wtData.data.main;
			let wtWind = wtData.data.wind;
			let wtResponse = "It's "+wtDescription.description+" in "+
				cityName+", and the temperature is "+wtMain.temp+"C."+
				" The wind speed is "+wtWind.speed+" km/hr."+
				" The highest temperature is "+wtMain.temp_max+", "+
				"and the lowest temperature is "+wtMain.temp_min+"C.";
			return wtResponse;
		}
		catch(error) {
			return "I don't know the city.";
		}
		return "";
	}
	//console.log(weatherRequest);
};