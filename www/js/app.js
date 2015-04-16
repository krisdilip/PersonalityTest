// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('personality', ['ionic'])

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider	
		.state('/personality', {
            url:'/personality',
            templateUrl: 'partials/personality.html',
            controller: 'PersonalityCtrl'
        })	
		.state('/result', {
            url:'/result',
            templateUrl: 'partials/result.html',
            controller: 'ResultCtrl'
        })	
        .state('/', {
            url: '/',
            templateUrl: 'partials/personality.html',
			controller: 'PersonalityCtrl'
        })
		.state('/:questionIndex', {
            url:'/:questionIndex',
            templateUrl: 'partials/question.html',
            controller: 'TestCtrl'
        })
		;
}]);

app.controller('IndexCtrl', function($scope, $state, $rootScope, $ionicPopup){
	$scope.data={};
	
	$rootScope.personality = [0,0,0,0,0,0,0];
	
	//Load question from external JS
	$rootScope.questions = QuestionData; 

	$scope.data.testQuestion = QuestionData[0];
	
	$scope.fnPersonality = function(){
		$state.go("/personality");
	};
	
	$scope.fnTest = function(){
		if(isNaN($rootScope.currQuestionIndex)) {
			$state.go("/:questionIndex", {questionIndex:0});
		}else {
			$state.go("/:questionIndex", {questionIndex:$rootScope.currQuestionIndex});
		}		
	};
});

app.controller('ResultCtrl', function($scope, $state, $rootScope, $ionicPopup, $window){
	
	$scope.showAlert = function(msg) {
		var alertPopup = $ionicPopup.alert({
			title: 'Quiz',
			template: msg
		});
	};
	
	//[E I S N T F J P]
	var testResult = [0,0,0,0,0,0,0,0];
	var testResPercent = [0,0,0,0,0,0,0,0];
	var localStorage = [];
		
	for(i=0; i < $rootScope.questions.length; i++){
		if($rootScope.questions[i].answer < 0){
			//$scope.showAlert("Please answer all the questions ...!");
			break;
		}else{
			localStorage[i] = $rootScope.questions[i].answer;
			testResult[parseInt($rootScope.questions[i].id) + parseInt($rootScope.questions[i].answer)] += 1;
		};
	};
	
	// caluclate the % of [E I S N T F J P]
	for(i=0; i < testResult.length-1; i++){
		if(i<2){
			testResPercent[i] = parseInt(testResult[i]/11*100);
		}else{
			testResPercent[i] = parseInt(testResult[i]/21*100);
		};
	};
	
	// Fill the $scope.data with the results to display in result.html
	// Store the values in a code array
	$scope.data.code = [];
	
	if(testResult[0] >5){
		$scope.data.code[0] = PersonalityTypes[0];
		$scope.data.code[0].percent = testResPercent[0];
	}else{
		$scope.data.code[0] = PersonalityTypes[1];
		$scope.data.code[0].percent = testResPercent[1];
	};
	
	if(testResult[2] >5){
		$scope.data.code[1] = PersonalityTypes[2];
		$scope.data.code[1].percent = testResPercent[2];
	}else{
		$scope.data.code[1] = PersonalityTypes[3];
		$scope.data.code[1].percent = testResPercent[3];
	};
		
	if(testResult[4] >5){
		$scope.data.code[2] = PersonalityTypes[4];
		$scope.data.code[2].percent = testResPercent[4];
	}else{
		$scope.data.code[2] = PersonalityTypes[5];
		$scope.data.code[2].percent = testResPercent[5];
	};
		
	if(testResult[6] >5){
		$scope.data.code[3] = PersonalityTypes[6];
		$scope.data.code[3].percent = testResPercent[6];
	}else{
		$scope.data.code[3] = PersonalityTypes[7];	
		$scope.data.code[3].percent = testResPercent[7];
	};
		
	for(i=0; i< PersonalityDetails.length-1; i++){
		if(PersonalityDetails[i].type == ($scope.data.code[0].type + $scope.data.code[1].type + $scope.data.code[2].type + $scope.data.code[3].type)){
			$scope.data.PersonalityDetails = PersonalityDetails[i];
		};
	};
	
	$scope.fnSave = function () {
		$window.localStorage['MyKey'] = JSON.stringify(localStorage);
		$scope.showAlert("Your Myers-Briggs result saved ...!");
	}
	
});

