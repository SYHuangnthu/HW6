var profileDataDB = new Mongo.Collection("profileData");
var conversationLogDB = new Mongo.Collection("conversationLog");
//		let APIKey = "90d8c21613fef55fbac74990281f6047";



var weatherInfo = function(msg) {
	let wtData;
	let weatherRegex = /(\w+)/i;
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
		wtData = HTTP.get(wtInfoURL)
		let wtData2 = HTTP.get(wtInfoURL2);
		console.log(wtData2.data.list[0]);
		try {
			wtData = HTTP.get(wtInfoURL);
			let wtDescription = wtData.data.weather[0];
			//console.log(wtData);
			let wtMain = wtData.data.main;
			let wtWind = wtData.data.wind;
			let wtMain2 = wtData2.data.list[lastPos].main;
			let wtWind2 = wtData2.data.list[lastPos].wind
			let wtResponse = "It's "+wtDescription.description+" in "+
				cityName+", and the temperature is "+wtMain.temp+"C."+
				" The wind speed is "+wtWind.speed+" km/hr."+
				" The highest temperature is "+wtMain.temp_max+", "+
				"and the lowest temperature is "+wtMain.temp_min+"C."+"\n The nextday temperature will be "+wtMain2.temp+" and the wind speed will be "+wtWind2.speed+" km/hr.";
			console.log(wtResponse);
			return wtResponse;
		}
		catch(error) {
			return "I don't know the city.";
		}
		return "";
	}
	//console.log(weatherRequest);
};

Meteor.methods({
	setCity: function(cityname) {
		if(cityname.includes(" ")) {
			console.log(cityname);
			throw new Meteor.Error();
		}
		else {
			let userLog = conversationLogDB.find({}).fetch();
			if(userLog.length > 0) {
				return;
			}
			else {
				return;
			}
		}
	},
	msgReceiver: function(msg) {
		let dataNum = conversationLogDB.find({}).fetch().length;
		if(dataNum <= 20) {
			conversationLogDB.insert(
				{
					source: "You",
					msg: msg,
					time: new Date()
				}
			);
			let ELIZAResponse = weatherInfo(msg);	
			conversationLogDB.insert(
				{
					source: "ELIZA",
					msg: ELIZAResponse,
					time: new Date()
				}
			);
			return;
		}
		else {
			return "full";
		}
	},
	resetMsg: function() {
		conversationLogDB.remove({});
	}
});