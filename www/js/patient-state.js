angular.module('patient-state',[])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('tabs', {
                    url: '/tab',
                    abstract: true,
                    templateUrl: 'templates/tabs.html',
                    resolve: {
                        patients: function (PatientService) {
                            return PatientService.getPatients();
                        }
                    }
                })

                .state('tabs.info', {
                    url: '/info',
                    views: {
                        'info-tab': {
                            templateUrl: 'templates/info.html',
                            controller: 'InfoController'
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
                });
            $urlRouterProvider.otherwise('/tab/list');

        }]);