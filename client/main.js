
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
Session.setDefault("userSession", "");


Tracker.autorun(function() {
	Meteor.subscribe("userConversation", Session.get("userSession"));
});

Template.body.helpers({
  checkCurrentPage: function(page) {
    return Session.equals("currentPage", page);
  }
});

Template.mainSection.events({
  "click #back": function() {
    Session.set("userSession", "");
    Session.set("currentPage", "frontPage");
  },
  "click #submitCity": function(event){
    let username1 = document.getElementById("username").value;
    Meteor.call("setUser", username1, /*function(error, result) {
     if(error) {
        alert("Cityname cannot have any space!");
      }
      else {
       console.log(username1);
      }
    }*/);
  	event.preventDefault();
    let myMsgObj = document.getElementById("username");
    let username2 = myMsgObj.value;
    Meteor.call("msgReceiver", username2, Session.get("userSession"), function(error, result) {
      if(error) {
      }
      else if(result === "full") {
        alert("The database is full!");
      }
      else {

      }
    });
    myMsgObj.value = "";
  },
  "click #resetCity": function(){
    Meteor.call("resetMsg", Session.get("userSession"));
  }
});
Template.frontPage.events({
  "click #enterMain": function() {
  	Session.set("currentPage", "home");
  }
});
Template.mainSection.helpers({
  getConversation: function() {
    let dbData = conversationLogDB.find({}, {sort: {time: 1}});
    dbData = dbData.fetch();
    let conversationLog = "";
    for(let index=0 ; index<dbData.length ; index++) {
      let msgData = dbData[index];
      conversationLog = conversationLog+msgData.source+": ";
      conversationLog = conversationLog+msgData.msg+"\n";
    }
    return conversationLog;
  }
});
