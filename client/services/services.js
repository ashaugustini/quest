angular.module('cityQuest.services', [])

.factory('QuestStorage', function($http){

  var selectedCity = '';
  var lastFetchedQuests = null;

  var saveCity = function(city){
    selectedCity = city;
  };

  var getSingleQuest = function(questId){
    if(lastFetchedQuests === null){
      throw "cityQuest.services - Single quest not available! HTTP GET the quests first."
    }

    var foundQuest = null;
    var numQuests = lastFetchedQuests.length;
    for(var questIndex = 0; questIndex < numQuests; questIndex++){
      var currentQuest = lastFetchedQuests[questIndex];
      if(currentQuest.id === questId){
        foundQuest = currentQuest;
        break;
      }
    }

    if(foundQuest === null){
      throw "cityQuest.services - Couldn't find clicked single quest!";
    }

    return foundQuest;
  }

  var getAllQuests = function(){
    return $http.get(
       '/api/quests/?city=' + selectedCity
        )
        .then(function(res){
          lastFetchedQuests = res.data;
          return lastFetchedQuests;
        });
  };

  function getQuestsSuccess(data, status){
        // $http will return the entire response object. To get the data returned from the database use data.data
    return data.data;
  };

  function getQuestsError(data, status){
    console.log(status);
  };

  var saveNewQuest = function(quest){
    $http({
        method: 'POST',
        url: '/api/quests',
        data: quest
      })
    .then(function(res){
      return res.data;
    });
  };

  function saveNewQuestSuccess(data, status){
    //
  };

  function saveNewQuestError(data, status){
    //
  };

  //TODO: Remove once hooked up to real server database. - John
  var initializeWithFakeData = function(fakeQuests){
    //Pre-filling 'global-ish' lastFetchedQuests without HTTP GET
    lastFetchedQuests = fakeQuests;
  }  //End TODO

  return {
    initializeWithFakeData: initializeWithFakeData, //TODO: remove this - John
    getSingleQuest: getSingleQuest,
    getAllQuests: getAllQuests,
    saveNewQuest: saveNewQuest,
    saveCity: saveCity
  }
})

.factory('Auth', function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.cityQuest');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.cityQuest');
    $location.path('/signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  }
});
