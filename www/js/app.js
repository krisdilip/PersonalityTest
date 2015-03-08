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

    $urlRouterProvider.otherwise('/0');

    $stateProvider	
		.state('/result', {
            url:'/result',
            templateUrl: 'partials/result.html',
            controller: 'ResultCtrl'
        })	
        .state('/', {
            url: '/',
            templateUrl: 'partials/question.html',
			controller: 'TestCtrl'
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

	$scope.data.testQuestion=QuestionData[0];
});

app.controller('ResultCtrl', function($scope, $state, $rootScope, $ionicPopup){
	
	$scope.showAlert = function(msg) {
		var alertPopup = $ionicPopup.alert({
			title: 'Quiz',
			template: msg
		});
	};
	
	//[E I S N T F J P]
	var testResult = [0,0,0,0,0,0,0,0];
	var testResPercent = [0,0,0,0,0,0,0,0];
	
	for(i=0; i < $rootScope.questions.length; i++){
		if($rootScope.questions[i].answer < 0){
			//$scope.showAlert("Please answer all the questions ...!");
			break;
		}else{
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
	
});

app.controller('TestCtrl', function($scope, $state, $rootScope, $ionicPopup, $stateParams){
	
	//var imgIndex=0;
	//var imgArray = ['./img/bg1.png', './img/bg2.png', './img/bg3.jpg', './img/bg4.gif', './img/bg5.png'];
	
	$scope.showAlert = function(msg) {
		var alertPopup = $ionicPopup.alert({
			title: 'Quiz',
			template: msg
		});
	};
	
	$scope.data.testQuestion = QuestionData[parseInt($stateParams.questionIndex)];
	$scope.data.totQuestions = QuestionData.length;
	$scope.data.currQuestion = (parseInt($stateParams.questionIndex) + 1);
	
	/*
	try{
		imgIndex = Math.floor(Math.random() * ((15-0)+1) + 0);
	}catch(exception){
		imgIndex = 0;
	};
	
	if(imgIndex >=0 || imgIndex <=15){
		$scope.data.imageSrc = PersonalityDetails[imgIndex].imgSrc;
	}else{
		$scope.data.imageSrc = "./img/entp.png";
	};
	*/
	
	$scope.fnNextQuestion = function(){
		if((parseInt($stateParams.questionIndex) + 1) < $rootScope.questions.length){
			$state.go("/:questionIndex", {questionIndex: (parseInt($stateParams.questionIndex) + 1)});    
		}else{
			$state.go("/result");
		};
	};
	
	$scope.fnPrevious = function(){
		if((parseInt($stateParams.questionIndex) - 1) >= 0){
			$state.go("/:questionIndex", {questionIndex: (parseInt($stateParams.questionIndex) - 1)});    
		};
    };
	
	$scope.fnNext = function(){
		if($scope.data.testQuestion.answer === -1){
			$scope.showAlert("Please answer the question ...!");
			exit;
		};
				
		if((parseInt($stateParams.questionIndex) + 1) < $rootScope.questions.length){
			$state.go("/:questionIndex", {questionIndex: (parseInt($stateParams.questionIndex) + 1)});    
		}else{
			$state.go("/result");
		};
    };
		
});
