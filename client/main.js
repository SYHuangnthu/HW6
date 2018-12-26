
/*
作業主題
利用openweather天氣網站提供的API，設計一個可以查詢天氣的Meteor App。

作業要求
1. 至少要有查詢當下的氣溫、風速與高低溫，以及隔天的預報氣溫與高低溫的功能。

2. 程式介面不使用ELIZA的介面，自行設計，天氣查詢結果的呈現方式也可以自由呈現(如：圖片)。

3. 可自行增加功能或是使用openweather天氣網站免費API提供的其他資訊(如：氣壓、濕度、天氣地圖、UV指數)

作業評分
50% = 達成基本要求(例：輸入城市的名稱得到目前或隔天的天氣預報)
10% = 程式排版與變數命名等程式基本開發邏輯
25% = 有使用到Session或是Reactive Variable的功能呈現網頁內容(例：利用Session Variable在查詢和結果頁面切換)
15% = 有使用到MongoDB儲存或查詢資料(例：歷史天氣查詢紀錄)

繳交說明
1. 上傳作業時請將你的Meteor App中的client與server資料夾壓縮為單一壓縮檔。

2. 另外請上傳一個說明文件，詳細解釋你的天氣查詢的App的主要功能。

3. 所有openweathermap可免費使用的API請參考https://openweathermap.org/api 
*/
var userConversationLogDB = new Mongo.Collection("conversationLog");
var conversationLog = new ReactiveVar("This is your record.");

Session.setDefault("currentPage","frontPage");
Session.setDefault("citySession","");

Tracker.autorun(function() {
	Meteor.subscribe("userConversation", Session.get("citySession"));
});

Template.body.helpers({
	checkCurrentPage: function(page) {
		return Session.euals("currentPage",page);
	}
});

Template.mainSection.evnets({
  "click #back": function() {
    Session.set("citySession", "");
    Session.set("currentPage", "frontPage");
  }
});
Template.frontPage.events({
	"click #gogo": function() {
		let cityname = document.getElementById("cityname").value;
		Meteor.call("setCity", cityname, function(error,result){
			if(error) {
				alert("City cannot have any space!");
			}
			else {
				Session.set("citySession",cityname);
				Session.set("currentPage", "home");

			}
		});
	}
});