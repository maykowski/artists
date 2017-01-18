// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ion-sticky'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
    })


    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tabs', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            .state('tabs.home', {
                url: '/home',
                views: {
                    'home-tab': {
                        templateUrl: 'templates/home.html'
                    }
                }
            })

            .state('tabs.list', {
                url: '/list',
                views: {
                    'list-tab': {
                        templateUrl: 'templates/list.html',
                        controller: 'ListController'
                    }
                }
            })

            .state('tabs.detail', {
                url: '/list/:aId',
                views: {
                    'list-tab': {
                        templateUrl: 'templates/detail.html',
                        controller: 'PatientController'
                    }
                }
            })
            .state('tabs.visit', {
                url: '/visit/:visitId',
                views: {
                    'list-tab': {
                        templateUrl: 'templates/visit.html',
                        controller: 'VisitController'
                    }
                }
            })

            .state('tabs.calendar', {
                url: '/calendar',
                views: {
                    'calendar-tab': {
                        templateUrl: 'templates/calendar.html',
                        controller: 'CalendarController'
                    }
                }
            })


        $urlRouterProvider.otherwise('/tab/home');
    })

    .controller('CalendarController', ['$scope', '$http', '$state',
        function ($scope, $http, $state) {
            $http.get('js/data.json').success(function (data) {
                $scope.calendar = data.calendar;

                $scope.onItemDelete = function (dayIndex, item) {
                    $scope.calendar[dayIndex].schedule.splice($scope.calendar[dayIndex].schedule.indexOf(item), 1);
                }

                $scope.doRefresh = function () {
                    $http.get('js/data.json').success(function (data) {
                        $scope.calendar = data.calendar;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }

                $scope.toggleStar = function (item) {
                    item.star = !item.star;
                }

            });
        }])

    .controller('ListController', ['$scope', '$http', '$state',
        function ($scope, $http, $state) {
            $http.get('js/data.json').success(function (data) {
                $scope.patients = data.patients;
                $scope.whichpatient = $state.params.aId;
                $scope.data = {showDelete: false, showReorder: false};

                $scope.onItemDelete = function (item) {
                    $scope.patients.splice($scope.patients.indexOf(item), 1);
                }

                $scope.doRefresh = function () {
                    $http.get('js/data.json').success(function (data) {
                        $scope.patients = data.patients;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }

                $scope.toggleStar = function (item) {
                    item.star = !item.star;
                }

                $scope.moveItem = function (item, fromIndex, toIndex) {
                    $scope.patients.splice(fromIndex, 1);
                    $scope.patients.splice(toIndex, 0, item);
                };
            });
        }])
    .controller('PatientController', ['$scope', '$http', '$state', '$filter',
        function ($scope, $http, $state, $filter) {
            $http.get('js/data.json').success(function (data) {
                $scope.whichpatient = $filter('filter')(data.patients, {id: $state.params.aId})[0];
            });
            $http.get('js/visits.json').success(function (data) {
                $scope.visits = $filter('filter')(data.visits, {patient_id: $state.params.aId});

                $scope.doRefresh = function () {
                    $http.get('js/visit.json').success(function (data) {
                        $scope.visits = data.visits;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            });
        }])
    .controller('VisitController', ['$scope', '$http', '$state', '$filter',
        function ($scope, $http, $state, $filter) {

            $http.get('js/visits.json').success(function (data) {
                $scope.whichvisit = $filter('filter')(data.visits, {id: $state.params.visitId})[0];


            });
            $http.get('js/results.json').success(function (data) {
                $scope.results = $filter('filter')(data.results, {visit_id: $state.params.visitId})[0];
                console.log($scope.results.hematology)
                $scope.doRefresh = function () {
                    $http.get('js/visits.json').success(function (data) {
                        $scope.results = data.results;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            });
        }]);