app.controller('TestCtrl', function($scope, $state, $rootScope, $ionicPopup, $stateParams){
	
	$scope.showAlert = function(msg) {
		var alertPopup = $ionicPopup.alert({
			title: 'Quiz',
			template: msg
		});
	};
	
	$scope.data.testQuestion = QuestionData[parseInt($stateParams.questionIndex)];
	$scope.data.totQuestions = QuestionData.length;
	$scope.data.currQuestion = (parseInt($stateParams.questionIndex) + 1);
	
	$scope.fnNextQuestion = function(){
		if((parseInt($stateParams.questionIndex) + 1) < $rootScope.questions.length){
			$rootScope.currQuestionIndex = (parseInt($stateParams.questionIndex) + 1);
			$state.go("/:questionIndex", {questionIndex: (parseInt($stateParams.questionIndex) + 1)});    
		}else{
			$state.go("/result");
		};
	};
	
	$scope.fnPrevious = function(){
		if((parseInt($stateParams.questionIndex) - 1) >= 0){
			$rootScope.currQuestionIndex = (parseInt($stateParams.questionIndex) - 1);
			$state.go("/:questionIndex", {questionIndex: (parseInt($stateParams.questionIndex) - 1)});    
		};
    };
	
	$scope.fnNext = function(){
		if($scope.data.testQuestion.answer === -1){
			$scope.showAlert("Please answer the question ...!");
			return;
		};
				
		if((parseInt($stateParams.questionIndex) + 1) < $rootScope.questions.length){
			$rootScope.currQuestionIndex = (parseInt($stateParams.questionIndex) + 1);
			$state.go("/:questionIndex", {questionIndex: (parseInt($stateParams.questionIndex) + 1)});    
		}else{
			$state.go("/result");
		};
    };
	
	$scope.height = parseInt((document.getElementsByTagName('ion-content')[0].clientHeight) * 25/100);
	$scope.width = parseInt((document.getElementsByTagName('ion-content')[0].clientWidth) * 50/100);

});

app.controller('PersonalityCtrl', function($scope, $state, $rootScope, $stateParams, $window, $ionicPopup){
	$scope.PersonalityDetails = PersonalityDetails;
	
	$scope.showAlert = function(msg) {
		var alertPopup = $ionicPopup.alert({
			title: 'Quiz',
			template: msg
		});
	};
	
	$scope.fnTest = function (){
		if(isNaN($rootScope.currQuestionIndex)) {
			// If there is no test active then clean the answers and start fresh
			// This is required in case old test results are loaded to review old results
			for(i=0; i < $rootScope.questions.length; i++){
				$rootScope.questions[i].answer = -1;
			};
			
			// Now go to the first question
			$state.go("/:questionIndex", {questionIndex:0});
		}else {
			
			// If there is a test active then clean the answers forward from last answered index
			// This is required in case old test results are loaded to review old results in the // middle of a new test
			for(i=$rootScope.currQuestionIndex; i < $rootScope.questions.length; i++){
				$rootScope.questions[i].answer = -1;
			};
			
			$state.go("/:questionIndex", {questionIndex:$rootScope.currQuestionIndex});
		}
	};
	
	$scope.fnNewTest = function (){
		// Clear all answers and start fresh.
		for(i=0; i < $rootScope.questions.length; i++){
			$rootScope.questions[i].answer = -1;
		};
		
		//Set the current question index of the ongoing test to 0
		$rootScope.currQuestionIndex = 0;
		
		// Now go to the first question
		$state.go("/:questionIndex", {questionIndex:0});	
	};
	
	$scope.fnSave = function (){
		$window.localStorage['MyKey'] = 'Hello World';
	};
	
	$scope.fnLoad = function (){
		// Try to load an old test result which is stored in the localStorage
		var localStorage = JSON.parse($window.localStorage['MyKey']);
		
		for(i=0; i < $rootScope.questions.length; i++){
			$rootScope.questions[i].answer = localStorage[i];
		};
		
		$state.go("/result");
	};
});
